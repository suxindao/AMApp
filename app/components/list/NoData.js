/**
 * create at 03/22/17
 * 列表为空的情况
 */
import React, {Component} from "react";
import {
    Platform, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image
} from "react-native"

// style
import {distances, fontScale, colors} from '../../constants/style'

/**
 *  params visible:是否显示该组件 icon: 图标  des: 描述
 */
export default class NoDataComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {visible, icon, des} = this.props
        if (visible) {
            return (
                <View style={{flex: 1}}>
                    <View>
                        <Image style={{alignSelf: 'center', marginTop: 88}} source={icon}/>
                        <Text style={{alignSelf: 'center', fontSize: 14 * fontScale, color: '#999', marginTop: 30}}>
                            {des}
                        </Text>
                    </View>
                </View>
            )
        }
        return null
    }
}