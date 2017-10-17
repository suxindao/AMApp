/**
 * create at 07/14/17
 */
import React, { Component } from 'react'
import { 
	View, Text, TouchableHighlight, Image, StyleSheet, InteractionManager, ScrollView
} from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// components
import DepartmentComponent from '../../../../components/department'
import {ConfirmButton} from '../../../../components/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common op
import {
	departmentInitObj
} from '../../../../constants/operation/departmentManage'

export default class ContactsScreenPage extends Component{
	constructor(props){
		super(props)

		// click
		this._confirmClick = this._confirmClick.bind(this)
		// function
		this._departmentBack = this._departmentBack.bind(this)
	}

	// 部门返回
  _departmentBack(backObj){
    // 给部门数据赋值
    this.department = backObj
  }

	_confirmClick(){
		let {screenBack} = this.props.routerData
		if(typeof screenBack === 'function'){
      screenBack({department: this.department})
    }
    Actions.pop()
	}

	render(){
		let {departmentRet, oldScreen} = this.props.routerData
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<ScrollView bounces={false}>
					<DepartmentComponent data={departmentRet} 
						current_department={oldScreen ? oldScreen.department : _.cloneDeep(departmentInitObj)} 
						departmentBack={this._departmentBack}
					/>
				</ScrollView>
				<ConfirmButton confirmPress={this._confirmClick}
					touchStyle={{marginLeft: 46/2, marginRight: 46/2}} confirmText='确认'
				/>
			</View>
		)
	}
}