/**
 * Create at 06/27/17
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet } from 'react-native'

// components
import {SelectItem} from './common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// 时间选择
export class TypePickerComponent extends Component{
  constructor(props){
    super(props)

    this._btnBack = this._btnBack.bind(this)
  }

  _btnBack(code, date){
    let {callBack} = this.props
    let data = {code: code, date: date}
    if(typeof callBack === 'function'){
      callBack(data)
    }
  }

  render(){
    let {minValue, maxValue} = this.props
    return(
      <View style={styles.viewRow}>
        <SelectItem content={minValue} code='min' 
          confirmPress={this._btnBack} 
        />
        <View style={{width: 45, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#ccc', fontSize: 10*fontScale}}>{'——'}</Text>
        </View>
        <SelectItem content={maxValue} code='max' 
          confirmPress={this._btnBack} 
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewRow:{
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 11, 
    paddingBottom: 11,
    paddingLeft: distances.contractLeftMargin,
  }
})