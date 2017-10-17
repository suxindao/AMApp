/**
 * Created by Joe on 2017/3/22.
 */

import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * 主体合同组件
 */
export default class EnterpriseDetails extends Component {
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
                        企业名称：{data.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15 * fontScale,
                            color: '#fff',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                    >
                        工商注册号：{data.reg_code}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15 * fontScale,
                            color: '#fff',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                    >
                        公司地址：{data.address}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15 * fontScale,
                            color: '#fff',
                            marginTop: 0,
                            marginBottom: 9,
                        }}
                    >
                        法人代表：{data.legal_person}
                    </Text>
                </View>
            </View>
        )
    }
}

// <Text
// style={{
//   fontSize:15*fontScale,
//     color:'#fff',
//     marginTop:9,
// }}
// >
// 法人代表身份证：{data.legal_person_idcard}
// </Text>
// <Text
//   style={{
//               fontSize:15*fontScale,
//               color:'#fff',
//               marginTop:9,
//               marginBottom:15,
//             }}
// >
//   法人联系方式：{data.legal_person_detail}
// </Text>