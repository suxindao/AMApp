/**
 * photo select component
 */
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    NativeModules,
    ViewPropTypes,
} from 'react-native';

const PropTypes = require('prop-types');

import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

import {toastShort} from '../../constants/toast'

//ui工具
import * as uiUtils from '../../constants/utils/ui'

import * as uploadUtils from '../../helpers/Upload'

// Permission
import {checkAndGetStoragePermission} from '../../modules/permission'

/**
 * 功能： photos select components
 * params:
 *
 *                dataPics: array, 初始化数据
 *                                每个item默认格式
 *                                {
										fileName: '',
										isStored: true,
										url: '111.png',			// 必须为url, 
										upload: {
											progress: 1,
											uploadFailed: false,
										}
									}
 *
 *                style: 样式
 *                  photoNumber:    number, 照片总数
 *                  imagesPerRow:   number, 每行照片数量
 *                  imageMargin:    number, 每个照片margin
 *                  containerWidth: number, 这个组件width, 默认为设备屏宽
 *
 *                (将如下两个属性都置为false, 则都不显示)
 *                isAddFirst:   boolean, 默认值为false, 加照片组件在最前
 *                isAddLast:    boolean, 默认值为true, 加照片组件在最后
 *
 *                createFirstComponent: func, 加照片在最前的组件
 *                createLastComponent:  func, 加照片在最后的组件
 *                createPhotoComponent: func, 每一个照片组件
 *                onItemUpload:         func, 每一个照片上传
 *                onItemDelete:         func, 每一个照片删除
 *                onItemClick:          func, 预览照片
 *                hideItemDelete:       boolean, 是否隐藏删除功能
 *
 *                initDataWillMount: bool 初始化数据方式 componentWillMount初始化数据(添加试听课程时,门店采集数据) 还是在componentDidUpdate初始化数据
 */
export default class PhotoSelect extends Component {
    constructor(props) {
        super(props)

        // UI
        this._renderPhotos = this._renderPhotos.bind(this)
        this._renderRow = this._renderRow.bind(this)
        this._renderRowItem = this._renderRowItem.bind(this)

        // function
        this._prpareData = this._prpareData.bind(this)
        this._handlerFirstOrLastPress = this._handlerFirstOrLastPress.bind(this)
        this._handlerOnImagesOk = this._handlerOnImagesOk.bind(this)
        this._handlerCameraCallback = this._handlerCameraCallback.bind(this)
        this._onImageItemDelete = this._onImageItemDelete.bind(this)
        this._onImageItemUploadComplete = this._onImageItemUploadComplete.bind(this)

        this._handleFun = this._handleFun.bind(this)
        this.lock = true

        // data
        this.state = {
            photos: [],			// 显示照片obj(即包含照片obj, 又包含照片component)的数组
        }
    }

    // 画全部的行
    _renderPhotos(photos: Array) {
        const {imagesPerRow} = this.props;
        let datas = this._prpareData(photos, imagesPerRow)
        datas = uiUtils.nEveryRow(datas, imagesPerRow)
        if (_.isArray(datas) && datas.length > 0) {
            return _.map(datas, (rowData, row) => {
                return this._renderRow(rowData, row)
            })
        }
        return null
    }

    // 根据添加照片在首部还是尾部初始化photos
    _prpareData(photos: Array, imagesPerRow: Number) {
        let datas = [];
        const {isAddFirst, isAddLast} = this.props;
        if (isAddFirst) {
            const {createFirstComponent} = this.props
            datas = [createFirstComponent].concat(photos)
        } else {
            datas = [].concat(photos)
        }

        if (isAddLast) {
            const {createLastComponent} = this.props
            datas.push(createLastComponent)
        }

        return datas
    }

    // 为画一行做准备
    // 每一行 宽为containerWidth，高为 imageSize, marginTop为imageMargin
    _renderRow(rowData: Array, row: number) {
        if (_.isArray(rowData) && rowData.length > 0) {
            let {width} = Dimensions.get('window');
            const {imageMargin, imagesPerRow, containerWidth} = this.props;
            if (typeof containerWidth != "undefined") {
                width = containerWidth;
            }
            // 计算每个item width
            const imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow;
            return (
                <View key={row} style={{width, height: imageSize, flexDirection: 'row', marginTop: imageMargin}}>
                    {this._renderRowItem(rowData, imageSize, imageMargin, row)}
                </View>
            )
        }
        return null
    }

    /**
     * 响应头尾组件的点击⌚️
     * @return
     */
    _handlerFirstOrLastPress() {
        checkAndGetStoragePermission()
            .then(granted => {
                console.log("StoragePermission granted => ", granted)
                if (granted) {
                    Actions.photoPicker({
                        handlerOnOk: this._handlerOnImagesOk,
                        selected: [],
                        handlerCameraCallback: this._handlerCameraCallback
                    })
                }
            })
    }

