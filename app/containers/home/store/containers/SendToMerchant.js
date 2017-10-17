/**
 * Created by Joe on 2017/5/2.
 */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image, Clipboard, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import WrapLoading from '../../../../components/load/wraploading'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import { loadData, setState, rsetState } from '../../../../redux/modules/home/store/sendToMerchantRedux'

const mapStateToProps = state=>({
  isRender:state.sendToMerchant.isRender,                      //是否渲染
  loading:state.sendToMerchant.loading,
  loading_success:state.sendToMerchant.loading_success,
  list:state.sendToMerchant.list,
})

const mapDispatchToProps = (dispatch)=>({
  myactions: bindActionCreators({
    loadData,
    setState,
    rsetState
  }, dispatch), dispatch
})

/**
 * 发给商户，生成二维码页面
 */
class SendToMerchant extends Component{
  constructor(props){
    super(props)
    this.getData = this.getData.bind(this);
    this.initLocalData = this.initLocalData.bind(this);
    this._setCopy = this._setCopy.bind(this);
  }

  componentWillMount(){
    this.getData();
  }

  componentWillUnmount(){
    this.props.myactions.rsetState();
  }

  /**
   * 获取/刷新 二维码图片信息
   */
  getData(status){
    let url = 'am_api/am/store/createQr';
    if(status)
      url = 'am_api/am/store/refreshQr';
    this.props.myactions.loadData(
      url,
      {
        _AT:global.UserInfo.token,
        id:this.props.routerData.id,
      },
      this.initLocalData
    );
  }

  async initLocalData(client, path, param){
    try{
      let list = await client.post(path, {data: param});
      // 刷新redux
      this.props.myactions.setState({ list:list }, true);
      return list;
    }catch(e){
      console.log(e)
    }
  }

  /**
   * 点击复制链接按钮
   */
  _setCopy(){
    // 将链接放置进剪切板
    Clipboard.setString(this.props.list.qr);
    Alert.alert(
      '提示',
      '复制成功！',
      [
        {text: '确认', onPress: ()=> {  }},
      ]
    )
  }

  render(){
    return(
      <WrapLoading {...this.props} onErrorPress={this.getData}>
        <View
          style={{
            flex:1,
            justifyContent:'flex-start',
            alignItems:'center',
            flexDirection:'column'
          }}
        >
          <View
            style={{
              width:distances.deviceWidth,
              height:32,
              justifyContent:'center',
              alignItems:'flex-end',
            }}
          >
            <TouchableHighlight
              underlayColor='#fafafa'
              onPress={()=>this.getData('refresh')}
            >
              <Image
                style={{
                  width:32,
                  height:32,
                  marginRight:35,
                }}
                source={require('../../../../sources/images/store/refresh_store.png')}/>
            </TouchableHighlight>
          </View>
          <View
            style={{
              width:190,
              height:190,
              justifyContent:'center',
              alignItems:'center',
              marginTop:18,
              backgroundColor:colors.labBgColor,
              borderWidth:distances.borderWidth,
              borderColor:colors.borderColor,
              borderRadius:3
            }}
          >
            <Image
              style={{
                width: 150,
                height: 150
              }}
              source={{uri: this.props.list.url}}
            />
          </View>
          <View>
            <Text style={{
              fontSize:15*fontScale,
              color:colors.inputColor,
              marginTop:20,
            }}>
              有效期至：{this.props.list.expired}
            </Text>
          </View>
          <View
            style={{
              width:distances.deviceWidth,
              height:38,
              justifyContent:'center',
              alignItems:'center',
              marginTop:45,
            }}
          >
            <TouchableHighlight
              underlayColor='#fafafa'
              style={{
                width:distances.deviceWidth-76,
                height:38,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:colors.blueColor,
                borderRadius:3,
              }}
              onPress={this._setCopy}
            >
              <Text
                style={{
                    fontSize:16*fontScale,
                    color:'#fff',
                  }}
              >
                复制链接
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </WrapLoading>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendToMerchant)