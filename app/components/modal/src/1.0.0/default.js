/**
 *  create at 16/09/23
 *
 *  构造所有浮层的父类
 *
 *  location 给子类提供一个可以更改位置的属性，alert中子属性在alert根类默认为居中，list中只有在地区选择需要靠下显示
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import Base from './base'

export default class DefaultModal extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <Base 
        modalStyle={{
          position: 'absolute', left: 0, top: 0, bottom: 0, right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.60)',
        }}
        hideModal={this.props.hideModal}
        touchStyle={[{flex: 1, justifyContent: 'center'}, this.props.location]}
        containerView={this.props.containerView}
      />
    )
  }
}