    /**
     * 相机拍照回调事件
     * @param  {String} imgData   图片数据base64格式
     */
    _handlerCameraCallback(cameResult) {
        this.setState({
            photos: this.state.photos.concat({path: cameResult.path}),
        })
    }

    /**
     * 接收photoPicker的回调，传回选择的图片
     * @param  {Array} images  图片数组
     * @return {[type]}        [description]
     */
    _handlerOnImagesOk(images) {
        this.setState({
            photos: this.state.photos.concat(images),
        })
    }

    /**
     * 删除图片
     * 更新photo列表，并更新最后更新的imgitem索引号
     */
    _onImageItemDelete(index) {
        return () => {
            let {uploadIndex} = this.state

            let allUploadCompleted = true
            let list = [].concat(this.state.photos);

            for (let item of list) {
                if (!(item.upload && item.upload.progress === 1 && item.upload.uploadFailed === false)) {
                    allUploadCompleted = false
                    break;
                }
            }

            //所有图片都上传完毕才能删除
            if (allUploadCompleted) {
                // uploadInfo 为null 时，不向外传递数据
                if (Boolean(list[index].upload) && Boolean(list[index].upload.uploadInfo)) {
                    this.props.onItemDelete(list[index].upload.uploadInfo);
                }
                list.splice(index, 1)
                this.setState({
                    photos: list,
                    uploadIndex: uploadIndex - 1
                })
            } else {
                console.log("还有未上传图片")
                toastShort('还有未上传图片，请稍后处理');
            }
        }
    }

    /**
     * 图片上传完成调用
     * @return {function} index: 图片索引值  response:{file_id, url_path} 服务器返回上传结果
     */
    _onImageItemUploadComplete() {
        return (index, response) => {
            let {photos} = this.state
            photos[index].upload = response
            this.setState({
                uploadIndex: index + 1,
                photos
            })
            const {onItemUpload} = this.props
            onItemUpload(response)
        }
    }

    // 画一行 photos
    _renderRowItem(photos: Array, imageSize: Number, margin: Number, row: NUmber) {
        //
        const uploadIndex = this.state.uploadIndex || 0
        return _.map(photos, (photo, index) => {
            index = index + row * this.props.imagesPerRow
            let marginLeft = margin

            // 如果是indicator（头或者尾)
            if (_.isFunction(photo)) {
                return photo().call(this, styles.indicator, {
                    width: imageSize,
                    height: imageSize,
                    marginLeft
                }, index, this._handlerFirstOrLastPress)
            }
            return (
                <ImageItem key={index} index={index} isUpload={uploadIndex == index ? true : false}
                           style={[styles.indicator, {width: imageSize, height: imageSize, marginLeft}]}
                           imageSize={imageSize} source={{uri: photo.uri}} image={photo} upload={photo.upload || {}}
                           hideItemDelete={this.props.hideItemDelete}
                           onDelete={this._onImageItemDelete(index)}
                           onUploadComplete={this._onImageItemUploadComplete()}
                           onClick={this.props.onItemClick}
                />
            )
        })
    }

    componentWillMount() {
        if (this.props.initDataWillMount) {
            this._handleFun()
        }
    }

    componentDidUpdate() {
        if (!this.props.initDataWillMount) {
            this._handleFun()
        }
    }

    _handleFun() {
        if (this.lock && Array.isArray(this.props.dataPics) && this.props.dataPics.length > 0) {
            this.setState({
                photos: this.props.dataPics,
                uploadIndex: this.props.dataPics.length
            })
            this.lock = false
        }
    }

    render() {
        const {style, photoNumber} = this.props
        return (
            <View style={[styles.wrapper, style]}>
                {this._renderPhotos(this.state.photos)}
            </View>
        )
    }
}

/**
 * 功能： 每一个photoItem
 *  params:
 *                index: number, 当前indx
 *                isUpload: boolean, 当前index是否是正在上传的
 *                style: style
 *                imageSize: number, width
 *                source: uri
 *                image: object, photo
 *                upload: object, 长传obj
 *                        progress: number, 进度条
 *                        uploadFailed: boolean, 上传失败
 *                        uploadInfo: obj, 上传信息
 *                onDelete: func, 删除照片
 *                onUploadComplete: func, 上传完成
 */
class ImageItem extends Component {
    constructor(props) {
        super(props)

        // func
        this._uploadImage = this._uploadImage.bind(this)

        // UI
        this._renderUploadComponent = this._renderUploadComponent.bind(this)
    }

