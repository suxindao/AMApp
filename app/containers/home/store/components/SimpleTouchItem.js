/**
 * Created by Joe on 2017/5/12.
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native'
// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class SimpleTouchItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {config} = this.props
        return (
            <TouchableOpacity
                style={
                    [
                        {
                            minHeight: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: colors.borderColor,
                            paddingLeft: distances.contractLeftMargin,
                        },
                        config.hasLine ? {borderBottomWidth: distances.borderWidth} : null
                    ]
                }
                onPress={() => {
                    this.props.touchCallback(config.editable)
                }}
            >
                <Text style={{fontSize: 16 * fontScale, color: '#333', width: 110}}>{config.title}</Text>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: distances.leftMargin,
                    }}
                >
                    {
                        typeof config.noImg == 'undefined' || config.noImg == false ?
                            <Image style={{width: 6, height: 10}}
                                   source={require('../../../../sources/images/arrow_right.png')}/> :
                            null
                    }
                </View>
            </TouchableOpacity>
        )
    }
}