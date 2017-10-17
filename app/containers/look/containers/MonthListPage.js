/**
 * create at 04/19/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight} from 'react-native'
import { Actions } from 'react-native-router-flux'

// 组件
import ListView from '../../../components/list/ListSectionSimple'
import ListItem, {sectionHeaderView} from '../components/MonthItem'
import ListNoData from '../../../components/list/NoData'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// style
import {colors, distances, fontScale} from '../../../constants/style'

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
    this._renderSectionHeader = this._renderSectionHeader.bind(this)
	}

	renderListRow(rowData, sectionID, rowID){
    let {storeId, storeName} = this.props
    return <ListItem rowData={rowData} storeName={storeName} storeId={storeId}/>
  }

  _renderSectionHeader(sectionData, sectionID){
    let yearStr = ''
    if(sectionID == 'groupA'){
      yearStr=this.years[0]
    } else if(sectionID == 'groupB'){
      yearStr=this.years[1]
    }
    return sectionHeaderView(yearStr)
  }

	render(){
		if(Boolean(this.props.init_data)){
      let {init_data} = this.props
      let {year, items} = manageData(init_data)
      this.years = year
      this.items = items
      if(Array.isArray(this.years) && this.years.length > 0){
        return (
          <ListView
            data={this.items}
            renderSectionHeader={this._renderSectionHeader}
            renderListRow={this.renderListRow}
            style={{flex: 1}}
          />
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

function manageData(datas){
  let years = [], months = []
  if(Array.isArray(datas) && datas.length > 0){
    datas.forEach((item, idx)=>{
      if(Boolean(item.year)){
        years.push(item.year)
      } 
      if(Array.isArray(item.data)){
        months.push(item.data)
      }
    })
  }

  if(years.length > 0 && years.length == months.length){
    if(years.length == 1){
      // year 和 month 等于1
      return {year: years, items: {groupA: months[0]}}
    } else if(years.length == 2){
      // year 和 month 等于2
      return {year: years, items: {groupA: months[0], groupB: months[1]}}
    } else {
      // year 和 month 大于2
      console.log('years length 大于 2 不符合定义规则！！！')
      return {year: [], items: null}
    }
  } else {
    // year 和 month 不一致 或者为0
    return {year: [], items: null}
  }
}