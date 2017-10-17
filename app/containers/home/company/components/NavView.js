/**
 *  create at 16/11/14
 */

import React, {Component} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, TouchableHighlight} from 'react-native'

//页面组件相关
import StatusBar from '../../../../components/common/StatusBar'

//style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class NavView extends Component{
  constructor(props){
    super(props)

  }

  render(){
    let {pressClose} = this.props
    return (
      <View style={{backgroundColor: colors.blueColor,}}>
        <StatusBar />
        <View style={{
          flexDirection: 'row', height: distances.navHeight, alignItems: 'center',
        }}>
          <View style={{
            position: 'absolute', left: 0, right: 0, top: 0,
            bottom: 0, justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{fontSize: 18*fontScale, color: '#fff'}}>城市列表</Text>
          </View>
          <TouchableOpacity onPress={pressClose}
            style={{paddingLeft: distances.navBarLeft, justifyContent: 'center'}}
          >
            <Image source={require('../../../../sources/images/home/city_cancel.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}