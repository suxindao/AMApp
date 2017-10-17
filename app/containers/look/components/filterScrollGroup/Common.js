/**
 * create at 08/03/17
 */
import React, {Component} from 'react'
import {
	View, Text, Image, TouchableHighlight, ScrollView, PixelRatio, StyleSheet
} from 'react-native'

// components
import {DatePickerComponent} from '../../../../components/common/DatePickerCommon'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {getToday, getTargetDay} from '../../../../constants/operation/time'

export class TimeComponent extends Component{
	render(){
		let {timeContent = '', confirmPress = ()=>null} = this.props
		return(
			<View style={styles.timeView}>
				<TitleComponent title='统计时间'/>
				<SelectItem content={timeContent} confirmPress={confirmPress}/>
			</View>
		)
	}
}

/**
 * 标题
 */
class TitleComponent extends Component{
	render(){
		let {title} = this.props
		return(
			<View style={styles.titleView}>
				<Text style={styles.titleText}>{title}</Text>
			</View>
		)
	}
}

/**
 * 自定义时间
 */
class SelectItem extends Component{
	constructor(props){
		super(props)

		this._selectClick = this._selectClick.bind(this)
	}

	_selectClick(date){
		let {confirmPress} = this.props
		if(typeof confirmPress === 'function'){
			confirmPress(date)
		} else {
			console.log('confirmPress is not function')
		}
	}

	render(){
		// 获取当前时间
		let nowDate = getToday()
		// 获取当前时间前三个月时间
		let beforeDate = getTargetDay(-3)
		let {content, styleDate = null} = this.props
		return (
			<DatePickerComponent 
				styleDate={styles.dateContainer}
				content={content} confirmText='确认' cancelText='取消'
				dateTextColor='#333' 
				placeholder='请选择'
				minDate={beforeDate}
				maxDate={nowDate}
				cancelTextColor={colors.blueColor} confirmTextColor={colors.blueColor}
				confirmPress={this._selectClick}
			/>
		)
	}
}

const styles = StyleSheet.create({
	timeView: {
		paddingLeft: distances.contractLeftMargin,
		paddingTop: 10,
		paddingBottom: 10,
	},
	titleView: {
		paddingBottom: 10
	},
	titleText: {
		color: '#999', 
		fontSize: 12*fontScale
	},
	dateContainer: {
		width: 100, 
		height: 74/2, 
		backgroundColor: '#fff', 
		borderWidth: 0, 
		borderRadius: 6 / PixelRatio.get(), 
		justifyContent: 'center', 
		alignItems: 'center'
	}
})