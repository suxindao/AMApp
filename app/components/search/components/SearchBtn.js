/**
 * Created at 03/08/17
 *
 * 'search' button
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, } from 'react-native';

// style
import {distances, colors, fontScale} from '../../../constants/style'

export default class SearchButtom extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {style, btnPress, textStyle} = this.props
    return (
      <TouchableOpacity onPress={btnPress}
        style={[
          { 
            justifyContent: 'center', alignItems: 'center', 
          },
          style
        ]}
        activeOpacity={colors.touchActive}
      >
        <Text style={{fontSize: 16*fontScale, color: colors.textBlue}} >
          搜索
        </Text>
      </TouchableOpacity>
    )
  }
}