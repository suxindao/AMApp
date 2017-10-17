/**
 * Created on 2017/5/27.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet, PixelRatio } from 'react-native';

// components
import {DatePickerComponent} from '../../../../components/common/DatePickerCommon'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const BTN_WIDTH = (distances.deviceWidth - 15*4)/3
const DATEPICKER_WIDTH = (distances.deviceWidth- 15*2-90/2)/2

/**
 * 
 * @param {*} title 
 */
export function showTitleLable(title){
  return(
    <View style={{ paddingLeft: distances.contractLeftMargin, justifyContent:'center', marginTop: 10}}>
      <Text style={{ fontSize: 12 * fontScale, color: '#999'}}>
        {title}
      </Text>
    </View>
  )
}

/**
 * button 
 */
export class ButtonComponent extends Component{
	constructor(props){
		super(props)

		this.btnClick = this.btnClick.bind(this)
	}

	btnClick(){
		let {btnPress, code} = this.props
		if(typeof btnPress === 'function'){
			btnPress(code)
		}
	}

	render(){
		let {name, code, isMarkedCode, styleBtn = null} = this.props
		let isMarked = isMarkedCode === code ? true : false
		return(
			<TouchableHighlight
				onPress={this.btnClick} underlayColor={colors.touchBgColor}
				style={[
					styles.buttonTouch,
					isMarked ? {borderColor: colors.blueColor, borderWidth: distances.borderWidth} : null,
					styleBtn
				]}
			>
				<Text style={[
					{fontSize: 15*fontScale},
					isMarked ? {color: colors.blueColor} : {color: '#333'}
				]}>{name}</Text>
			</TouchableHighlight>
		)
	}
}

/**
 * 自定义时间
 */
export class SelectItem extends Component{
	constructor(props){
		super(props)

		this._selectClick = this._selectClick.bind(this)
	}

	_selectClick(date){
		let {confirmPress, code} = this.props
		if(typeof confirmPress === 'function'){
			confirmPress(code, date)
		}
	}

	render(){
		let {content, styleDate = null} = this.props
		return (
			<DatePickerComponent 
				styleDate={styles.dateContainer}
				content={content} confirmText='确认' cancelText='取消'
				dateTextColor='#333' 
				cancelTextColor={colors.blueColor} confirmTextColor={colors.blueColor}
				confirmPress={this._selectClick}
			/>
		)
	}
}

const styles = StyleSheet.create({
	dateContainer: {
		width: DATEPICKER_WIDTH, 
		height: 74/2, 
		backgroundColor: '#fff', 
		borderWidth: 0, 
		borderRadius: 6 / PixelRatio.get(), 
		justifyContent: 'center', 
		alignItems: 'center'
	},
	buttonTouch: {
		width: BTN_WIDTH, 
		height: 37, 
		justifyContent: 'center', 
		alignItems: 'center', 
		backgroundColor: '#fff',
		borderRadius: 6 / PixelRatio.get(), 
	}
})