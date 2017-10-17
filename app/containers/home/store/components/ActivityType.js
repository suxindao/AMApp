/**
 * Created by Joe on 2017/6/2.
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
// style
import {colors, distances, fontScale} from '../../../../constants/style'

import CheckBox from 'react-native-check-box'
import SimpleTouchItem from './SimpleTouchItem'

export default class ActivityType extends Component {
    constructor(props) {
        super(props)
        this.setActivityTypeItem = this.setActivityTypeItem.bind(this);
    }

    setActivityTypeItem() {
        return (
            <View>
                <SimpleTouchItem
                    config={{
                        hasLine: true,
                        title: '电话',
                        noImg: true,
                    }}
                    touchCallback={() => {
                        this.props.touchItem(1)
                    }}
                />
                <SimpleTouchItem
                    config={{
                        hasLine: true,
                        title: '拜访签到',
                        noImg: true,
                    }}
                    touchCallback={() => {
                        this.props.touchItem(2)
                    }}
                />
                <SimpleTouchItem
                    config={{
                        hasLine: true,
                        title: '经营情况收集',
                        noImg: true,
                    }}
                    touchCallback={() => {
                        this.props.touchItem(3)
                    }}
                />
            </View>
        );
    }

    render() {
        return (
            <View
                style={{
                    width: distances.deviceWidth,
                    height: 244,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        height: 64,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: distances.deviceWidth,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor
                    }}
                >
                    <TouchableOpacity
                        onPress={this.props.callback}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 64,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15 * fontScale,
                                marginLeft: 15,
                                marginRight: 15,
                                color: colors.blueColor,
                            }}
                        >
                            取消
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <Text
                            style={{
                                fontSize: 15 * fontScale
                            }}
                        >
                            选择活动类型
                        </Text>
                    </View>
                </View>
                <ScrollView
                    style={{
                        width: distances.deviceWidth,
                        backgroundColor: '#fff'
                    }}
                    bounces={false}
                >
                    {this.setActivityTypeItem()}
                </ScrollView>
            </View>
        )
    }
}