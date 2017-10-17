/**
 * create at 04/20/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'

// components
import ListSimple from '../../../../components/list/ListSimple'
import { TitleSort, TitleName, ContentSort, ContentName } from './common'

// style
import {distances, colors, fontScale} from '../../../../constants/style'

export default class LeftComponent extends Component{
	constructor(props){
		super(props)

		// UI
		this._renderListrow = this._renderListrow.bind(this)
	}

	_renderListrow(rowData, sectionID, rowID){
		return (
			<ItemView sortContent={parseInt(rowID)+1} rowData={rowData}/>
		)
	}

	render(){
		let {leftStyle, data} = this.props
		if(Array.isArray(data) && data.length > 0){
			return (
				<View style={leftStyle}>
					<TitleView sortTitle={'名次'} nameTitle={'姓名'}/>
					<ListSimple 
						style={null}
						data={data}
						renderListRow={this._renderListrow}
						scrollEnabled={false}
					/>
				</View>
			)
		}
		return null
	}
}
// 排名、名字 title
class TitleView extends Component{
	render(){
		let {sortTitle, nameTitle} = this.props
		return (
			<View style={styles.itemView}>
				<TitleSort title={sortTitle}/>
				<TitleName title={nameTitle}/>
			</View>
		)
	}
}
// 排名、名字 content
class ItemView extends Component{
	render(){
		let {sortContent, rowData} = this.props
		return (
			<View style={styles.itemView}>
				<ContentSort content={sortContent}/>
				<ContentName content={Boolean(rowData.am_name) ? rowData.am_name : ''}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	itemView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: distances.contractLeftMargin,
		paddingRight: distances.contractLeftMargin,
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	}
})