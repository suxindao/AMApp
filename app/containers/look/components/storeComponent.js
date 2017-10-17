/**
 * create at 04/13/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// 组件
import StoreItem from './storeComponentItems/StoreItem'
import TouchOrShowItem from './storeComponentItems/TouchOrShowItem'
import DayShowItem from './storeComponentItems/DayShowItem'
import MonthShowItem from './storeComponentItems/MonthShowItem'
import {
    RecordsItem, SignStoreComponent, StatsHeader, HeaderComponent
} from './storeComponentItems/Common'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// common
import {
    storeStatusType, storeCode, keepStatus, toBeStatus, loanBail, lookDateType, signStoreType
} from '../../../constants/operation/lookManage'

export default class StoreComponent extends Component {
    constructor(props) {
        super(props)

        this.typeItemClick = this.typeItemClick.bind(this)
    }

    typeItemClick(code) {
        let {bodyData, dateTime} = this.props
        switch (code) {
            case storeCode.active: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.monthNewSign,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '新签激活门店'
                })
            }
                break;
            case storeCode.frozen: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.monthFrozen,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '冰冻激活门店'
                })
            }
                break;
            case storeCode.inactive: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.monthNoActive,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '非活跃门店'
                })
            }
                break;
            default:
                break;
        }
    }

    render() {
        let {data, bodyData, dateTime} = this.props
        let newDayStats = (Boolean(data) && Boolean(data.dayStats)) ? data.dayStats : {}
        let newMonthStats = (Boolean(data) && Boolean(data.monthStats)) ? data.monthStats : {}
        return (
            <View>
                <DayStatsStore data={newDayStats} bodyData={bodyData} dateTime={dateTime}/>
                <OnLineStore data={newMonthStats} bodyData={bodyData} dateTime={dateTime}/>
                <StoreItem title='本月新签激活门店' content={
                    (Boolean(newMonthStats.store) && Boolean(newMonthStats.store.newly_activated)) ? newMonthStats.store.newly_activated : 0
                }
                           code={storeCode.active} itemTouch={this.typeItemClick} dateTime={dateTime}
                />
                <StoreItem title='本月冰冻激活门店' content={
                    (Boolean(newMonthStats.store) && Boolean(newMonthStats.store.frozen_activated)) ? newMonthStats.store.frozen_activated : 0
                }
                           code={storeCode.frozen} itemTouch={this.typeItemClick} dateTime={dateTime}
                />
                <StoreItem title='本月非活跃门店' content={
                    (Boolean(newMonthStats.store) && Boolean(newMonthStats.store.inactive)) ? newMonthStats.store.inactive : 0
                }
                           code={storeCode.inactive} itemTouch={this.typeItemClick} dateTime={dateTime}
                />
                <KeepStore data={Boolean(newMonthStats.store) ? newMonthStats.store : {}}
                           bodyData={bodyData} dateTime={dateTime}
                />
                <ToBeStore data={Boolean(newMonthStats.store) ? newMonthStats.store : {}}
                           bodyData={bodyData} dateTime={dateTime}
                />
            </View>
        )
    }
}

/**
 * 日数据
 */
class DayStatsStore extends Component {
    constructor(props) {
        super(props)

        this._dayClick = this._dayClick.bind(this)
        this._dayRecordClick = this._dayRecordClick.bind(this)
    }

    _dayClick(code) {
        let {bodyData, dateTime} = this.props
        console.log("dateTime => ", dateTime)
        switch (code) {
            case loanBail.loans: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.day,
                        code: storeStatusType.dayLoans,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '日放款门店',
                })
            }
                break;
            case loanBail.bails: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.day,
                        code: storeStatusType.dayBails,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '日进件门店'
                })
            }
                break;
            default:
                break;
        }
    }

    _dayRecordClick() {
        let {bodyData, dateTime} = this.props
        // 跳入跟进记录
        Actions.upRecordList({
            routerData: {
                fromPage: 'look', // 跳转页面类型
                dateType: lookDateType.day, // 是从日数据跳入还是从月数据跳入
                bodyData: bodyData,  // 请求参数体 (主要包含部门请求参数)
                dateTime: dateTime   // time string
            }
        })
    }

    render() {
        let {data, bodyData} = this.props
        return (
            <View style={[styles.moduleContainer, {marginTop: 0}]}>
                <StatsHeader title='日数据'/>
                <View style={styles.moduleView}>
                    <DayShowItem leftTitle='进件' middleTitle='进件门店' rightTitle='总额'
                                 leftContent={(Boolean(data.bails) && Boolean(data.bails.count)) ? data.bails.count : 0}
                                 middleContent={(Boolean(data.bails) && Boolean(data.bails.store_count)) ? data.bails.store_count : 0}
                                 rightContent={(Boolean(data.bails) && Boolean(data.bails.value)) ? data.bails.value : 0}
                                 dayItemPress={this._dayClick} showTopLine={false}
                                 code={loanBail.bails}
                    />
                    <DayShowItem leftTitle='放款' middleTitle='放款门店' rightTitle='总额'
                                 leftContent={(Boolean(data.loans) && Boolean(data.loans.count)) ? data.loans.count : 0}
                                 middleContent={(Boolean(data.loans) && Boolean(data.loans.store_count)) ? data.loans.store_count : 0}
                                 rightContent={(Boolean(data.loans) && Boolean(data.loans.value)) ? data.loans.value : 0}
                                 dayItemPress={this._dayClick} showTopLine={true}
                                 code={loanBail.loans}
                    />
                </View>
                <RecordsItem recordPress={this._dayRecordClick} count={Boolean(data.trackNum) ? data.trackNum : 0}
                />
            </View>
        )
    }
}

