/**
 * create at 06/20/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, TouchableOpacity, InteractionManager} from 'react-native'
import {PointComponent} from '../../../components/common/PointComponent'
import {isNull} from './../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../constants/style'

export default class MsgItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {rowData} = this.props;
        let obj = JSON.parse(rowData.ext);
        return (
            <View>
                <View
                    style={{
                        width: distances.deviceWidth,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{color: '#ccc', fontSize: 13 * fontScale}}>{rowData.create_time}</Text>
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
                            color: '#999',
                            fontSize: 13 * fontScale,
                            lineHeight: 18,
                            marginBottom: 13,
                        }}
                    >
                        接收人：{rowData.receive_am_name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            paddingRight: distances.contractLeftMargin
                        }}
                    >
                        <PointComponent
                            isShow={rowData.unread}
                            showNum={false}
                            containerStyle={{
                                backgroundColor: colors.redColor,
                                width: 8,
                                height: 8,
                                borderRadius: 8 / 2,
                                marginTop: 9,
                                marginRight: 9
                            }}
                        />
                        <Text
                            style={{
                                color: '#333',
                                fontSize: 16 * fontScale
                            }}
                        >
                            {rowData.subject}
                        </Text>
                    </View>
                    {
                        (obj.attachments && !isNull(obj.attachments.err_reason)) &&
                        <Text
                            style={{
                                color: '#999',
                                fontSize: 13 * fontScale,
                                lineHeight: 18,
                                marginTop: 13,
                            }}
                        >
                            {obj.attachments.err_reason}
                        </Text>
                    }
                </View>
            </View>
        )
    }
}