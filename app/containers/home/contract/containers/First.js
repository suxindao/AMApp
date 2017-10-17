/**
 * create at 03/06/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, InteractionManager, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import {SearchInputText} from '../../../../components/search/Search'
import Page from './FirstPage'
import WrapLoading from '../../../../components/load/wraploading'
import { NavBarRightImg } from '../../../../components/NavBar/NavBarWithoutLeft'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadData } from '../../../../redux/modules/contractFirstReducer'

// presenter
import {fetchContractFirstDataWithoutCache, handleContractList} from '../presenters/contractFirstPresenters'

// common js
import {notification} from '../../../../constants/common'

// style
import {colors, distances, fontScale, shadowStyles} from '../../../../constants/style'

const mapStateToProps = state => ({
  loading: state.contractFirst.loading,
  loading_success: state.contractFirst.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadData}, dispatch),
  dispatch,
})

class First extends Component{
  constructor(props){
    super(props)

    // data
    this.state = {
      searchContent: '',
    }
    this.contracts = [] // 合同列表

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
      let body = {
        _AT: global.UserInfo.token
      }
      let ret = await fetchContractFirstDataWithoutCache(body, '')()
      // console.log('ContractFirst >>> _loadLocationData >>> ret ===>', ret)
      this.contracts = await handleContractList(ret)
      return true
    }catch(e){
      console.log('ContractFirst >>> _loadLocationData >>> e ===>', e)
      throw e
    }
  }

	// 点击搜索触发操作
  clickSearchBtn(searchResult){
    // console.log('ContractFirst >>> clickSearchBtn >>> searchResult===>', searchResult)
    // 进入搜索页面
    Actions.contractSearchList({routerData: {searchText: this.state.searchContent}})
  }

	// 搜索框文字变换
  searchInputContent(content){
    this.setState({
      searchContent: content
    }) 
  }

  render(){
    return(
      <View style={{backgroundColor: colors.bgColor, flex: 1}} {...shadowStyles}>
        <NavBarRightImg title='合同' img={require('../../../../sources/images/contract/contract_add.png')} 
					rightFun={Actions.searchEnterprise} showRight={true}
				/>
        <SearchInputText placeText='搜索合同编号、企业名称' showText={this.state.searchContent} updateSearch={this.searchInputContent} 
          onSearchSubmit={this.clickSearchBtn} 
        />
        <WrapLoading {...this.props} onErrorPress={this.requestData}>
          <Page init_data={this.contracts}/>
        </WrapLoading>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(First)