/**
 * 月数据 在线门店
 */
class OnLineStore extends Component {
    constructor(props) {
        super(props)

        this._monthClick = this._monthClick.bind(this)
        this._monthRecordClick = this._monthRecordClick.bind(this)
        this._monthSignClick = this._monthSignClick.bind(this)
    }

    _monthClick(code) {
        let {bodyData, dateTime} = this.props
        switch (code) {
            case loanBail.loans: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.monthLoans,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '本月放款门店',
                })
            }
                break;
            case loanBail.bails: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.monthBails,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '本月进件门店'
                })
            }
                break;
            default:
                break;
        }
    }

    _monthRecordClick() {
        let {bodyData, dateTime} = this.props
        // 跳入跟进记录
        Actions.upRecordList({
            routerData: {
                fromPage: 'look', // 跳转页面类型
                dateType: lookDateType.month, // 是从日数据跳入还是从月数据跳入
                bodyData: bodyData,  // 请求参数体 (主要包含部门请求参数)
                dateTime: dateTime   // time string
            }
        })
    }

    _monthSignClick(code) {
        let {bodyData, dateTime} = this.props
        // 提交签约门店
        Actions.lookSignStoreList({
            routerData: {
                code: code,
                bodyData: bodyData,
                dateTime: dateTime,
            }
        })
    }

    render() {
        let {data} = this.props
        return (
            <View style={[styles.moduleContainer, {marginBottom: 10}]}>
                <StatsHeader title='月数据'/>
                <View style={styles.moduleView}>
                    <HeaderComponent title='在线门店' content={Boolean(data.online) ? data.online : 0} noBold={true}/>
                    <MonthShowItem leftTitle={'本月进件'}
                                   leftContent={(Boolean(data.bails) && Boolean(data.bails.count)) ? data.bails.count : 0}
                                   middleRightContent={(Boolean(data.bails) && Boolean(data.bails.value)) ? data.bails.value : 0}
                                   rightContent={(Boolean(data.bails) && Boolean(data.bails.link_relative_ratio)) ? data.bails.link_relative_ratio : 0}
                                   middleLeftTitle={'进件门店'}
                                   middleLeftContent={(Boolean(data.bails) && Boolean(data.bails.store_count)) ? data.bails.store_count : 0}
                                   itemPress={this._monthClick}
                                   code={loanBail.bails}
                    />
                    <MonthShowItem leftTitle={'本月放款'}
                                   leftContent={(Boolean(data.loans) && Boolean(data.loans.count)) ? data.loans.count : 0}
                                   middleRightContent={(Boolean(data.loans) && Boolean(data.loans.value)) ? data.loans.value : 0}
                                   rightContent={(Boolean(data.loans) && Boolean(data.loans.link_relative_ratio)) ? data.loans.link_relative_ratio : 0}
                                   middleLeftTitle={'放款门店'}
                                   middleLeftContent={(Boolean(data.loans) && Boolean(data.loans.store_count)) ? data.loans.store_count : 0}
                                   itemPress={this._monthClick}
                                   code={loanBail.loans}
                    />
                </View>
                <SignStoreComponent monthSignPress={this._monthSignClick}
                                    passStore={Boolean(data.pass_stores) ? data.pass_stores : 0}
                                    store={Boolean(data.stores) ? data.stores : 0}
                />
                <RecordsItem recordPress={this._monthRecordClick}
                             count={Boolean(data.trackNum) ? data.trackNum : 0}
                />
            </View>
        )
    }
}

