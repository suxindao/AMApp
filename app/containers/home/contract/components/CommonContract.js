/**
 * Created by Joe on 2017/7/14.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import moment from 'moment-timezone'

/**
 * 服务合同组件
 */
export default class CommonContract extends Component{
  constructor(props){
    super(props)
    this.renderLable = this.renderLable.bind(this);
    this.photoCallback = this.photoCallback.bind(this);
    this.photoDeleteCallback = this.photoDeleteCallback.bind(this);
    this.callback = this.callback.bind(this);
  }

  // 返回列表模块标题
  renderLable(text, h){
    return(
      <View
        style={{
          backgroundColor:colors.labBgColor,
          width:distances.deviceWidth,
          height:h||30,
          justifyContent:'center',
          borderTopWidth:distances.borderWidth,
          borderBottomWidth:distances.borderWidth,
          borderColor:'#d3d3d3',
        }}
      >
        <Text
          style={{
            fontSize: 13 * fontScale,
            color: '#999',
            marginLeft:distances.contractLeftMargin
          }}
        >
          {text}
        </Text>
      </View>
    )
  }

  photoCallback(data){
    if(data.uploadInfo){
      let contract_pics = this.props.data.contract_pics;
      let obj = {};
      obj.file_id = data.uploadInfo.file_id;
      obj.file_path = data.uploadInfo.url_path;
      contract_pics.push(obj);
      this.callback({contract_pics:contract_pics});
    }
  }

  photoDeleteCallback(data){
    let contract_pics = this.props.data.contract_pics;
    let new_contract_pics = new Array();
    for(var z of contract_pics){
      if(z.file_id!=data.file_id){
        new_contract_pics.push(z);
      }
    }
    this.callback({contract_pics:new_contract_pics});
  }

  callback(result){
    let data = _.cloneDeep(this.props.data);
    // data.contacts = list;
    console.log(result)
    // this.props.myactions.setState({data:data}, true)
  }

  render(){
    let { data } = this.props;
    return(
      <View style={{ flex: 1 }}>
        <ContentComponent
          config={{
            hasLine:false,
            title:'企业名称',
            type:'text',
            placeholder:'',
            editable:true,
            key:'name',
            value:data.name
          }}
          callback={this.callback}
        />
        {this.renderLable('基础信息')}
        <ContentComponent
          config={{
            hasLine:true,
            title:'编号',
            type:'input',
            placeholder:'',
            editable:true,
            key:'cms_code',
            value:data.cms_code
          }}
          callback={this.callback}
        />
        <ContentComponent
          config={{
            hasLine:true,
            title:'签约日期',
            type:'date',
            placeholder:moment().format('YYYY-MM-DD'),
            editable:true,
            key:'signed_date',
            value:data.signed_date
          }}
          callback={this.callback}
        />
        <ContentComponent
          config={{
            hasLine:true,
            title:'开始日期',
            type:'date',
            placeholder:moment().format('YYYY-MM-DD'),
            editable:true,
            key:'from_date',
            value:data.from_date
          }}
          callback={this.callback}
        />
        <ContentComponent
          config={{
            hasLine:true,
            title:'结束日期',
            type:'date',
            placeholder:'请选择',
            editable:true,
            key:'to_date',
            value:data.to_date
          }}
          callback={this.callback}
        />
        <ContentComponent
          config={{
            hasLine:true,
            title:'签约AM',
            type:'input',
            placeholder:'请输入签约AM',
            editable:true,
            key:'am_name',
            value:data.am_name
          }}
          callback={this.callback}
        />
        <Contact editable={true} callback={this.callback} data={data}/>
        {this.renderLable('合作门店')}
        <View
          style={{
            backgroundColor:'#fff'
          }}
        >
          <View
            style={{
                  alignItems:'center',
                  justifyContent:'center',
                  height:60
                }}
          >
            <TouchableOpacity
              onPress={
                ()=>{
                  Actions.searchStore({
                  routerData:{
                    enterprise_id:data.enterprise_id,
                    stores:data.stores
                  },
                  callback:this.callback
                  })
                }
              }
            >
              <Text style={{ fontSize:16*fontScale, color:colors.blueColor }}>
                关联门店
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderLable('服务合同照片')}
        <PhotoSelect
          photoNumber={20}
          style={{
            backgroundColor: '#fff',
            marginBottom:distances.contractLeftMargin
          }}
          dataPics={[]}
          imagesPerRow={4}
          imageMargin={distances.contractLeftMargin}
          onItemUpload={(data)=>{this.photoCallback(data)}}
          onItemDelete={(data)=>{this.photoDeleteCallback(data)}}
          isAddLast={true}
          hideItemDelete={false}
        />
      </View>
    )
  }
}
