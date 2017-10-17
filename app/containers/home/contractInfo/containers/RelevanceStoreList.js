/**
 * create at 03/17/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'

// components
import ListComponentSimple from '../../../../components/list/ListSimple'
import RelevanceItem from '../components/RelevanceItem'
import ListNoData from '../../../../components/list/NoData'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class RelevanceComponent extends Component{
	constructor(props){
		super(props)

		// UI
		this.renderListRow = this.renderListRow.bind(this)
	}

	renderListRow(rowData, sectionID, rowID){
		return <RelevanceItem rowData={rowData} index={rowID} length={this.storesLength}/>
	}

	render(){
		if(!Boolean(this.props.init_data)){
			return null
		}
		let {scrollEnabled = true, init_data} = this.props
		if(Array.isArray(init_data.stores) && init_data.stores.length > 0){
			this.storesLength = init_data.stores.length
			return(
				<ListComponentSimple 
					scrollEnabled={scrollEnabled}
					style={{
						flex: 1
					}}
					data={init_data.stores}
					renderListRow={this.renderListRow}
				/>
			)
		}
		return (
			<ListNoData visible={true} icon={require('../../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
		)
	}
}