/**
 * Created by Joe on 2017/3/27.
 */

import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class RelatedStore extends Component {
    constructor(props) {
        super(props)
        this.goView = this.goView.bind(this);
        this.goTitle = this.goTitle.bind(this);
        this.renderTag = this.renderTag.bind(this);
    }

    goView(item) {
        Actions.contractInfo(
            {
                routerData: {
                    type: item.type,
                    id: item.id,
                }
            }
        );
    }

    goTitle(status) {
        switch (status) {
            case 1: {
                return '框架协议';
            }
            case 2: {
                return '服务合同';
            }
            case 3: {
                return '分期协议';
            }
            case 4: {
                return '直通车协议';
            }
            case 5: {
                return '推广合同';
            }
            default : {
                return '其它';
            }
        }
    }

    renderTag(data) {
        return data.map((item, index) => {
            return (
                <TouchableOpacity
                    style={{
                        marginLeft: distances.contractLeftMargin,
                        paddingTop: distances.contractLeftMargin,
                        paddingBottom: distances.contractLeftMargin,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                        flexDirection: 'row'
                    }}
                    key={index}
                    onPress={() => {
                        this.goView(item)
                    }}
                >
                    <View
                        style={{
                            borderRadius: 2,
                            backgroundColor: colors.blueColor,
                            marginTop: 3,
                            height: 16,
                            marginRight: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: 11 * fontScale, marginLeft: 4, marginRight: 4}}>
                            {this.goTitle(item.type)}
                        </Text>
                    </View>
                    <View style={{flex: 1, marginRight: distances.contractLeftMargin}}>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row'
                            }}
                        >
                            <View>
                                <Text style={{fontSize: 16 * fontScale, color: '#333'}}>
                                    {item.code}
                                </Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 16 * fontScale, color: '#999'}}>
                                    {item.state}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: item.type === 1 ? 'flex-end' : 'space-between',
                                flexDirection: 'row'
                            }}
                        >
                            {
                                item.type === 1 ?
                                    null :
                                    <View style={{marginTop: 13}}>
                                        <Text
                                            style={{
                                                fontSize: 13 * fontScale,
                                                color: '#999',
                                            }}
                                        >
                                            门店数：{item.store_sum}家
                                        </Text>
                                    </View>
                            }
                            <View style={{marginTop: 13}}>
                                <Text
                                    style={{
                                        fontSize: 13 * fontScale,
                                        color: '#999',
                                    }}
                                >
                                    结束日期：{item.to_date}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        });
    }

    render() {
        let data = this.props.data;
        return (
            <View>
                <View style={{backgroundColor: '#fff'}}>
                    {this.renderTag(data)}
                </View>
            </View>
        )
    }
}