/**
 * create at 06/02/17
 */
import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView, Image, StyleSheet } from 'react-native'

// 组件
import HeaderView from './HeaderView'
import listsShow from './lists'

import { colors, distances, fontScale } from '../../../../constants/style'

/**
 * pageView
 */
export default class PageView extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {
      leftTitle, title, rightTitle, leftPress, rightPress, 
			page, containerStyle, lists, currentItem, itemPress
    } = this.props
    return (
      <View style={[{flexDirection: 'column', flex: 1}, containerStyle]}>
        <HeaderView leftTitle={leftTitle} title={title} rightTitle={rightTitle}
          leftPress={leftPress} rightPress={rightPress} page={page}
        />
        <ScrollView style={{flex: 1}}>
          { listsShow(lists, currentItem, page, itemPress) }
        </ScrollView>
      </View>
    )
  }
}