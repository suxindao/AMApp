/**
 * create at 04/13/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView} from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * 本月新签激活门店、本月冰冻激动门店、本月非活跃门店 item
 */
export default class StoreItem extends Component{
	constructor(props){
		super(props)

		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {code, itemTouch} = this.props
		itemTouch(code)
	}

	render(){
		let {title, content} = this.props
		return(
			<View style={{marginBottom: 10}}>
				<TouchableHighlight 
					onPress={this.itemClick} underlayColor={colors.touchBgColor}
					style={{
						height: 55, backgroundColor: '#fff', justifyContent: 'center',
						borderColor: colors.borderColor, borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
					}}
				>
					<View style={{
						marginLeft: distances.contractLeftMargin, flexDirection: 'row', alignItems: 'center'
					}}>
						<Text style={{flex: 1, textAlign: 'left', color: '#333', fontSize: 15*fontScale, fontWeight: 'bold'}}>{title}</Text>
						<Text style={{color: colors.blueColor, fontSize: 15*fontScale}}>{content}</Text>
						<Image style={{marginLeft: 15, marginRight: distances.contractLeftMargin}} source={require('../../../../sources/images/arrow_right.png')}/>
					</View>
				</TouchableHighlight>
			</View>
		)
	}
}