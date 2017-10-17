/**
 * Created by Joe on 2017/6/5.
 */

import React, { Component } from 'react';
import { View, Text, Image, InteractionManager } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// 组件
import WrapLoading from '../../../../../components/load/wraploading'
import { ConfirmButton } from '../../../../../components/common'
import ListViewSimple from '../../../../../components/list/ListSimple'
import TagListItem from '../../components/visit/VisitWorkTagItem'
import ListNoData from '../../../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadData } from '../../../../../redux/modules/home/store/visit/visitWorkListReducer'
// presenter
import { fetchVisitWorkTags } from '../../presenters/activityVisitPresenter'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

const mapStateToProps = state => ({
  loading: state.visitWorkList.loading,
  loading_success: state.visitWorkList.loading_success,
})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({ loadData }, dispatch),
  dispatch,
})

class VisitWorkList extends Component{
  constructor(props){
    super(props)

    this.tags = []
    this.state = {
      pageRefresh: false
    }

    // UI
    this._renderListRow = this._renderListRow.bind(this)
    // request
    this._requestData = this._requestData.bind(this)
    this._getData = this._getData.bind(this)
    // click
    this._itemClick = this._itemClick.bind(this)
    this.saveClick = this.saveClick.bind(this)
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this._requestData()
    })
  }

  _requestData(){
    this.props.myactions.loadData(this._getData)
  }

  async _getData(){
    try{
      let body = {
        _AT: global.UserInfo.token
      }
      let ret = await fetchVisitWorkTags(body, '')()
      if(Array.isArray(ret) && ret.length > 0){
        for(var z of ret){
          z.isChecked=false;
        }
        this.tags = ret
      }
      return true
    }catch(e){
      console.log('_getData e===>', e)
      throw e
    }
  }

  _renderListRow(rowData, sectionID, rowID){
    return (
      <TagListItem rowData={rowData} tagItemPress={this._itemClick}/>
    )
  }

  _itemClick(tagId){
    for(var z of this.tags){
      if(tagId == z.id){
        z.isChecked = !z.isChecked;
        break;
      }
    }
    this.setState({
      pageRefresh: this.state.pageRefresh,
    })
  }

  saveClick(){
    let { callback = ()=>null } = this.props.routerData
    if(typeof callback === 'function'){
      callback(this.tags)
    } else {
      console.log('callback is not a funtion')
    }
    Actions.pop()
  }

  render(){
    return (
      <View style={{flex:1, backgroundColor: colors.labBgColor}}> 
        <WrapLoading {...this.props} onErrorPress={this._requestData}>
          {
            (Array.isArray(this.tags) && this.tags.length > 0) ? (
              <View style={{flex: 1}}>
                <ListViewSimple style={{flex: 1}} 
                  data={this.tags}
                  renderListRow={this._renderListRow}
                />
                <ConfirmButton confirmPress={this.saveClick} confirmText='保存'
                  touchStyle={{marginLeft: 50, marginRight: 50}} 
                />
              </View>
            ) : (
              <ListNoData visible={true} icon={require('../../../../../sources/images/list_no_data.png')} des='暂时没有哦'/>
            )
          }
				</WrapLoading>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitWorkList)