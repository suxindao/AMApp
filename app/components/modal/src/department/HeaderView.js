/**
 * create at 06/02/17
 */
import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, ScrollView, Image, StyleSheet } from 'react-native'

import { colors, distances, fontScale } from '../../../../constants/style'

/**
 * headerView
 */
export default class HeaderView extends Component{
  constructor(props){
    super(props)

    this._leftClick = this._leftClick.bind(this)
    this._rightClick = this._rightClick.bind(this)
  }

  _leftClick(){
    let { leftPress, page } = this.props
    leftPress(page)
  }

  _rightClick(){
    let {rightPress, page} = this.props
    rightPress(page)
  }

  render(){
    let {leftTitle = '', title, rightTitle} = this.props
    return(
      <View style={{
        flexDirection: 'row', height: 60, alignItems: 'center',
        borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
      }}>
        <TouchableOpacity style={[{paddingLeft: distances.leftMargin}, styles.barBtn]} 
          onPress={this._leftClick}
        >
          <Text style={styles.buttonText}>{leftTitle}</Text>
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 18*fontScale, color: '#333'}}>{title}</Text>
        </View>
        <TouchableOpacity style={[{paddingRight: distances.leftMargin}, styles.barBtn]} 
          onPress={this._rightClick}
        >
          <Text style={styles.buttonText}>{rightTitle}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14*fontScale, 
    color: colors.blueColor,
  },
  barBtn:{
    height:60,
    justifyContent: 'center'
  }
})