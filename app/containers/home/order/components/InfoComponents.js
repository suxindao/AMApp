/**
 * create at 06/28/17
 */
import React, { Component } from 'react'
import { View, Text, Image, TouchableHighlight, StyleSheet, PixelRatio } from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common 
import {nEveryRow} from '../../../../constants/utils/ui'

// components
import {showMarkComponent} from './common'

/**
 * info every item
 * @param {*} title 
 * @param {*} content 
 * @param {*} status 
 * @param {*} isContentMark 
 * @param {*} isStatusMark 
 * @param {*} isGrayBg 
 */
export class InfoEveryItem extends Component{
	render(){
		let {
			title = '', content = '', isGrayBg = false, isContentMark = false, 
			status = '', isStatusMark = false 
		} = this.props
		let contentColor = isContentMark ? colors.redColor3 : '#333'
		let statusColor = isStatusMark ? colors.redColor3 : '#333'
		let bgColor = isGrayBg ? '#f5f5f5' : '#fff'
		return (
			<View style={[styles.itemView, {backgroundColor: bgColor}]}>
				<View style={[styles.leftTitleView, {justifyContent: 'center'}]}>
					<Text style={styles.leftText}>
						{Boolean(title) ? title : ''}
					</Text>
				</View>
				<Text style={[styles.rightText, {color: contentColor}]}>
					{Boolean(content) ? content : ''}
				</Text>
				<Text style={[styles.statusText, {color: statusColor}]}>
					{Boolean(status) ? status : ''}
				</Text>
			</View>
		)
	}
}

/**
 * 缺失资料模块
 * @param {*} data 
 */
export class MissingData extends Component{
	render(){
		let {data} = this.props
		// 处理缺失资料数组
		let dataArr = [], itemBgColor = '#fff', itemHasBorder = true
		if(Array.isArray(data)){
			dataArr = nEveryRow(data, 3)
		}
		return(
			<View style={{
				flexDirection: 'row', paddingTop: 9, paddingBottom: 9, paddingLeft: distances.leftMargin
			}}>
				<View style={[styles.leftTitleView, {justifyContent: 'flex-start'}]}>
					<Text style={[styles.leftText, {marginTop: 7, fontSize: 13*fontScale}]}>
						{'缺失资料'}
					</Text>
				</View>
				{showMarkComponent(dataArr, itemBgColor, itemHasBorder)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	itemView: {
		height: 45, 
		flexDirection: 'row', 
		alignItems: 'center',
		paddingLeft: distances.leftMargin,
	},
	leftText:{
		color: '#999',
		fontSize: 13*fontScale,
	},
	rightText:{
		fontSize: 13*fontScale
	},
	statusText:{
		fontSize: 13*fontScale,
		marginLeft: 17
	},
	leftTitleView: {
		width: 90,  
		alignItems:'flex-start'
	}
})