/**
 * create at 03/13/17
 * 其他列表，包括（审核中，审核驳回，未归档，执行中，即将到期，所有合同）
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, InteractionManager, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import {SearchInputText} from '../../../../components/search/Search'
import WrapLoading from '../../../../components/load/wraploading'
import Page from './OtherListPage'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadData} from '../../../../redux/modules/contract/otherListReducer'

// presenter
import {fetchContractOtherDataWithoutCache} from '../presenters/contractOtherPresenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {notification} from '../../../../constants/common'
import {handleContractsBody} from '../../../../constants/operation/contractManage'
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({
  loading: state.contractOther.loading,
  loading_success: state.contractOther.loading_success,
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
      let body = handleContractsBody(this.state.searchContent, this.props.routerData.code, '')
      // console.log('_loadLocationData body===>', body)
      let ret = await fetchContractOtherDataWithoutCache(body, '')()
      this.contracts = ret
      return true
    }catch(e){
      console.log('OtherList >>> _loadLocationData >>> e ===>', e)
      throw e
    }
  }

	// 点击搜索触发操作
  clickSearchBtn(searchResult){
    // console.log('searchResult===>', searchResult)
    this.props.myactions.loadData(this._loadData)
  }

	// 搜索框文字变换
  searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

  render(){
    return (
      <View style={{backgroundColor: colors.labBgColor, flex: 1}}>
        <SearchInputText placeText='搜索合同编号、企业名称' showText={this.state.searchContent} updateSearch={this.searchInputContent} 
          onSearchSubmit={this.clickSearchBtn} 
        />
        <WrapLoading {...this.props} onErrorPress={this.requestData}>
          <Page init_data={this.contracts} contractType={this.props.routerData.code} 
            searchContent={this.state.searchContent}
          />
        </WrapLoading>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContainerComponent)
