/**
 * Created by Joe on 2017/3/27.
 */

import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Alert } from 'react-native'

// common
import {subsectionText} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class BankNo extends Component{
  constructor(props){
    super(props)
    this.renderTag = this.renderTag.bind(this);
  }

  renderTag(data){
    return data.map((item, index)=>{
      return (
        <View
          style={{
            marginLeft:distances.contractLeftMargin,
            paddingTop:distances.contractLeftMargin,
            paddingBottom:distances.contractLeftMargin,
            borderBottomWidth:distances.borderWidth,
            borderColor:colors.borderColor,
            flexDirection:'row'
          }}
          key={index}
        >
          <View
            style={{
              borderRadius:2,
              backgroundColor:colors.blueColor,
              marginTop:3,
              height:16,
              marginRight:10,
              alignItems: 'center',
              justifyContent:'center',
            }}
          >
            <Text style={{color:'#fff', fontSize:11*fontScale, marginLeft:4, marginRight:4}}>
              {item.type==1?'对公':'对私'}
            </Text>
          </View>
          <View style={{flex:1, marginRight:distances.contractLeftMargin}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent:'space-between',
                flexDirection:'row'
              }}
            >
              <View>
                <Text style={{fontSize:16*fontScale, color:'#333'}}>
                  {item.name}
                </Text>
              </View>
              {
                item.default?
                  <View>
                    <Text style={{fontSize:13*fontScale, color:'#f35e5e'}}>
                      默认账号
                    </Text>
                  </View>
                  :
                  null
              }
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent:'center',
              }}
            >
              <View style={{marginTop:13}}>
                <Text
                  style={{
                  fontSize:13*fontScale,
                  color:'#999',
                }}
                >
                  {item.bank_name}
                </Text>
              </View>
              <View style={{marginTop:5}}>
                <Text
                  style={{
                  fontSize:13*fontScale,
                  color:'#999',
                }}
                >
                  {subsectionText(item.bank_account, 4)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )
    });
  }

  render(){
    let data = this.props.data;
    return (
      <View>
        <View style={{flex: 1, backgroundColor:'#fff'}}>
          {this.renderTag(data)}
        </View>
      </View>
    )
  }
}