/**
 * create at 08/02/17
 */
import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native'
import _ from 'lodash'

// components
import ScrollGroupComponent from '../common/ScrollGroupComponent'
import LoadingFloatingLayer from '../common/LoadingFloatingLayer'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

// style
import {colors, distances, fontScale} from '../../constants/style'

// op common
import {
    departmentInitObj, manageGroups, manageMembers, manageRequestMembers, manageCitys
} from '../../constants/operation/departmentManage'

// presenter
import {fetchPageGetMembers} from '../../containers/look/presenters/pagePresenter'

// const
const groupsCode = {
    city: 'GROUP_CITY_CODE',
    group: 'GROUP_GROUP_CODE',
    member: 'GROUP_MEMBER_CODE'
}

export default class Department extends Component {
    constructor(props) {
        super(props)

        // Data
        this.currentGroup = [] // 当前组
        this.currentMembers = [] // 当前组员

        this.state = {
            pageRefresh: false
        }

        // function
        this.groupItemClick = this.groupItemClick.bind(this)
        this._getMembers = this._getMembers.bind(this)
        this._manageData = this._manageData.bind(this)
    }

    componentWillMount() {
        this._manageData()
    }

    _manageData() {
        let {data, current_department} = this.props
        // 如果组结构调整, 则先按错误的显示，让用户重新选择
        const {citys, groups} = manageCitys(data)
        this.citys = citys
        this.allGroups = groups
        // 赋值上次的选择结果
        this.resultObj = _.cloneDeep(current_department)

        let {city, group, member} = this.resultObj
        if (typeof city.id === 'number' && city.id > 0) {
            // 选择了城市且城市不为全部
            this.currentGroup = manageGroups(this.allGroups, city.id)

            if (typeof group.id === 'number' && group.id > 0) {
                // 下面请求是异步操作
                this._getMembers(group.id, false)
            }
        }
    }

    groupItemClick(titleCode, result) {
        // 返回 结果 第一个code 是组类型， 第二个code是选择的item code
        let {departmentBack} = this.props
        let {city, group, member} = this.resultObj
        switch (titleCode) {
            case groupsCode.city: {
                let cityId = (typeof result.id === 'number') ? result.id : 0
                // id不一致才刷新和重置
                if (cityId != city.id) {
                    // 先重置
                    // 重置组
                    this.currentGroup = []
                    group.id = -1
                    group.name = ''
                    // 重置组员
                    this.currentMembers = []
                    member.id = -1
                    member.name = ''
                    // 重新赋值
                    // 城市重新赋值
                    city.id = cityId
                    city.name = Boolean(result.name) ? result.name : ''
                    // 重新赋值当前组
                    if (city.id == 0) {
                        // 城市id为0， 全部情况不显示，组
                    } else {
                        this.currentGroup = manageGroups(this.allGroups, cityId)
                    }
                    // 刷新界面
                    this.setState({
                        pageRefresh: !this.state.pageRefresh
                    })
                }
            }
                break;
            case groupsCode.group: {
                let groupId = (typeof result.id === 'number') ? result.id : 0
                // id不一致才刷新和重置
                if (groupId != group.id) {
                    // 先重置
                    this.currentMembers = []
                    member.id = -1
                    member.name = ''
                    // 重新赋值
                    // 组重新赋值
                    group.id = groupId
                    group.name = Boolean(result.name) ? result.name : ''
                    if (group.id == 0) {
                        // 组id 是0 ,即组为全部，则不显示组员
                        // 刷新界面
                        this.setState({
                            pageRefresh: !this.state.pageRefresh
                        })
                    } else {
                        // 下面请求是异步操作
                        this.refs.floatingLayer.show()
                        // 组员重新赋值
                        this._getMembers(groupId)
                    }
                }
            }
                break;
            case groupsCode.member: {
                let memberId = (typeof result.id === 'number') ? result.id : 0
                // id不一致才刷新和重置
                if (memberId != member.id) {
                    // 重新赋值
                    // 组员中心赋值
                    member.id = memberId
                    member.name = Boolean(result.name) ? result.name : ''
                    // 刷新界面
                    this.setState({
                        pageRefresh: !this.state.pageRefresh
                    })
                }
            }
                break;
            default:
                break;
        }

        if (typeof departmentBack === 'function') {
            departmentBack(this.resultObj)
        }
    }

    async _getMembers(id, showFloatingLayer = true) {
        try {
            let {arr, error} = manageRequestMembers(id, this.currentGroup)
            if (error) {
                console.log('_getMembers error===>', error)
                if (showFloatingLayer) {
                    this.refs.floatingLayer.hide()
                }
            } else {
                let body = {
                    _AT: global.UserInfo.token,
                    group_id: arr
                }
                let ret = await fetchPageGetMembers(body, '')()
                this.currentMembers = manageMembers(ret)
                // 刷新界面
                this.setState({
                    pageRefresh: !this.state.pageRefresh
                })
                if (showFloatingLayer) {
                    this.refs.floatingLayer.hide()
                }
            }
        } catch (e) {
            console.log('_getMembers e===>', e)
            if (showFloatingLayer) {
                this.refs.floatingLayer.hide()
            }
        }
    }

    render() {
        let {city, group, member} = this.resultObj
        return (
            <View style={{paddingTop: 10}}>
                <ScrollGroupComponent code={groupsCode.city} title='城市' num={3}
                                      data={this.citys} itemBtnPress={this.groupItemClick} currentItem={city}
                />
                {(() => {
                    if (Array.isArray(this.currentGroup) && this.currentGroup.length > 0) {
                        return (
                            <ScrollGroupComponent code={groupsCode.group} currentItem={group} title='小组'
                                                  data={this.currentGroup} itemBtnPress={this.groupItemClick} num={3}
                            />
                        )
                    }
                })()}
                {(() => {
                    if (Array.isArray(this.currentMembers) && this.currentMembers.length > 0) {
                        return (
                            <ScrollGroupComponent code={groupsCode.member} currentItem={member} title='姓名'
                                                  data={this.currentMembers} itemBtnPress={this.groupItemClick} num={3}
                            />
                        )
                    }
                })()}
                <LoadingFloatingLayer ref="floatingLayer"/>
            </View>
        )
    }
}