/**
 * create at 06/06/17
 * 简单版本的section listView, 没有上拉刷新和下拉加载
 */

import React, {Component} from "react";
import {Text, View, ListView} from "react-native";

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
})

export default class ListViewSimple extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {style, data, renderListRow, renderSectionHeader, scrollEnabled = true} = this.props
        return (
            <ListView
                style={style}
                enableEmptySections={true}
                scrollEnabled={scrollEnabled}
                dataSource={ds.cloneWithRowsAndSections(data)}
                renderSectionHeader={renderSectionHeader}
                renderRow={renderListRow}
            />
        )
    }
}