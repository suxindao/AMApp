/**
 * Created by Joe on 2017/4/27.
 */
import React, {Component} from 'react';
import {ScrollView, DeviceEventEmitter, View, Text, TouchableHighlight, TouchableOpacity, Image} from 'react-native'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import {toastShort} from '../../../../constants/toast'
//组件
import PhotoSelect from '../../../../components/photoSelect'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {httpIP} from '../../../../helpers/Upload'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/storePhotoInfoRedux'

const CODE = {
    face: 'face',
    desk: 'desk',
    indoor: 'indoor',
    honour: 'honour',
    activity: 'activity',
}

const mapStateToProps = state => ({
    isRender: state.storePhotoInfo.isRender,                      //是否渲染
    loading: state.storePhotoInfo.loading,
    loading_success: state.storePhotoInfo.loading_success,
    list: state.storePhotoInfo.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

class StorePhotoInfo extends Component {
    constructor(props) {
        super(props)
        this.getData = this.getData.bind(this);
        this.initLocalData = this.initLocalData.bind(this);
        this.renderLable = this.renderLable.bind(this);
        this.photoCallback = this.photoCallback.bind(this);
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this);
        this.photoSwiper = this.photoSwiper.bind(this);
        this.getPhotoData = this.getPhotoData.bind(this);
        this.subInfo = this.subInfo.bind(this);
        this.setLocalData = this.setLocalData.bind(this);
        this.editable = this.props.status === 'view' ? false : true;
        this.picList = [];
    }

    componentWillMount() {
        this.getData();
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
    }

    /**
     * 初始化照片数据
     */
    getData() {
        this.props.myactions.loadData(
            '/am_api/am/store/albums',
            {
                _AT: global.UserInfo.token,
                id: this.props.id,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let list = await client.post(path, {data: param});
            this.picList = list;
            this.props.myactions.setState({list: list}, true);
            return list;
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 返回标签栏数据
     */
    renderLable(text) {
        return (
            <View
                style={{
                    backgroundColor: colors.labBgColor,
                    width: distances.deviceWidth,
                    height: 30,
                    justifyContent: 'center',
                    borderTopWidth: distances.borderWidth,
                    borderBottomWidth: distances.borderWidth,
                    borderColor: '#d3d3d3',
                }}
            >
                <Text
                    style={{
                        fontSize: 13 * fontScale,
                        color: '#999',
                        marginLeft: distances.contractLeftMargin
                    }}
                >
                    {text}
                </Text>
            </View>
        )
    }

    /**
     * 添加照片回调函数
     */
    photoCallback(data, code) {
        if (data.uploadInfo) {
            let list = _.cloneDeep(this.props.list);
            for (var z in list) {
                if (list[z].code === code) {
                    list[z].pics.push(
                        {
                            file_id: data.uploadInfo.file_id,
                            file_path: data.uploadInfo.url_path,
                        }
                    )
                }
            }
            this.props.myactions.setState({
                list: list
            }, true);
        }
    }

    /**
     * 删除照片回调函数
     */
    photoDeleteCallback(data, code) {
        let list = _.cloneDeep(this.props.list);
        for (var z of list) {
            if (z.code === code) {
                let pics = z.pics;
                for (var a in pics) {
                    if (pics[a].file_id === data.file_id) {
                        pics.splice(Number(a), 1);
                    }
                }
            }
        }
        this.props.myactions.setState({
            list: list
        }, true);
    }

    /**
     * 照片预览函数
     */
    photoSwiper(code, index) {
        let data = this.props.list.find(item => item.code === code)
        if (data && Array.isArray(data.pics) && data.pics.length > 0) {
            Actions.photoSwiper({
                photo_data: data.pics,
                index
            })
        }
    }

    /**
     * 初始化回显照片数据
     */
    getPhotoData(code) {
        let list = this.picList;
        let pics = new Array();
        for (var z of list) {
            if (z.code === code && z.pics.length > 0) {
                for (var a of z.pics) {
                    pics.push(
                        {
                            fileName: a.file_id,
                            isStored: true,
                            url: httpIP.substring(0, httpIP.length - 1) + a.file_path,
                            upload: {
                                progress: 1,
                                uploadFailed: false,
                                uploadInfo: {
                                    file_id: a.file_id,
                                    url_path: a.file_path
                                }
                            }
                        }
                    )
                }
            }
        }
        return pics;
    }

    /**
     * 提交照片数据
     */
    subInfo() {
        let {list} = this.props;
        for (var z of list) {
            delete z.code;
        }
        this.props.myactions.loadData(
            '/am_api/am/store/modifyAlbums',
            {
                _AT: global.UserInfo.token,
                albums: list,
            },
            this.setLocalData
        );
    }

    async setLocalData(client, path, param) {
        try {
            let list = await client.post(path, {data: param});
            if (list.errorCode) {
                toastShort('创建失败');
            } else {
                Actions.pop();
            }
            return list;
        } catch (e) {
            toastShort(e.message);
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: colors.labBgColor, flex: 1, marginBottom: this.editable ? 60 : 0}}
                            bounces={false}>
                    {this.renderLable('门脸照片(必填)')}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            paddingRight: distances.contractLeftMargin,
                        }}
                    >
                        <PhotoSelect
                            photoNumber={20}
                            dataPics={this.getPhotoData(CODE.face)}
                            style={{backgroundColor: '#fff', marginBottom: 15}}
                            imagesPerRow={4}
                            imageMargin={distances.contractLeftMargin}
                            onItemUpload={(data) => {
                                this.photoCallback(data, CODE.face)
                            }}
                            onItemDelete={(data) => {
                                this.photoDeleteCallback(data, CODE.face)
                            }}
                            onItemClick={(index) => {
                                this.photoSwiper(CODE.face, index)
                            }}
                            isAddLast={this.editable}
                            hideItemDelete={!this.editable}
                        />
                    </View>
                    {this.renderLable('前台照片(必填)')}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            paddingRight: distances.contractLeftMargin,
                        }}
                    >
                        <PhotoSelect
                            photoNumber={20}
                            dataPics={this.getPhotoData(CODE.desk)}
                            style={{backgroundColor: '#fff', marginBottom: 15}}
                            imagesPerRow={4}
                            imageMargin={distances.contractLeftMargin}
                            onItemUpload={(data) => {
                                this.photoCallback(data, CODE.desk)
                            }}
                            onItemDelete={(data) => {
                                this.photoDeleteCallback(data, CODE.desk)
                            }}
                            onItemClick={(index) => {
                                this.photoSwiper(CODE.desk, index)
                            }}
                            isAddLast={this.editable}
                            hideItemDelete={!this.editable}
                        />
                    </View>
                    {this.renderLable('室内照片(必填)')}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            paddingRight: distances.contractLeftMargin,
                        }}
                    >
                        <PhotoSelect
                            photoNumber={20}
                            dataPics={this.getPhotoData(CODE.indoor)}
                            style={{backgroundColor: '#fff', marginBottom: 15}}
                            imagesPerRow={4}
                            imageMargin={distances.contractLeftMargin}
                            onItemUpload={(data) => {
                                this.photoCallback(data, CODE.indoor)
                            }}
                            onItemDelete={(data) => {
                                this.photoDeleteCallback(data, CODE.indoor)
                            }}
                            onItemClick={(index) => {
                                this.photoSwiper(CODE.indoor, index)
                            }}
                            isAddLast={this.editable}
                            hideItemDelete={!this.editable}
                        />
                    </View>
                    {this.renderLable('荣誉照片')}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            paddingRight: distances.contractLeftMargin,
                        }}
                    >
                        <PhotoSelect
                            photoNumber={20}
                            dataPics={this.getPhotoData(CODE.honour)}
                            style={{backgroundColor: '#fff', marginBottom: 15}}
                            imagesPerRow={4}
                            imageMargin={distances.contractLeftMargin}
                            onItemUpload={(data) => {
                                this.photoCallback(data, CODE.honour)
                            }}
                            onItemDelete={(data) => {
                                this.photoDeleteCallback(data, CODE.honour)
                            }}
                            onItemClick={(index) => {
                                this.photoSwiper(CODE.honour, index)
                            }}
                            isAddLast={this.editable}
                            hideItemDelete={!this.editable}
                        />
                    </View>
                    {this.renderLable('活动照片')}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            paddingRight: distances.contractLeftMargin,
                        }}
                    >
                        <PhotoSelect
                            photoNumber={20}
                            dataPics={this.getPhotoData('activity')}
                            style={{backgroundColor: '#fff', marginBottom: 15}}
                            imagesPerRow={4}
                            imageMargin={distances.contractLeftMargin}
                            onItemUpload={(data) => {
                                this.photoCallback(data, CODE.activity)
                            }}
                            onItemDelete={(data) => {
                                this.photoDeleteCallback(data, CODE.activity)
                            }}
                            onItemClick={(index) => {
                                this.photoSwiper(CODE.activity, index)
                            }}
                            isAddLast={this.editable}
                            hideItemDelete={!this.editable}
                        />
                    </View>
                    <View
                        style={{
                            backgroundColor: colors.labBgColor,
                            width: distances.deviceWidth,
                            height: 30,
                            justifyContent: 'center',
                            borderTopWidth: distances.borderWidth,
                            borderColor: '#d3d3d3',
                        }}
                    >
                    </View>
                </ScrollView>
                {
                    this.editable ?
                        <View
                            style={{
                                width: distances.deviceWidth,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderTopWidth: distances.borderWidth,
                                borderColor: colors.borderColor,
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <TouchableHighlight
                                underlayColor='#fafafa'
                                style={{
                                    width: distances.deviceWidth - 100,
                                    height: 38,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: colors.blueColor,
                                    borderRadius: 3,
                                }}
                                onPress={this.subInfo}
                            >
                                <Text
                                    style={{
                                        fontSize: 16 * fontScale,
                                        color: '#fff',
                                    }}
                                >
                                    保存
                                </Text>
                            </TouchableHighlight>
                        </View> :
                        null
                }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorePhotoInfo)