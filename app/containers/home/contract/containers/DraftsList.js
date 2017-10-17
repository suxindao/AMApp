/**
 * create at 03/13/17
 * 草稿箱列表
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, InteractionManager, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import {SearchInputText} from '../../../../components/search/Search'
import WrapLoading from '../../../../components/load/wraploading'
import Page from './DraftsListPage'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../../redux/modules/contract/draftsListReducer'

// presenter
import {searchDraftsData} from '../presenters/draftsPresenters'

// storage
import {loadAllDrafts} from '../../../../modules/storage/draftsHistory'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'
import {toastShort} from '../../../../constants/toast'
import {notification} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

const mapStateToProps = state => ({
  loading: state.contractDrafts.loading,
  loading_success: state.contractDrafts.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class ContainerComponent extends Component{
  constructor(props){
    super(props)

    // data
    this.state = {
      searchContent: '',
    }

    // function
		this.clickSearchBtn = this.clickSearchBtn.bind(this)
		this.searchInputContent = this.searchInputContent.bind(this)
    this.requestData = this.requestData.bind(this)
    this._loadData = this._loadData.bind(this)
    this._searchStorage = this._searchStorage.bind(this)
  }

  componentDidMount(){
    this.subscription = DeviceEventEmitter.addListener(notification.contractListNotify, ()=>{
      this.props.myactions.loadData(this._loadData)
    })
    InteractionManager.runAfterInteractions(() => {
      this.requestData()
    })
  }

  componentWillUnmount(){
    this.subscription.remove()
  }

  requestData(){
    this.props.myactions.loadData(this._loadData)
  }

  async _loadData(){
    try{
      let ret = await loadAllDrafts()
      // console.log('_loadLocationData ret===>', ret)
      this.contracts = ret
      return true
    }catch(e){
      console.log('DraftsList >>> _loadLocationData >>> e ===>', e)
      throw e
    }
  }

	// 点击搜索触发操作
  clickSearchBtn(searchResult){
    if(!searchResult) {
      toastShort('请输入搜索内容（不能为空格哦）。')
      return
    }
    // 去掉搜索字段中的 ‘_’
    this.searchResult = searchResult.replaceAll('_', '')
    this.props.myactions.loadData(this._searchStorage)
  }

  async _searchStorage(){
    try{
      let ret = await searchDraftsData(this.searchResult)
      console.log('_searchStorage ret===>', ret)
      this.contracts = ret
      return true
    }catch(e){
      console.log('_searchStorage e===>', e)
      throw e
    }
  }

	// 搜索框文字变换
  searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

  render(){
    return (
      <View style={{backgroundColor: colors.bgColor, flex: 1}}>
        {(()=>{
          return null
          // return (
          //   <SearchInputText placeText='搜索合同编号、企业名称' showText={this.state.searchContent} updateSearch={this.searchInputContent} 
          //     onSearchSubmit={this.clickSearchBtn} 
          //   />
          // )
        })()}
        <WrapLoading {...this.props} onErrorPress={this.requestData}>
          <Page init_data={this.contracts}/>
        </WrapLoading>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerComponent)