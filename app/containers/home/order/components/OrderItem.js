/**
 * create at 06/22/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// components
import {showMarkComponent} from './common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common 
import {nEveryRow} from '../../../../constants/utils/ui'

export default class OrderItem extends Component {
    constructor(props) {
        super(props)

        this._itemClick = this._itemClick.bind(this)
    }

    _itemClick() {
        let {rowData} = this.props
        if (Boolean(rowData.id)) {
            Actions.referOrderInfo({routerData: {id: rowData.id}})
        } else {
            console.log('rowData 中 id is null or undefine or 0')
        }
    }

    render() {
        let {rowData} = this.props
        let bailStatus = '', isBailStatusMarked = false
        if (Boolean(rowData.bail_info) && (typeof rowData.bail_info.status === 'number')) {
            // 0-未支付 1-已支付
            if (rowData.bail_info.status == 0) {
                bailStatus = '未支付'
                isBailStatusMarked = true
            } else if (rowData.bail_info.status == 1) {
                bailStatus = '已支付'
                isBailStatusMarked = false
            }
        }
        return (
            <View style={{paddingBottom: 10}}>
                <TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
                                    style={[styles.touchView]}
                >
                    <View style={{
                        flex: 1,
                        paddingLeft: distances.leftMargin,
                        paddingBottom: 17,
                        paddingRight: distances.leftMargin
                    }}>
                        {showTop(rowData)}
                        <MiddleItem title='城市'
                                    content={Boolean(rowData.city_name) ? rowData.city_name : ''}
                        />
                        <MiddleItem title='门店' contentIsLong={true}
                                    content={Boolean(rowData.store_name) ? rowData.store_name : ''}
                        />
                        <MiddleItem title='申请时间'
                                    content={Boolean(rowData.create_time) ? rowData.create_time : ''}
                        />
                        <MiddleItem title='履约保证金'
                                    content={(Boolean(rowData.bail_info) && Boolean(rowData.bail_info.amount)) ? rowData.bail_info.amount : 0}
                                    status={bailStatus} isStatusMarked={isBailStatusMarked}
                        />
                        <MiddleItem title='所属AM'
                                    content={Boolean(rowData.am_name) ? rowData.am_name : ''}
                        />
                        <MiddleItem title='借款人'
                                    content={Boolean(rowData.user_name) ? rowData.user_name : ''}
                        />
                        {showData(rowData.missing)}
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

/**
 * item top
 * @param {*} rowData
 */
function showTop(rowData) {
    return (
        <View style={{
            flexDirection: 'row', alignItems: 'center', height: 50, borderColor: colors.borderColor,
            borderBottomWidth: distances.borderWidth,
        }}>
            <Image style={{marginRight: 10}} source={require('../../../../sources/images/home/home_order_text.png')}/>
            <Text style={[styles.leftText, {flex: 1, fontSize: 15 * fontScale}]}>
                {Boolean(rowData.code) ? rowData.code : ''}
            </Text>
        </View>
    )
}

/**
 * 中间部分 item
 * @param {*} title
 * @param {*} content
 * @param {*} status
 * contentIsLong bool, 门店内容过长做的兼容
 */
class MiddleItem extends Component {
    render() {
        let {title = '', content = '', contentIsLong = false, status = '', isStatusMarked = false} = this.props
        let statusColor = isStatusMarked ? colors.redColor3 : '#333'
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 17}}>
                <View style={[styles.leftTitleView, {justifyContent: 'center'}]}>
                    <Text style={[styles.leftText, {fontSize: 13 * fontScale}]}>
                        {title}
                    </Text>
                </View>
                {contentIsLong ? (
                    <View style={{flex: 1}}>
                        <Text style={styles.rightText}>
                            {content}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.rightText}>
                        {content}
                    </Text>
                )}
                {contentIsLong ? null : (
                    <Text style={[styles.statusText, {marginLeft: 17, color: statusColor}]}>
                        {status}
                    </Text>
                )}
            </View>
        )
    }
}

/**
 * 缺失资料模块
 * @param {*} data
 */
function showData(data) {
    // 处理缺失资料数组
    let dataArr = [], itemBgColor = '#f5f5f5', itemHasBorder = false
    if (Array.isArray(data)) {
        dataArr = nEveryRow(data, 3)
    }
    return (
        <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={[styles.leftTitleView, {justifyContent: 'flex-start'}]}>
                <Text style={[styles.leftText, {marginTop: 7, fontSize: 13 * fontScale}]}>
                    {'缺失资料'}
                </Text>
            </View>
            {showMarkComponent(dataArr, itemBgColor, itemHasBorder)}
        </View>
    )
}

const styles = StyleSheet.create({
    touchView: {
        backgroundColor: '#fff',
        borderColor: colors.borderColor,
        borderTopWidth: distances.borderWidth,
        borderBottomWidth: distances.borderWidth,
    },
    leftText: {
        color: '#999',
    },
    rightText: {
        color: '#333',
        fontSize: 13 * fontScale
    },
    statusText: {
        fontSize: 13 * fontScale
    },
    leftTitleView: {
        width: 90,
        alignItems: 'flex-start'
    }
})