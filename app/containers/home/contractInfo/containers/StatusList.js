/**
 * create at 03/17/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'

// components
import StatusItem from '../components/StatusItem'
import ListNoData from '../../../../components/list/NoData'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class StatusComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		if(!Boolean(this.props.init_data)){
			return null
		}
		let {init_data} = this.props
		if(Array.isArray(init_data.review) && init_data.review.length > 0){
			// console.log('StatusList init_data===>', this.props.init_data)
			let {review} = init_data
			return(
				<View style={{
					flex: 1, borderColor: colors.borderColor, 
					borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
				}}>
					{(()=>{
						return review.map((item, idx)=>{
							return <StatusItem key={idx} rowData={item} index={idx} lengths={review.length}/>
						})
					})()}
				</View>
			)
		}
		return (
			<ListNoData visible={true} icon={require('../../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
		)
	}
}