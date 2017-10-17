/**
 * create at 03/13/17
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, ScrollView,} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

// components
import {TopComponent} from '../components/common'
import TextTabBar from '../../../../components/scrollTabBar/textDefaultTabBar'
import StatusList from './StatusList'
import RelevanceList from './RelevanceStoreList'
// import MainContract from '../../contract/containers/CreatMainContract'
// import ServerContract from '../../contract/containers/CreatServiceContract'
// import StateContract from '../../contract/containers/CreateStageContract'
// import ExtendContract from '../../contract/containers/CreateExtendContract'
// import StraightContract from '../../contract/containers/CreateStraightContract'

// common js
import {notification} from '../../../../constants/common'
import {contractType} from '../../../../constants/operation/contractManage'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const STATUS_HISTORY = 'status_history'
const INFO_DETAIL_MAIN = 'info_detail_main'
const INFO_DETAIL_SERVER = 'info_detail_server'
const INFO_DETAIL_SERVER_FQ = 'info_detail_server_FQ'
const INFO_DETAIL_SERVER_ZT = 'info_detail_server_ZT'
const INFO_DETAIL_SERVER_TG = 'info_detail_server_TG'
const RELEVANCE_STORE = 'relevance_store'

export default class Page extends Component {
    constructor(props) {
        super(props)

        // UI
        this.renderTabs = this.renderTabs.bind(this)

        // function
        this._companyClick = this._companyClick.bind(this)
    }

    componentWillMount() {
        if (Boolean(this.props.infoType)) {
            let {infoType} = this.props
            if (infoType == contractType.main) {
                this.tabs = [
                    {code: STATUS_HISTORY, name: '状态记录'},
                    {code: INFO_DETAIL_MAIN, name: '详细资料'},
                ]
            } else if (infoType == contractType.server) {
                this.tabs = [
                    {code: STATUS_HISTORY, name: '状态记录'},
                    {code: RELEVANCE_STORE, name: '关联门店'},
                    {code: INFO_DETAIL_SERVER, name: '详细资料'},
                ]
            } else if (infoType == contractType.server_FQ) {
                this.tabs = [
                    {code: STATUS_HISTORY, name: '状态记录'},
                    {code: RELEVANCE_STORE, name: '关联门店'},
                    {code: INFO_DETAIL_SERVER_FQ, name: '详细资料'},
                ]
            } else if (infoType == contractType.server_TG) {
                this.tabs = [
                    {code: STATUS_HISTORY, name: '状态记录'},
                    {code: RELEVANCE_STORE, name: '关联门店'},
                    {code: INFO_DETAIL_SERVER_TG, name: '详细资料'},
                ]
            } else if (infoType == contractType.server_ZT) {
                this.tabs = [
                    {code: STATUS_HISTORY, name: '状态记录'},
                    {code: RELEVANCE_STORE, name: '关联门店'},
                    {code: INFO_DETAIL_SERVER_ZT, name: '详细资料'},
                ]
            }
        }
    }

    renderTabs(tabs) {
        let {init_data} = this.props
        // console.log('renderTabs init_data===>', init_data)
        return tabs.map((item) => {
            switch (item.code) {
                // case STATUS_HISTORY:
                //     return (
                //         <View style={{flex: 1, paddingTop: 10}} key={item.code}>
                //             <StatusList init_data={init_data}/>
                //         </View>
                //     )
                // case RELEVANCE_STORE:
                //     return (
                //         <View style={{flex: 1, paddingTop: 10}} key={item.code}>
                //             <RelevanceList init_data={init_data} scrollEnabled={false}/>
                //         </View>
                //     )
                // case INFO_DETAIL_MAIN: {
                //     return (
                //         <View style={{flex: 1, paddingTop: 10}} key={item.code}>
                //             <MainContract
                //                 emitKey={notification.contractInfoNotify}
                //                 routerData={{
                //                     fromPage: 'edit',
                //                     btnType: ((
                //                         typeof init_data.audit_status == 'number'
                //                         && init_data.audit_status == 1) ? 1 : 0),
                //                     editable: {
                //                         code: false,
                //                         signed_date: false,
                //                         from_date: false,
                //                         to_date: false,
                //                         am_name: false,
                //                         name: false,
                //                         reg_code: false,
                //                         operator_brand: false,
                //                         operator_type: false,
                //                         operator_type_other: false,
                //                         tel: false,
                //                         email: false,
                //                         legal_person: false,
                //                         area: false,
                //                         address: false,
                //                         contact: false,
                //                         contact_detail: false,
                //                         contract_pics: false,
                //                     },
                //                     ...init_data,
                //                 }}
                //                 scrollEnabled={false}
                //                 needKeyWord={false}
                //             />
                //         </View>
                //     )
                // }
                // case INFO_DETAIL_SERVER: {
                //     return (
                //         <View style={{
                //             flex: 1,
                //             marginTop: 10,
                //             borderColor: colors.borderColor,
                //             borderTopWidth: distances.borderWidth,
                //         }} key={item.code}>
                //             <ServerContract
                //                 emitKey={notification.contractInfoNotify}
                //                 routerData={{
                //                     fromPage: 'edit',
                //                     btnType: (
                //                         (typeof init_data.audit_status == 'number'
                //                             && init_data.audit_status == 1) ? 1 : 0
                //                     ),
                //                     editable: {
                //                         name: false,
                //                         code: false,
                //                         signed_date: false,
                //                         from_date: false,
                //                         to_date: false,
                //                         am_name: false,
                //                         srv_instalment: false,
                //                         fin_codes: false,
                //                         srv_straight: false,
                //                         straight_fee: false,
                //                         srv_mini: false,
                //                         srv_roll: false,
                //                         stores: false,
                //                         contract_pics: false,
                //                     },
                //                     ...init_data,
                //                 }}
                //                 scrollEnabled={false}
                //                 needKeyWord={false}
                //             />
                //         </View>
                //     )
                // }
                // case INFO_DETAIL_SERVER_FQ: {
                //     return (
                //         <View style={{
                //             flex: 1,
                //             marginTop: 10,
                //             borderColor: colors.borderColor,
                //             borderTopWidth: distances.borderWidth,
                //         }} key={item.code}>
                //             <StateContract
                //                 emitKey={notification.contractInfoNotify}
                //                 routerData={{
                //                     fromPage: 'edit',
                //                     btnType: ((
                //                         typeof init_data.audit_status == 'number'
                //                         && init_data.audit_status == 1) ? 1 : 0),
                //                     editable: {
                //                         name: false,
                //                         code: false,
                //                         signed_date: false,
                //                         from_date: false,
                //                         to_date: false,
                //                         am_name: false,
                //                         fin_codes: false,
                //                         contacts: false,
                //                         stores: false,
                //                         pics: false,
                //                     },
                //                     data: init_data,
                //                 }}
                //                 scrollEnabled={false}
                //                 needKeyWord={false}
                //             />
                //         </View>
                //     )
                // }
                // case INFO_DETAIL_SERVER_TG: {
                //     return (
                //         <View style={{
                //             flex: 1,
                //             marginTop: 10,
                //             borderColor: colors.borderColor,
                //             borderTopWidth: distances.borderWidth,
                //         }} key={item.code}>
                //             <ExtendContract
                //                 emitKey={notification.contractInfoNotify}
                //                 routerData={{
                //                     fromPage: 'edit',
                //                     btnType: ((
                //                         typeof init_data.audit_status == 'number'
                //                         && init_data.audit_status == 1) ? 1 : 0),
                //                     editable: {
                //                         name: false,
                //                         code: false,
                //                         signed_date: false,
                //                         from_date: false,
                //                         to_date: false,
                //                         am_name: false,
                //                         contacts: false,
                //                         stores: false,
                //                         pics: false,
                //                     },
                //                     data: init_data,
                //                 }}
                //                 scrollEnabled={false}
                //                 needKeyWord={false}
                //             />
                //         </View>
                //     )
                // }
                // case INFO_DETAIL_SERVER_ZT: {
                //     return (
                //         <View style={{
                //             flex: 1,
                //             marginTop: 10,
                //             borderColor: colors.borderColor,
                //             borderTopWidth: distances.borderWidth,
                //         }} key={item.code}>
                //             <StraightContract
                //                 emitKey={notification.contractInfoNotify}
                //                 routerData={{
                //                     fromPage: 'edit',
                //                     btnType: ((
                //                         typeof init_data.audit_status == 'number'
                //                         && init_data.audit_status == 1) ? 1 : 0),
                //                     editable: {
                //                         name: false,
                //                         code: false,
                //                         signed_date: false,
                //                         from_date: false,
                //                         to_date: false,
                //                         am_name: false,
                //                         fee_type: false,
                //                         contacts: false,
                //                         srv_mini: false,
                //                         mini_course_num: false,
                //                         memo: false,
                //                         stores: false,
                //                         pics: false,
                //                     },
                //                     data: init_data,
                //                 }}
                //                 scrollEnabled={false}
                //                 needKeyWord={false}
                //             />
                //         </View>
                //     )
                // }
                default:
                    return (
                        <View style={{flex: 1}} key={item.code}/>
                    )
            }
        })
    }

    _companyClick(data) {
        // console.log('_companyClick data===>', data)
        if (Boolean(data) && Boolean(data.id)) {
            Actions.enterprise({routerData: {id: data.id}})
        }
    }

    render() {
        if (Boolean(this.props.init_data)) {
            let {init_data, infoType} = this.props
            return (
                <View style={{flex: 1}}>
                    {/*<KeyboardAwareScrollView bounces={false}>*/}
                        {/*<TopComponent data={init_data} companyPress={this._companyClick} infoType={infoType}/>*/}
                        {/*<ScrollableTabView*/}
                            {/*renderTabBar={() =>*/}
                                {/*<TextTabBar*/}
                                    {/*tabArr={this.tabs}*/}
                                    {/*containerStyle={{*/}
                                        {/*height: 44,*/}
                                        {/*backgroundColor: '#fff',*/}
                                        {/*borderColor: colors.borderColor,*/}
                                        {/*borderBottomWidth: distances.borderWidth,*/}
                                    {/*}}*/}
                                    {/*itemStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}*/}
                                    {/*activeTextColor='#73b1fa'*/}
                                    {/*inactiveTextColor='#666'*/}
                                    {/*textStyle={{fontSize: 13 * fontScale}}*/}
                                    {/*underlineHeight={distances.scrollTabActiveBorderWidth}*/}
                                    {/*underlineColor={colors.blueColor}*/}
                                {/*/>*/}
                            {/*}*/}
                            {/*locked={true}*/}
                        {/*>*/}
                            {/*{this.renderTabs(this.tabs)}*/}
                        {/*</ScrollableTabView>*/}
                    {/*</KeyboardAwareScrollView>*/}
                </View>
            )
        }
        return null
    }
} 