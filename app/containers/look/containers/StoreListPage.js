/**
 * create at 04/17/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, Linking} from 'react-native'
import { Actions } from 'react-native-router-flux'

import _ from 'lodash'

// 组件
import ListView from '../../../components/list/list'
import ListFoot from '../../../components/list/foot'
import ListItem from '../components/StoreItem'
import ListNoData from '../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {loadMoreData, reloadData} from '../../../redux/modules/look/storeList'

// presenter
import {fetchStoreWithoutCache} from '../presenters/storePresenter'

// style
import {colors, distances, fontScale} from '../../../constants/style'

// common
import {LIST_ITEM_COUNT} from '../../../constants/default.config'

const mapStateToProps = state => ({
  list_loading: state.lookStoreList.list_loading,
  list_refresh: state.lookStoreList.list_refresh,
	list_error: state.lookStoreList.list_error,
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
    return (
      <ListItem rowData={rowData} index={rowID} 
        length={Boolean(this.listLength) ? this.listLength : 0}
        dateType={this.props.dateType}
        dateTime={this.props.dateTime}
      />
    )
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
      let body = _.cloneDeep(this.props.pageBody)
      body.next_key = Boolean(this.data.next_key) ? this.data.next_key : ''
      let ret = await fetchStoreWithoutCache(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.stores)){
        this.data.stores = Boolean(ret.stores) ? this.data.stores.concat(ret.stores) : this.data.stores
      } 
      if(Boolean(this.data.next_key)){
        this.data.next_key = Boolean(ret.next_key) ? ret.next_key : ''
      } 
      // console.log('_getMore this.data===>', this.data)
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
      let body = _.cloneDeep(this.props.pageBody)
      body.next_key = ''
      let ret = await fetchStoreWithoutCache(body, '')()
      if(typeof this.data.ended === 'boolean'){
        this.data.ended = ret.ended 
      } 
      if(Boolean(this.data.stores)){
        this.data.stores = Boolean(ret.stores) ? ret.stores : this.data.stores
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
    let {init_data, pageBody} = this.props
		if(Boolean(init_data)){
      this.data = init_data
      if(Array.isArray(this.data.stores) && this.data.stores.length > 0){
				this.listLength = this.data.stores.length
        return (
          <View style={{flex: 1}}>
            <ListView
              data={this.data.stores}
              renderListRow={this.renderListRow}
              renderFooter={this.renderFooter}
              loadMoreData={this.loadMoreData}
              reloadLists={this.reloadData}
              loading={this.props.list_loading}
              refreshing={this.props.list_refresh}
              style={{flex: 1, marginTop: 10}}
            />
          </View>
        )
      }
      return (
        <ListNoData visible={true} icon={require('../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
      )
    }
    return null
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)