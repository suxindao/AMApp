/**
 * create at 06/22/17
 */
import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, StyleSheet, PixelRatio } from 'react-native'

// components
import {DatePickerComponent} from '../../../../components/common/DatePickerCommon'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

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
 * 时间item
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

/**
 * 页面下方按钮
 */
export class BottomButton extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let { touchPress, title, touchAble = true } = this.props
		if(touchAble){
			return(
				<View style={styles.bottomTouchContainer}>
					<TouchableHighlight underlayColor={colors.touchBgColor} onPress={touchPress} 
						style={[styles.bottomTouchView, {backgroundColor: colors.blueColor}]}
					>
						<Text style={{color: '#fff', fontSize: 16*fontScale}}>{title}</Text>
					</TouchableHighlight>
				</View>
			)
		}
		return (
			<View style={styles.bottomTouchContainer}>
				<View style={[styles.bottomTouchView, {backgroundColor: '#f5f5f5'}]}>
					<Text style={{color: '#666', fontSize: 16*fontScale}}>{title}</Text>
				</View>
			</View>
		)
	}
}

/**
 * 标签组件 (主要for 缺失资料)
 * @param {*} data 
 * @param {*} itemBgColor 
 * @param {*} ItemHasBorder 
 */
export function showMarkComponent(data = [], itemBgColor = '', ItemHasBorder = ''){
	if(Array.isArray(data) && data.length >0){
		// data is array and length > 0
		return (
			<View>
				{
					data.map((items, idx)=>{
						let rowMrgTop = (idx === 0) ? 0 : 10
						return showMarkRow(items, idx, itemBgColor, ItemHasBorder, rowMrgTop)
					})
				}
			</View>
		)
	}
	// data is not array or length = 0
	return null
}
/**
 * mark every row
 * @param {*} data 
 * @param {*} keyCode 
 * @param {*} itemBgColor 
 * @param {*} ItemHasBorder 
 * @param {*} mgrTop 
 */
function showMarkRow(
	data = [], keyCode = '', itemBgColor = '', ItemHasBorder = false, mrgTop = 0
	){
	if(Array.isArray(data) && data.length > 0){
		// data is array and length > 0
		return(
			<View key={keyCode} style={{flexDirection: 'row', alignItems: 'center', marginTop: mrgTop}}>
				{
					data.map((item, idx)=>{
						let itemMrgLeft = (idx === 0) ? 0 : 9 
						return showMarkItem(item, idx, itemBgColor, ItemHasBorder, itemMrgLeft)
					})
				}
			</View>
		)
	}
	// data is not array or length = 0
	return <View key={keyCode}/>
}
/**
 * 标签 item
 * @param {*} title 
 * @param {*} bgColor 
 * @param {*} hasBorder 
 */
function showMarkItem(title = '', keyCode = '', bgColor = '', hasBorder = false, mrgLeft = 0){
	return (
		<View key={keyCode} style={[
			{
				justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, marginLeft: mrgLeft,
				borderRadius: 20, borderColor: colors.borderColor, padding: 8,
			}, hasBorder ? {borderWidth: distances.borderWidth} : null
		]}>
			<Text style={{color: '#999', fontSize: 10*fontScale}}>
				{Boolean(title) ? title : ''}
			</Text>
		</View>
	)
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
	bottomTouchContainer:{
		height: 60, 
		backgroundColor: '#fff', 
		borderColor: colors.borderColor, 
		borderTopWidth: distances.borderWidth, 
		justifyContent: 'center'
	},
	bottomTouchView:{
		marginLeft: 46/2, 
		marginRight: 46/2,
		height: 76/2, 
		borderRadius: 4, 
		justifyContent: 'center', 
		alignItems: 'center'
	}
})