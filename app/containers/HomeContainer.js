/**
 * create at 03/06/17
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, ScrollView, Image} from 'react-native'
import {Actions} from 'react-native-router-flux'

// 界面组件
import TabIcon, {TabCode} from '../components/Tabbar'
import ListViewSample from '../components/list/ListSectionSimple'
import HomeItem from '../components/list/items/HomeItem'

// style
import {colors, distances, fontScale} from '../constants/style'

export default class HomeComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{backgroundColor: colors.bgColor, flex: 1}}>
                <Page/>
                <TabIcon currentCode={TabCode.HOME_TAB}/>
            </View>
        )
    }
}

class Page extends Component {
    constructor(props) {
        super(props)

        // data
        this.items = {
            groupA: [
                {code: 'store', title: '门店', icon_uri: require('../sources/images/home/store.png')},
                {code: 'record', title: '跟进记录', icon_uri: require('../sources/images/home/home_records.png')},
                {code: 'contact', title: '联系人', icon_uri: require('../sources/images/home/home_contacts.png')},
            ],
            groupB: [
                {code: 'contract', title: '合同', icon_uri: require('../sources/images/home/contract.png')},
                {code: 'company', title: '企业', icon_uri: require('../sources/images/home/company.png')},
                {code: 'order', title: '订单状态查询', icon_uri: require('../sources/images/home/home_order.png')},
            ]
        }

        // UI
        this.renderListRow = this.renderListRow.bind(this)
        this._renderSectionHeader = this._renderSectionHeader.bind(this)
    }

    _renderSectionHeader(sectionData, sectionID) {
        if (sectionID == 'groupB') {
            return <View style={{
                height: 10, backgroundColor: colors.labBgColor, borderColor: colors.borderColor,
                borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
            }}/>
        }
        return null
    }

    renderListRow(rowData, sectionID, rowID) {
        return <HomeItem rowData={rowData} token={UserInfo.token} sectionID={sectionID} rowID={rowID}/>
    }

    render() {
        return (
            <ListViewSample
                style={{flex: 1}}
                scrollEnabled={false}
                renderListRow={this.renderListRow}
                renderSectionHeader={this._renderSectionHeader}
                data={this.items}
            />
        )
    }
}
