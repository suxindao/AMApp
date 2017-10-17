/**
 * Created by Joe on 2017/4/24.
 */
import React, {Component} from 'react';
import {
  View, TextInput, TouchableHighlight, Text, ScrollView
} from 'react-native';
import ElementAlert from './ElementAlert';

import {colors, distances, fontScale} from '../../constants/style'

/**
 * title:'',
 * inner:'',
 * placeholder:'',
 * value:'',
 * leftBtn:'',
 * rightBtn:''
 * onCancel:function,
 * onSubmint:function(text)
 */
export default class Prompt extends Component{
  constructor(props){
    super(props)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.setValue = this.setValue.bind(this)
    this.getInner = this.getInner.bind(this)
    this.state = {
      value:''
    }
  }

  show(){
    this.refs.prompt.slideModal();
  }

  hide(){
    this.refs.prompt.hide();
  }

  setValue(text){
    this.setState({
      value:text
    })
  }

  getInner(){
    let { title, inner, value, leftBtn, rightBtn, onCancel, onSubmint, placeholder } = this.props;
    return (
        <View
          style={{
            width:270,
            height:193,
            backgroundColor:'#fff',
            borderRadius:11,
          }}
        >
          <ScrollView
            style={{
              flex:1,
            }}
            bounces={false}
            scrollEnabled={false}
          >
          <View
            style={{
              flex:1,
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
            }}
          >
          <View
            style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:25,
          }}
          >
            <Text
              style={{color:'#333', fontSize:18*fontScale}}
            >
              {title?title:'请输入'}
            </Text>
          </View>
          <View
            style={{
            width:190,
            justifyContent:'center',
            alignItems:'flex-start',
            marginTop:12,
          }}
          >
            <Text style={{color:'#333', fontSize:14*fontScale}}>{inner}</Text>
          </View>
          <View
            style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:12,
          }}
          >
            <TextInput
              style={{
              width:190,
              height:35,
              borderRadius:3,
              backgroundColor:'#f5f5f5',
              paddingLeft:13,
              paddingTop:0,
              paddingBottom:0,
            }}
              autoCapitalize='none'
              onChange={(e)=>{this.setValue(e.nativeEvent.text);}}
              placeholder={placeholder}
              placeholderTextColor={'#ccc'}
              underlineColorAndroid={'transparent'}
              defaultValue={this.props.value}
            />
          </View>
          <View
            style={{
            flexDirection:'row',
            width:270,
            height:50,
            borderTopWidth:distances.borderWidth,
            borderColor:colors.borderColor,
            justifyContent:'center',
            alignItems:'center',
            borderBottomLeftRadius:11,
            borderBottomRightRadius:11,
            marginTop:25,
          }}
          >
            <TouchableHighlight
              underlayColor='#fafafa'
              style={{
              width:135,
              height:50,
              justifyContent:'center',
              alignItems:'center',
              borderRightWidth:distances.borderWidth,
              borderColor:colors.borderColor,
            }}
              onPress={
              ()=>{
                this.refs.prompt.hide();
                if(typeof onCancel === 'function')
                  onCancel();
                this.setState({value : ''});
              }
            }
            >
              <Text
                style={{
                fontSize:17*fontScale,
                color:'#007aff',
              }}
              >{leftBtn?leftBtn:'取消'}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='#fafafa'
              style={{
              width:135,
              height:50,
              justifyContent:'center',
              alignItems:'center',
            }}
              onPress={
              ()=>{
                this.refs.prompt.hide();
                if(typeof onSubmint === 'function')
                  onSubmint(this.state.value);
                this.setState({value : ''});
              }
            }
            >
              <Text
                style={{
                fontSize:17*fontScale,
                color:'#007aff',
              }}
              >{rightBtn?rightBtn:'确认'}</Text>
            </TouchableHighlight>
          </View>
          </View>
          </ScrollView>
        </View>
    )
  }

  render(){
    return (
      <ElementAlert
        ref="prompt"
        innerElement={this.getInner()}
        tapBackHide={true}
      />
    )
  }
}