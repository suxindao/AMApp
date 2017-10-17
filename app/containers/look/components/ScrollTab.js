/**
 * create at 04/20/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet, ScrollView} from 'react-native'

// components
import LeftComponent from './tabsComponent/LeftComponent'
import RightComponent from './tabsComponent/RightComponent'

// style
import {distances, colors, fontScale} from '../../../constants/style'
import {ItemHight, LeftWidth } from './tabsComponent/common'
const RightWidth = distances.deviceWidth - LeftWidth -distances.contractLeftMargin

export default class Container extends Component{
	constructor(props){
		super(props)

	}

	render(){
		let {
			data, code,
			weekSelectElement, weekSortPress, weekSelectStatus,
			monthSelectElement, monthSortPress, monthSelectStatus
		} = this.props
		return (
			<View style={styles.container}>
				<LeftComponent data={data} leftStyle={null}/>
				<RightComponent rightStyle={{width: RightWidth}} code={code} data={data}
					weekSelectElement={weekSelectElement} weekSortPress={weekSortPress} weekSelectStatus={weekSelectStatus}
					monthSelectElement={monthSelectElement} monthSortPress={monthSortPress} monthSelectStatus={monthSelectStatus}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		minHeight: ItemHight, 
		backgroundColor: '#fff',
		flexDirection: 'row',
	},
})