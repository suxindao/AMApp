/**
 *  create at 16.09/21
 *
 *  构造用于显示在透明浮层上的父类listView
 *  
 */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import Default from './default'

export default class ListModal extends Component{
  constructor(props){
    super(props)

    this._renderList = this._renderList.bind(this)
  }

  _renderList(){
    return (
      <View style={this.props.listStyle}>
        {this.props.headerView}
        {this.props.contentView}
        {this.props.footerView}
      </View>
    )
  }

  render(){
    return (
      <Default
        containerView={this._renderList()}
        location={this.props.location}
        hideModal={this.props.hideModal}
      />
    )
  }
}
