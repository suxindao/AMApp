/**
 * Created by Joe on 2017/4/19.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'

import {colors, distances, fontScale} from '../../../../constants/style'
import {store} from '../../../../constants/common'

/**
 * 首页列表项
 */
export default class ViewStoreListItem extends Component{
  constructor(props){
    super(props)
    this.itemClick = this.itemClick.bind(this)
  }

  /**
   * 点击标签
   */
  itemClick(code){
    return ()=>{
      switch(code){
        case store[0].code : {
          Actions.draftStoreInfo({emitKey:this.props.emitKey});// 草稿
        }
          break;
        case store[1].code : {
          Actions.rejectedStoreInfo({emitKey:this.props.emitKey});// 驳回
        }
          break;
        case store[2].code : {
          Actions.pendingStoreInfo();// 待审核
        }
          break;
        case store[3].code:{
          Actions.throughStoreInfo();// 通过
          break;
        }
        default:
          break;
      }
    }
  }

  render(){
    let {rowData} = this.props
    return (
      <TouchableHighlight onPress={this.itemClick(rowData.code)} underlayColor='#fafafa' >
        <View style={{height: 60, flexDirection: 'row'}}>
          <Image style={{marginLeft: distances.leftMargin, width: 50/2, height: 50/2, alignSelf: 'center'}}
                 source={rowData.icon_uri}
          />
          <View style={{
						marginLeft: 30, height: 60, flex: 1,
						flexDirection: 'row', alignItems: 'center',
						borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
					}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{color: '#333', fontSize: 15*fontScale}}>{rowData.title}</Text>
            </View>
            <Text style={{fontSize: 14*fontScale, color: '#999'}}>
              {rowData.count}
            </Text>
            <Image style={{width: 12/2, height: 20/2, marginLeft: 10, marginRight: distances.leftMargin}}
                   source={require('../../../../sources/images/arrow_right.png')}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}