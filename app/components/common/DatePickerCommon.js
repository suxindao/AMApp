/**
 * Create at 06/27/17
 * 公用的时间组件
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet, PixelRatio } from 'react-native';
import DatePicker from 'react-native-datepicker'

// style
import {colors, distances, fontScale} from '../../constants/style'

/**
 * 日期选择通用组件
 * params:
 * 		content, string, 日期编辑内容
 * 		confirmText, string, 确认按钮文字
 * 		cancelText, string, 取消按钮文字
 * 		showIcon, boolean, 是否显示日期 icon
 * 		disabled, boolean, 是否可编辑
 * 		styleDate, style, DatePickerComponent 样式
 * 		dateTextColor, string, 每一条date text color
 * 		cancelTextColor, string, 取消按钮 text color
 * 		confirmTextColor, string, 确认按钮 text color
 * 		confirmPress, function, 确认 点击 function
 */
export class DatePickerComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {
			content = '', confirmText = '', cancelText = '', showIcon = false, disabled = false,
			styleDate = null, dateTextColor = '#333', 
			minDate = '1970-01-01', maxDate = '2100-12-31', placeholder = '年-月-日',
			cancelTextColor = '#333', confirmTextColor = '#333',
			confirmPress = ()=>null,
		} = this.props
		return (
      <DatePicker
        style={[
					styleDate
				]}
				customStyles={{
					dateInput:{
						borderWidth: 0
					},
					dateText:{
						color: dateTextColor
					},
					btnTextCancel:{
						color: cancelTextColor
					},
					btnTextConfirm:{
						color: confirmTextColor
					}
				}}
				disabled={disabled}
        date={content ? content: ''}
        mode="date"
        placeholder={placeholder}
        format={"YYYY-MM-DD"}
				minDate={minDate}
				maxDate={maxDate}
				showIcon={showIcon}
        confirmBtnText={confirmText}
        cancelBtnText={cancelText}
        onDateChange={confirmPress}
      />
    )
	}
}