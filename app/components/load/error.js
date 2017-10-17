/**
 *  create by Qi at 16/09/26
 */
import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Image, PixelRatio, Platform, NativeModules} from 'react-native'

// const {RNXnjhEvent} = NativeModules;

//style
import {colors, fontScale, distances} from '../../constants/style'

export default class Error extends Component{
  constructor(props){
    super(props)
    this._handlerPress = this._handlerPress.bind(this)
  }

  _handlerPress(){
    // console.log('RNXnjhEvent===>', RNXnjhEvent)
    if(this.props.onPress){
      this.props.onPress()
    }else{
      // RNXnjhEvent.openNetWorkSetting()
    }
  }

  render(){
    return (
      <TouchableOpacity activeOpacity={1} style={{flex: 1, alignItems: 'center'}} onPress={this._handlerPress} >
        <Image style={{width: 158/2, height: 158/2, marginTop: 110}} source={require('../../sources/images/error_icon.png')}/>
        <Text style={{color: '#999', fontSize: 14*fontScale, marginTop: 30}}>网络连接失败</Text>
        <Text style={{color: colors.greenColor, fontSize: 15*fontScale, marginTop: 12}}>点击屏幕重新尝试</Text>
      </TouchableOpacity>
    )
  }
}