/**
 * create at 04/14/17
 */
import React, {Component} from 'react'
import {
    View, Text, Image, TouchableHighlight, InteractionManager, ScrollView
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// 界面组件
import TabIcon, {TabCode} from '../../components/Tabbar'
import WrapLoading from '../../components/load/wraploading'
import LookTopComponent from '../look/components/filterScrollGroup/LookTopComponent'
import {NavBarRightImg} from '../../components/NavBar/NavBarWithoutLeft'
import StoreComponent from '../look/components/storeComponent'
import TextTabBar from '../../components/scrollTabBar/textDefaultTabBar'
import ScrollTab from '../look/components/ScrollTab'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData} from '../../redux/reducers/look/lookContainerReducer'
import {setMineTabbarPoint} from '../../redux/reducers/look/tabbarReducer'
// presenter
import {fetchPageWithoutCache} from '../look/presenters/pagePresenter'

// style
import {colors, distances, fontScale} from '../../constants/style'
// toast
import {toastShort} from '../../constants/toast'
// op common
import {
    departmentInitObj, manageRequestBody, manageShowName
} from '../../constants/operation/departmentManage'
import {getToday} from '../../constants/operation/time'
import {
    currentStatsType, currentSortElement, currentSortStatus, sortStatsData
} from '../../constants/operation/lookManage'
// notify
import {
    registerReceiveRemoteNofity, removeReceiveRemoteNofify, registerClickRemoteNotify, removeClickRemoteNotify
} from '../../modules/notify'

const mapStateToProps = state => ({
    loading: state.look.loading,
    loading_success: state.look.loading_success,
    current_department: state.look.current_department,
    page_data: state.look.page_data,
    request_body: state.look.request_body,
    department_name: state.look.department_name,
    date_time: state.look.date_time
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData, setMineTabbarPoint}, dispatch),
    dispatch,
})

class LookComponent extends Component {
    constructor(props) {
        super(props)
        // 初始化一个无任何条件的body
        this.body = {
            _AT: global.UserInfo.token,
            am_id: null,
            group_id: null,
            date: ''
        }

        // 部门名字
        this.departmentName = Boolean(global.UserInfo.user_name) ? global.UserInfo.user_name : ''
        // 时间
        this.dateTime = getToday()

        // 单纯获取首页数据
        this._requestData = this._requestData.bind(this)
        this._getLoad = this._getLoad.bind(this)
        // 筛选返回
        this.filterBack = this.filterBack.bind(this)
        // click
        this._handleRightClick = this._handleRightClick.bind(this)
        // 推送
        this._notifyReceiveFun = this._notifyReceiveFun.bind(this)
    }

    componentDidMount() {
        if (Boolean(this.props.page_data)) {
            // 检测是否有页面数据
            // 有页面数据，因为日数据有变化(数据有变动，比如日跟进记录)
            // 刷新数据，数据reducer正确赋值
            let {
                current_department, page_data, request_body, department_name, date_time
            } = this.props
            // 部门名字赋值
            this.departmentName = department_name
            // 时间赋值
            this.dateTime = date_time
            // 赋值body
            this.body = _.cloneDeep(request_body)
            InteractionManager.runAfterInteractions(() => {
                this._requestData(current_department)
            })
        } else {
            // 页面第一次加载
            InteractionManager.runAfterInteractions(() => {
                // 设置请求 body
                let arr = []
                arr.push(global.UserInfo.user_id)
                this.body.am_id = arr
                // 请求
                let newDepartment = _.cloneDeep(departmentInitObj)
                this._requestData(newDepartment)
            })
        }
        // 注册消息
        registerReceiveRemoteNofity(this._notifyReceiveFun) // 接收远程'payload'通知事件
        registerClickRemoteNotify(this._notifyClickFun) // 点击消息
    }

    componentWillUnmount() {
        // 移除通知
        removeReceiveRemoteNofify(this._notifyReceiveFun)
        removeClickRemoteNotify(this._notifyClickFun)
    }

