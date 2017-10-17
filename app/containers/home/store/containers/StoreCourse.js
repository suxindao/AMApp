/**
 * Created by Joe on 2017/5/3.
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
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/storeCourseRedux'

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

const emitKey = notification.storeCourseList;

const mapStateToProps = state => ({
    isRender: state.storeCourse.isRender,                      //是否渲染
    loading: state.storeCourse.loading,
    loading_success: state.storeCourse.loading_success,
    editable: state.storeCourse.editable,
    data: state.storeCourse.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
    }, dispatch), dispatch
})

class StoreCourse extends Component {
    constructor(props) {
        super(props)
        this.renderLable = this.renderLable.bind(this)
        this.getPhotoData = this.getPhotoData.bind(this)
        this.getPerson = this.getPerson.bind(this)
        this.getInner = this.getInner.bind(this)
        this.photoCallback = this.photoCallback.bind(this)
        this.photoDeleteCallback = this.photoDeleteCallback.bind(this)
        this.photoSwiper = this.photoSwiper.bind(this)
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
     * 返回开班人数dom标签
     */
    getPerson(student_min, student_max) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: 60,
                    marginRight: distances.leftMargin,
                    flexDirection: 'row'
                }}
            >
                <View style={{marginRight: 5}}>
                    <TextInput
                        style={lablestyle}
                        onChange={(e) => {
                            this.inputCallback({student_min: e.nativeEvent.text});
                        }}
                        editable={this.editable}
                        value={student_min + ''}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
                <View>
                    <Text>至</Text>
                </View>
                <View style={{marginLeft: 5}}>
                    <TextInput
                        style={lablestyle}
                        onChange={(e) => {
                            this.inputCallback({student_max: e.nativeEvent.text});
                        }}
                        editable={this.editable}
                        value={student_max + ''}
                        underlineColorAndroid={'transparent'}
                    />
                </View>
            </View>
        )
    }

    /**
     * 返回门店内容dom标签
     */
    getInner() {
        let {data = new Array()} = this.props;
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
                            placeholder: '请填写',
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
                            title: '开班人数',
                            type: 'custom',
                            innerElemet: this.getPerson(data.student_min + '', data.student_max + '')
                        }}
                    />
                </View>
                <View style={{width: distances.deviceWidth, backgroundColor: '#fff'}}>
                    <ContentComponent
                        config={{
                            hasLine: false,
                            title: '课时长度',
                            type: 'input',
                            placeholder: '请填写',
                            keyboardType: 'numeric',
                            editable: this.editable,
                            key: 'class_min',
                            value: data.class_min + ''
                        }}
                        callback={obj => {
                            this.inputCallback(obj)
                        }}
                    />
                </View>
                {this.renderLable('课程介绍')}
                <DesComponent data={data.desc + ''} editable={this.editable} updateInput={data => {
                    this.inputCallback({desc: data})
                }}/>
                {this.renderLable('课程照片')}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        marginRight: distances.contractLeftMargin,
                    }}
                >
                    <PhotoSelect
                        photoNumber={20}
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
                            this.photoSwiper(data)
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
     * 照片 预览
     * @param index
     */
    photoSwiper(index) {
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
        if (data.student_min > data.student_max) {
            toastShort('开班人数最大值和最小值数量有误，请修正');
            return false;
        }
        if (isNull(data.class_min)) {
            toastShort('课时长度不允许为空');
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
        let path = '/am_api/am/store/createCourse';
        let obj = {
            _AT: global.UserInfo.token,
            name: data.name,
            student_min: data.student_min,
            student_max: data.student_max,
            class_min: data.class_min,
            desc: data.desc,
        };
        // 设置保存或修改的参数
        if (this.props.routerData.status === 'add') {
            obj.id = this.props.routerData.id;
            obj.pics = data.album.pics;
        } else if (this.props.routerData.status === 'update') {
            path = '/am_api/am/store/modifyCourse';
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
        if (JSON.stringify(this.props.data) === '{}')
            return null;
        return (
            <View style={{flex: 1, height: distances.deviceHeight}}>
                <KeyboardAwareScrollView
                    style={{
                        flex: 1,
                        backgroundColor: colors.labBgColor,
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

/**
 * 课程介绍
 * 多行输入框
 */
class DesComponent extends Component {
    constructor(props) {
        super(props)
        this._inputUpdate = this._inputUpdate.bind(this)
    }

    _inputUpdate(text) {
        let {updateInput} = this.props
        updateInput(text)
    }

    render() {
        let {data, editable} = this.props
        return (
            <View style={{
                backgroundColor: '#fff', height: 125,
                paddingLeft: distances.contractLeftMargin,
                paddingRight: distances.contractLeftMargin,
                paddingTop: 5,
                paddingBottom: 5,
            }}>
                {multilineTextInput(data, this._inputUpdate, '请填写', null, editable)}
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreCourse)