/**
 * create at 08/02/17
 */
import React, { Component } from 'react'
import { 
	Text, View, Image, TouchableHighlight, StyleSheet, ScrollView,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// components
import {TimeComponent} from '../components/filterScrollGroup/Common'
import Department from '../../../components/department'
import BottomComponent from '../components/filterScrollGroup/BottomComponent'

// presenters
import {fetchPageGetGroups} from '../presenters/pagePresenter'
// op common
import { manageShowName, departmentInitObj } from '../../../constants/operation/departmentManage'

// style
import {colors, distances, fontScale} from '../../../constants/style'

export default class LookScreenComponent extends Component{
	constructor(props){
		super(props)

		// data
		this.state = {
			pageRefresh: false,
			dateTime: ''
		}

		// request
		this._getGroupsData = this._getGroupsData.bind(this)
		// data
		this._initData = this._initData.bind(this)
		// click
		this.selectClick = this.selectClick.bind(this)
		// data back
		this._departmentBack = this._departmentBack.bind(this)
		this._datetimeBack = this._datetimeBack.bind(this)	
	}

	componentWillMount(){
		this._getGroupsData()
		this._initData()
	}

	_initData(){
		let {current_department, select_time} = this.props.routerData
		if(!Boolean(current_department)){
			// current_department为null, 赋值默认的结构
			this.departmentObj = _.cloneDeep(departmentInitObj)
		} else {
			this.departmentObj = _.cloneDeep(current_department)
		}
		if(Boolean(select_time)){
			this.setState({
				dateTime: select_time
			})
		}
	}

	async _getGroupsData(){
		try{
			let body = {
				_AT: global.UserInfo.token
			}
			let ret = await fetchPageGetGroups(body, '')()
			// console.log('_getGroupsData ret===>', ret)
			this.data = ret
			this.setState({
				pageRefresh: !this.state.pageRefresh
			})
		}catch(e){
			console.log('_getGroupsData e===>', e)
		}
	}

	_datetimeBack(date){
		this.setState({
			dateTime: date
		})
	}

	_departmentBack(resultObj){
		this.departmentObj = resultObj
	}

	selectClick(code){
		let {resultBack} = this.props.routerData
		let result
		if(code === 0){
			// 组织返回结果
			result = {
				code: 'reset',
			}
		} else {
			result = {
				code: 'confirm',
				departmentData: this.departmentObj,
				dateTime: this.state.dateTime
			}
		}
		if(typeof resultBack === 'function'){
			resultBack(result, this.data)
		} else {
			console.log('resultBack is not a function')
		}
		Actions.pop()
	}

	render(){
		return(
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<ScrollView bounces={false} style={{marginBottom: 50}}>
					<TimeComponent confirmPress={this._datetimeBack} 
						timeContent={this.state.dateTime}
					/>
					{
						(Array.isArray(this.data) && this.data.length > 0) ? 
						(
							<Department data={this.data} current_department={this.departmentObj} departmentBack={this._departmentBack}/>
						) 
						: null
					}
				</ScrollView>
				<BottomComponent selectTouch={this.selectClick} bottomStyle={{height: 50}}/>
			</View>
		)
	}
}
