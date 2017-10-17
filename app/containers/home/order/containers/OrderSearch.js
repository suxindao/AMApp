/**
 * create at 06/23/17
 */
import React, { Component } from 'react'
import { View, Text, Image, InteractionManager } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 界面组件
import WrapLoading from '../../../../components/load/wraploading'
import Page from './OrderSearchPage'
import {SearchInputText} from '../../../../components/search/Search'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../../redux/modules/home/order/referOrderSearchReducer'

// presenter
import {fetchReferOrderList} from '../presenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({
  loading: state.referOrderSearch.loading,
  loading_success: state.referOrderSearch.loading_success
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class SearchContainer extends Component{
	constructor(props){
		super(props)

		this.searchName = '' // 搜索提交
    this.state = {
      searchContent: '', // 界面搜索变化
    }

		// click
		this._searchInputContent = this._searchInputContent.bind(this)
		this._clickSearchBtn = this._clickSearchBtn.bind(this)

		// request
		this._requestData = this._requestData.bind(this)
		this._getLoad = this._getLoad.bind(this)
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
			let body = {
				_AT: global.UserInfo.token,
				keyword: this.searchName,
				page:{
					next_key: '',
					limit: LIST_ITEM_COUNT
				}
			}
			let ret = await fetchReferOrderList(body, '')()
			this.data = ret
			return true
		}catch(e){
			console.log('_getLoad e===>', e)
			throw e
		}
	}

	// 点击搜索触发操作
  _clickSearchBtn(searchResult){
		this.searchName = searchResult
		this._requestData()
  }
	// 搜索框文字变换
  _searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

	render(){
		return(
			<View style={{flex: 1, backgroundColor: colors.labBgColor}}>
				<SearchInputText placeText='请输入门店名或订单编号' showText={this.state.searchContent} 
					updateSearch={this._searchInputContent} 
          onSearchSubmit={this._clickSearchBtn} 
        />
				<WrapLoading {...this.props} onErrorPress={this._requestData}>
					<Page init_data={this.data} searchName={this.searchName}/>
				</WrapLoading>
			</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer)