/**
 * create at 04/17/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../constants/style'
import {lookDateType} from '../../../constants/operation/lookManage'

export default class StoreComponent extends Component{
	constructor(props){
		super(props)

		// func
		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {rowData, dateType, dateTime} = this.props
		let title = Boolean(rowData.name) ? rowData.name : ''
		if(dateType == lookDateType.day){
			// 类型为 日 门店列表
			Actions.lookOrderList({
				routerData: {
					dateStr: dateTime,
					dateType: lookDateType.day,
					id: Boolean(rowData.id) ? rowData.id : 0,
				}, 
				title: Boolean(rowData.name) ? rowData.name : ''
			})
		} else {
			// 类型为 月份门店列表
			Actions.lookMonthList({
				routerData: {data: rowData}, title: title
			})
		}
	}

	render(){
		let {rowData, index, length} = this.props
		return(
			<TouchableHighlight onPress={this.itemClick} underlayColor={colors.touchBgColor}
					style={{backgroundColor: '#fff'}}
				>
				<View style={[
					{
						borderColor: colors.borderColor, borderTopWidth: distances.borderWidth,
						paddingLeft: distances.contractLeftMargin, paddingRight: distances.contractLeftMargin,
						paddingTop: 15, paddingBottom: 15
					},
					(index == length - 1) ? {borderBottomWidth: distances.borderWidth} : null
				]}>
					<Text style={{color: '#333', fontSize: 16*fontScale}}>{
						Boolean(rowData.name) ? rowData.name : ''
					}</Text>
					<Text style={{marginTop: 10, color: '#999', fontSize: 13*fontScale}}>{
						Boolean(rowData.addr) ? '地址：'+rowData.addr : ''
					}</Text>
					<Text style={{marginTop: 10, color: '#999', fontSize: 13*fontScale}}>{
						Boolean(rowData.am_name) ? '维护AM：'+rowData.am_name : ''
					}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}