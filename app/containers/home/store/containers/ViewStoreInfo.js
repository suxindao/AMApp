/**
 * Created by Joe on 2017/4/21.
 */
import React, {Component} from 'react';
import {View, TextInput, Text, TouchableHighlight, Image, DeviceEventEmitter, ScrollView} from 'react-native'
import _ from 'lodash'
import {toastShort} from '../../../../constants/toast'
import {Actions} from 'react-native-router-flux'
// style
import {colors, distances, fontScale, globleStyles} from '../../../../constants/style'
// common
import {notification, store} from '../../../../constants/common'
//组件
import ViewStoreInfoItem from './../components/ViewStoreInfoItem'
import SimpleTouchItem from './../components/SimpleTouchItem'
import {btn} from './../../../../components/common/RenderRightButton'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/viewStoreInfoRedux'

const emitKey = notification.viewStoreInfo;

const emitKeyviewStore = notification.viewStore;

const mapStateToProps = state => ({
    isRender: state.viewStoreInfo.isRender,                      //是否渲染
    loading: state.viewStoreInfo.loading,
    loading_success: state.viewStoreInfo.loading_success,
    store_info: state.viewStoreInfo.store_info,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState
    }, dispatch), dispatch
})

/**
 * 门店详情页面
 */
class ViewStoreInfo extends Component {
    constructor(props) {
        super(props)
        this.go2next = this.go2next.bind(this)
        this.getData = this.getData.bind(this)
        this.initLocalData = this.initLocalData.bind(this)
        this.subData = this.subData.bind(this)
        this.subLocalData = this.subLocalData.bind(this)
        this.goBasic = this.goBasic.bind(this)
        this.refresh = '';
    }

    componentWillMount() {
        // 添加监听事件，用于返回刷新页面
        this.refresh = DeviceEventEmitter.addListener(emitKey, param => {
            this.getData(param);
        });
        let {routerData} = this.props;
        if (routerData.status != 'add') {
            this.getData();
            // if(routerData.status!='view'){
            //   Actions.refresh(
            //     {
            //       renderRightButton : ()=><btn.ViewStoreRightButton id={this.props.routerData.id}/>,
            //     }
            //   );
            // }
        }
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
        this.refresh.remove();
    }

    /**
     * 跳转到创建门店页面
     */
    go2next() {
        Actions.createStore();
    }

    /**
     * 获取门店基础数据
     */
    getData(id) {
        this.props.myactions.loadData(
            '/am_api/am/store/detail',
            {
                _AT: global.UserInfo.token,
                id: id || this.props.routerData.id,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            // 赋值门店数据
            this.props.myactions.setState({store_info: data,}, true);
            return data;
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 提交门店数据到门店审核
     */
    subData() {
        this.props.myactions.loadData(
            '/am_api/am/store/sendApply',
            {
                _AT: global.UserInfo.token,
                id: this.props.store_info.id,
            },
            this.subLocalData
        );
    }

    async subLocalData(client, path, param) {
        try {
            let list = await client.post(path, {data: param});
            if (list.errorCode === 1) {
                // 打印错误信息
                toastShort(list.message);
            } else {
                // 刷新门店首页列表数据
                let {emitKey} = this.props;
                if (emitKey)
                    DeviceEventEmitter.emit(emitKey);
                DeviceEventEmitter.emit(emitKeyviewStore);
                // 返回上一页面
                Actions.pop();
            }
            return list;
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 跳转到门店基础信息页面
     */
    goBasic() {
        let {routerData} = this.props;
        if (routerData) {
            let editable = {};
            // 如果为查看状态，赋值为所有项都不可修改
            if (routerData.status === 'add') {
                Actions.createStore();
            } else {
                if (routerData.status === 'view') {
                    editable = {
                        cms_code: false,
                        brand_name: false,
                        branch: false,
                        store_type: false,
                        store_tel: false,
                        region: false,
                        position: false,
                        address: false,
                        location: false,
                        area: false,
                        found_year: false,
                        tag: false,
                        contacts: false,
                    }
                } else {
                    // 否则可以修改
                    editable = {
                        cms_code: true,
                        brand_name: true,
                        branch: true,
                        store_type: true,
                        store_tel: true,
                        region: true,
                        position: true,
                        address: true,
                        location: true,
                        area: true,
                        found_year: true,
                        tag: true,
                        contacts: true,
                    }
                }
                // 跳转到基础信息页面
                Actions.basicStoreInfo(
                    {
                        routerData: {
                            data: this.props.store_info,
                            status: routerData.status,
                            id: routerData.id,
                            editable: editable,
                        },
                        emitKey: emitKey
                    }
                );
            }

        }
    }

    render() {
        let {routerData} = this.props;
        return (
            <View
                style={{
                    backgroundColor: colors.labBgColor,
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <ScrollView bounces={false} style={{marginBottom: routerData.status == 'view' ? 0 : 60}}>
                    {
                        this.props.store_info.id ?
                            <View
                                style={{
                                    width: distances.deviceWidth,
                                    minHeight: 170,
                                    borderTopWidth: distances.borderWidth,
                                    borderBottomWidth: distances.borderWidth,
                                    borderColor: colors.borderColor,
                                    backgroundColor: colors.labBgColor,
                                }}
                            >
                                <ViewStoreInfoItem data={this.props.store_info}/>
                            </View> :
                            null
                    }
                    <View style={{
                        width: distances.deviceWidth,
                        backgroundColor: '#fff',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}>
                        <SimpleTouchItem
                            config={{
                                hasLine: true,
                                title: '基础信息',
                            }}
                            touchCallback={this.goBasic}
                        />
                        <SimpleTouchItem
                            config={{
                                hasLine: true,
                                title: '门店相册',
                            }}
                            touchCallback={() => {
                                if (this.props.store_info.id)
                                    Actions.storePhotoInfo({
                                        id: this.props.store_info.id,
                                        status: this.props.routerData.status
                                    })
                                else
                                    toastShort('请先填写基础信息！')
                            }}
                        />
                        <SimpleTouchItem
                            config={{
                                hasLine: true,
                                title: '试听课程',
                            }}
                            touchCallback={() => {
                                if (this.props.store_info.id)
                                    Actions.listeningCourse({
                                        id: this.props.store_info.id,
                                        editable: this.props.routerData.status !== 'view'
                                    })
                                else
                                    toastShort('请先填写基础信息！')
                            }}
                        />
                        <SimpleTouchItem
                            config={{
                                hasLine: true,
                                title: '门店课程',
                            }}
                            touchCallback={() => {
                                if (this.props.store_info.id)
                                    Actions.storeCourseList({
                                        id: this.props.store_info.id,
                                        status: this.props.routerData.status
                                    });
                                else
                                    toastShort('请先填写基础信息！')
                            }}
                        />
                        <SimpleTouchItem
                            config={{
                                hasLine: false,
                                title: '分期课包',
                            }}
                            touchCallback={() => {
                                if (this.props.store_info.id)
                                    Actions.byStagesPackageList({
                                        id: this.props.store_info.id,
                                        status: this.props.routerData.status
                                    });
                                else
                                    toastShort('请先填写基础信息！')
                            }}
                        />
                    </View>
                </ScrollView>
                {
                    routerData.status == 'view' ?
                        null :
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
                                    提交申请
                                </Text>
                            </TouchableHighlight>
                        </View>
                }
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewStoreInfo)
