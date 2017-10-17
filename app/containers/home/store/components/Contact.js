/**
 * Created by Joe on 2017/7/17.
 */
/**
 * Created by Joe on 2017/6/2.
 */
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
import _ from 'lodash'

export default class Contactss extends Component{
  constructor(props){
    super(props)
    this.getContacts = this.getContacts.bind(this);
    this.editContacts = this.editContacts.bind(this);
  }

  /**
   * 获取联系人标签项
   */
  getContacts(){
    let { contacts = new Array() } = this.props.data;
    let contactsTag = new Array();
    if(contacts.length>0){
      for(var z=0; z<contacts.length; z++){
        contactsTag.push(
          <ContentComponent
            key={'contacts_'+z}
            config={{
              hasLine:true,
              title:'联系人'+(z+1),
              type:'text',
              value:`${contacts[z].name||''}    ${contacts[z].phone_num||''}`,
            }}
          />
        );
      }
    }
    return contactsTag;
  }

  /**
   * 获取编辑联系人按钮
   */
  editContacts(){
    return (
      <TouchableOpacity
        style={{
          width: distances.deviceWidth,
          height: 60,
          flexDirection: 'row',
          justifyContent:'center',
          alignItems:'center',
          borderBottomWidth:distances.borderWidth,
          borderColor:colors.borderColor,
        }}
        onPress={
          ()=>{
            if(this.props.editable){
              Actions.editContact({
                routerData:{data:this.props.data},
                callback:list=>{this.props.callback({contacts:list})}
              });
            }
          }
        }
      >
        <Image
          style={{
            width: 18,
            height: 18,
            marginRight: 10,
          }}
          source={require('../../../../sources/images/store/add_contacts.png')}
        />
        <Text
          style={{
            fontSize:16*fontScale,
            color:colors.blueColor,
          }}
        >
          添加/编辑联系人
        </Text>
      </TouchableOpacity>
    )
  }

  render(){
    return(
      <View>
        {this.getContacts()}
        {this.editContacts()}
      </View>
    )
  }
}