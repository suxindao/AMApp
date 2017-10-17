/**
 * Created by Joe on 2017/3/22.
 */

import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Alert} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import TextTabBar from '../../../../components/scrollTabBar/textDefaultTabBar'
import RelatedStore from './RelatedStore'
import Contract from './Contract'
import BankNo from './BankNo'
import EnterpriseContact from './../components/EnterpriseContact'

const RELATEDSTORE = 'RELATEDSTORE';
const CONTRACTS = 'CONTRACTS';
const CONTACT = 'CONTACT';
const BANKNO = 'BANKNO';

/**
 * 主体合同组件
 */
export default class EnterpriseTables extends Component {
    constructor(props) {
        super(props)
        this.renderTabs = this.renderTabs.bind(this);
        this.items = [
            {code: RELATEDSTORE, name: '关联门店'},
            {code: CONTRACTS, name: '合同'},
            {code: CONTACT, name: '联系人'},
            {code: BANKNO, name: '银行账号'},
        ];
    }

    renderTabs(tabs) {
        let data = this.props.data;
        if (data.length < 1)
            return <View style={{flex: 1}}/>;
        return tabs.map((item) => {
            switch (item.code) {
                case RELATEDSTORE:
                    if (data.stores.length < 1) {
                        return <View key={item.code}></View>
                    }
                    return (
                        <RelatedStore data={data.stores} key={item.code} scrollEnabled={false}/>
                    )
                case CONTRACTS:
                    if (data.contracts.length < 1) {
                        return <View key={item.code}></View>
                    }
                    return (
                        <Contract data={data.contracts} key={item.code}/>
                    )
                case CONTACT:
                    if (!data.contacts || data.contacts.length <= 0) {
                        return <View key={item.code}></View>
                    }
                    return (
                        <EnterpriseContact data={data.contacts} key={item.code}/>
                    )
                case BANKNO:
                    if (data.pay_account.length < 1) {
                        return <View key={item.code}></View>
                    }
                    return (
                        <BankNo data={data.pay_account} key={item.code}/>
                    )
                default:
                    return (
                        <View style={{flex: 1}} key={item.code}/>
                    )
            }
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    style={{flex: 1, paddingBottom: 60}}
                    onChangeTab={this.props.onClickTab}
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
            </View>
        )
    }
}