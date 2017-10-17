/**
 * Created by Joe on 2017/5/27.
 */
import React, {Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, StyleSheet, InteractionManager, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// 组件
import {showTitleLable} from '../components/common'
import {
    TimeSwitchComponent, TypePickerComponent, TypeSwitchComponent
} from '../components/ScreenComponents'
import {ConfirmButton} from '../../../../components/common'
import DepartmentComponent from '../../../../components/department'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// presenter
import {fetchPageGetGroups} from '../../../look/presenters/pagePresenter'

// toast
import {toastShort} from '../../../../constants/toast'

// op common
import {departmentInitObj} from '../../../../constants/operation/departmentManage'
import {
    initTimeAndTypeObj, timeSelectObj
} from '../../../../constants/operation/recordScreenManage'

export default class ScreenPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pageRefresh: false
        }

        // data
        // 时间和类型
        this.typeAndTimeObj = _.cloneDeep(initTimeAndTypeObj)
        // 部门
        this.department = _.cloneDeep(departmentInitObj)

        // function
        this._getGroups = this._getGroups.bind(this)
        this._departmentBack = this._departmentBack.bind(this)
        this._typeAndDateBack = this._typeAndDateBack.bind(this)
        this._confirmBack = this._confirmBack.bind(this)
    }

    componentWillMount() {
        if (this.props.routerData.oldScreen) {

            let {oldScreen} = this.props.routerData
            // 赋值选过的状态
            if (oldScreen.typeAndTime) {
                this.typeAndTimeObj = oldScreen.typeAndTime
            }
            if (oldScreen.department) {
                // 给部门数据赋值
                this.department = _.cloneDeep(oldScreen.department)
            }
        }
    }

    componentDidMount() {
        this._getGroups()
    }

    async _getGroups() {
        try {
            let body = {
                _AT: global.UserInfo.token
            }
            let ret = await fetchPageGetGroups(body, '')()
            this.data = ret
            this.showDepartment = (Array.isArray(ret) && ret.length > 0) ? true : false
            // 刷新页面
            this.setState({
                pageRefresh: !this.state.pageRefresh
            })
        } catch (e) {
            console.log('')
        }
    }

    // 部门返回
    _departmentBack(backObj) {
        // 给部门数据赋值
        this.department = backObj
    }

    // 类型和时间返回
    _typeAndDateBack(callType, callCode, data = null) {
        let {time, type} = this.typeAndTimeObj
        // 判断类型并赋值
        if (callType == 'time') {
            time.code = callCode
            if (callCode == timeSelectObj.custom) {
                if (data.code == 'min') {
                    time.min = data.date
                } else {
                    time.max = data.date
                }
            }
        } else if (callType == 'type') {
            type.code = callCode
        }
        // 刷新页面
        this.setState({
            pageRefresh: !this.state.pageRefresh
        })
    }

    _confirmBack() {
        let {screenBack} = this.props.routerData
        if (typeof screenBack === 'function') {
            screenBack({typeAndTime: this.typeAndTimeObj, department: this.department}, this.data)
        }
        Actions.pop()
    }

    render() {
        let {type, time} = this.typeAndTimeObj
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor}}>
                <ScrollView style={styles.container} bounces={false}>
                    {showTitleLable('时间')}
                    <TimeSwitchComponent callBack={this._typeAndDateBack} type='time' currentCode={time.code}/>
                    {showTitleLable('自定义')}
                    <TypePickerComponent callBack={this._typeAndDateBack} type='time' currentCode={time.code}
                                         minValue={time.min} maxValue={time.max}
                    />
                    {showTitleLable('类型')}
                    <TypeSwitchComponent callBack={this._typeAndDateBack} type='type' currentCode={type.code}/>
                    {
                        this.showDepartment ? (
                            <DepartmentComponent data={this.data}
                                                 current_department={this.department}
                                                 departmentBack={this._departmentBack}
                            />
                        ) : null
                    }
                </ScrollView>
                <ConfirmButton confirmPress={this._confirmBack}
                               touchStyle={{marginLeft: 46 / 2, marginRight: 46 / 2}} confirmText='确认'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.labBgColor,
    }
})