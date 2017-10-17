/**
 * Created by Xindao on 2017/09/08.
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native'
// style
import {colors, distances, fontScale} from '../../../../constants/style'

import CheckBox from 'react-native-check-box'
import SimpleTouchItem from './SimpleTouchItem'

export default class PayoffType extends Component {
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
                        title: '是',
                        noImg: true,
                    }}
                    touchCallback={() => {
                        this.props.touchItem({payoff: 1})
                        this.props.callback()
                    }}
                />
                <SimpleTouchItem
                    config={{
                        hasLine: true,
                        title: '否',
                        noImg: true,
                    }}
                    touchCallback={() => {
                        this.props.touchItem({payoff: 0})
                        this.props.callback()
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
                    height: 186,
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
                            是否正常发工资
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