/**
 *  create at by Qi at 16/09/06
 *  在 react-native-scrollable-tab-view 中 DefaultTabbar 基础上,每个tab上可以在右侧显示一张图片
 *  并提供每个tab样式给外部
 *  外部需要提供的属性:
 *    style: containerStyle
 *    array: tabArr
 *    style: itemStyle
 *    文字 style: activeTextColor, inactiveTextColor, textStyle
 *    underline: underlineHeight, underlineColor
 *    finishIcon: style: iconStyle
 *    tabclick func: tabClick
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated, Image} from 'react-native';

import Button from './button'

const styles = StyleSheet.create({
  icon:{
    marginLeft: 6,
    width: 13,
    height: 13,
  }
})

export default class DefaultImageTabBar extends Component{
  constructor(props){
    super(props)

    this._renderTabOption = this._renderTabOption.bind(this)
    this._renderFinishIcon = this._renderFinishIcon.bind(this)
  }

  _renderFinishIcon(state){
    switch(state){
      case '0':
        return null
      case '1':
        return <Image style={styles.icon} source={require('../../sources/images/order/wonder.png')}/>
      case '2':
        return <Image style={styles.icon} source={require('../../sources/images/order/check_green.png')}/>
      default:
        break;
    }
  }

  _renderTabOption(){
    // console.log('defaultImageTabBar tabArr===>', this.props.tabArr)
    return this.props.tabArr.map((tab, page)=>{

      const isTabActive = this.props.activeTab === page;
      const { activeTextColor, inactiveTextColor, textStyle } = this.props;
      const textColor = isTabActive ? activeTextColor : inactiveTextColor;
      const fontWeight = isTabActive ? 'bold' : 'normal';

      // console.log('tab ===> ', tab)
      // 已完成暂时先屏蔽
      if (!tab.clickAble) {
        return (
          <View style={{flex: 1}} key={page}>
            <View style={[this.props.itemStyle, {flexDirection: 'row'}]}>
              <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
                {tab.name}
              </Text>
              {this._renderFinishIcon(tab.state)}
            </View>
          </View>
        )
      }
      return (
        <Button 
          style={{flex: 1}}
          key={page}
          accessible={true}
          accessibilityLabel={tab.name}
          accessibilityTraits='button'
          onPress={this.btnClick.bind(this, page)}
        >
          <View style={[this.props.itemStyle, {flexDirection: 'row'}]}>
            <Text style={[{color: textColor, fontWeight, }, textStyle, ]}>
              {tab.name}
            </Text>
            {this._renderFinishIcon(tab.state)}
          </View>
        </Button>
      )
    })
  }

  btnClick(page){
    this.props.tabClick(page)
    this.props.goToPage(page)
  }

  render(){
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabArr.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: this.props.underlineHeight,
      backgroundColor: this.props.underlineColor,
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0,  containerWidth / numberOfTabs],
    });

    return (
      <View style={[{flexDirection: 'row'}, this.props.containerStyle]}>
        {this._renderTabOption()}
        <Animated.View style={[tabUnderlineStyle, { left }]} />
      </View>
    )
  }
}