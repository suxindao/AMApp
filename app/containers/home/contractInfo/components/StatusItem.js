/**
 * create at 03/17/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 *  构造结构
 * 								|						|			status | time
 *					name  |  分割Icon |			---------------
 * 								|						|			des
 */
export default class StatusItem extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {rowData, index, lengths} = this.props
		let bgColor = (index % 2 == 0) ? '#fff' : '#f8f8f8'
		let rightComponentPadding = Boolean(rowData.message) ? 11 : 23
		return(
			<View style={{paddingLeft: 15, paddingRight: 15, flexDirection: 'row', backgroundColor: bgColor}}>
				<NameComponent title={Boolean(rowData.operator_name) ? rowData.operator_name : ''} index={index}/>
				<IconComponet index={index} lengths={lengths}/>
				<View style={{
					paddingTop: rightComponentPadding, paddingBottom: rightComponentPadding,
					flex: 1,
				}}>
					<ItemStatus data={rowData} index={index}/>
					<DesComponent data={Boolean(rowData.message) ? rowData.message : null}/>
				</View>
			</View>
		)
	}
}

/**
 * name
 */
class NameComponent extends Component{
	render(){
		let {title, index} = this.props
		let titleColor = index == 0 ? '#333' : '#999'
		return(
			<View style={{width: 60, alignItems: 'flex-end', alignSelf: 'center'}}>
				<Text numberOfLines={1} style={{color: titleColor, fontSize: 13 * fontScale}}>
					{title}
				</Text>
			</View>
		)
	}
}

/**
 * status component
 */
class ItemStatus extends Component{
	render(){
		let {data, index} = this.props
		let textColor = index === 0 ? '#333' : '#ccc'
		return (
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<Text style={{color: textColor, fontSize: 13 * fontScale, flex: 1}} numberOfLines={1}>
					{Boolean(data.status) ? data.status : ''}
				</Text>
				<Text style={{color: '#ccc', fontSize: 13 * fontScale, marginLeft: 5}}>
					{Boolean(data.timestamp) ? data.timestamp : ''}
				</Text>
			</View>
		)
	}
}

/**
 * des component
 */
class DesComponent extends Component{
	render(){
		let {data} = this.props
		if(Boolean(data)){
			return(
				<Text style={{marginTop: 9, color: '#999', fontSize: 13 * fontScale, lineHeight: 14}}>
					{data}
				</Text>
			)
		}
		return null
	}
}

/**
 * icon component
 */
class IconComponet extends Component{
	render(){
		let {index, lengths} = this.props
		return(
			<View style={{width: 20*2+12, alignItems: 'center'}}>
				<IconVertical isSpecial={(index === 0) ? true : false} index={index}/>
				<IconCircle isSpecial={(index === 0) ? true : false} index={index}/>
				<IconVertical isSpecial={(index === (lengths - 1)) ? true : false} index={index}/>
			</View>
		)
	}
}

/**
 * 图片竖条
 */
class IconVertical extends Component{
	render(){
		let {isSpecial, index} = this.props
		let bgColor = isSpecial ? ((index % 2 == 0) ? '#fff' : '#f8f8f8') : '#ececec'
		return (
			<View style={{
				width:2 , flex: 1, backgroundColor: bgColor
			}}/>
		)
	}
}

/**
 * icon circle
 */
class IconCircle extends Component{
	render(){
		let {isSpecial, index} = this.props
		let bgColor = isSpecial ? colors.blueColor : '#ccc'
		let littleBgColor = (index % 2 == 0) ? '#fff' : '#f8f8f8'
		return(
			<View style={{
				backgroundColor: bgColor, width: 14, height: 14, borderRadius: 7, 
				justifyContent: 'center', alignItems: 'center', marginTop: 2, marginBottom: 2,
			}}>
				<View style={{
					backgroundColor: littleBgColor, width: 10, height: 10, borderRadius: 5,
				}}/>
			</View>
		)
	}
}