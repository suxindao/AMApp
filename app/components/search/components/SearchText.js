/**
 * Created at 03/08/17
 *
 * only view
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, } from 'react-native';

// style
import {distances, colors, fontScale} from '../../../constants/style'

export default class SearchComponent extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {style, searchPress, searchText} = this.props
    return (
      <TouchableOpacity activeOpacity={1} onPress={searchPress}
        style={[
          { 
            flexDirection: 'row', alignItems: 'center', 
          },
          style
        ]}
      >
        <Image style={{marginLeft: 12}} source={require('../../../sources/images/home/magnifying_glass.png')}/>
        <Text style={{fontSize: 14*fontScale, marginLeft:12, color: '#bbb'}} >{searchText}</Text>
      </TouchableOpacity>
    )
  }
}