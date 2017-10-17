/**
 * Created at 07/17/17
 */
import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

export default class TagListItem extends Component{
  constructor(props){
    super(props)

    this._tabItemClick = this._tabItemClick.bind(this)
  }

  _tabItemClick(){
    let {rowData, tagItemPress} = this.props
		if( typeof tagItemPress === 'function'){
			let tagId = Boolean(rowData.id) ? rowData.id : 0
			tagItemPress(tagId)
		} else {
			console.log('_tabItemClick tagItemPress is not a function')
		}
  }

  render(){
		let {rowData} = this.props
    return (
      <View style={styles.listItemView}>
        <CheckBox
          isChecked={ Boolean(rowData.isChecked) ? rowData.isChecked : false}
          ref='checkBox'
          rightText={ Boolean(rowData.tag) ? rowData.tag : '' }
          style={{flex: 1, justifyContent:'center', height:60}}
          onClick={this._tabItemClick}
          checkedImage={<Image source={require('../../../../../sources/images/radio_yes.png')}/>}
          unCheckedImage={<Image source={require('../../../../../sources/images/radio_no.png')}/>}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listItemView: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    height:44,
    paddingLeft:distances.contractLeftMargin,
    borderBottomWidth:distances.borderWidth,
    borderColor:colors.borderColor,
    backgroundColor:'#fff',
  }
})