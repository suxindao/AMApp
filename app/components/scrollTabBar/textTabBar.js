/**
 * create by Qi at 16/09/06
 * 只显示文字的tabbar, 并且整体tabbar 样式可以控制
 * tabArr 显示个数
 * 外部需要提供的属性  
 *   style: viewStyle
 *   array: tabArr
 *   array: itemStyle
 */

import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {colors, distances, fontSizes} from '../../constants/style'

export default class TextTabbar extends Component{
  constructor(props){
    super(props)
    this._renderTabOption = this._renderTabOption.bind(this)
  }

  componentDidMount() {
    // Animated.Value监听范围 [0, tab数量-1]
    this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({value}) {
    // console.log(value);
  }

  _renderTabOption() {
    return this.props.tabArr.map((tab, i)=>{
      const color = this.props.activeTab === i ? "#666" : "#ccc"; // 判断i是否是当前选中的tab，设置不同的颜色
      return (
        <TouchableOpacity onPress={this.tabOptionClick.bind(this, i)} 
          style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}
          key={i}
        >
          <Text style={{color: color, fontSize: fontSizes.navTitle, fontFamily: 'Avenir Next',}}>
            {tab}
          </Text>
        </TouchableOpacity>
       );
    })
  }

  tabOptionClick(index){
    this.props.goToPage(index)
  }

  render() {
    return (
      <View style={[{flexDirection: 'row'}, this.props.viewStyle]}>
        {this._renderTabOption()}
       
      </View>
    );
  }
}