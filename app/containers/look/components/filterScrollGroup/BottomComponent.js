/**
 * create at 04/15/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView, PixelRatio, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const btnCode = {
	reset: 'BOTTOM_RESET',
	confirm: 'BOTTOM_CONFIRM'
}

/**
 * 底部 重置 和 确认 button
 */
export default class BottomComponent extends Component{
	constructor(props){
		super(props)

		this.touchClick = this.touchClick.bind(this)
	}

	touchClick(code){
		let {selectTouch} = this.props
		let result = 0 // 默认回传 0
		if(code === btnCode.confirm){
			// 点击确认 回传 1
			result = 1
		} 
		selectTouch(result)
	}

	render(){
		let {bottomStyle} = this.props
		return(
			<View style={[{
				position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', 
				borderColor: colors.borderColor, borderTopWidth: distances.borderWidth,
			}, bottomStyle]}>
				<BtnItem code={btnCode.reset} title='重置' itemPress={this.touchClick}/>
				<View style={{width: distances.borderWidth, backgroundColor: colors.borderColor}}/>
				<BtnItem code={btnCode.confirm} title='确认' itemPress={this.touchClick}/>
			</View>
		)
	}
}

/**
 * button item
 */
class BtnItem extends Component{
	constructor(props){
		super(props)

		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {itemPress, code} = this.props
		itemPress(code)
	}

	render(){
		let {title, code } = this.props
		let textColor = code === btnCode.confirm ? colors.blueColor : '#999'
		return(
			<TouchableHighlight 
				onPress={this.itemClick} underlayColor={colors.touchBgColor}
				style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}
			>
				<Text style={{fontSize: 16*fontScale, color: textColor}}>{title}</Text>
			</TouchableHighlight>
		)
	}
}