/**
 * create at 05/25/17
 */
import React, { Component } from 'react'
import { View, Text, Image, Linking } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// components
import ListViewComponent from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListNoData from '../../../../components/list/NoData'
import ListItem from '../components/ContactItem'
import ActionSheet from '../../../../components/modal/ActionSheet'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadMoreData, reloadData } from '../../../../redux/modules/home/contact/contactsReducer'

// presenters 
import {fetchContactsData} from '../presenters'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({
  list_loading: state.contactsList.list_loading,
  list_refresh: state.contactsList.list_refresh,
	list_error: state.contactsList.list_error
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({loadMoreData, reloadData}, dispatch),
  dispatch,
})

class Page extends Component{
	constructor(props){
		super(props)

    this.tels = []
    this.currentTel = ''

    this.state = {
      showActionSheet: false
    }

		// UI
    this.renderListRow = this.renderListRow.bind(this)
    this.renderFooter = this.renderFooter.bind(this)

    // Function
    this.loadMoreData = this.loadMoreData.bind(this)
    this.reloadData = this.reloadData.bind(this)
    this._getMore = this._getMore.bind(this)
    this._getReload = this._getReload.bind(this)

    // click
    this._itemClickCallBack = this._itemClickCallBack.bind(this)
    this._actionShow = this._actionShow.bind(this)
    this._actionHide = this._actionHide.bind(this)
    this._actionItem = this._actionItem.bind(this)
	}

  _actionShow(){
    this.setState({
      showActionSheet: true
    })
  }
  _actionHide(){
    this.setState({
      showActionSheet: false
    })
  }
  _actionItem(key){
    if(key !== 'cancel'){
      let url = "tel:" + this.currentTel
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
            return Linking.openURL(url);
        }
      }).catch( err => {
        console.error('An error occurred', err)
      })
    }
    this._actionHide()
  }

	renderListRow(rowData, sectionID, rowID){
		return (
      <ListItem rowData={rowData} itemPress={this._itemClickCallBack} 
        length={this.listLength} index={rowID}
      />
		)
	}

	_itemClickCallBack(rowData){
    // 初始化为空数组
    this.tels = []
		this.currentTel = Boolean(rowData.phone_num) ? rowData.phone_num : ''
    this.tels.push(this.currentTel)
    // 展示
    this._actionShow()
	}

	renderFooter(){
    let ended = (typeof this.data.ended === 'boolean' && this.data.ended) ? true : false
    return (
      <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this._loadMoreData}/>
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
      let {bodyParam} = this.props
      let body = _.cloneDeep(bodyParam)
      body.page.next_key = Boolean(this.data.next_key) ? this.data.next_key : ''
      let ret = await fetchContactsData(body, '')()
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
      let {bodyParam} = this.props
      let body = _.cloneDeep(bodyParam)
      body.page.next_key = ''
      let ret = await fetchContactsData(body, '')()
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
    let {init_data} = this.props
		if(Boolean(init_data)){
      this.data = init_data
      if(Array.isArray(this.data.list) && this.data.list.length > 0){
        this.listLength = this.data.list.length
        return (
          <View style={{flex: 1}}>
            <ListViewComponent
              data={this.data.list}
              renderListRow={this.renderListRow}
              renderFooter={this.renderFooter}
              loadMoreData={this.loadMoreData}
              reloadLists={this.reloadData}
              loading={this.props.list_loading}
              refreshing={this.props.list_refresh}
              style={{flex: 1}}
            />
            <ActionSheet visible={this.state.showActionSheet} modalPress={this._actionHide} 
              itemPress={this._actionItem} contentItems={this.tels} 
              hideTitle={false} title='拨打电话'
            />
          </View>
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