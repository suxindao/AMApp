/**
 *  create at 16/09/23
 *
 *  构造所有浮层的父类
 *
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

//高阶组件  包装android 硬件回退
import EnhancedBackAndroid from '../../../../modules/enhanced/back.android'

class ModalComponent extends Component{
  constructor(props){
    super(props)
    this.modalTouch = this.modalTouch.bind(this)
  }

  modalTouch(){
    this.props.hideModal();
  }

  handleHardwareBackPress(){
    this.modalTouch()
    return true
  }

  render(){
    return (
      <TouchableOpacity activeOpacity={0} onPress={this.modalTouch}
        style={this.props.touchStyle}>
        {this.props.containerView}
      </TouchableOpacity>
    )
  }
}

export default (EnhancedBackAndroid()(ModalComponent))
