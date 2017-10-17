/**
 * Created by Joe on 2017/5/31.
 */

import React, {Component} from 'react';
import {
  View, ActivityIndicator, Text, TouchableHighlight
} from 'react-native';
import ElementAlert from './ElementAlert';

import {colors, distances, fontScale} from '../../constants/style'

export default class BottomPopup extends Component{
  constructor(props){
    super(props)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.getItems = this.getItems.bind(this)
    this.getActivityIndicator = this.getActivityIndicator.bind(this)
  }


  show(){
    this.refs.float.slideModal();
  }

  hide(){
    this.refs.float.hide();
  }

  getItems(){
    let { items } = this.props;
    let lastIdx = items.length-1;
    return items.map((v, idx)=>{
      return (
        <TouchableHighlight
          underlayColor='#fafafa'
          key={new Date().getTime()+idx}
          style={[
            {
              width:distances.deviceWidth-30,
              height:50,
              alignItems: 'center',
              justifyContent:'center',
              backgroundColor:'#fff',
              borderTopWidth:distances.borderWidth,
              borderColor:colors.borderColor,
            },
            idx === lastIdx?{
              borderBottomLeftRadius:15,
              borderBottomRightRadius:15,
            }:null,
            idx === 0?{
              borderTopLeftRadius:15,
              borderTopRightRadius:15,
            }:null
          ]}
          onPress={()=>{this.props.callback(idx)}}
        >
          <Text style={{fontSize:17*fontScale, color:'#007aff'}}>{v}</Text>
        </TouchableHighlight>
      )
    });
  }

  getActivityIndicator(){
    return(
      <View
        style={{
          alignItems: 'center',
          justifyContent:'center',
          width:distances.deviceWidth,
          position:'absolute',
          left:0,
          bottom:0,
          backgroundColor:'rgba(0,0,0,0)'
        }}
      >
        {this.getItems()}
        <TouchableHighlight
          underlayColor='#fafafa'
          style={{
            width:distances.deviceWidth-30,
            height:50,
            alignItems: 'center',
            justifyContent:'center',
            backgroundColor:'#fff',
            borderRadius:15,
            marginTop:8,
            marginBottom:15,
          }}
          onPress={this.hide}
        >
          <Text style={{fontSize:17*fontScale, color:'#007aff'}}>取消</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render(){
    return (
      <ElementAlert
        ref="float"
        innerElement={this.getActivityIndicator()}
        tapBackHide={true}
      />
    )
  }
}