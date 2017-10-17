/**
 * Created by Joe on 2017/4/20.
 */
import React, { Component } from 'react';
import { View } from 'react-native'
//组件
import StoreListItem from './../components/StoreListItem'
import ListNoDadta from '../../../../components/list/NoData'
// style
import {colors} from '../../../../constants/style'
// common
import { store } from '../../../../constants/common'

export default class RejectedStoreInfo extends Component{

  render(){
    return(
      <View style={{backgroundColor: colors.labBgColor, flex:1}} bounces={false}>
        <StoreListItem
          type={2}
          status={store[1].code}
        />
      </View>
    )
  }
}