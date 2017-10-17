/**
 * Created by Joe on 2017/4/20.
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
 * 通过列表页面
 */
export default class ThroughStoreInfo extends Component{

  render(){
    let { list=new Array() } = this.props;
    return(
      <View style={{backgroundColor: colors.labBgColor, flex:1}} bounces={false}>
        <StoreListItem
          type={4}
          status={store[3].code}
        />
      </View>
    )
  }
}
