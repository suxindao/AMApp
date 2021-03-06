/**
 * create at 03/09/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import ListView from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListItem from '../components/OtherItem'
import ListNoData from '../../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadMoreData, reloadData} from '../../../../redux/modules/contract/searchListReducer'

// presenter
import {fetchContractSearchDataWithoutCache} from '../presenters/searchPresenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({
  list_loading: state.contractSearch.list_loading,
  list_refreshing: state.contractSearch.list_refresh,
  list_error: state.contractSearch.list_error
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadMoreData, reloadData}, dispatch),
  dispatch,
})

class Page extends Component{
  constructor(props){
    super(props)

    // UI
    this.renderListRow = this.renderListRow.bind(this)
    this.renderFooter = this.renderFooter.bind(this)

    // Function
    this.loadMoreData = this.loadMoreData.bind(this)
    this.reloadData = this.reloadData.bind(this)
    this._getMore = this._getMore.bind(this)
    this._getReload = this._getReload.bind(this)
  }

  renderListRow(rowData, sectionID, rowID){
    return <ListItem rowData={rowData} />
  }

  renderFooter(){
    let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    return (
      <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreData}/>
    )
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
        codeOrName: this.props.searchContent,
        page:{
          limit: LIST_ITEM_COUNT,
          next_key: Boolean(this.data.next_key) ? this.data.next_key : ''
        }
      }
      let ret = await fetchContractSearchDataWithoutCache(body, '')()
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
        codeOrName: this.props.searchContent,
        page:{
          limit: LIST_ITEM_COUNT,
          next_key: ''
        }
      }
      let ret = await fetchContractSearchDataWithoutCache(body, '')()
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

  render(){
    if(Boolean(this.props.init_data)){
      this.data = this.props.init_data
      // console.log('OtherListPage >>> this.data ===>', this.data)
      if(Array.isArray(this.data.list) && this.data.list.length > 0){
        return (
          <ListView
            data={this.data.list}
            renderListRow={this.renderListRow}
            renderFooter={this.renderFooter}
            loadMoreData={this.loadMoreData}
            reloadLists={this.reloadData}
            loading={this.props.list_loading}
            refreshing={this.props.list_refreshing}
            style={{flex: 1, backgroundColor: colors.bgColor}}
          />
        )
      }
      return (
        <ListNoData visible={true} icon={require('../../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
      )
    }
    return null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)