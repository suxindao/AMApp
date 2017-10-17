/**
 * create at 03/08/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import ListView from '../../../../components/list/ListSimple'
import FirstItem from '../components/FirstItem'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class Page extends Component{
  constructor(props){
    super(props)

    // UI
    this.renderListRow = this.renderListRow.bind(this)
  }

  renderListRow(rowData, sectionID, rowID){
    return <FirstItem data={rowData}/>
  }

  render(){
    // console.log('FirstPage props===>', this.props)
    if(Array.isArray(this.props.init_data) && this.props.init_data.length > 0){
      return(
        <View style={{backgroundColor: colors.bgColor, flex: 1}}>
          <ListView
            style={{flex: 1}}
            renderListRow={this.renderListRow}
            data={this.props.init_data}
          />
        </View>
      )
    }
    return null
  }
}