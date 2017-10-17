/**
 * create at 07/18/17
 */

import React, { Component } from 'react'
import { View, Text, Image, InteractionManager } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// 组件
import WrapLoading from '../../../../../components/load/wraploading'
import ListViewComponent from '../../../../../components/list/list'
import ListFoot from '../../../../../components/list/foot'
import { ListItem, DefaultItem } from '../../components/visit/VisitContactItem'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { 
	loadData, loadMoreData, reloadData 
} from '../../../../../redux/modules/home/store/visit/visitContactListReducer'
// presenter
import { fetchStoreContacts } from '../../presenters/activityVisitPresenter'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'
// common
import {LIST_ITEM_COUNT} from '../../../../../constants/default.config'
import {toastShort} from '../../../../../constants/toast'

const mapStateToProps = state => ({
	loading: state.visitContactList.loading,
	loading_success: state.visitContactList.loading_success,
  list_loading: state.visitContactList.list_loading,
  list_refresh: state.visitContactList.list_refresh,
	list_error: state.visitContactList.list_error
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({ loadData, loadMoreData, reloadData }, dispatch),
  dispatch,
})

class VisitContactList extends Component{
	constructor(props){
		super(props)

		this.storeId = 0

		// request
		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)
		this.loadMoreData = this.loadMoreData.bind(this)
    this.reloadData = this.reloadData.bind(this)
    this._getMore = this._getMore.bind(this)
    this._getReload = this._getReload.bind(this)
		// UI
		this._renderListRow = this._renderListRow.bind(this)
		this._renderFooter = this._renderFooter.bind(this)
		// click
		this._listRowClick = this._listRowClick.bind(this)
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
			this.storeId = (
				Boolean(this.props.routerData) && Boolean(this.props.routerData.id)
			) ? this.props.routerData.id : 0
			this._requestData()
    })
	}

	_requestData(){
		this.props.myactions.loadData(this._getLoad)
	}

	async _getLoad(){
		try{
			let body = {
				_AT: global.UserInfo.token,
				store_id: this.storeId,
				page: {
					limit: LIST_ITEM_COUNT,
					next_key: ''
				}
			}
			let ret = await fetchStoreContacts(body, '')()
			// console.log('ret===>', ret)
			this.data = ret
			return true
		}catch(e){
			console.log('_getLoad e===>', e)
			throw e
		}
	}

	loadMoreData(){
    let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    if (ended)
      return
    this.props.myactions.loadMoreData(this._getMore)
  }

  async _getMore(){
    try{
      let body = {
				_AT: global.UserInfo.token,
				store_id: this.storeId,
				page: {
					limit: LIST_ITEM_COUNT,
					next_key: Boolean(this.data.next_key) ? this.data.next_key : ''
				}
			}
      let ret = await fetchStoreContacts(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.list)){
        this.data.list = Boolean(ret.list) ? this.data.list.concat(ret.list) : this.data.list
      } 
      if(Boolean(this.data.next_key)){
        this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
      } 
      return true
    }catch(e){
      console.log('_getMore e===>', e)
      throw e
    }
  }

	reloadData(){
    this.props.myactions.reloadData(this._getReload)
  }

  async _getReload(){
    try{
      let body = {
				_AT: global.UserInfo.token,
				store_id: this.storeId,
				page: {
					limit: LIST_ITEM_COUNT,
					next_key: ''
				}
			}
      let ret = await fetchStoreContacts(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.list)){
        this.data.list = Boolean(ret.list) ? ret.list : this.data.list
      } 
      if(Boolean(this.data.next_key)){
        this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
      } 
      return true
    }catch(e){
      console.log('_getReload e===>', e)
      throw e
    }
  }

	_renderListRow(rowData, sectionID, rowID){
		return (
			<ListItem rowData={rowData} itemPress={this._listRowClick}/>
		)
	}

	_listRowClick(backObj){
		let { callback } = this.props.routerData
		let {isDefault, data} = backObj
		let contactbackObj = {
			isDefault: false,
			rowData: null
		}
		if(backObj && backObj.isDefault){
			// 0 陌拜情况
			contactbackObj.isDefault = true
			contactbackObj.rowData = null
		} else {
			// 有联系人
			contactbackObj.isDefault = false
			contactbackObj.rowData = (backObj && backObj.data) ? backObj.data : null
		}
		if(typeof callback === 'function'){
			callback(contactbackObj)
		} else {
			console.log('_listRowClick callback is not a function')
		}
		Actions.pop()
	}

	_renderFooter(){
    let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    return (
      <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this._loadMoreData}/>
    )
  }

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
          {
						Boolean(this.data) ? (
							<View style={{flex: 1, marginTop: 10}}>
								{
									(Array.isArray(this.data.list) && this.data.list.length > 0) ? (
										<ListViewComponent
											data={this.data.list}
											renderListRow={this._renderListRow}
											renderFooter={this._renderFooter}
											loadMoreData={this.loadMoreData}
											reloadLists={this.reloadData}
											loading={this.props.list_loading}
											refreshing={this.props.list_refresh}
											style={{flex: 1}}
										/>
									) : (
										<DefaultItem itemPress={this._listRowClick}/>
									)
								}
							</View>
						) : null
					}
      	</WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitContactList)