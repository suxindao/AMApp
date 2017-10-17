/**
 * Created by Joe on 2017/4/28.
 */
import React, {Component} from 'react';
import {View, Text,} from 'react-native'
// style
import {colors, distances, fontScale} from '../../../../constants/style'

const innerStyle = {
    fontSize: 13 * fontScale,
    color: '#999',
    marginBottom: 10,
};

export default class ViewStoreInfoItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {data} = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    borderTopWidth: distances.borderWidth,
                    borderBottomWidth: distances.borderWidth,
                    borderColor: colors.borderColor,
                    backgroundColor: '#fff',
                    marginTop: 10,
                    marginBottom: 10,
                }}
            >
                <View style={{
                    flex: 1,
                    marginLeft: distances.contractLeftMargin,
                    marginRight: distances.contractLeftMargin
                }}>
                    <View style={{justifyContent: 'flex-start'}}>
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#333',
                                marginBottom: 12,
                                marginTop: 15,
                            }}
                        >
                            {data.brand_name + data.branch}
                        </Text>
                    </View>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={innerStyle}>门店ID：</Text>
                        <Text style={innerStyle}>{data.id}</Text>
                    </View>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={innerStyle}>门店编号：</Text>
                        <Text style={innerStyle}>{data.cms_code}</Text>
                    </View>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                        <Text style={innerStyle}>创建时间：</Text>
                        <Text style={innerStyle}>{data.create_time}</Text>
                    </View>
                    <View style={{justifyContent: 'flex-start', flexDirection: 'row', marginBottom: 5}}>
                        <Text style={innerStyle}>最后维护：</Text>
                        <Text style={innerStyle}>{data.update_time}</Text>
                    </View>
                </View>
            </View>
        )
    }
}