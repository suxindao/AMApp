/**
 * Created by suxindao on 2017/9/6 .
 */

'use strict';

import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'

export default class TagComponent extends Component {
    render() {
        let {tagsData, viewStyle, textStyle} = this.props

        if (tagsData && tagsData.length > 0) {
            return (
                <View style={viewStyle}>{
                    tagsData.map((item, idx) => {
                        return (
                            <View key={idx} style={{
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                marginRight: 5,
                                backgroundColor: item.color,
                                paddingTop: 3,
                                paddingBottom: 3,
                                paddingLeft: 5,
                                paddingRight: 5,
                                borderRadius: 2,
                            }}>
                                <Text style={textStyle}>{item.name}</Text>
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
}
