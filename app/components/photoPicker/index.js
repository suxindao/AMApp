/**
 * 照片选择器
 */
import React, {Component} from 'react';
import {
    CameraRoll,
    Platform,
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';

import {Actions} from 'react-native-router-flux'
import ImageItem from './ImageItem'

import _ from 'lodash'

//ui工具
import * as UiUtils from '../../constants/utils/ui'

// style
import {view_margin} from './styles'

// Permission
import {checkAndGetCameraPermission, checkAndGetStoragePermission} from '../../modules/permission'

const ReactNative = require('react-native');
const ReactPropTypes = require('prop-types');
const {ViewPropTypes} = ReactNative;

/**
 * 功能: 照片选择器
 *  params:
 *        handlerCameraCallback: func, 相机拍照回调事件
 *        handlerOnOk: func, 接收photoPicker的回调，传回选择的图片
 *
 *        selected: array,  默认为 []
 *
 *        emptyText: string, 当相册照片个数为0时， 提示文字, 默认'No photos.'
 *
 *        imageMargin:  number, 每个照片margin, 默认为0，
 *        imagesPerRow: number, 每行照片数量,
 *        containerWidth: number, 这个组件width, 默认为设备屏宽
 *
 *        emptyTextStyle: style, 当相册照片个数为0时， 提示文字样式
 *        backgroundColor: color, CameraRollPicker 的 CameraRollPicker，默认为黑色
 *
 *        assetType: 资源类型， 默认 ‘Photos’
 *
 *  ?
 *        groupTypes:  默认： ‘SavedPhotos’
 *        selectedMarker
 *        maximum: number, 默认值15
 *        callback: func,
 *        selectSingleItem: bool, 默认值 false
 *
 * listView params:
 *        scrollRenderAheadDistance: number, 当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行, 默认500
 *        initialListSize: number, 指定在组件刚挂载的时候渲染多少行数据, 默认1
 *        pageSize: number, 每次事件循环（每帧）渲染的行数, 默认3
 *        removeClippedSubviews: bool, 用于提升大列表的滚动性能。
 */
class CameraRollPicker extends Component {
    constructor(props) {
        super(props);
        // console.log('CameraRollPicker props===>', props)
        this.state = {
            images: [{camera: true}],
            selected: this.props.selected,
            lastCursor: null,
            loadingMore: false,
            noMore: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
        this._onCameraClick = this._onCameraClick.bind(this)
    }

    async componentWillMount() {
        this.fetch();
    }

    componentDidMount() {
        //必须在此处bind上下文，否则在_handleRightClick调用的是global上下文
        Actions.refresh({onRight: this._handleRightClick.bind(this)})
    }

    _handleRightClick() {
        const images = this.state.selected
        // console.log('this.props===>', this.props)
        const {handlerOnOk} = this.props
        if (_.isFunction(handlerOnOk)) {
            handlerOnOk(images)
        }
        Actions.pop()
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected: nextProps.selected,
        });
    }

    fetch() {
        if (!this.state.loadingMore) {
            this.setState({loadingMore: true}, () => {
                this._fetch();
            });
        }
    }

    _fetch() {
        var {groupTypes, assetType} = this.props;

        var fetchParams = {
            first: 1000,
            groupTypes: groupTypes,
            assetType: 'Photos',
            mimeTypes: ['image/jpg', 'image/png', 'image/jpeg', 'image/JPG']
        };

        if (Platform.OS === "android") {
            // not supported in android
            delete fetchParams.groupTypes;
        }

        if (this.state.lastCursor) {
            fetchParams.after = this.state.lastCursor;
        }

        CameraRoll.getPhotos(fetchParams).then((data) => {
            return this._appendImages(data)
        }).catch(e => {
            console.log('camera roll err===>', e)
        });
    }

    _appendImages(data) {
        var assets = data.edges;
        var newState = {
            loadingMore: false,
        };

        if (!data.page_info.has_next_page) {
            newState.noMore = true;
        }

        if (assets.length >= 0) {
            newState.lastCursor = data.page_info.end_cursor;
            newState.images = this.state.images.concat(assets);
            newState.dataSource = this.state.dataSource.cloneWithRows(
                UiUtils.nEveryRow(newState.images, this.props.imagesPerRow)
            );
        }

        this.setState(newState);
    }

    render() {
        var {dataSource} = this.state;
        var {
            scrollRenderAheadDistance,
            initialListSize,
            pageSize,
            removeClippedSubviews,
            backgroundColor,
            imageMargin,
            emptyText,
            emptyTextStyle,
        } = this.props;

        var listViewOrEmptyText = dataSource.getRowCount() > 0 ? (
            <ListView
                style={{flex: 1}}
                scrollRenderAheadDistance={scrollRenderAheadDistance}
                initialListSize={initialListSize}
                pageSize={pageSize}
                removeClippedSubviews={removeClippedSubviews}
                renderFooter={this._renderFooterSpinner.bind(this)}
                onEndReached={this._onEndReached.bind(this)}
                dataSource={dataSource}
                renderRow={rowData => this._renderRow(rowData)}/>
        ) : (
            <Text style={[{textAlign: 'center'}, emptyTextStyle]}>{emptyText}</Text>
        );

        return (
            <View style={[styles.wrapper, {margin: imageMargin, backgroundColor: backgroundColor},]}>
                {listViewOrEmptyText}
            </View>
        );
    }

    _renderImage(item) {
        var {selected} = this.state;
        var {
            imageMargin,
            selectedMarker,
            imagesPerRow,
            containerWidth
        } = this.props;

        var uri = item.node.image.uri;
        var isSelected = (this._arrayObjectIndexOf(selected, 'uri', uri) >= 0) ? true : false;

        return (
            <ImageItem
                key={uri}
                item={item}
                selected={isSelected}
                imageMargin={imageMargin}
                selectedMarker={selectedMarker}
                imagesPerRow={imagesPerRow}
                containerWidth={containerWidth}
                onClick={this._selectImage.bind(this)}
            />
        );
    }

    _onCameraClick() {
        const {handlerCameraCallback} = this.props
        checkAndGetCameraPermission()
            .then(granted => {
                console.log("CameraPermission granted => ", granted)
                if (granted) {
                    Actions.camera({type: 'replace', onCameraCallback: handlerCameraCallback})
                }
            })
    }

    _renderCamera() {
        const {
            imageMargin, imagesPerRow,
        } = this.props;
        const {width} = Dimensions.get('window');
        const imageSize = (width - ((imagesPerRow + 1) * imageMargin + imagesPerRow * 2 * view_margin)) / imagesPerRow;
        return (
            <TouchableWithoutFeedback key='camera'
                                      style={{marginBottom: imageMargin, marginRight: imageMargin,}}
                                      onPress={this._onCameraClick}>
                <View style={{
                    height: imageSize,
                    width: imageSize,
                    margin: view_margin,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image source={require('../../sources/images/camera.png')}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderRow(rowData) {
        var items = rowData.map((item) => {
            // console.log('item===>', item)
            if (item === null) {
                return null;
            } else if (item.camera) {
                return this._renderCamera();
            }
            return this._renderImage(item);
        });

        return (
            <View style={styles.row}>
                {items}
            </View>
        );
    }

    _renderFooterSpinner() {
        if (!this.state.noMore) {
            return <ActivityIndicator style={styles.spinner}/>;
        }
        return null;
    }

    _onEndReached() {
        if (!this.state.noMore) {
            this.fetch();
        }
    }

    _selectImage(image) {
        var {maximum, imagesPerRow, callback, selectSingleItem} = this.props;
        var selected = this.state.selected,
            index = this._arrayObjectIndexOf(selected, 'uri', image.uri);
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            if (selectSingleItem) {
                selected.splice(0, selected.length);
            }
            if (selected.length < maximum) {
                selected.push(image);
            }
        }
        this.setState({
            selected: selected,
            dataSource: this.state.dataSource.cloneWithRows(
                UiUtils.nEveryRow(this.state.images, imagesPerRow)
            ),
        });
        callback(selected, image);
    }

    _arrayObjectIndexOf(array, property, value) {
        return array.map((o) => {
            return o[property];
        }).indexOf(value);
    }

}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
    },
    marker: {
        position: 'absolute',
        top: 5,
        backgroundColor: 'transparent',
    },
})

