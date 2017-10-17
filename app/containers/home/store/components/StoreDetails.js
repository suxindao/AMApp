/**
 * Created by Xindao on 2017/9/1.
 */

import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Alert, TouchableHighlight} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

import TagComponent from './StoreTags'

/**
 * 主体合同组件
 */
export default class StoreDetails extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {data, style} = this.props;
        return (
            <View style={style}>
                <View style={{marginLeft: distances.contractLeftMargin, marginRight: distances.contractLeftMargin}}>
                    <Text
                        style={{
                            fontSize: 15 * fontScale,
                            color: '#fff',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                    >
                        门店地址：{data.address}
                    </Text>
                    <View>
                        <TouchableHighlight
                            onPress={() => {
                                if (data.enterprise) {
                                    Actions.enterprise({routerData: {id: data.enterprise.id}})
                                }
                            }}
                            underlayColor='rgba(0,0,0,0.0)'
                        >
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 15 * fontScale,
                                        color: '#fff',
                                        marginTop: 0,
                                        marginBottom: 9,
                                    }}
                                >
                                    所属企业：{data.enterprise ? data.enterprise.name : '无'}
                                </Text>
                                {
                                    data.enterprise ?
                                        <Text
                                            style={{
                                                fontSize: 15 * fontScale,
                                                color: '#fff',
                                                marginTop: 0,
                                                marginBottom: 9,
                                            }}
                                        >></Text>
                                        :
                                        null
                                }
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Text
                        style={{
                            fontSize: 15 * fontScale,
                            color: '#fff',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                    >
                        门店状态：{data.status}
                    </Text>
                    <TagComponent
                        tagsData={data.tags}
                        viewStyle={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                        textStyle={{
                            color: '#FFF',
                            fontSize: 12 * fontScale
                        }}/>
                </View>
            </View>
        )
    }
}
