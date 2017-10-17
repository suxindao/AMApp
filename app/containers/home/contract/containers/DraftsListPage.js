/**
 * create at 03/13/17
 */

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import ListView from '../../../../components/list/ListSimple'
import ListFoot from '../../../../components/list/foot'
import ListItem from '../components/DraftsItem'
import ListNoData from '../../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// presenter
import {fetchContractDraftsDataWithoutCache} from '../presenters/draftsPresenters'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {LIST_ITEM_COUNT} from '../../../../constants/default.config'

const mapStateToProps = state => ({

})

const mapDispatchToProps = (dispatch) => ({
  myactions: bindActionCreators({}, dispatch),
  dispatch,
})

class Page extends Component{
  constructor(props){
    super(props)

    // UI
    this.renderListRow = this.renderListRow.bind(this)
  }

  renderListRow(rowData, sectionID, rowID){
    return <ListItem rowData={rowData} />
  }

  render(){
    if(Boolean(this.props.init_data)){
      this.data = this.props.init_data
      // console.log('OtherListPage >>> this.data ===>', this.data)
      if(Array.isArray(this.data) && this.data.length > 0){
        return (
          <ListView
            data={this.data}
            renderListRow={this.renderListRow}
            style={{flex: 1}}
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