CameraRollPicker.propTypes = {
    scrollRenderAheadDistance: ReactPropTypes.number,
    initialListSize: ReactPropTypes.number,
    pageSize: ReactPropTypes.number,
    removeClippedSubviews: ReactPropTypes.bool,
    groupTypes: ReactPropTypes.oneOf([
        'Album',
        'All',
        'Event',
        'Faces',
        'Library',
        'PhotoStream',
        'SavedPhotos',
    ]),
    maximum: ReactPropTypes.number,
    assetType: ReactPropTypes.oneOf([
        'Photos',
        'Videos',
        'All',
    ]),
    selectSingleItem: ReactPropTypes.bool,
    imagesPerRow: ReactPropTypes.number,
    imageMargin: ReactPropTypes.number,
    containerWidth: ReactPropTypes.number,
    callback: ReactPropTypes.func,
    selected: ReactPropTypes.array,
    selectedMarker: ReactPropTypes.element,
    backgroundColor: ReactPropTypes.string,
    emptyText: ReactPropTypes.string,
    emptyTextStyle: Text.propTypes.style,
}

CameraRollPicker.defaultProps = {
    scrollRenderAheadDistance: 500,
    initialListSize: 1,
    pageSize: 3,
    removeClippedSubviews: true,
    groupTypes: 'SavedPhotos',
    maximum: 15,
    imagesPerRow: 3,
    imageMargin: 0,
    selectSingleItem: false,
    assetType: 'Photos',
    backgroundColor: 'black',
    selected: [],
    callback: function (selectedImages, currentImage) {
        console.log(currentImage);
        console.log(selectedImages);
    },
    emptyText: 'No photos.',
}

export default CameraRollPicker;