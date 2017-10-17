/**
 * create at 07/21/17
 * 
 * 判断 是应用ScrollView 组件包裹内容还是 KeyboardAwareScrollView 包裹内容
 * 
 * for 多层ScrollView 包裹的组件，且里面的某些组件肯可能作为单独的界面
 */
import React, { Component } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class AutoKeywordScrollView extends Component{
	render(){
		let { 
			needKeyWord = true, scrollEnabled = true, scrollStyle = null, scrollBounces = false,
		} = this.props
		if(needKeyWord){
			return (
				<KeyboardAwareScrollView scrollEnabled={scrollEnabled} bounces={scrollBounces}
					style={scrollStyle}>
					{this.props.children}
				</KeyboardAwareScrollView>
			)
		}else {
			return (
				<ScrollView scrollEnabled={scrollEnabled} style={scrollStyle}
					bounces={scrollBounces}>
					{this.props.children}
				</ScrollView>
			)
		}
	}
}
