/**
 * create at 06/27/17
 */
import React, { Component } from 'react'
import {
	 View, Text, TouchableHighlight, Image, StyleSheet, InteractionManager, ScrollView, 
} from 'react-native'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'

// components 
import DepartmentComponent from '../../../../components/department'
import {showTitleLable} from '../components/common'
import {TypePickerComponent} from '../components/ScreenComponents'
import {ConfirmButton} from '../../../../components/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// toast
import {toastShort} from '../../../../constants/toast'

// presenter
import {fetchPageGetGroups} from '../../../look/presenters/pagePresenter'

// op common
import { departmentInitObj } from '../../../../constants/operation/departmentManage'

const timeObj = {min: '', max: ''}

export default class ScreenPage extends Component{
	constructor(props){
		super(props)

		this.state = {
			pageRefresh: false,
		}

		// 时间
		this.timeData = _.cloneDeep(timeObj)
		// 部门
    this.department = _.cloneDeep(departmentInitObj)

		// request
		this._getGroups = this._getGroups.bind(this)
		// click
		this._confirmClick = this._confirmClick.bind(this)
		// function
		this._departmentBack = this._departmentBack.bind(this)
		this._timeBack = this._timeBack.bind(this)
	}

	componentWillMount(){
    if(this.props.routerData.oldScreen){
      let {oldScreen} = this.props.routerData
      // 赋值选过的状态
      if(oldScreen.timeData){
        this.timeData = _.cloneDeep(oldScreen.timeData)
      }
      if(oldScreen.department){
        // 给部门数据赋值
        this.department = _.cloneDeep(oldScreen.department)
      }
    } 
  }

	componentDidMount(){
    this._getGroups()
  }

  async _getGroups(){
    try{
      let body = {
				_AT: global.UserInfo.token
			}
			let ret = await fetchPageGetGroups(body, '')()
      this.data = ret
			// 是否显示部门
      this.showDepartment = (Array.isArray(ret) && ret.length > 0) ? true : false
      this.setState({
				pageRefresh: !this.state.pageRefresh
			})
    }catch(e){
      console.log('_getGroups e===>', e)
    }
  }

	// 部门返回
  _departmentBack(backObj){
    // 给部门数据赋值
    this.department = backObj
  }
	// 时间返回
	_timeBack(data){
		if(data.code == 'min'){
			if(this.timeData.max.length > 0){
				// 判断是否有结束时间
				if(data.date > this.timeData.max){
					// 开始时间不能大于结束时间
					toastShort('开始时间不能大于结束时间')
					return
				} else {
					this.timeData.min = data.date
				}
			} else {
				// 结束时间没设置则，可以直接置开始时间
				this.timeData.min = data.date
			}
		} else {
			if(this.timeData.min.length > 0){
				// 判断是否有开始时间
				if(data.date < this.timeData.min){
					// 结束时间不能小于结束时间
					toastShort('结束时间不能小于开始时间')
					return
				} else {
					this.timeData.max = data.date
				}
			} else {
				// 开始时间没设置则，可以直接置结束时间
				this.timeData.max = data.date
			}
		} 
		this.setState({
			pageRefresh: !this.state.pageRefresh
		})
	}
	_confirmClick(){
		let {screenBack} = this.props.routerData
		let {min, max} = this.timeData
		if(min.length > 0 && max.length == 0){
			// 选择开始时间但是没有选择结束时间
			toastShort('请选择一个结束时间哦')
			return
		}
		if(max.length > 0 && min.length == 0){
			// 选择结束时间但是没有选择开始时间
			toastShort('请选择一个开始时间哦')
			return 
		} 
		
    if(typeof screenBack === 'function'){
      screenBack({timeData: this.timeData, department: this.department}, this.data)
    }
    Actions.pop()
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<ScrollView style={styles.screenView} bounces={false}>
					{showTitleLable('时间')}
					<TypePickerComponent callBack={this._timeBack} 
						minValue={Boolean(this.timeData.min) ? this.timeData.min : ''} 
						maxValue={Boolean(this.timeData.max) ? this.timeData.max : ''}
					/>
					{ 
						this.showDepartment ? (
							<DepartmentComponent data={this.data} 
								current_department={this.department} 
								departmentBack={this._departmentBack}
							/>
						) : null 
					}
				</ScrollView>
				<ConfirmButton confirmPress={this._confirmClick}
					touchStyle={{marginLeft: 46/2, marginRight: 46/2}} confirmText='确认'
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	screenView: {
		backgroundColor: colors.labBgColor, 
	}
})