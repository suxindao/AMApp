/**
 * create at 2017/09/21
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, TouchableOpacity, InteractionManager} from 'react-native'
import {PointComponent} from '../../../components/common/PointComponent'
import {isNull} from './../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../constants/style'

export default class HistoryItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {rowData} = this.props;
        return (
            <View key={rowData.index}>
                <View
                    style={{
                        width: distances.deviceWidth,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{color: '#ccc', fontSize: 13 * fontScale}}>
                        {rowData.item.launch_time}
                    </Text>
                </View>
                <View
                    style={{
                        marginLeft: distances.contractLeftMargin,
                        marginRight: distances.contractLeftMargin,
                        backgroundColor: '#fff',
                        borderWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                        borderRadius: 3,
                        marginBottom: 5,
                        paddingLeft: distances.contractLeftMargin,
                        paddingRight: distances.contractLeftMargin,
                        paddingTop: 15,
                        paddingBottom: 15
                    }}
                >
                    <Text
                        style={{
                            color: '#333',
                            fontSize: 16 * fontScale,
                            lineHeight: 18,
                            marginBottom: 13,
                        }}
                    >
                        {rowData.item.app_version}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingRight: distances.contractLeftMargin
                        }}
                    >
                        <Text
                            style={{
                                color: '#333',
                                fontSize: 14 * fontScale
                            }}
                        >
                            {rowData.item.description}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}