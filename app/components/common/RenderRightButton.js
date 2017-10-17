/**
 * Created by Joe on 2017/4/19.
 */
import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'

// style
import {colors, distances, fontScale, globleStyles} from '../../constants/style'

const style = {
  width:18,
  height:18,
  marginLeft:10,
  marginRight:10,
  marginBottom:20,
}

export default class StoreRightButton extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <TouchableOpacity onPress={()=>{Actions.viewStoreInfo({routerData:{status:'add'}})}}>
        <Image style={style} source={require('../../sources/images/contract/contract_add.png')}/>
      </TouchableOpacity>
    )
  }
}

class CourseRightButton extends Component{
  constructor(props){
    super(props)

    this._addClick = this._addClick.bind(this)
  }

  _addClick(){
  }

  render(){
    return(
      <TouchableOpacity onPress={this._addClick}>
        <Image style={style} source={require('../../sources/images/contract/contract_add.png')}/>
      </TouchableOpacity>
    )
  }
}

class ViewStoreRightButton extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <TouchableOpacity onPress={()=>{Actions.sendToMerchant({routerData:{id:this.props.id}})}}>
        <Image style={style} source={require('../../sources/images/store/share_store.png')}/>
      </TouchableOpacity>
    )
  }
}

class StoreCourseRightButton extends Component{
  constructor(props){
    super(props)
    this._addClick = this._addClick.bind(this)
  }

  _addClick(){
    Actions.storeCourse({routerData: {status: 'add', id:this.props.id}});
  }

  render(){
    return(
      <TouchableOpacity onPress={this._addClick}>
        <Image style={style} source={require('./../../sources/images/contract/contract_add.png')}/>
      </TouchableOpacity>
    )
  }
}

class ByStagesPackageRightButton extends Component{
  constructor(props){
    super(props)
    this._addClick = this._addClick.bind(this)
  }

  _addClick(){
    this.props.callback();
    Actions.byStagesPackage({routerData: {status: 'add', id:this.props.id}});
  }

  render(){
    return(
      <TouchableOpacity onPress={this._addClick}>
        <Image style={style} source={require('./../../sources/images/contract/contract_add.png')}/>
      </TouchableOpacity>
    )
  }
}

class MoreButton extends Component{
  constructor(props){
    super(props)
    this._addClick = this._addClick.bind(this)
  }

  _addClick(){
    if(typeof this.props.callback == 'function')
      this.props.callback();
  }

  render(){
    return(
      <TouchableOpacity onPress={this._addClick}>
        <Image style={style} source={require('./../../sources/images/home/navbar_mores.png')}/>
      </TouchableOpacity>
    )
  }
}

module.exports.btn = {
  StoreRightButton:StoreRightButton,
  CourseRightButton:CourseRightButton,
  ViewStoreRightButton:ViewStoreRightButton,
  StoreCourseRightButton:StoreCourseRightButton,
  ByStagesPackageRightButton:ByStagesPackageRightButton,
  MoreButton:MoreButton,
}