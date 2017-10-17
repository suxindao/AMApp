/**
 *  create at 16/11/09
 */
import React, {Component} from 'react'
import {View, Text, Platform} from 'react-native'

//style
import {distances} from '../../constants/style'

export default class StatusBar extends Component{
  constructor(props){
    super(props)
  }

  render(){
    if (Platform.OS === 'ios') 
      return <View style={{height: distances.statusBarHeight}}/>
    return null
  }
}