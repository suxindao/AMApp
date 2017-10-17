/**
 * create at 06/02/17
 */
import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView, Image, StyleSheet } from 'react-native'

import { colors, distances, fontScale } from '../../../../constants/style'

/**
 * listsView
 * @param {*} lists 
 * @param {*} page 
 */
export default function listsShow(lists, currentItem, page, itemPress){
	if(Array.isArray(lists) && lists.length > 0){
		return(
			<View style={{flex: 1}}>
				{
					lists.map((item, idx)=>{
						return <ListsItem key={idx} item={item} currentItem={currentItem} page={page} itemPress={itemPress}/>
					})
				}
			</View>
		)
	}
	return null
}

class ListsItem extends Component{
	constructor(props){
		super(props)

		this._itemClick = this._itemClick.bind(this)
	}

	_itemClick(){
		let {itemPress, page, item} = this.props
		if(typeof itemPress === 'function'){
			itemPress(item, page)
		}
	}

	render(){
		let {item, currentItem} = this.props
		return(
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
				style={styles.itemTouch}
			>
				<Text style={[styles.itemText, item.id == currentItem.id ? styles.markText : null ]}>{
					Boolean(item.name) ? item.name : ''
				}</Text>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	itemTouch:{
		height: 50, 
		justifyContent: 'center',
		borderColor: colors.borderColor, 
		borderBottomWidth: distances.borderWidth,
	},
	itemText:{
		marginLeft: distances.leftMargin, 
		alignSelf: 'flex-start',
		fontSize: 16*fontScale, 
		color: '#666',
	},
	markText:{
		color: colors.blueColor
	}
})