/**
 * create at 08/07/17
 */
import React, { Component } from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// components
import ScrollGroupComponet from '../../../components/common/ScrollGroupComponent'
import { ConfirmButton } from '../../../components/common'

// style
import {colors, distances, fontScale} from '../../../constants/style'
// verify
import {verifyFunction} from '../../../constants/utils/validate'
// toast
import {toastShort} from '../../../constants/toast'

const init_types = [
	{name: '全部', id: 0},
	{name: '分期', id: 3},
	{name: '直通车', id: 4},
	// {name: '推广', id: 5}
]

export default class ScreenComponent extends Component{
	constructor(props){
		super(props)

		// data
		this.state = {
			selectType: {}
		}
		this.allTypes = _.cloneDeep(init_types)

		// click
		this._itemClick = this._itemClick.bind(this)
		this._confirmBack = this._confirmBack.bind(this)
	}

	componentWillMount(){
		let {oldTypeObj} = this.props.routerData
		if(oldTypeObj){
			this.setState({
				selectType: {
					id: Boolean(oldTypeObj.id) ? oldTypeObj.id : 0,
					name: Boolean(oldTypeObj.name) ? oldTypeObj.name : ''
				}
			})
		}
	}

	_itemClick(code, data){
		this.setState({
			selectType: {
				id: Boolean(data.id) ? data.id : 0,
				name: Boolean(data.name) ? data.name : ''
			}
		})
	}

	_confirmBack(){
		let {comfirmBack} = this.props.routerData
		let {selectType} = this.state
		// check
		if(!(typeof selectType.id === 'number')){
			toastShort('请至少选择一个类型哦')
			return
		}
		if(verifyFunction(comfirmBack, 'look signStoreList', 'comfirmBack')){
			comfirmBack(selectType)
		}
		Actions.pop()
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<View style={{height: 15}}/>
				<ScrollGroupComponet title='签约类型' data={this.allTypes}
					itemBtnPress={this._itemClick} code='' currentItem={this.state.selectType}
					num={3}
				/>
				<View style={{flex: 1}}/>
				<ConfirmButton confirmPress={this._confirmBack}
          touchStyle={{marginLeft: 46/2, marginRight: 46/2}} confirmText='确认'
        />
			</View>
		)
	}
}