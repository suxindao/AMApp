/**
 * create at 05/25/17
 */
import React, {Component} from 'react'
import {View, Text, Image, InteractionManager} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// 界面组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './RecordListPage'
import {NavBarRightImg} from '../../../../components/NavBar/NavBarWithoutLeft'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadData, setState, rsetState, sendData} from '../../../../redux/modules/home/records/recordsReducer'

// presenters
import {fetchRecordsData} from '../presenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {timeSelectObj, typeSelectObj} from '../../../../constants/operation/recordScreenManage'
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

// op common
import {manageRequestBody} from '../../../../constants/operation/departmentManage'
import {lookDateType} from '../../../../constants/operation/lookManage'
import {getToday, getMonthStartAndEnd} from '../../../../constants/operation/time'
// verify
import {verifyString} from '../../../../constants/utils/validate'

const mapStateToProps = state => ({
    loading: state.recordsList.loading,
    loading_success: state.recordsList.loading_success,
    isRender: state.recordsList.isRender,
    init_data: state.recordsList.init_data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loadData, setState, rsetState, sendData}, dispatch),
    dispatch,
})

class Containers extends Component {
    constructor(props) {
        super(props)

        // data
        this.body = {
            _AT: global.UserInfo.token,
            am_id: null,
            group_id: null,
            from_date: null,
            to_date: null,
            type: null,
            page: {
                limit: LIST_ITEM_COUNT,
                next_key: ''
            }
        }

        this.showRightBar = true
        this.oldScreen = null // 记录选过的筛选条件

        // request
        this._requestData = this._requestData.bind(this)
        this._getLoad = this._getLoad.bind(this)

        // click
        this._handleRightClick = this._handleRightClick.bind(this)
        this._screenCallBack = this._screenCallBack.bind(this)
        this._replayCallback = this._replayCallback.bind(this)
        this.createTrackRelpy = this.createTrackRelpy.bind(this)
    }

    componentWillMount() {
        let {routerData} = this.props
        if (routerData && routerData.fromPage && routerData.fromPage == 'look') {
            // 从首页进入
            this.showRightBar = false
            // 处理时间
            if (routerData.dateType == lookDateType.day) {
                // 日数据
                let theDay = verifyString(routerData.dateTime) ? routerData.dateTime : getToday()
                this.body.from_date = theDay
                this.body.to_date = theDay
            } else {
                // 月数据
                let theDay = verifyString(routerData.dateTime) ? routerData.dateTime : getToday()
                let {startDay, endDay} = getMonthStartAndEnd(theDay)
                this.body.from_date = startDay
                this.body.to_date = endDay
            }
            // 处理部门
            if (routerData.bodyData) {
                if (Array.isArray(routerData.bodyData.group_id)) {
                    // 有组
                    this.body.group_id = routerData.bodyData.group_id
                } else {
                    // 组员
                    let amArr = []
                    amArr.push(global.UserInfo.user_id)
                    this.body.am_id = Array.isArray(routerData.bodyData.am_id) ? routerData.bodyData.am_id : amArr
                }
            }
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            // 第一次加载时am_id和group_id都不传就是看全部的
            this._requestData()
        })
    }

    componentWillUnmount() {
        this.props.myactions.rsetState()
    }

    _handleRightClick() {
        Actions.recordScreenPage({routerData: {screenBack: this._screenCallBack, oldScreen: this.oldScreen}})
    }

    _screenCallBack(screenObj, requestData) {
        let {department, typeAndTime} = screenObj
        // 记录已经选过的筛选条件
        this.oldScreen = _.cloneDeep(screenObj)
        let newBody = _.cloneDeep(this.body)
        // 处理时间选择
        if (typeAndTime && typeAndTime.time) {
            let {time} = typeAndTime
            if (time.code == timeSelectObj.all) {
                // 全部
                newBody.from_date = null
                newBody.to_date = null
            } else if (time.code == timeSelectObj.today) {
                let today = getToday()
                newBody.from_date = today
                newBody.to_date = today
            } else {
                newBody.from_date = time.min
                newBody.to_date = time.max
            }
        }

        // 处理类型
        if (typeAndTime && typeAndTime.type) {
            let {type} = typeAndTime
            if (type.code == typeSelectObj.all) {
                newBody.type = null
            } else if (type.code == typeSelectObj.tel) {
                newBody.type = 1
            } else if (type.code == typeSelectObj.sign) {
                newBody.type = 2
            } else {
                newBody.type = 3
            }
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

        this.body = newBody
        this._requestData()
    }

    _requestData() {
        this.props.myactions.loadData(this._getLoad)
    }

    async _getLoad() {
        try {
            let ret = await fetchRecordsData(this.body, '')()
            this.props.myactions.setState({init_data: ret}, true)
            return true
        } catch (e) {
            throw e
        }
    }

    _replayCallback(v, id) {
        this.props.myactions.sendData(
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
                let init_data = _.cloneDeep(this.props.init_data);
                for (var z of init_data.list) {
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
                this.props.myactions.setState({init_data: init_data}, true)
            }
            return data
        } catch (e) {
            console.log('createTrackRelpy:' + e)
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <NavBarRightImg title='跟进记录' img={require('../../../../sources/images/home/navbar_screens.png')}
                                rightFun={this._handleRightClick} showRight={this.showRightBar}
                />
                <WrapLoading {...this.props} onErrorPress={this._requestData}>
                    <Page init_data={this.props.init_data} bodyData={this.body} callback={this._replayCallback}/>
                </WrapLoading>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Containers)