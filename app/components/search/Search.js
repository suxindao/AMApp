/**
 * Created at 03/08/17
 *
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TouchableHighlight, StyleSheet, Keyboard} from 'react-native';

// 界面组件
import {SearchText, SearchInput, SearchBtn} from './index'

// style
import {distances, colors, fontScale} from '../../constants/style'

/**
 * only view
 */
export class SearchView extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {searchText, searchPress, btnPress} = this.props
    return (
      <View style={{
        paddingLeft: distances.leftMargin, paddingRight: distances.leftMargin, paddingTop: 10, paddingBottom: 10,
        backgroundColor: 'gray', flexDirection: 'row', alignItems: 'center',
      }}>
        <SearchText style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 4, height: 32, 
          }} searchText={searchText} searchPress={searchPress}
        />
        <SearchBtn style={{
            marginLeft: distances.leftMargin, backgroundColor: '#fff', borderRadius: 4, height: 32, width: 50,
          }} 
          btnPress={btnPress}
        />
      </View>
    )
  }
}

/**
 * 功能： 可编辑搜索框
 * params:
 *        placeText: placeholder 文字;
 *        showText: value 显示的文字;
 *        onSearchSubmit: 点击键盘 ‘search’/ 'go' , 包括点击 右边 ‘搜索’
 *        updateSearch: 搜索输入变换后反馈     
 */
export class SearchInputText extends Component{
  constructor(props){
    super(props)

    this.searchSubmit = this.searchSubmit.bind(this)
  }

  searchSubmit(){
    let {showText, onSearchSubmit} = this.props
    // 处理空
    if(!showText) {
      console.log('Search >>> showText is null')
      // return
    }
    // 处理空格（以空格开头或者结尾）
    showText = showText.replace(/(^\s*)|(\s*$)/g, "")
    onSearchSubmit(showText)
    Keyboard.dismiss()
  }

  render(){
    let {placeText, showText, updateSearch} = this.props
    return (
      <View style={{
        paddingLeft: 15, paddingRight: 15, paddingTop: (88/2-56/2)/2, paddingBottom: (88/2-56/2)/2,
        backgroundColor: colors.labBgColor, flexDirection: 'row', alignItems: 'center',
      }}>
        <SearchInput style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 6, height: 56/2, 
            borderColor: colors.borderColor, borderWidth: distances.borderWidth,
          }} placeText={placeText} showText={showText} 
          searchSubmit={this.searchSubmit} updateSearch={updateSearch}
        />
        <SearchBtn style={{
            marginLeft: 14, height: 56/2
          }} 
          btnPress={this.searchSubmit}
        />
      </View>
    )
  }
}

/**
 * 功能： 可编辑搜索框 (带城市按钮)
 * params:
 *        city: 城市；
 *        touchClick: 点击city click 
 *        placeText: placeholder 文字;
 *        showText: value 显示的文字;
 *        onSearchSubmit: 点击键盘 ‘search’/ 'go' , 包括点击 右边 ‘搜索’
 *        updateSearch: 搜索输入变换后反馈     
 */
export class SearchWithCity extends Component{
  constructor(props){
    super(props)

    this.searchSubmit = this.searchSubmit.bind(this)
  }

  searchSubmit(){
    let {showText, onSearchSubmit} = this.props
    // 处理空
    if(!showText) {
      console.log('Search >>> showText is null')
      // return
    }
    // 处理空格（以空格开头或者结尾）
    showText = showText.replace(/(^\s*)|(\s*$)/g, "")
    onSearchSubmit(showText)
    Keyboard.dismiss()
  }

  render(){
    let {city, placeText, showText, updateSearch, cityClick} = this.props
    return (
      <View style={{
        paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10,
        backgroundColor: colors.labBgColor, flexDirection: 'row', alignItems: 'center',
      }}>
        <CityBtn city={city} touchClick={cityClick}/>
        <SearchInput style={{
            flex: 1, backgroundColor: '#fff', borderRadius: 4, height: 28, 
            borderColor: colors.borderColor, borderWidth: distances.borderWidth,
          }} placeText={placeText} showText={showText} 
          searchSubmit={this.searchSubmit} updateSearch={updateSearch}
        />
        <SearchBtn style={{
            marginLeft: 14, borderRadius: 4, height: 28,
          }} 
          btnPress={this.searchSubmit}
        />
      </View>
    )
  }
}

/**
 * city click btn
 */
class CityBtn extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {city, touchClick} = this.props
    return(
      <TouchableHighlight onPress={touchClick} underlayColor={colors.touchBgColor}
        style={{ justifyContent: 'center', marginRight: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#333', fontSize: 15 * fontScale, alignSelf: 'center' }}>
            {city}
          </Text>
          <Image style={{ marginLeft: 5, alignSelf: 'center' }} source={require('../../sources/images/arrow_down_black.png')} />
        </View>
      </TouchableHighlight>
    )
  }
}
