/**
 * create at 04/17/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, InteractionManager} from 'react-native'
import { Actions } from 'react-native-router-flux'

// 界面组件
import WrapLoading from '../../../components/load/wraploading'
import Page from './StoreListPage'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../redux/modules/look/storeList'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// presenter
import {fetchStoreWithoutCache} from '../presenters/storePresenter'

// common
import {LIST_ITEM_COUNT} from '../../../constants/default.config'
import {lookDateType} from '../../../constants/operation/lookManage'
import { getToday } from '../../../constants/operation/time'

const mapStateToProps = state => ({
  loading: state.lookStoreList.loading,
  loading_success: state.lookStoreList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class StoreList extends Component{
	constructor(props){
		super(props)

		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)
	}

	componentWillMount(){
		if(Boolean(this.props.routerData)){
			let {code, bodyData, dateType, dateTime} = this.props.routerData
			let rangeStr = 'month'
			if(dateType == lookDateType.day){
				rangeStr = 'day'
			}

			if(Boolean(bodyData.group_id)){
				// 组
				this.body = {
					_AT: Boolean(bodyData._AT) ? bodyData._AT : global.UserInfo.token,
					group_id: Boolean(bodyData.group_id) ? bodyData.group_id : [],
					date: dateTime,
					range: rangeStr,
					store_state: code,
					limit: LIST_ITEM_COUNT,
					next_key: ''
				}
			} else {
				// 成员
				let arr = []
				arr.push(global.UserInfo.user_id)
				this.body = {
					_AT: Boolean(bodyData._AT) ? bodyData._AT : global.UserInfo.token,
					am_id: Boolean(bodyData.am_id) ? bodyData.am_id : arr,
					date: dateTime,
					range: rangeStr,
					store_state: code,
					limit: LIST_ITEM_COUNT,
					next_key: ''
				}
			}
		}
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
      this._requestData()
    })
	}

	_requestData(){
		this.props.myactions.loadData(this._getLoad)
	}

	async _getLoad(){
		try{
			// console.log('body ===>', this.body)
			let ret = await fetchStoreWithoutCache(this.body, '')()
			this.data = ret
			return true
		}catch(e){
			throw e
		}
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
					<Page pageBody={this.body} init_data={this.data} 
						dateTime={Boolean(this.props.routerData) ? this.props.routerData.dateTime : getToday()}
						dateType={Boolean(this.props.routerData) ? this.props.routerData.dateType : lookDateType.month}
					/>
        </WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreList)