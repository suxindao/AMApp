/**
 * Created at 07/18/17
 */
import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableHighlight } from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

export class ListItem extends Component{
	constructor(props){
		super(props)

		this._itemClick = this._itemClick.bind(this)
	}

	_itemClick(){
		let { itemPress, rowData } = this.props
		if(typeof itemPress === 'function'){
			// isDefault 是否是没有联系人的情况
			itemPress({isDefault: false, data:rowData})
		} else {
			console.log('ListItem itemPress is not a function')
		}
	}

	render(){
		let { rowData } = this.props
		let keyPersonStr = ''
		if(Boolean(rowData) 
				&& (typeof rowData.contacts_isKP === 'number') 
				&& (rowData.contacts_isKP == 1) 
			){
			// 1 关键联系人
			keyPersonStr = '（关键联系人）'	
		}
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
				style={[styles.touchView]}
			>
				<View style={[styles.itemView]}>
					<Text style={[styles.titleText]}>{
						Boolean(rowData.contacts_name) ? rowData.contacts_name : ''
					}</Text>
					<View style={styles.bottomView}>
						<View style={{
							justifyContent: 'center', alignItems: 'flex-start', width: 155
						}}>
							<Text style={[styles.contentText]}>{
								Boolean(rowData.phone_num) ? rowData.phone_num : ''
							}</Text>
						</View>
						<Text style={[styles.contentText]}>{
							(Boolean(rowData.contacts_duty) ? rowData.contacts_duty : '') + keyPersonStr
						}</Text>
					</View>
				</View>
			</TouchableHighlight>
		)
	}
}

export class DefaultItem extends Component{
	constructor(props){
		super(props)

		this._itemClick = this._itemClick.bind(this)
	}

	_itemClick(){
		let { itemPress, rowData } = this.props
		if(typeof itemPress === 'function'){
			// isDefault 是否是没有联系人的情况
			itemPress({isDefault: true, data: null})
		} else {
			console.log('DefaultItem itemPress is not a function')
		}
	}

	render(){
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._itemClick}
				style={[styles.touchView]}
			>
				<View style={[styles.itemView, { justifyContent: 'center' }]}>
					<Text style={[styles.contentText]}>{
						'陌拜，没有联系人；或联系人信息不详。'
					}</Text>
				</View>
			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	touchView: {
		backgroundColor: '#fff',
		minHeight: 60,
	},
	itemView: {
		flex: 1,
		paddingTop: 15,
		paddingBottom: 15,
		marginLeft: distances.leftMargin,
		paddingRight: distances.leftMargin,
		borderColor: colors.borderColor,
		borderBottomWidth: distances.borderWidth,
	},
	bottomView: {
		paddingTop: 9,
		flexDirection: 'row',
		alignItems: 'center'
	},
	titleText: {
		color: '#333',
		fontSize: 15*fontScale,
	},
	contentText: {
		color: '#999',
		fontSize: 12*fontScale
	}
})