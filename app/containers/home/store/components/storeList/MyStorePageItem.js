/**
 * Created on 2017/7/19
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

import TagComponent from '../StoreTags'

export default class ListItem extends Component {
    constructor(props) {
        super(props)

        this._itemClick = this._itemClick.bind(this)
    }

    _itemClick() {
        let {rowData, emitKey} = this.props
        Actions.myStoreViewInfo({
            routerData: {
                id: Boolean(rowData.id) ? rowData.id : 0,
                name: Boolean(rowData.name) ? rowData.name : '',
                // 审核中 editable 为false, 其他为true, 审核中 isReviewing 为true
                isReviewing: !Boolean(rowData.editable)
            }, emitKey: emitKey
        })
    }

    render() {
        let {rowData} = this.props
        return (
            <TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
                                style={[styles.itemTouch]}>
                <View style={[styles.itemView]}>
                    <Text style={{color: '#333', fontSize: 15 * fontScale}}>{
                        Boolean(rowData.name) ? rowData.name : ''
                    }</Text>
                    <BottomComponent rowData={rowData}/>
                    <TagComponent tagsData={rowData.tags} viewStyle={[styles.bottomView]} textStyle={[styles.tagText]}/>
                </View>
            </TouchableHighlight>
        )
    }
}

class BottomComponent extends Component {
    render() {
        let {rowData} = this.props
        return (
            <View style={[styles.bottomView]}>
                <View style={{
                    justifyContent: 'center', alignItems: 'flex-start', width: 155
                }}>
                    <Text style={[styles.bottomText]}>{
                        '所属AM：' + (Boolean(rowData.owner_name) ? rowData.owner_name : '')
                    }</Text>
                </View>
                <Text style={[styles.bottomText]}>{
                    '当前状态：' + (Boolean(rowData.state) ? rowData.state : '')
                }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemTouch: {
        backgroundColor: '#fff',
        paddingLeft: distances.contractLeftMargin,
    },
    itemView: {
        flex: 1,
        borderBottomWidth: distances.borderWidth,
        borderColor: colors.borderColor,
        paddingRight: distances.contractLeftMargin,
        paddingTop: 15,
        paddingBottom: 15,
    },
    bottomView: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomText: {
        color: '#999',
        fontSize: 12 * fontScale
    },
    tagText: {
        color: '#FFF',
        fontSize: 12 * fontScale
    },
})