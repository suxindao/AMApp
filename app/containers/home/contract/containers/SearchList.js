/**
 * create at 03/09/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, InteractionManager } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import {SearchView, SearchInputText} from '../../../../components/search/Search'
import Page from './SearchListPage'
import WrapLoading from '../../../../components/load/wraploading'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../../redux/modules/contract/searchListReducer'

// presenter
import {fetchContractSearchDataWithoutCache} from '../presenters/searchPresenters'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const mapStateToProps = state => ({
  loading: state.contractSearch.loading,
  loading_success: state.contractSearch.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class Container extends Component{
  constructor(props){
    super(props)

    // data
    this.state = {
      searchContent: '',
    }

    this.contracts = []

    // function
		this.clickSearchBtn = this.clickSearchBtn.bind(this)
		this.searchInputContent = this.searchInputContent.bind(this)
    this.requestData = this.requestData.bind(this)
    this._loadData = this._loadData.bind(this)
  }

  componentWillMount(){
    if(Boolean(this.props.routerData) && Boolean(this.props.routerData.searchText)){
      // 上一个界面带入的搜索条件
      this.searchInputContent(this.props.routerData.searchText)
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.requestData()
    })
  }

  requestData(){
    this.props.myactions.loadData(this._loadData)
  }

  async _loadData(){
    try{
      let body = {
        _AT: global.UserInfo.token,
        codeOrName: this.state.searchContent,
        page:{
          limit: LIST_ITEM_COUNT,
          next_key: ''
        }
      }
      let ret = await fetchContractSearchDataWithoutCache(body, '')()
      this.contracts = ret
      return true
    }catch(e){
      console.log('SearchList >>> _loadLocationData >>> e ===>', e)
      throw e
    }
  }

	// 点击搜索触发操作
  clickSearchBtn(searchResult){
    // console.log('SearchList >>> clickSearchBtn >>> searchResult===>', searchResult)
    this.props.myactions.loadData(this._loadData)
  }

  // 搜索框文字变换
  searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

  render(){
    return(
      <View style={{backgroundColor: colors.bgColor, flex: 1}}>
        <SearchInputText placeText='搜索合同编号、企业名称' showText={this.state.searchContent} updateSearch={this.searchInputContent} 
          onSearchSubmit={this.clickSearchBtn}
        />
        <WrapLoading {...this.props} onErrorPress={this.requestData}>
          <Page init_data={this.contracts} searchContent={this.state.searchContent}/>
        </WrapLoading>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)