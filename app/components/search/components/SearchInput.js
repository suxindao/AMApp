/**
 * Created at 03/08/17
 *
 * can write
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, TextInput, Platform} from 'react-native';

// style
import {distances, colors, fontScale} from '../../../constants/style'

const styles = StyleSheet.create({
  textInput:{
    flex: 1,
    fontSize: 14*fontScale,
    color: '#333',
    marginLeft: 6,
  }
})

export default class SearchComponent extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {style, placeText, showText, searchSubmit, updateSearch} = this.props
    return (
      <View style={[
        { flexDirection: 'row', alignItems: 'center' },
        style
      ]}>
        <Image style={{marginLeft: 6}} source={require('../../../sources/images/home/magnifying_glass.png')}/>
        <InputTextComponent placeText={placeText} showText={showText} 
          searchSubmit={searchSubmit} updateSearch={updateSearch}
        />
      </View>
    )
  }
}

/**
 *  功能: 安卓、iOS TextInput 封装
 *  params: 
 *        placeText: placeholder 文字;
 *        showText: value 显示的文字;
 *        searchSubmit: 点击键盘 ‘search’/ 'go' 
 *        updateSearch: 键盘输入变换后反馈
 */
class InputTextComponent extends Component{
  constructor(props){
    super(props)

    this.searchChange = this.searchChange.bind(this)
  }

  searchChange(val){
    this.props.updateSearch(val)
  }

  render(){
    let {placeText, showText, searchSubmit} = this.props
    if(Platform.OS === 'ios') {
      return <TextInput style={[styles.textInput]}
        placeholder={placeText}
        placeholderTextColor='#ccc'
        onChange={(event) => {
          this.searchChange(event.nativeEvent.text)
        }}
        returnKeyType='search'
        autoFocus={false}
        value={ showText }
        selectionColor={colors.orangeColor}
        onSubmitEditing={searchSubmit}
        clearButtonMode="while-editing"/>
    }
    return (
      <View style={{flex: 1, flexDirection:'row'}}>
        <TextInput style={[
          {paddingTop:0, paddingBottom:0, backgroundColor:'transparent'},
          styles.textInput
          ]}
          underlineColorAndroid = {'transparent'}
          placeholder={placeText}
          placeholderTextColor='#ccc'
          onChange={(event) => {
            this.searchChange(event.nativeEvent.text)
          }}
          onBlur ={ () => {
            null
          } }
          blurOnSubmit={false}
          autoFocus={false}
          value={showText}
          selectionColor={colors.orangeColor}
          returnKeyType='search'
          onSubmitEditing={searchSubmit}
          clearButtonMode="while-editing"/>
      </View>
    )
  }
}