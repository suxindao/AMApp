/**
 * create at 05/25/17
 */
import React, { Component } from 'react'
import { View, Text, Image, InteractionManager } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// 界面组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './ContactListPage'
import {SearchInputText} from '../../../../components/search/Search'
import {NavBarRightImg} from '../../../../components/NavBar/NavBarWithoutLeft'
import ActionSheet from '../../../../components/modal/ActionSheet'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadData } from '../../../../redux/modules/home/contact/contactsReducer'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// presenters 
import {fetchContactsData} from '../presenters'
import {fetchPageGetGroups} from '../../../look/presenters/pagePresenter'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'
// op common
import {manageRequestBody} from '../../../../constants/operation/departmentManage'
 
const mapStateToProps = state => ({
  loading: state.contactsList.loading,
  loading_success: state.contactsList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class ContactList extends Component{
	constructor(props){
		super(props)

		// data
		this.showRightBar = false
		this.oldScreen = null // 记录选过的筛选条件
		this.body = {
			_AT: global.UserInfo.token,
			am_id: null,
			group_id: null,
			name: '',
			page: {
				limit: LIST_ITEM_COUNT,
				next_key: ''
			}
		}
    this.state = {
      searchContent: '',
    }

		// request
		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)

		// function
		this._searchInputContent = this._searchInputContent.bind(this)
		this._clickSearchBtn = this._clickSearchBtn.bind(this)
		this._handleRightClick = this._handleRightClick.bind(this)
		this._screenBack = this._screenBack.bind(this)
	}

	componentDidMount(){
		InteractionManager.runAfterInteractions(() => {
			// 第一次加载时am_id和group_id都不传就是看全部的
			this._requestData()
    })
	}

	_handleRightClick(){
		Actions.contactsScreenPage({routerData: {
			departmentRet: this.departmentRet, 
			screenBack: this._screenBack,
			oldScreen: this.oldScreen
		}})
	}

	_screenBack(screenObj){
		let {department} = screenObj
		// 记录已经选过的筛选条件
		this.oldScreen = _.cloneDeep(screenObj)
		let newBody = _.cloneDeep(this.body)
		// 处理部门
		if(department){
			let {code, body, error_msg} = manageRequestBody(newBody, department, this.departmentRet)
			if(Boolean(code) && Boolean(body)){
				newBody = body
			} else {
				console.log('filterBack error===>', error_msg)
			}
		}
		this.body = newBody
		this._requestData()
	}

	// 点击搜索触发操作
  _clickSearchBtn(searchResult){
		this.body.name = searchResult
		this._requestData()
  }

	// 搜索框文字变换
  _searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

	_requestData(){
		this.props.myactions.loadData(this._getLoad)
	}

	async _getLoad(){
		try{
			let body2 = {
				_AT: global.UserInfo.token
			}
			let ret = await Promise.all([
				fetchContactsData(this.body, '')(),
				fetchPageGetGroups(body2, '')()
			])
			if(Array.isArray(ret) && ret.length > 1){
				this.data = ret[0]
				this.showRightBar = (Array.isArray(ret[1]) && ret[1].length > 0) ? true : false
				this.departmentRet = ret[1]
			}
			return true
		}catch(e){
			console.log('_getLoad e===>', e)
			throw e
		}
	}

	render(){
		return (
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<NavBarRightImg title='联系人' img={require('../../../../sources/images/home/navbar_mores.png')} 
					rightFun={this._handleRightClick} showRight={this.showRightBar}
				/>
				<SearchInputText placeText='输入门店名' showText={this.state.searchContent} 
					updateSearch={this._searchInputContent} 
          onSearchSubmit={this._clickSearchBtn} 
        />
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
          <Page init_data={this.data} bodyParam={this.body}/>
        </WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)