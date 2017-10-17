/**
 * Created by Joe on 2017/6/26.
 */
import React, {Component} from 'react';
import {TouchableHighlight, Text, TextInput, View, ScrollView, DeviceEventEmitter, Keyboard} from 'react-native'
import _ from 'lodash'
import {Actions} from 'react-native-router-flux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
import PhotoSelect from '../../../../components/photoSelect'
import WrapLoading from '../../../../components/load/wraploading'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {multilineTextInput} from './../components/listeningCourse/editCommon'
import {httpIP} from '../../../../helpers/Upload'
import {notification, store} from '../../../../constants/common'
import {toastShort} from '../../../../constants/toast'
import {isNull} from '../../../../constants/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/byStagesPackageRedux'

let lablestyle = {
    fontSize: 15 * fontScale,
    color: colors.inputColor,
    justifyContent: 'center',
    textAlign: 'center',
    width: 59,
    height: 35,
    backgroundColor: colors.labBgColor,
    borderRadius: 2,
    paddingTop: 0,
    paddingBottom: 0,
};

const emitKey = notification.byStagesPackage;

const mapStateToProps = state => ({
    isRender: state.byStagesPackage.isRender,                      //是否渲染
    loading: state.byStagesPackage.loading,
    loading_success: state.byStagesPackage.loading_success,
    editable: state.byStagesPackage.editable,
    data: state.byStagesPackage.data,
    instalment: state.byStagesPackage.instalment,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
    }, dispatch), dispatch
})

class ByStagesPackage extends Component {
    constructor(props) {
        super(props)
        this.renderLable = this.renderLable.bind(this)
        this.getPhotoData = this.getPhotoData.bind(this)
        this.getInner = this.getInner.bind(this)
        this.photoCallback = this.photoCallback.bind(this)
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this)
        this.photoClick = this.photoClick.bind(this)
        this.inputCallback = this.inputCallback.bind(this)
        this.getData = this.getData.bind(this)
        this.checkData = this.checkData.bind(this)
        this.subData = this.subData.bind(this)
        this.subLocalData = this.subLocalData.bind(this)
        this.editable = this.props.routerData.status === 'view' ? false : true;
        this.picList = [];
    }

    componentWillMount() {
        this.picList = this.props.data.album;
        if (this.props.routerData.status !== 'add') {
            this.picList = this.props.routerData.data.album;
            this.getData();
        }
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
        Keyboard.dismiss()
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    /**
     * 返回分类标签
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
     * 获取照片初始化数据，用于照片组件回显
     */
    getPhotoData() {
        var data = this.picList;
        let pics = new Array();
        if (data.pics) {
            for (var z of data.pics) {
                pics.push(
                    {
                        fileName: z.file_id,
                        isStored: true,
                        url: httpIP.substring(0, httpIP.length - 1) + z.file_path,
                        upload: {
                            progress: 1,
                            uploadFailed: false,
                            uploadInfo: {
                                file_id: z.file_id,
                                url_path: z.file_path
                            }
                        }
                    }
                )
            }
        }
        return pics;
    }

    /**
     * 返回门店内容dom标签
     */
    getInner() {
        let {data = new Array(), instalment} = this.props;
        if (data.length == 0)
            return null;
        return (
            <View style={{backgroundColor: '#fff'}}>
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '课程名称',
                            type: 'input',
                            placeholder: '请填写课程名称',
                            editable: this.editable,
                            key: 'name',
                            value: data.name + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '课时数',
                            type: 'input',
                            keyboardType: 'numeric',
                            placeholder: '请填写课时数',
                            editable: this.editable,
                            key: 'course_num',
                            value: data.course_num + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '课程原价',
                            type: 'input',
                            keyboardType: 'numeric',
                            placeholder: '请填写原价',
                            editable: this.editable,
                            key: 'original_price',
                            value: data.original_price + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '课程现价',
                            type: 'input',
                            keyboardType: 'numeric',
                            placeholder: '请填写现价',
                            editable: this.editable,
                            key: 'current_price',
                            value: data.current_price + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                {
                    instalment && instalment.length > 0 ?
                        <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                            <ContentComponent
                                config={{
                                    hasLine: true,
                                    title: '分期数',
                                    type: 'radio',
                                    radio: instalment,
                                    editable: this.editable,
                                    key: 'instalment',
                                    value: data.instalment
                                }}
                                callback={this.inputCallback}
                            />
                        </View> : null
                }
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: false,
                            title: '月供金额',
                            type: 'input',
                            placeholder: '请填写月供金额',
                            keyboardType: 'numeric',
                            editable: this.editable,
                            key: 'monthly_repayment',
                            value: data.monthly_repayment + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                {this.renderLable('分期课包照片')}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        marginRight: distances.contractLeftMargin,
                    }}
                >
                    <PhotoSelect
                        photoNumber={5}
                        dataPics={this.getPhotoData()}
                        style={{backgroundColor: '#fff', marginBottom: 15}}
                        imagesPerRow={4}
                        imageMargin={distances.contractLeftMargin}
                        onItemUpload={(data) => {
                            this.photoCallback(data)
                        }}
                        onItemDelete={(data) => {
                            this.photoDeleteCallback(data)
                        }}
                        onItemClick={(data) => {
                            this.photoClick(data)
                        }}
                        isAddLast={this.editable}
                        hideItemDelete={!this.editable}
                    />
                </View>
            </View>
        )
    }

    /**
     * 输入框回调函数
     */
    inputCallback(obj) {
        let data = _.cloneDeep(this.props.data);
        Object.assign(data, obj);
        this.props.myactions.setState({data: _.cloneDeep(data)}, true);
    }

    /**
     * 上传照片回调函数
     */
    photoCallback(obj) {
        if (obj.uploadInfo) {
            let data = _.cloneDeep(this.props.data);
            if (!data.album.pics)
                data.album.pics = new Array();
            data.album.pics.push({
                file_id: obj.uploadInfo.file_id,
                file_path: obj.uploadInfo.url_path,
            })
            this.props.myactions.setState({data: data}, true);
        }
    }

    /**
     * 删除照片回调函数
     */
    photoDeleteCallback(obj) {
        let data = _.cloneDeep(this.props.data);
        let pics = data.album.pics;
        for (var a in pics) {
            if (pics[a].file_id === obj.file_id) {
                pics.splice(a, 1);
            }
        }
        this.props.myactions.setState({data: data}, true);
    }

    /**
     * 照片预览
     */
    photoClick(index) {
        let pics = this.props.data.album.pics
        if (Array.isArray(pics) && pics.length > 0) {
            Actions.photoSwiper({
                photo_data: pics,
                index
            })
        }
    }

    /**
     * 获取数据
     */
    getData() {
        this.props.myactions.setState({data: this.props.routerData.data}, true);
    }

    /**
     * 校验数据
     */
    checkData() {
        let {data} = this.props;
        if (isNull(data.name)) {
            toastShort('课程名称不允许为空');
            return false;
        }
        if (isNull(data.course_num)) {
            toastShort('课程数不允许为空');
            return false;
        }
        if (isNull(data.original_price)) {
            toastShort('课程原价不允许为空');
            return false;
        }
        if (isNull(data.current_price)) {
            toastShort('课程现价不允许为空');
            return false;
        }
        if (data.instalment === 0) {
            toastShort('请选择分期数');
            return false;
        }
        if (isNull(data.monthly_repayment)) {
            toastShort('月供金额不允许为空');
            return false;
        }
        if (isNull(data.album.pics)) {
            toastShort('请上传照片');
            return false;
        }
        return true;
    }

    /**
     * 保存数据
     */
    subData() {
        if (!this.checkData()) {
            return;
        }
        let {data} = this.props;
        let path = '/am_api/am/store/createInstalmentCourse';
        let obj = {
            _AT: global.UserInfo.token,
            name: data.name,
            course_num: data.course_num,
            original_price: data.original_price,
            current_price: data.current_price,
            instalment_id: data.instalment,
            monthly_repayment: data.monthly_repayment,
        };
        // 设置保存或修改的参数
        if (this.props.routerData.status === 'add') {
            obj.id = this.props.routerData.id;
            obj.pics = data.album.pics;
        } else if (this.props.routerData.status === 'update') {
            path = '/am_api/am/store/modifyInstalmentCourse';
            obj.course_id = data.course_id;
            obj.album = data.album;
        }
        this.props.myactions.loadData(
            path,
            obj,
            this.subLocalData
        );
    }

    async subLocalData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data == 'success') {
                DeviceEventEmitter.emit(emitKey);
                Actions.pop();
            }
            return data;
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return (
            <View style={{flex: 1, height: distances.deviceHeight}}>
                <KeyboardAwareScrollView
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        marginBottom: this.editable ? 60 : 0
                    }}
                    bounces={false}
                >
                    <View style={{flex: 1, marginBottom: this.editable ? 60 : 0, backgroundColor: '#fff'}}>
                        {this.getInner()}
                    </View>
                </KeyboardAwareScrollView>
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
                                onPress={this.subData}
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

export default connect(mapStateToProps, mapDispatchToProps)(ByStagesPackage)