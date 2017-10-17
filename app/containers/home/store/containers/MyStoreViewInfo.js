/**
 * Created by Joe on 2017/6/1.
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, ScrollView, DeviceEventEmitter} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import _ from 'lodash'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
    loadData,
    setState,
    rsetState,
} from './../../../../redux/modules/home/store/myStoreViewInfoRedux'

// 组件
import TextTabBar from './../../../../components/scrollTabBar/textDefaultTabBar'
import FollowIem from './../components/FollowIem'
import {btn} from './../../../../components/common/RenderRightButton'
import BottomPopup from './../../../../components/common/BottomPopup'
import ActionSheet from '../../../../components/modal/ActionSheet'
import MyStore from './../components/MyStore'
import ActivityType from './../components/ActivityType'
import ElementAlert from './../../../../components/common/ElementAlert'
import StoreDetails from '../components/StoreDetails'

// style
import {colors, distances, fontScale} from './../../../../constants/style'
import {toastShort} from '../../../../constants/toast'

const FOLLOW = 'FOLLOW'
const VIEW = 'VIEW'

// presenters
const mapStateToProps = state => ({
    isRender: state.myStoreViewInfo.isRender,
    list: state.myStoreViewInfo.list,
    data: state.myStoreViewInfo.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
    }, dispatch),
    dispatch,
})

class MyStoreViewInfo extends Component {
    constructor(props) {
        super(props)

        // data
        this.items = [
            {code: FOLLOW, name: '跟进记录'},
            {code: VIEW, name: '详细信息'},
        ]
        this.state = {
            showActionSheet: false, // 展示 actonSheet浮层
        }

        this._replayCallback = this._replayCallback.bind(this)
        this.createTrackRelpy = this.createTrackRelpy.bind(this)

        // UI
        this.renderTabs = this.renderTabs.bind(this)
        // request
        this.getFollowList = this.getFollowList.bind(this);
        this.initLocalData = this.initLocalData.bind(this);
        this.getViewData = this.getViewData.bind(this);
        this.initViewData = this.initViewData.bind(this);
        this.getViewStoreInfo = this.getViewStoreInfo.bind(this);
        this.getViewStoreInfos = this.getViewStoreInfos.bind(this);
        // click
        this.goAddActivity = this.goAddActivity.bind(this);

        this._rightBarClick = this._rightBarClick.bind(this);
        this._hideActionSheet = this._hideActionSheet.bind(this)
        this._actionItem = this._actionItem.bind(this)
    }

    componentWillMount() {
        Actions.refresh(
            {
                renderRightButton: () => <btn.MoreButton callback={this._rightBarClick}/>,
                title: this.props.routerData.name
            }
        );
        this.getFollowList();
        this.getViewData();
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    _replayCallback(v, id) {
        this.props.myactions.loadData(
            '/am_api/am/store/createTrackReply',
            {
                _AT: global.UserInfo.token,
                id: id,
                reply: v
            },
            this.createTrackRelpy
        )
    }

    async createTrackRelpy(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data) {
                let list = _.cloneDeep(this.props.list);
                for (var z of list) {
                    if (z.id === param.id) {
                        z.replies.push({
                            am_id: data.am_id,
                            am_name: data.am_name,
                            create_time: data.create_time,
                            reply: param.reply
                        })
                        break;
                    }
                }
                this.props.myactions.setState({list: list}, true)
            }
            return data
        } catch (e) {
            console.log('createTrackRelpy:' + e)
        }
    }

    renderTabs(tabs) {
        return tabs.map((item) => {
            switch (item.code) {
                case FOLLOW:
                    return (
                        <FollowIem
                            key={'follow_' + item.code}
                            list={this.props.list}
                            name={this.props.routerData.name}
                            callback={() => {
                                this.refs.activityType.slideModal()
                            }}
                            replayCallback={this._replayCallback}
                        />
                    )
                case VIEW:
                    return (
                        <MyStore
                            key={item.code}
                            editable={false}
                            // 是否审核中
                            status={
                                (Boolean(this.props.routerData) && Boolean(this.props.routerData.isReviewing))
                                    ? 'view' : 'update'
                            }
                            emitKey={this.props.emitKey}
                            routerData={{data: this.props.data}}
                        />
                    )
                default:
                    return (
                        <View style={{flex: 1}} key={item.code}/>
                    )
            }
        })
    }

    getFollowList() {
        this.props.myactions.loadData(
            '/am_api/am/store/trackList',
            {
                _AT: global.UserInfo.token,
                id: this.props.routerData.id,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.props.myactions.setState({list: data}, true);
            return data;
        } catch (e) {
            console.log(e.message);
        }
    }

    getViewData() {
        this.props.myactions.loadData(
            '/am_api/am/store/detail',
            {
                _AT: global.UserInfo.token,
                id: this.props.routerData.id,
            },
            this.initViewData
        );
    }

    async initViewData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.props.myactions.setState({data: data}, true);
            return data;
        } catch (e) {
            console.log(e.message);
        }
    }

    getViewStoreInfo() {
        this.props.myactions.loadData(
            '/am_api/am/store/toPOI',
            {
                _AT: global.UserInfo.token,
                id: this.props.routerData.id,
            },
            this.getViewStoreInfos
        );
    }

    async getViewStoreInfos(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this._hideActionSheet()
            Actions.viewStoreInfo({routerData: {id: this.props.routerData.id, status: 'update'}});
            return data;
        } catch (e) {
            console.log(e.message);
        }
    }

    goAddActivity(type) {
        this.refs.activityType.hide()
        Actions.addActivity({routerData: {type: type, callback: this.getFollowList, id: this.props.routerData.id}})
    }

    _rightBarClick() {
        this.setState({
            showActionSheet: true
        })
    }

    _hideActionSheet() {
        this.setState({
            showActionSheet: false
        })
    }

    _actionItem(key) {
        if (key === 0) {
            let {isReviewing} = this.props.routerData
            if (isReviewing) {
                // 门店审核中
                toastShort('门店审核中')
                this._hideActionSheet()
                return
            }
            this.getViewStoreInfo()
            // 刷新数据
            let {emitKey} = this.props;
            if (emitKey) {
                DeviceEventEmitter.emit(emitKey);
            }
        }
        if (key === 1) {
            Actions.choiceColleague({
                routerData: {id: this.props.routerData.id, name: this.props.data.branch},
                emitKey: this.props.emitKey
            });
            this._hideActionSheet()
        }
        if (key === 'cancel') {
            this._hideActionSheet()
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.labBgColor,
            }}>
                <StoreDetails
                    data={this.props.data}
                    style={{
                        width: distances.deviceWidth,
                        backgroundColor: colors.blueColor,
                        // flex: 1,
                    }}
                />
                <ScrollableTabView
                    style={{flex: 1}}
                    onChangeTab={() => {
                    }}
                    renderTabBar={
                        () => {
                            return (
                                <TextTabBar
                                    tabArr={this.items}
                                    containerStyle={{
                                        height: 44,
                                        backgroundColor: '#fff',
                                        borderColor: colors.borderColor,
                                        borderBottomWidth: distances.borderWidth,
                                        marginBottom: 10
                                    }}
                                    itemStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                    activeTextColor='#73b1fa'
                                    inactiveTextColor='#666'
                                    textStyle={{fontSize: 13 * fontScale}}
                                    underlineHeight={distances.scrollTabActiveBorderWidth}
                                    underlineColor={colors.blueColor}
                                />
                            )
                        }
                    }
                    locked={true}
                >
                    {this.renderTabs(this.items)}
                </ScrollableTabView>
                <ElementAlert
                    ref="activityType"
                    tapBackHide={false}
                    innerElement={
                        <ActivityType
                            touchItem={this.goAddActivity}
                            callback={() => {
                                this.refs.activityType.hide()
                            }}
                        />
                    }
                />
                <ActionSheet visible={this.state.showActionSheet} modalPress={this._hideActionSheet}
                             itemPress={this._actionItem} contentItems={['发起上线审批', '转给他人']}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStoreViewInfo)