/**
 * create at 04/25/17
 */
import React, { Component } from 'react';
import { Text, Image, TouchableHighlight, View, ScrollView } from 'react-native'
import Picker from 'react-native-picker'
import Modal from 'react-native-root-modal';

// 组件
import Base from './src/Base'

// style
import {colors, distances, fontScale} from '../../constants/style'

export default class PickerModal extends Component{
	constructor(props){
		super(props)

		this._renderContentView = this._renderContentView.bind(this)
		this.modalTouch = this.modalTouch.bind(this)
		this._pickerShow = this._pickerShow.bind(this)
	}

	componentWillUnmount(){
		Picker.hide()
	}

	_pickerShow(){
		let {visible, pickersData, confirmPress, code, index} = this.props
		if(visible){
			Picker.init({
				pickerCancelBtnText: '取消',
				pickerConfirmBtnText: '确认',
				pickerTitleText: '请选择',
				pickerConfirmBtnColor: [115, 177, 250, 1],
				pickerCancelBtnColor: [115, 177, 250, 1],
				pickerToolBarBg: [255, 255, 255, 1],
				pickerBg: [255, 255, 255, 1],
				//传入的初始数据可供选择
				pickerData: pickersData,
				//进入picker后的当前选择项，为空则从第一个加载
				selectedValue: [],
				onPickerConfirm: data => {
					confirmPress(code, index, data)
					this.modalTouch()
				},
				onPickerCancel: data => {
					this.modalTouch()
				}
			});
			Picker.show();
		}
	}

	modalTouch(){
		let {code, modalPress} = this.props
		Picker.hide()
    modalPress(code)
  }

	_renderContentView(){
		return(
			<View>
				{this._pickerShow()}
			</View>
		)
	}

	render(){
		let {visible, modalPress} = this.props
		return(
			<Base 
				visible={visible}
				modalPress={this.modalTouch}
				contentStyle={{justifyContent: 'flex-end'}}
				contentView={this._renderContentView()}
			/>
		)
	}
}