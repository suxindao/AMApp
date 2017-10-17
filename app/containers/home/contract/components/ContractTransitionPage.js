/**
 * Created by Joe on 2017/3/28.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { toastShort } from '../../../../constants/toast'
import _ from 'lodash'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

export default class ContractTransitionPage extends Component{
  constructor(props){
    super(props)
    this.popRefresh = this.popRefresh.bind(this);
    this.callback = this.callback.bind(this);
    this.state = {
      showBotton:true,
      btnList:{
        stage:{
          title:'分期协议',
          complete:false,
        },
        straight:{
          title:'直通车协议',
          complete:false,
        },
        extend:{
          title:'推广合同',
          complete:false,
        },
      }
    };
  }

  popRefresh(page){
    if(!this.state.btnList[page].complete){
      let n_btnList = _.cloneDeep(this.state.btnList);
      n_btnList[page].complete = true;
      this.setState({btnList:n_btnList});
    }
  }

  callback(mark){
    let { routerData } = this.props;
    switch (mark){
      case 'stage':{
        Actions.createStageContract({
          popRefresh:this.popRefresh,
          routerData:{
            btnType:2,
            data:{
              enterprise:{
                id: routerData.enterprise_id,
                name: routerData.name,
              },
              main_contract_id: routerData.main_contract_id,
            },
          },
          isNew:true,
        });
        break;
      }
      case 'straight':{
        Actions.createStraightContract({
          popRefresh:this.popRefresh,
          routerData:{
            btnType:2,
            data:{
              enterprise:{
                id: routerData.enterprise_id,
                name: routerData.name,
              },
              main_contract_id: routerData.main_contract_id,
            },
          },
          isNew:true,
        });
        break;
      }
      case 'extend':{
        Actions.createExtendContract({
          popRefresh:this.popRefresh,
          routerData:{
            btnType:2,
            data:{
              enterprise:{
                id: routerData.enterprise_id,
                name: routerData.name,
              },
              main_contract_id: routerData.main_contract_id,
            },
          },
          isNew:true,
        });
        break;
      }
      default :{
        toastShort('跳转失败');
      }
    }
  }

  render(){
    return(
      <View style={{flex:1}}>
        <ScrollView style={{ flex: 1, marginBottom:60 }} bounces={false}>
          <Head/>
          {
            this.state.showBotton?
              <BtnList data={this.state.btnList} callback={this.callback}/>
              :null
          }
        </ScrollView>
        <Foot/>
      </View>
    )
  }
}

class Head extends Component{

  render(){
    return(
      <View
        style={{
          justifyContent:'center',
          alignItems:'center',
          marginTop:93,
          width:distances.deviceWidth,
          marginBottom:85
        }}
      >
        <Image
          style={{
            width: 75,
            height: 75,
            marginBottom: 30
          }}
          source={require('./../../../../sources/images/contract/contract_ok.png')}
        />
        <Text style={{fontSize:15*fontScale, color:'#666'}}>
          创建框架协议成功！
        </Text>
      </View>
    )
  }
}

class Foot extends Component{

  render(){
    return(
      <View
        style={{
          width: distances.deviceWidth,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          position: 'absolute',
          left: 0,
          bottom: 15,
        }}
      >
        <TouchableOpacity
          style={{
            width: distances.deviceWidth - 30,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.labBgColor,
            borderRadius: 3,
          }}
          onPress={Actions.pop}
        >
          <Text style={{fontSize: 16 * fontScale, color: colors.blueColor}}>返回</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class BtnList extends Component{
  constructor(props){
    super(props)
    this.renderInner = this.renderInner.bind(this);
  }

  renderInner(){
    let { data, callback } = this.props;
    let tag = new Array();
    for(var z in data){
      let key = z;
      if(key=='extend')
        continue;
      tag.push(
        <TouchableOpacity
          key={'btn_'+key}
          style={{
            width: distances.deviceWidth - 30,
            height: 48,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: data[key].complete?colors.labBgColor:colors.blueColor,
            borderRadius: 3,
            marginBottom: 10,
            flexDirection: 'row'
          }}
          onPress={()=>{data[key].complete||callback(key)}}
        >
          <Text style={{fontSize: 16 * fontScale, color: data[key].complete?'#999':'#fff'}}>{data[key].title}</Text>
          {
            data[z].complete?
              <Image
                style={{
                  width: 17,
                  height: 17,
                  position: 'absolute',
                  right: 95,
                }}
                source={require('./../../../../sources/images/contract/complete_mark.png')}
              />:null
          }
        </TouchableOpacity>
      )
    }
    return tag;
  }

  render(){
    return(
      <View
        style={{
          width: distances.deviceWidth,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.renderInner()}
      </View>
    )
  }
}