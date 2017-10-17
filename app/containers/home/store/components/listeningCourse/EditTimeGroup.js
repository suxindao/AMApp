/**
 * create at 04/26/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import DatePicker from 'react-native-datepicker'

// component function
import {groupContentLeft, showGroupTitle, middleShow, styles} from './editCommon'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

// common
import {toastShort} from '../../../../../constants/toast'

/**
 * 课程名称和开班人数
 */
export default class TimeSectionComponent extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {data, addPress, deletePress, timePress, confirmPress, editable} = this.props
		if(Array.isArray(data) && data.length > 0){
			return(
				<View>
					{
						data.map((item, idx)=>{
							return (
								<TimeGroup key={idx}
									dayContent={Boolean(item.select) ? item.select : ''}
									fromData={Boolean(item.min) ? item.min : ''}
									toData={Boolean(item.max) ? item.max : ''}
									addPress={addPress} timePress={timePress} deletePress={deletePress} index={idx}
									confirmPress={confirmPress} editable={editable}
								/>
							)
						})
					}
				</View>
			)
		}
		return null
	}
}

/**
 * 一组 Time组件
 */
export class TimeGroup extends Component{
	render(){
		let {
			dayContent, fromData, toData, addPress, timePress, confirmPress, deletePress, index, editable
		} = this.props
		let count = index+1
		return(
			<View>
				{showGroupTitle('试听时段'+count, editable, deletePress, index)}
				<View style={{
					backgroundColor: '#fff', borderColor: colors.borderColor, 
					borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
				}}>
					<DayGroup content={dayContent} touchPress={timePress} index={index} editable={editable}/>
					<TimeSection fromTime={fromData} toTime={toData} confirmPress={confirmPress} index={index} editable={editable}/>
					{ editable ? <AddGroup addPress={addPress} index={index}/> : null}
				</View>
			</View>
		)
	}
}
// 日组件
class DayGroup extends Component{
	constructor(props){
		super(props)

		this._touchClick = this._touchClick.bind(this)
	}

	_touchClick(){
		let {touchPress, index} = this.props
		touchPress('day', index)
	}

	render(){
		let {content, editable} = this.props
		if(editable){
			return (
				<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._touchClick}>
					<View style={[styles.groupContent, {marginLeft: distances.contractLeftMargin}]}>
						{groupContentLeft('日期')}
						{
							content.length > 0 ? (
								<Text style={{flex: 1, color: '#666', fontSize: 15*fontScale}}>{content}</Text>
							) : (
								<Text style={{flex: 1, color: '#ccc', fontSize: 15*fontScale}}>{'请选择'}</Text>
							)
						}
						<Image source={require('../../../../../sources/images/arrow_right.png')}/>
					</View>
				</TouchableHighlight>
			)
		} 
		return (
			<View style={[styles.groupContent, {marginLeft: distances.contractLeftMargin}]}>
				{groupContentLeft('日期')}
				{
					content.length > 0 ? (
						<Text style={{flex: 1, color: '#666', fontSize: 15*fontScale}}>{content}</Text>
					) : (
						<Text style={{flex: 1, color: '#ccc', fontSize: 15*fontScale}}>{'请选择'}</Text>
					)
				}
			</View>
		)
	}
}
// 时间选择组件
class TimeSection extends Component{
	render(){
		let {fromTime, toTime, confirmPress, index, editable} = this.props
		return (
			<View style={[
				styles.groupContent,
				{marginLeft: distances.contractLeftMargin, borderBottomWidth: 0}
			]}>
				{groupContentLeft('时间')}
				<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
					<SelectItem content={fromTime} code='from' confirmPress={confirmPress} index={index} editable={editable}/>
					{middleShow('至')}
					<SelectItem content={toTime} code='to' confirmPress={confirmPress} index={index} editable={editable}/>
				</View>
			</View>
		)
	}
}
class SelectItem extends Component{
	constructor(props){
		super(props)

		this._selectClick = this._selectClick.bind(this)
	}

	_selectClick(date){
		let {confirmPress, code, index} = this.props
		confirmPress(code, index, date)
	}

	render(){
		let {content, editable} = this.props
		return (
      <DatePicker
        style={{
					width: 60, height: 40, backgroundColor: colors.labBgColor, borderWidth: 0, borderRadius: 4,
				}}
				customStyles={{
					dateInput:{
						borderWidth: 0
					},
					dateText:{
						color: '#666'
					},
					btnTextCancel:{
						color: colors.blueColor
					},
					btnTextConfirm:{
						color: colors.blueColor
					}
				}}
				disabled={!editable}
        date={content ? content: ''}
        mode="time"
        placeholder="请选择"
        format="HH:mm"
        minDate="0:00"
        maxDate="23:59"
				showIcon={false}
        confirmBtnText="确认"
        cancelBtnText="取消"
        onDateChange={this._selectClick}
      />
    )
	}
}
// 添加组件
class AddGroup extends Component{
	constructor(props){
		super(props)

		this._addClick = this._addClick.bind(this)
	}

	_addClick(){
		let {addPress, index} = this.props
		addPress(index)
	}

	render(){
		return (
			<TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._addClick} style={{
				height: 60, justifyContent: 'center', alignItems: 'center', 
				borderColor: colors.borderColor, borderTopWidth: distances.borderWidth,
			}}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Image source={require('../../../../../sources/images/store/add_contacts.png')}/>
					<Text style={{marginLeft: 10, color: colors.blueColor, fontSize: 16*fontScale}}>添加时段</Text>
				</View>
			</TouchableHighlight>
		)
	}
}