    _notifyReceiveFun(notification) {
        // 设置我的红点
        this.props.myactions.setMineTabbarPoint(true)
    }

    _notifyClickFun(notification) {
        if (global.CurUser) {
            // 只有有当前用户才跳转
            Actions.mineMsgList()
        }
    }

    // 单纯获取首页数据
    _requestData(departObj) {
        this.props.myactions.loadData(() => this._getLoad(departObj))
    }

    // 单纯获取首页数据
    async _getLoad(departObj) {
        try {
            // 赋值时间
            this.body.date = this.dateTime
            let ret = await fetchPageWithoutCache(this.body, '')()
            // 存储body
            let storeBody = _.cloneDeep(this.body)
            return {
                page_data: ret,
                current_department: departObj,
                request_body: storeBody,
                department_name: this.departmentName,
                date_time: this.dateTime
            }
        } catch (e) {
            console.log('_getLoad e===>', e)
            throw e
        }
    }

    _handleRightClick() {
        Actions.lookPageScreen({
            routerData: {
                resultBack: this.filterBack,
                current_department: this.props.current_department,
                select_time: this.props.date_time
            }
        })
    }

    filterBack(result, requestData) {
        // 筛选返回数据， 重新请求门店数据
        if (result.code == 'reset') {
            // 重置名字
            this.departmentName = Boolean(global.UserInfo.user_name) ? global.UserInfo.user_name : ''
            // 重置设置请求 body
            let arr = []
            arr.push(global.UserInfo.user_id)
            this.body.am_id = arr
            // 还原 group_id
            this.body.group_id = null
            this.dateTime = getToday()
            let newDepartment = _.cloneDeep(departmentInitObj)
            InteractionManager.runAfterInteractions(() => {
                this._requestData(newDepartment)
            })
        } else if (result.code == 'confirm') {
            // 取 部门选择后的结构 和 时间str
            let {departmentData, dateTime} = result
            // 设置名字
            this.departmentName = manageShowName(departmentData, '')
            // 处理数据
            let {code, body, error_msg} = manageRequestBody(this.body, departmentData, requestData)
            if (Boolean(code) && Boolean(body)) {
                this.body = body
                this.dateTime = dateTime
                InteractionManager.runAfterInteractions(() => {
                    this._requestData(departmentData)
                })
            } else {
                console.log('filterBack error===>', error_msg)
                this.dateTime = dateTime
                InteractionManager.runAfterInteractions(() => {
                    this._requestData(this.props.current_department)
                })
            }

        } else {
            console.log('result.code is underfine')
        }
    }

