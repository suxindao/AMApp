
import React, {Component} from "react";
import {
  Platform, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet
} from "react-native"

// style
import {distances, fontScale, colors} from '../../constants/style'

export default class ListFoot extends Component{
  constructor(props){
    super(props)
  }

  render(){
    if(this.props.error && this.props.loadEnd === false){
      return (
        <TouchableOpacity style={{
            height:40, alignItems:'center', justifyContent:'center', width: distances.deviceWidth
          }} 
          onPress={this.props.moreTouchPress}
        >
          <View>
            <Text>网络不给力</Text>
          </View>
        </TouchableOpacity>
      )
    }
    if(this.props.loadEnd === false ){
      return (
        <View style={{ 
          height: 40, alignItems: 'center', justifyContent: 'center', width: distances.deviceWidth
        }}>
          <ActivityIndicator color="gray" size="small"/>
        </View>
      )
    } 
    return (
      <View style={{
        height: 40, alignItems:'center', justifyContent:'center', width: distances.deviceWidth
      }}>
        <Text style={{fontSize: 15 * fontScale}}>{''}</Text>
      </View>
    )
  }
}