    // 上传图片
    async _uploadImage(image, index, onUploadComplete) {
        const haoqixUtils = NativeModules.RNHaoqixUtil
        // console.log('_uploadImage image===>', image)
        try {
            let ret
            if (Boolean(image.path)) {
                const path = image.path.replace(/^file:\/\//, '')
                ret = await haoqixUtils.getImageBase64ByPath(path)
            } else if (image.uri) {
                ret = await haoqixUtils.getImageBase64ByUri(image.uri, image.width, image.height)
            } else {
                return
            }
            // console.log('ret===>', ret)
            ret.type = ret.type.replace(/(\w+)\./, '')
            const response = await uploadUtils.doPhotoUpload(ret.base64, ret.type, (received, total) => {
                this.progress = received / total
                onUploadComplete(index, {progress: this.progress, uploadFailed: false})
            })
            // console.log('upload response===>', response);
            onUploadComplete(index, {progress: 1, uploadFailed: false, uploadInfo: response})
        } catch (e) {
            console.log('_uploadImage err===>', e)
            onUploadComplete(index, {progress: this.progress, uploadFailed: true})
        }
    }

    //
    _renderUploadComponent(imageSize) {
        const {progress = 0, uploadFailed} = this.props.upload
        let {hideItemDelete} = this.props
        const {onDelete} = this.props
        if (uploadFailed) {
            return (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableWithoutFeedback onPress={onDelete}>
                        <Image source={require('../../sources/images/wonder.png')}/>
                    </TouchableWithoutFeedback>
                </View>
            )
        }

        if (hideItemDelete) {
            // 不显示 删除
            return null
        }

        //显示上传进度
        if (progress < 1) {
            //上传中
            return (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flex: 1,
                        height: imageSize,
                        // marginLeft: 5,
                        // marginRight: 5,
                        backgroundColor: 'transparent',
                        // flexDirection: 'row'
                    }}>
                        <View style={{flex: progress, backgroundColor: '#73b1fa', opacity: 0}}/>
                        <View style={{flex: 1 - progress, backgroundColor: '#666', opacity: 0.8}}/>
                    </View>
                </View>
            )
        } else {
            //上传完成
            return (
                <TouchableWithoutFeedback onPress={onDelete}>
                    <Image style={{position: 'absolute', top: 2, right: 2,}}
                           source={require('../../sources/images/reduce.png')}/>
                </TouchableWithoutFeedback>
            )
        }

    }

    render() {
        const {style, index, image, imageSize, isUpload, onUploadComplete, onClick} = this.props
        if (isUpload && !this.uploading) {
            this._uploadImage(image, index, onUploadComplete)
            this.uploading = true
        }

        return (
            <View style={style}>
                <TouchableWithoutFeedback onPress={onClick ? () => {
                    onClick(index)
                } : null}>
                    <Image style={{width: imageSize, height: imageSize}}
                           source={{uri: image.uri || image.path || image.url}}/>
                </TouchableWithoutFeedback>
                {this._renderUploadComponent(imageSize)}
            </View>
        )
    }
}

/**
 * 功能：每一个photoItem
 * params:
 *                width; height; url
 *
 */
const createPhotoComponent = () => {
    return (width, height, url) => (
        <View>
            <Image style={{width, height}} src={{url}}/>
        </View>
    )
}

/**
 * 功能：头或者尾部 indicator
 *    params:
 *                defaultStyle; curStyle, key, handlerOnPress
 */
const createIndicator = () => {
    return (defaultStyle, curStyle, key, handlerOnPress) => (
        <TouchableWithoutFeedback key={key} onPress={handlerOnPress}>
            <View style={[defaultStyle, curStyle]}>
                <Image source={require('../../sources/images/add.png')}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

PhotoSelect.propTypes = {
    style: ViewPropTypes.style,
    photoNumber: PropTypes.number,
    imagesPerRow: PropTypes.number,
    imageMargin: PropTypes.number,
    isAddFirst: PropTypes.bool,
    isAddLast: PropTypes.bool,
    createFirstComponent: PropTypes.func,
    createLastComponent: PropTypes.func,
    createPhotoComponent: PropTypes.func,
    isTest: PropTypes.bool,
    initDataWillMount: PropTypes.bool,
    onItemUpload: PropTypes.func,
    onItemDelete: PropTypes.func,
}

PhotoSelect.defaultProps = {
    style: {},
    photoNumber: 0,
    imagesPerRow: 4,
    imageMargin: 10,
    isAddFirst: false,
    isAddLast: true,
    createFirstComponent: createIndicator,
    createLastComponent: createIndicator,
    createPhotoComponent: createPhotoComponent,
    isTest: false,
    initDataWillMount: false,
    onItemUpload: (response) => {
        console.log('onItemUpload response===>', response)
    },
    onItemDelete: () => {
        console.log('onItemDelete====>')
    },
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    indicator: {
        backgroundColor: 'white',
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

