/**
 * create at 06/22/17
 */
import React, {Component} from 'react'
import {View, Text, Image, InteractionManager, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import _ from 'lodash'

// 界面组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './OrderListPage'
import {NavbarWidthTwoRightImg} from '../../../../components/NavBar/NavBarWithoutLeft'
import TextTabBar from '../../../../components/scrollTabBar/textDefaultTabBar'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData} from '../../../../redux/modules/home/order/referOrderListReducer'

// presenter
import {fetchReferOrderList} from '../presenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'
import {toastShort} from '../../../../constants/toast'
// op common
import {manageShowName, manageRequestBody} from '../../../../constants/operation/departmentManage'

// const 
const NEW_ORDER = 'new_order' // 新订单
const WAIT_REVIEW = 'wait_review' // 待审核
const REVIEWING = 'reviewing' // 审核中
const REJECT = 'reject' // 拒绝

const mapStateToProps = state => ({
    loading: state.referOrderList.loading,
    loading_success: state.referOrderList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData}, dispatch),
    dispatch,
})

class OrderContainer extends Component {
    constructor(props) {
        super(props)

        this.tabs = [
            {code: NEW_ORDER, name: '新订单'},
            {code: WAIT_REVIEW, name: '待审核'},
            {code: REVIEWING, name: '审核中'},
            {code: REJECT, name: '拒绝'},
        ]

        // data
        this.body = {
            _AT: global.UserInfo.token,
            am_id: null,
            group_id: null,
            from_date: null,
            to_date: null,
            type: 1, // 1-新订单 2-待审核 3-审核中 4-拒绝
            page: {
                limit: LIST_ITEM_COUNT,
                next_key: ''
            }
        }

        this.isShowRemind = false // 是否显示 remind
        this.departmentName = '' // 部门显示
        this.timeShow = '' // 时间显示
        this.oldScreen = null // 记录选过的筛选条件

        // UI
        this._renderTabs = this._renderTabs.bind(this)
        // click
        this._rightHandle = this._rightHandle.bind(this) // right handle
        this._changeTab = this._changeTab.bind(this)
        this._screenCallBack = this._screenCallBack.bind(this)
        // request
        this._requestData = this._requestData.bind(this)
        this._getLoad = this._getLoad.bind(this)
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._requestData()
        })
    }

    _requestData() {
        this.props.myactions.loadData(this._getLoad)
    }

    async _getLoad() {
        try {
            let newBody = _.cloneDeep(this.body)
            let ret = await fetchReferOrderList(newBody, '')()
            this.data = ret
            return true
        } catch (e) {
            console.log('_getLoad e===>', e)
            throw e
        }
    }

    _rightHandle() {
        Actions.orderScreenPage({routerData: {screenBack: this._screenCallBack, oldScreen: this.oldScreen}})
    }

    _screenCallBack(screenObj, requestData) {
        let {department, timeData} = screenObj
        // 记录已经选过的筛选条件
        this.oldScreen = _.cloneDeep(screenObj)
        // 处理显示名字
        this.departmentName = manageShowName(department, '')
        this.timeShow = manageTimeName(timeData)
        if (this.departmentName.length > 0 || this.timeShow.length > 0) {
            this.isShowRemind = true
        }
        // 处理请求结果
        let newBody = _.cloneDeep(this.body)
        // 处理时间选择
        if (timeData) {
            newBody.from_date = timeData.min
            newBody.to_date = timeData.max
        }
        // 处理部门
        if (department) {
            let {code, body, error_msg} = manageRequestBody(newBody, department, requestData)
            if (Boolean(code) && Boolean(body)) {
                newBody = body
            } else {
                console.log('filterBack error===>', error_msg)
            }
        }
        // 赋值body
        this.body = newBody
        this._requestData()
    }

    // tab切换
    _changeTab(idx) {
        this.body.type = idx + 1
        this._requestData()
    }

    _renderTabs(tabs) {
        return tabs.map((item) => {
            return (
                <View key={item.code} style={{flex: 1}}>
                    {showTopRemind(this.isShowRemind, this.timeShow, this.departmentName)}
                    <WrapLoading {...this.props} onErrorPress={() => {
                        this._requestData()
                    }}>
                        <Page code={item.code} init_data={this.data} body={this.body}/>
                    </WrapLoading>
                </View>
            )
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <NavbarWidthTwoRightImg title={'订单状态查询'}
                                        img2={require('../../../../sources/images/home/navbar_screens.png')}
                                        rightFun2={this._rightHandle}
                                        img1={require('../../../../sources/images/search_white.png')}
                                        rightFun1={Actions.referOrderSearch}
                />
                <ScrollableTabView
                    renderTabBar={() =>
                        <TextTabBar
                            tabArr={this.tabs}
                            containerStyle={{
                                height: 44,
                                backgroundColor: '#fff',
                                borderColor: colors.borderColor,
                                borderBottomWidth: distances.borderWidth,
                            }}
                            itemStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            activeTextColor='#73b1fa'
                            inactiveTextColor='#666'
                            textStyle={{fontSize: 13 * fontScale}}
                            underlineHeight={distances.scrollTabActiveBorderWidth}
                            underlineColor={colors.blueColor}
                        />
                    }
                    onChangeTab={(obj) => {
                        this._changeTab(obj.i)
                    }}
                    locked={true}
                    scrollWithoutAnimation={true}
                >
                    {this._renderTabs(this.tabs)}
                </ScrollableTabView>
            </View>
        )
    }
}

/**
 * 顶部 提示
 * @param {*} isShow
 * @param {*} time
 * @param {*} name
 */
function showTopRemind(isShow = false, time = '', name = '') {
    if (isShow) {
        return (
            <View style={{height: 35, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.remindText, {flex: 1, marginLeft: distances.leftMargin}]}>
                    {Boolean(time) ? time : ''}
                </Text>
                <Text style={[styles.remindText, {marginRight: distances.leftMargin}]}>
                    {Boolean(name) ? name : ''}
                </Text>
            </View>
        )
    }
    return <View style={{height: 10}}/>
}

function manageTimeName(data) {
    resultNameStr = ''
    if (Boolean(data.min) || Boolean(data.max)) {
        if (data.min.length > 0 && data.max.length > 0) {
            resultNameStr = data.min + ' 至 ' + data.max
        } else if (data.min.length > 0) {
            resultNameStr = data.min
        } else {
            resultNameStr = data.max
        }
        return resultNameStr
    }
    // 数据异常
    return resultNameStr
}

const styles = StyleSheet.create({
    remindText: {
        color: '#999',
        fontSize: 12 * fontScale
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderContainer)