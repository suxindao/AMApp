/**
 * Created by Joe on 2017/5/9.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import _ from 'lodash'
// common
import {getTitle} from './../../contract/presenters/contractContact'
/**
 * 主体合同组件
 */
export default class EnterpriseContact extends Component{
  constructor(props){
    super(props)
    this.getInner = this.getInner.bind(this);
  }

  getInner(){
    let { data } = this.props;
    let Tag = new Array();
    for(var z of data){
      let item = z;
      Tag.push(
        <View
          key={item.status}
          style={{
            height: 60,
            flexDirection: 'row',
            justifyContent:'space-between',
            alignItems:'center',
            borderColor: colors.borderColor,
            backgroundColor: '#fff',
            paddingLeft: distances.contractLeftMargin,
            paddingRight: distances.contractLeftMargin,
            borderBottomWidth: distances.borderWidth,
          }}
        >
          <View
            style={{
              flex:1,
              justifyContent:'center',
              alignItems:'flex-start',
            }}
          >
            <Text style={{fontSize: 16 * fontScale, color: '#999'}}>
              {getTitle(item.status)}
            </Text>
          </View>
          <View
            style={{
              flex:1,
              justifyContent:'center',
              alignItems:'flex-start',
            }}
          >
            <Text style={{fontSize: 16 * fontScale, color: '#999'}}>
              {item.contact}
            </Text>
          </View>
          <View
            style={{
              flex:1,
              justifyContent:'center',
              alignItems:'flex-start',
            }}
          >
            <Text style={{fontSize: 16 * fontScale, color: '#333'}}>
              {item.contact_detail}
            </Text>
          </View>
        </View>
      );
    }
    return Tag;
  }

  render(){
    return(
      <View style={{flex:1, backgroundColor:colors.labBgColor}}>
        {this.getInner()}
      </View>
    )
  }
}