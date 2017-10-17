/**
 * create at 03/15/17
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet, TextInput} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {colors, distances, fontScale} from '../../../constants/style'

export default class RecordItem extends Component {
    constructor(props) {
        super(props)
        this.renderReply = this.renderReply.bind(this);
        this.renderReplies = this.renderReplies.bind(this);
    }

    renderReply(rowData) {
        return (
            <View style={{marginLeft: 10, justifyContent: 'flex-end'}}>
                <TouchableHighlight
                    onPress={() => {
                        this.props.callback(rowData.id)
                    }}
                    underlayColor='rgba(0,0,0,0.0)'
                >
                    <View style={{height: 30, justifyContent: 'center', alignItems: 'center'}}>
                        <Image style={{width: 22.5, height: 14}}
                               source={require('./../../../sources/images/store/replay_msg.png')}/>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    renderReplies(replies) {
        if (replies.length > 0) {
            return (
                <View style={{backgroundColor: '#f6f6f6', marginTop: 15}}>{
                    replies.map((v, idx) => {
                        return (
                            <View
                                key={'item_' + idx}
                                style={
                                    [
                                        {
                                            marginTop: 12,
                                            marginBottom: 8,
                                            marginLeft: 12,
                                            marginRight: 12,
                                            paddingBottom: 8
                                        },
                                        idx + 1 == replies.length ?
                                            {
                                                marginBottom: 12,
                                            } :
                                            {
                                                marginBottom: 12,
                                                borderBottomWidth: 1,
                                                borderColor: colors.borderColor,
                                            }
                                    ]
                                }
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{
                                        fontSize: 14 * fontScale,
                                        color: colors.blueColor,
                                        marginBottom: 6
                                    }}>{v.am_name}：</Text>
                                    <Text style={{fontSize: 12 * fontScale, color: '#999'}}>{v.create_time}</Text>
                                </View>
                                <Text style={{fontSize: 14 * fontScale, color: colors.inputColor}}>{v.reply}</Text>
                            </View>
                        )
                    })
                }
                </View>
            )
        } else {
            return null
        }
    }

    render() {
        let {rowData, from} = this.props
        let typeStr = manageType(rowData.type)
        let detailStr = manageDetails(rowData.detail)
        let visitStr = manageVisit(rowData.contact)
        return (
            <View>
                <Text style={styles.timeText}>{Boolean(rowData.create_time) ? rowData.create_time : ''}</Text>
                <View style={styles.mainContainer}>
                    <View style={styles.titleText}>
                        <Text style={{color: '#333', flex: 1, fontSize: 16 * fontScale}}>{
                            Boolean(rowData.am_name) ? rowData.am_name : ''
                        }</Text>
                        <Text style={{color: '#ccc', fontSize: 12 * fontScale}}>{typeStr}</Text>
                    </View>
                    {
                        Boolean(rowData.comment) ?
                            <Text style={{color: '#666', fontSize: 14 * fontScale, lineHeight: 20, marginTop: 10}}>
                                {rowData.comment}
                            </Text>
                            : null
                    }
                    {showOperationInfo(rowData)}
                    {showContent(detailStr)}
                    {showContent(visitStr)}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            justifyContent: typeStr == '电话' ? 'flex-end' : 'space-between',
                            marginTop: 8
                        }}
                    >
                        <View style={{flex: 1}}>

                            <TouchableHighlight
                                onPress={() => {
                                    if (from == 'list') {
                                        Actions.myStoreViewInfo({
                                            routerData: {
                                                id: rowData.store_id,
                                                name: rowData.store_name,
                                            }
                                        })
                                    }
                                }}

                                underlayColor='rgba(0,0,0,0.0)'
                            >
                                <Text style={{color: colors.blueColor, fontSize: 12 * fontScale, marginTop: 8}}>
                                    {Boolean(rowData.store_name) ? rowData.store_name : ''}
                                </Text>
                            </TouchableHighlight>
                            {showAddress(rowData)}
                        </View>
                        {this.renderReply(rowData)}
                    </View>
                    {this.renderReplies(rowData.replies)}
                </View>
            </View>
        )
    }
}

function showContent(content) {
    if (content.length > 0) {
        return (
            <Text style={{color: '#ccc', fontSize: 12 * fontScale, lineHeight: 15, marginTop: 8}}>
                {content}
            </Text>
        )
    } else {
        return null
    }
}

function showOperationInfo(data) {
    if (data && data.type === 3) {
        return (
            <View>
                <Text style={{color: '#666', fontSize: 14 * fontScale, lineHeight: 15, marginTop: 8}}>
                    是否正常发工资 : {(data.payoff === 1) ? '是' : '否'}
                </Text>
                <Text style={{color: '#666', fontSize: 14 * fontScale, lineHeight: 15, marginTop: 8}}>
                    上月流水(万) : {data.sales ? data.sales : '0'}
                </Text>
                <Text style={{color: '#666', fontSize: 14 * fontScale, lineHeight: 15, marginTop: 8}}>
                    本月业绩目标(万) : {data.target ? data.target : '0'}
                </Text>
            </View>
        )
    } else {
        return null
    }
}

function showAddress(rowData) {
    if (Boolean(rowData.address) && rowData.address.length > 0) {
        return (
            <TouchableOpacity
                style={styles.addressView}
                onPress={() => {
                    Actions.showMap({routerData: {data: rowData}})
                }}
            >
                <Image source={require('../../../sources/images/home/location_blues.png')}/>
                <Text style={{color: colors.blueColor, fontSize: 12 * fontScale, marginLeft: 8}}>
                    {rowData.address}
                </Text>
            </TouchableOpacity>
        )
    } else {
        return null
    }
}

// 处理拜访类型
function manageType(type) {
    let result = ''
    if (!Boolean(type)) {
        return result
    }
    // 拜访类型: Number, 1-电话 2-拜访签到
    if (type == 1) {
        result = '电话'
    } else if (type == 2) {
        result = '拜访签到'
    } else if (type == 3) {
        result = '经营情况'
    }
    return result
}

// 处理详情
function manageDetails(details) {
    let result = ''
    if (Array.isArray(details) && details.length > 0) {
        result = '拜访工作内容：'
        details.forEach((item, idx) => {
            if (Boolean(item.tag)) {
                if (idx == details.length - 1) {
                    result += item.tag
                } else {
                    result += item.tag + '，'
                }
            }
        })
    }
    return result
}

// 处理拜访人
function manageVisit(contact) {
    let result = ''
    if (Boolean(contact)) {
        result = '拜访人：'
        if (Boolean(contact.name)) {
            result += contact.name + ' '
        }
        if (Boolean(contact.phone_num)) {
            result += contact.phone_num + ' '
        }
        if (Boolean(contact.duty)) {
            result += contact.duty + ' '
        }
        if (contact.is_kp == 1) {
            result += '（关键联系人）'
        }
    }
    return result
}

const styles = StyleSheet.create({
    timeText: {
        fontSize: 13 * fontScale,
        color: '#ccc',
        alignSelf: 'center',
        lineHeight: 70 / 2,
    },
    mainContainer: {
        marginLeft: 15,
        marginRight: 15,
        borderWidth: distances.borderWidth,
        borderColor: colors.borderColor,
        borderRadius: 4,
        backgroundColor: '#fff',
        padding: 15
    },
    titleText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 6
    }
})