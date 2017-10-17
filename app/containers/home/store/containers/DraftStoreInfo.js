/**
 * Created by Joe on 2017/4/19.
 */
import React, { Component } from 'react';
import { View } from 'react-native'
//组件
import StoreListItem from './../components/StoreListItem'
// style
import {colors} from '../../../../constants/style'
// common
import { store } from '../../../../constants/common'


/**
 * 草稿列表页
 */
export default class DraftStoreInfo extends Component{
  render(){
    return(
      <View style={{flex:1, backgroundColor:colors.labBgColor}}>
        <StoreListItem
          type={1}
          status={store[0].code}
        />
      </View>
    )
  }
}