    render() {
        let {page_data, request_body, department_name, date_time} = this.props
        return (
            <View style={{flex: 1}}>
                <NavBarRightImg title='首页' img={require('../../sources/images/home/navbar_screens.png')}
                                rightFun={this._handleRightClick} showRight={true} showLeft={false}
                />
                <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                    <WrapLoading {...this.props} onErrorPress={this._requestData}>
                        <View style={{flex: 1}}>
                            <LookTopComponent departmentName={department_name} timeStr={date_time}/>
                            <LookPage pageStyle={{
                                marginBottom: distances.tabBarHeight
                            }} init_data={page_data} bodyData={request_body} dateTime={date_time}/>
                        </View>
                    </WrapLoading>
                    <TabIcon currentCode={TabCode.LOOK_TAB}/>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LookComponent)

class LookPage extends Component {
    constructor(props) {
        super(props)

        // data
        this.tabs = [
            {code: currentStatsType.week, name: '本周'},
            {code: currentStatsType.month, name: '本月'}
        ]
        this.state = {
            weekSelectElement: currentSortElement.bailValue,
            monthSelectElement: currentSortElement.bailValue,
            weekSelectSort: currentSortStatus.descend,
            monthSelectSort: currentSortStatus.descend
        }

        // UI
        this.renderTabs = this.renderTabs.bind(this)
        // click
        this._weekSortChange = this._weekSortChange.bind(this)
        this._monthSortChange = this._monthSortChange.bind(this)
    }

    _weekSortChange(element, status) {
        if (element === this.state.weekSelectElement) {
            // 元素相同， 同一元素状态切换
            if (status === currentSortStatus.ascend) {
                // 原来是升序
                this.setState({
                    weekSelectSort: currentSortStatus.descend
                })
            } else {
                // 原来是降序
                this.setState({
                    weekSelectSort: currentSortStatus.ascend
                })
            }
        } else {
            // 元素不同切换元素
            this.setState({
                weekSelectElement: element,
                weekSelectSort: currentSortStatus.descend
            })
        }
    }

    _monthSortChange(element, status) {
        if (element === this.state.monthSelectElement) {
            // 元素相同， 同一元素状态切换
            if (status === currentSortStatus.ascend) {
                // 原来是升序
                this.setState({
                    monthSelectSort: currentSortStatus.descend
                })
            } else {
                // 原来是降序
                this.setState({
                    monthSelectSort: currentSortStatus.ascend
                })
            }
        } else {
            // 元素不同切换元素
            this.setState({
                monthSelectElement: element,
                monthSelectSort: currentSortStatus.descend
            })
        }
    }

    renderTabs(tabs) {
        let {weekData, monthData} = this.props.init_data
        let {
            weekSelectElement, monthSelectElement, weekSelectSort, monthSelectSort
        } = this.state
        return tabs.map((item, idx) => {
            switch (item.code) {
                case currentStatsType.week: {
                    let newWeekStats = _.cloneDeep(weekData.stats ? weekData.stats : [])
                    newWeekStats = sortStatsData(newWeekStats, weekSelectElement, weekSelectSort)
                    return (
                        <ScrollTab style={{flex: 1}} scrollable={false}
                                   data={newWeekStats}
                                   key={item.code} code={currentStatsType.week}
                                   weekSelectElement={weekSelectElement} weekSelectStatus={weekSelectSort}
                                   weekSortPress={this._weekSortChange}
                        />
                    )
                }
                case currentStatsType.month: {
                    let newMonthStats = _.cloneDeep(monthData.stats ? monthData.stats : [])
                    newMonthStats = sortStatsData(newMonthStats, monthSelectElement, monthSelectSort)
                    return (
                        <ScrollTab style={{flex: 1}} scrollable={true}
                                   data={newMonthStats}
                                   key={item.code} code={currentStatsType.month}
                                   monthSelectElement={monthSelectElement} monthSelectStatus={monthSelectSort}
                                   monthSortPress={this._monthSortChange}
                        />
                    )
                }
                default:
                    return <View style={{flex: 1}} key={item.code}/>
            }
        })
    }

    render() {
        let {pageStyle, init_data, bodyData, dateTime} = this.props
        if (!Boolean(init_data)) {
            return null
        }
        return (
            <View style={[pageStyle, {flex: 1}]}>
                <ScrollView>
                    <StoreComponent data={init_data} bodyData={bodyData} dateTime={dateTime}/>
                    {(() => {
                        if (Boolean(init_data.weekData) && Boolean(init_data.monthData)) {
                            return (
                                <ScrollableTabView
                                    renderTabBar={() =>
                                        <TextTabBar
                                            tabArr={this.tabs}
                                            containerStyle={{
                                                height: 45,
                                                backgroundColor: '#fff',
                                                borderColor: colors.borderColor,
                                                borderBottomWidth: distances.borderWidth,
                                                borderTopWidth: distances.borderWidth,
                                            }}
                                            itemStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                            activeTextColor='#73b1fa'
                                            inactiveTextColor='#333'
                                            textStyle={{fontSize: 13 * fontScale}}
                                            underlineHeight={distances.scrollTabActiveBorderWidth}
                                            underlineColor={colors.blueColor}
                                        />
                                    }
                                    locked={true}
                                >
                                    {this.renderTabs(this.tabs)}
                                </ScrollableTabView>
                            )
                        }
                        return null
                    })()}
                </ScrollView>
            </View>
        )
    }
}