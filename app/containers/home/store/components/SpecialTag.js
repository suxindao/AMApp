/**
 * Created by Joe on 2017/4/24.
 */
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, StyleSheet, TouchableHighlight } from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
//组件
import Prompt from '../../../../components/common/Prompt';


/**
 * 特殊标签
 */
export default class SpecialTag extends Component {
  constructor(props) {
    super(props)
    this.alertPrompt = this.alertPrompt.bind(this);
    this.renderInner = this.renderInner.bind(this);
    this.modifyTag = this.modifyTag.bind(this);
    this.checkedTag = this.checkedTag.bind(this);
  }

  componentWillUnmount(){
    Keyboard.dismiss()
  }

  /**
   * 弹出输入框
   */
  alertPrompt(){
    this.refs.prompt.show();
  }

  /**
   * 弹出框输入后的回调
   */
  modifyTag(text){
    if(!text)
      return;
    let {data} = this.props;
    // 添加标签项，赋值状态为未选中
    data.push(
      {
        tag:text,
        checked:false
      }
    );
    this.props.callback({tagData:data});
  }

  /**
   * 点击标签，选中or取消选中
   */
  checkedTag(index){
    let {data} = this.props;
    let arr = new Array();
    let tag = ''
    // 赋值为与原来状态相反
    data[index].checked = !data[index].checked;
    // 获取选中的标签，赋值到存放选中标签的容器当中，用于提交数据
    for(var z of data){
      if(z.checked){
        arr.push(z.tag);
      }
    }
    if(arr.length>0){
      tag = arr.join();
    }
    this.props.callback(
      {
        tag:tag,
        tagData:data,
      }
    );
  }

  /**
   * 返回特色服务dom标签
   */
  renderInner(){
    let {data} = this.props
    let tagArr = new Array();
    if(data&&data.length>0){
      let tag = new Array();
      let checked = new Array();
      for(var a of data){
        tag.push(a.tag);
        checked.push(a.checked);
      }
      for(var z=0; z<tag.length; z++){
        let index = z;
        tagArr.push(
          <TouchableHighlight
            underlayColor='#fafafa'
            key={'tag_'+index}
            style={{
              height:32,
              justifyContent:'center',
              alignItems:'center',
              borderWidth:distances.borderWidth,
              borderRadius:3,
              borderColor:colors.borderColor,
              backgroundColor:checked[index]?colors.blueColor:'#fff',
              marginTop:10,
              marginRight:10,
              marginBottom:10,
              paddingLeft:10,
              paddingRight:10,
            }}
            onPress={()=>{
              if(this.props.editable){
                this.checkedTag(index)
              } else {

              }
            }}
          >
            <Text
              style={{
              color:checked[index]?'#fff':'#666',
              fontSize:14*fontScale,
            }}
            >{tag[index]}</Text>
          </TouchableHighlight>
        )
      }
    }
    // 遍历结束后再添加一个"+"按钮
    tagArr.push(
      <TouchableHighlight
        underlayColor='#fafafa'
        key={'tag_Touch'}
        style={{
          width:75,
          height:32,
          justifyContent:'center',
          alignItems:'center',
          borderWidth:distances.borderWidth,
          borderRadius:3,
          borderColor:colors.borderColor,
          backgroundColor:'#fff',
          marginTop:10,
          marginRight:10,
          marginBottom:10,
        }}
        onPress={
          ()=>{
            if(this.props.editable){
              this.alertPrompt()
            } else {

            }
          }
        }
      >
        <Image
          style={{
            width: 18,
            height: 18
          }}
          source={require('../../../../sources/images/store/add_store.png')}
        />
      </TouchableHighlight>
    )
    return (
      <View
        style={{
              flex:1,
              marginRight:distances.leftMargin-10,
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap:'wrap',
              marginTop:10,
            }}
      >
        {tagArr}
      </View>
    )
  }

  render() {
    return (
      <View
        style={{
          flex:1,
          flexDirection: 'column',
          justifyContent:'center',
          alignItems:'flex-start',
          borderBottomWidth: distances.borderWidth,
          borderColor: colors.borderColor,
          backgroundColor: colors.labBgColor,
          paddingLeft: distances.contractLeftMargin,
          paddingRight: 5,
          paddingTop:15,
          paddingBottom:15,
        }}
      >
        <Text style={{
          fontSize: 13 * fontScale,
          color: '#999',
          marginBottom:5,
        }}>
          特色服务
        </Text>
        {this.renderInner()}
        <Prompt
          ref="prompt"
          title="特色服务"
          inner="请输入特色服务"
          placeholder="请输入"
          rightBtn="添加"
          onSubmint={this.modifyTag}
        />
      </View>
    )
  }
}