/**
 * create at 05/26/17
 * 
 * # 类似于iOS UIActionSheet组件
 */
import React, {Component} from 'react'
import {View, Image, Text, TouchableHighlight, StyleSheet} from 'react-native'

// 组件
import Base from './src/Base'

// style
import {colors, distances, fontScale} from '../../constants/style'

/**
 * props
 * ##整体
 * visiable bool, 控制 actionSheet显示和隐藏 (必须)
 * modalPress function , 浮层点击消失（必须）
 * itemPress function, item click (必须), 返回 index 或者 ‘cancel’ 
 * 
 * ##头部
 * hideTitle bool, 是否显示头部, 默认隐藏(非必须)
 * titleStyle style, 头部文字样式(非必须)
 * title string, 头部文字(非必须)
 * 
 * ##items
 * contentItems array, 列表内容，如['1', '2'](必须)
 * itemTextStyle style, item样式， 有默认样式（非必须）
 * itemSpecialIndex number, 特殊item索引，默认值-1，第一个item索引为0（非必须）
 * itemSpecialTextStyle style, 特殊item样式， （非必须）
 * 
 * ##cancel
 * cancelTextStyle style, cancel样式,(非必须)
 * cancelText string, cancel文字，默认‘取消’(非必须)
 */
export default class Container extends Component{
	constructor(props){
		super(props)

		// UI
		this.renderContent = this.renderContent.bind(this)
		this._renderItems = this._renderItems.bind(this)
		// click
		this._itemClick = this._itemClick.bind(this)
	}

	renderContent(){
		let {
			hideTitle = true, titleStyle = null, title = '', 
			contentItems = [], 
			cancelText = '取消', cancelTextStyle = null,
		} = this.props
		return(
			<View>
				{
					hideTitle ? null : 
					<View style={[styles.item, styles.titleView ]} onStartShouldSetResponder={()=> true}>
						<Text style={[styles.title, titleStyle]}>{title}</Text>
					</View>
				}
				{this._renderItems(contentItems, hideTitle)}
				<TouchableHighlight underlayColor={TouchItemTouchColor} style={[styles.item, styles.cancelView]}
					onPress={()=>this._itemClick('cancel')}
				>
					<Text style={[styles.itemText, cancelTextStyle]}>{cancelText}</Text>
				</TouchableHighlight>
			</View>
		)
	}

	_renderItems(items, isHideTitle){
		if(Array.isArray(items) && items.length > 0){
			let { 
				itemTextStyle = null, itemSpecialIndex = -1, itemSpecialTextStyle = null
			} = this.props
			return items.map((item, idx)=>{
				let hasBorderTopLine = true 	
				if(idx == 0 && isHideTitle){
					hasBorderTopLine = false
				}
				return(
					<TouchableHighlight key={idx} underlayColor={TouchItemTouchColor} onPress={()=>this._itemClick(idx)}
						style={[ styles.item, {borderColor: colors.borderColor},
							hasBorderTopLine ? {borderTopWidth: distances.borderWidth} : null,
							(idx == items.length - 1) ? styles.itemsLast : null,
							(idx == 0 && isHideTitle) ? styles.itemsFirst : null
						]}
					>
						<Text style={[
							styles.itemText, itemTextStyle,
							idx == itemSpecialIndex ? itemSpecialTextStyle : null
						]}>{item}</Text>
					</TouchableHighlight>
				)
			})
		}
		return null
	}

	_itemClick(key){
		// key items 中 key 是index, cancel中 key 是'cancel'
		let {itemPress} = this.props
		if(typeof itemPress === 'function'){
			itemPress(key)
		} else {
			console.log('itemPress is not function')
		}
	}

	render(){
		let {visible, modalPress} = this.props
		return(
			<Base 
				visible={visible}
				modalPress={modalPress}
				contentStyle={{justifyContent: 'flex-end'}}
				contentView={this.renderContent()}
			/>
		)
	}
}

const TouchItemTouchColor = '#fafafa'
const styles = StyleSheet.create({
	title: {
		fontSize:12*fontScale, 
		color:'#999'
	},
	item: {
		height: 50,
		backgroundColor: '#fff',
		alignItems: 'center',
    justifyContent:'center',
		marginLeft: 15, 
		marginRight: 15
	},
	itemText:{
		fontSize:17*fontScale, 
		color:'#007aff'
	},
	titleView: {
		borderTopLeftRadius:15,
    borderTopRightRadius:15,
	},
	cancelView: {
		borderRadius: 15,
		marginTop: 8, 
		marginBottom: 15,
	},
	itemsFirst: {
		borderTopLeftRadius:15,
    borderTopRightRadius:15,
	},
	itemsLast: {
		borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
	}
})