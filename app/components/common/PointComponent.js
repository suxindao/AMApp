/**
 *  create at 06/21/17
 */

import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'

// style
import {distances, colors} from '../../constants/style'

/**
 * 展示红点
 * @param {*} isShow , boolean
 * @param {*} containerStyle , style
 * @param {*} showNum , number
 * @param {*} numStyle , style
 * @param {*} num , number
 */
export class PointComponent extends Component {
    render() {
        let {
            isShow = true, containerStyle = null, showNum = true, numStyle = null, num = 0
        } = this.props
        if (isShow) {
            return (
                <View style={[containerStyle, styles.pointContainer]}>
                    {showNum ? (
                        <Text style={[numStyle]}>{Boolean(num) ? num : 0}</Text>
                    ) : null}
                </View>
            )
        }
        return null
    }
}

const styles = StyleSheet.create({
    pointContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})