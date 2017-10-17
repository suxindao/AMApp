/**
 * create at 04/19/17
 */
import React, {Component} from 'react'
import {View, Image, Text, TouchableHighlight} from 'react-native'

// 组件
import Base from './src/Base'

// style
import {colors, distances, fontScale} from '../../constants/style'

const borderRadius = 11

export default class TelComponent extends Component{
	constructor(props){
		super(props)

		this.renderContent = this.renderContent.bind(this)
		this.selectClick = this.selectClick.bind(this)
	}

	selectClick(code){
		let {tel, selectPress} = this.props
		if(code == 'cancel'){
			selectPress(code, tel)
		} else if(code == 'dial'){
			selectPress(code, tel)
		} else {
			console.log('code is null')
		}
	}

	renderContent(){
		let {tel} = this.props
		return(
			<View style={{
				marginLeft: 50, marginRight: 50, borderRadius: borderRadius, backgroundColor: '#fff'
			}}>
				<View style={{justifyContent: 'center', alignItems: 'center', height: 50}}>
					<Text style={{color: '#333', fontSize: 18*fontScale, fontWeight: 'bold'}}>{tel}</Text>
				</View>
				<View style={{
					flexDirection: 'row', height: 52, 
					borderColor: colors.borderColor, borderTopWidth: distances.borderWidth,
					borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius
				}}>
					<TouchItem code='cancel' title='取消' itemPress={this.selectClick}/>
					<View style={{backgroundColor: colors.borderColor, width: distances.borderWidth}}/>
					<TouchItem code='dial' title='拨号' itemPress={this.selectClick}/>
				</View>
			</View>
		)
	}

	render(){
		let {visible, modalPress} = this.props
		return(
			<Base 
				visible={visible}
				modalPress={modalPress}
				contentStyle={{justifyContent: 'center'}}
				contentView={this.renderContent()}
			/>
		)
	}
}

class TouchItem extends Component{
	constructor(props){
		super(props)

		this.itemClick = this.itemClick.bind(this)
	}

	itemClick(){
		let {code, itemPress} = this.props
		itemPress(code)
	}

	render(){
		let {title, code} = this.props
		return(
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this.itemClick}
				style={[
					{flex: 1, justifyContent: 'center', alignItems: 'center'},
					code == 'cancel' ? {borderBottomLeftRadius: borderRadius} : null,
					code == 'dial' ? {borderBottomRightRadius: borderRadius} : null
			]}>
				<Text style={{color: '#007aff', fontSize: 18*fontScale}}>{title}</Text>
			</TouchableHighlight>
		)
	}
}