/**
 * 防守门店
 */
class KeepStore extends Component {
    constructor(props) {
        super(props)

        this.keepItemClick = this.keepItemClick.bind(this)
    }

    keepItemClick(code) {
        let {bodyData, dateTime} = this.props
        switch (code) {
            case keepStatus.active: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.guardActive,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '活跃门店',
                })
            }
                break;
            case keepStatus.willActive: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.guardWillActive,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '即将活跃门店'
                })
            }
                break;
            case keepStatus.previousMonth: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.guardLastMonth,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '上月出单门店'
                })
            }
                break;
            default:
                break;
        }
    }

    render() {
        let {data} = this.props
        return (
            <View style={styles.moduleContainer}>
                <View style={styles.moduleView}>
                    <HeaderComponent title='防守门店' content={
                        Boolean(data.defense) ? data.defense : 0
                    }/>
                    <TouchOrShowItem
                        showRight={true}
                        rightContent={
                            Boolean(data.active) && Boolean(data.active.link_relative_ratio) ? data.active.link_relative_ratio : 0
                        }
                        leftTitle={'活跃门店'}
                        leftContent={
                            Boolean(data.active) && Boolean(data.active.count) ? data.active.count : 0
                        }
                        pressAble={true} code={keepStatus.active} pressTouch={this.keepItemClick}
                    />
                    <TouchOrShowItem
                        showRight={true}
                        rightContent={
                            Boolean(data.almost_active) && Boolean(data.almost_active.link_relative_ratio) ? data.almost_active.link_relative_ratio : 0
                        }

                        leftTitle={'即将活跃门店'}
                        leftContent={
                            Boolean(data.almost_active) && Boolean(data.almost_active.count) ? data.almost_active.count : 0
                        }
                        pressAble={true} code={keepStatus.willActive} pressTouch={this.keepItemClick}
                    />
                    <TouchOrShowItem
                        showRight={true}
                        rightContent={
                            Boolean(data.active_last_month) && Boolean(data.active_last_month.link_relative_ratio) ? data.active_last_month.link_relative_ratio : 0
                        }

                        leftTitle={'上月出单门店'}
                        leftContent={
                            Boolean(data.active_last_month) && Boolean(data.active_last_month.count) ? data.active_last_month.count : 0
                        }
                        pressAble={true} code={keepStatus.previousMonth} pressTouch={this.keepItemClick}
                    />
                </View>
            </View>
        )
    }
}

/**
 * 未激活门店
 */
class ToBeStore extends Component {
    constructor(props) {
        super(props)

        this._tobeItemClick = this._tobeItemClick.bind(this)
    }

    _tobeItemClick(code) {
        let {bodyData, dateTime} = this.props
        switch (code) {
            case toBeStatus.noLoan: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.noActiveNoLoan,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '未出单门店'
                })
            }
                break;
            case toBeStatus.almostFrozen: {
                Actions.lookStoreList({
                    routerData: {
                        dateType: lookDateType.month,
                        code: storeStatusType.noActiveFrozen,
                        bodyData: bodyData,
                        dateTime: dateTime
                    },
                    title: '转冰冻门店'
                })
            }
                break;
            default:
                break;
        }
    }

    render() {
        let {data} = this.props
        return (
            <View style={[styles.moduleContainer, {marginBottom: 10}]}>
                <View style={styles.moduleView}>
                    <HeaderComponent title='未激活门店' content={Boolean(data.inactivated) ? data.inactivated : 0}/>
                    <TouchOrShowItem showRight={false} pressAble={true}
                                     leftTitle={'未出单门店'} leftContent={
                        Boolean(data.no_loan) ? data.no_loan : 0
                    } pressTouch={this._tobeItemClick} code={toBeStatus.noLoan}
                    />
                    <TouchOrShowItem showRight={true}
                                     rightContent={(Boolean(data.almost_frozen) && Boolean(data.almost_frozen.link_relative_ratio)) ? data.almost_frozen.link_relative_ratio : 0}
                                     leftTitle={'转冰冻门店'} leftContent={
                        (Boolean(data.almost_frozen) && Boolean(data.almost_frozen.count)) ? data.almost_frozen.count : 0
                    } pressAble={true} pressTouch={this._tobeItemClick} code={toBeStatus.almostFrozen}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    moduleContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
    moduleView: {
        borderColor: colors.borderColor,
        borderTopWidth: distances.borderWidth,
        borderBottomWidth: distances.borderWidth,
    }
})