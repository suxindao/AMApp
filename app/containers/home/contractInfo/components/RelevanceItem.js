/**
 * create at 03/17/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class RelevanceItem extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {rowData, index, length} = this.props
		return(
			<View style={[
				{paddingLeft: 15, backgroundColor: '#fff', borderColor: colors.borderColor},
				index == 0 ? {borderTopWidth: distances.borderWidth} : null,
				index == length - 1 ? {borderBottomWidth: distances.borderWidth} : null
			]}>
				<View style={[
					{
						flex: 1, paddingTop: 15, paddingBottom: 15, paddingRight: 15, borderColor: colors.borderColor,
					},
					index == length - 1 ? null : {borderBottomWidth: distances.borderWidth}
				]}>
					<Text style={{color: '#333', fontSize: 16 * fontScale}}>
						{(Boolean(rowData.store_info) && Boolean(rowData.store_info.branch)) ? rowData.store_info.branch : ''}
					</Text>
					<ItemComponent style={{paddingTop: 13}} 
						content={(Boolean(rowData.store_info) && Boolean(rowData.store_info.address)) ? rowData.store_info.address : null} 
					/>
					<LabelsComponent data={Boolean(rowData.services) ? rowData.services : []}/>
					<ItemComponent content={
						(Boolean(rowData.store_info) && Boolean(rowData.store_info.creator_name)) ? '维护AM：'+rowData.store_info.creator_name : null
					} />
				</View>
			</View>
		)
	}
}

/**
 * item
 */
class ItemComponent extends Component{
	render(){
		if(!Boolean(this.props.content)){
			return null
		}
		let {content, style} = this.props
		return(
			<View style={Boolean(style) ? style : null}>
				<Text style={{color: '#999', fontSize: 13 * fontScale}} numberOfLines={1}>
					{content}
				</Text>
			</View>
		)
	}
}

/**
 * 功能标签
 */
class LabelsComponent extends Component{
	render(){
		let {data} = this.props
		if(Array.isArray(data) && data.length > 0){
			return(
				<View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 9, paddingBottom: 9}}>
					{(()=>{
						return data.map((item, idx)=>{
							return <LabelItem key={idx} title={item} index={idx}/>
						})
					})()}
				</View>
			)
		}
		return null
	}
}

/**
 * 标签 item
 */
class LabelItem extends Component{
	render(){
		let {title, index} = this.props
		let marginLeft = 4
		if(index === 0){
			marginLeft = 0
		}
		return(
			<View style={{
				paddingTop: 2, paddingBottom: 2, paddingLeft: 4, paddingRight: 4,
				backgroundColor: colors.blueColor, borderRadius: 2, marginLeft: marginLeft,
			}}>
				<Text style={{color: '#fff', fontSize: 11 * fontScale}}>
					{title}
				</Text>
			</View>
		)
	}
}
