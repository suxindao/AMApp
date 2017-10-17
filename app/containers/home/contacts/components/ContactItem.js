/**
 * create at 05/25/17
 */
import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class ListItem extends Component{
	constructor(props){
		super(props)

		this._itemClick = this._itemClick.bind(this)
	}

	_itemClick(){
		let {itemPress, rowData} = this.props
		if(typeof itemPress == 'function'){
			itemPress(rowData)
		}
	}

	render(){
		let {rowData, length, index} = this.props
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} 
				style={[ styles.itemTouch, 
					index == length-1 ? {borderBottomWidth: distances.borderWidth} : null
				]} 
				onPress={this._itemClick}
			>
				<View style={[
					styles.itemView,
					index == length-1 ? null : {borderBottomWidth: distances.borderWidth}
				]}>
					<Text style={{color: '#333', fontSize: 16*fontScale}}>{
						Boolean(rowData.store_name) ? rowData.store_name  : ''
					}</Text>
					<MiddleComponent rowData={rowData}/>
					<BottomComponent rowData={rowData}/>
				</View>
			</TouchableHighlight>
		)
	}
}

/**
 * 展示: 姓名 职务 电话
 */
class MiddleComponent extends Component{
	render(){
		let {rowData} = this.props
		return (
			<View style={[styles.middleView]}>
				<View style={[styles.innerLeftView]}>
					<Text style={[styles.text]}>{
						(Boolean(rowData.contacts_duty) ? rowData.contacts_duty + '：'  : '') 
						+ (Boolean(rowData.contacts_name) ? rowData.contacts_name  : '')
					}</Text>
				</View>
				<Text style={[styles.text]}>{
					'电话：' + (Boolean(rowData.phone_num) ? rowData.phone_num  : '')
				}</Text>
			</View>
		)
	}
}

/**
 * 展示：负责am 所在部门
 */
class BottomComponent extends Component{
	render(){
		let {rowData} = this.props
		return (
			<View style={[styles.bottomView]}>
				<View style={styles.innerLeftView}>	
					<Text style={[styles.text]}>{
						'负责AM：' + (Boolean(rowData.am_name) ? rowData.am_name  : '')
					}</Text>
				</View>
				<Text style={[styles.text]}>{
					'所在部门：' + (Boolean(rowData.group_name) ? rowData.group_name  : '')
				}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	itemTouch: {
		backgroundColor: '#fff', 
		paddingLeft: 15, 
		borderColor: colors.borderColor
	},
	itemView:{
		paddingTop: 15,
		paddingBottom: 15,
		paddingRight: 15, 
		borderColor: colors.borderColor,
		flex: 1 
	},
	middleView: {
		flexDirection: 'row', 
		alignItems: 'center', 
		marginTop: 13, 
	},
	bottomView: {
		flexDirection: 'row', 
		alignItems: 'center', 
		marginTop: 9, 
	},
	innerLeftView: {
		width: 140,
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	text: {
		color: '#999', 
		fontSize: 13*fontScale,
	}
})