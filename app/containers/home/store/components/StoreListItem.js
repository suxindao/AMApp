/**
 * Created by Joe on 2017/6/26.
 */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Image, Alert, DeviceEventEmitter } from 'react-native'
import {toastShort} from '../../../../constants/toast'
import {Actions} from 'react-native-router-flux'
//组件
import ListView from '../../../../components/list/list'
import ListFoot from '../../../../components/list/foot'
import ListNoData from '../../../../components/list/NoData'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
// common
import { notification, store } from '../../../../constants/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
  loadData,
  loadMoreData,
  reloadData,
  setState,
  rsetState
} from '../../../../redux/modules/home/store/storeListItemRedux'

const mapStateToProps = state=>({
  isRender:state.storeListItem.isRender,                      //是否渲染
  list_loading:state.storeListItem.list_loading,
  list_refreshing:state.storeListItem.list_refreshing,
  list_error:state.storeListItem.list_error,
  ended:state.storeListItem.ended,
  next_key:state.storeListItem.next_key,
  limit:state.storeListItem.limit,
  queryOK:state.storeListItem.queryOK,
  list:state.storeListItem.list,
})

const mapDispatchToProps = (dispatch)=>({
  myactions: bindActionCreators({
    loadData,
    loadMoreData,
    reloadData,
    setState,
    rsetState
  }, dispatch), dispatch
})

const itemStyle = {
  flexDirection: 'row',
  alignItems:'center',
  backgroundColor:colors.bgColor,
  marginLeft:distances.contractLeftMargin,
  marginRight:distances.contractLeftMargin,
};

const btnStyle = {
  marginRight:10,
  borderWidth:distances.borderWidth,
  borderColor:colors.blueColor,
  borderRadius:26,
  width:75,
  height:26,
  alignItems:'center',
  justifyContent:'center',
};

const innerStyle = {
  fontSize:13*fontScale,
  color:'#999',
  marginBottom:10,
};

const emitKey = notification.viewStore;

const emitKey1 = notification.storeListItem;

class StoreListItem extends Component{
  constructor(props){
    super(props)
    this.getItemData = this.getItemData.bind(this)
    this.getStatus = this.getStatus.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getDelTag = this.getDelTag.bind(this)
    this.delData = this.delData.bind(this)
    this.delLocalData = this.delLocalData.bind(this)
    this.getInner = this.getInner.bind(this)
    this.subData = this.subData.bind(this)
    this.subLocalData = this.subLocalData.bind(this)
    this.renderListRow = this.renderListRow.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.goReloadData = this.goReloadData.bind(this)
    this.reloadDatas = this.reloadDatas.bind(this)
    this.goLoadMoreData = this.goLoadMoreData.bind(this)
    this.loadMoreDatas = this.loadMoreDatas.bind(this)
    this.refresh = '';
  }

  componentWillMount(){
    this.goReloadData();
    // 添加监听事件，用于返回刷新页面
    this.refresh = DeviceEventEmitter.addListener(emitKey1, param => {
      this.goReloadData();
      DeviceEventEmitter.emit(emitKey);
    });
  }

  componentWillUnmount(){
    this.props.myactions.rsetState();
    this.refresh.remove();
  }

  /**
   * 获取指定格式（满足展示）的数据
   */
  getItemData(rowData){
    let itemData = {
      name:rowData.name,
      cms_code:rowData.cms_code,
      create_time:rowData.create_time,
      update_time:rowData.update_time,
    }
    // 如果是store[1].code（驳回列表）,加入一条message数据
    if(this.props.status==store[1].code)
      itemData.message = rowData.message;
    return itemData;
  }

  /**
   * 获取展示按钮状态
   * (true:查看详情,发给商户,提交申请, false:查看详情)
   */
  getStatus(){
    // 草稿和驳回
    if(this.props.status==store[0].code||this.props.status==store[1].code)
      return true;
    // 待审核和通过
    if(this.props.status==store[2].code||this.props.status==store[3].code)
      return false;
    return false;
  }

  /**
   * 获取每条的头(左半部分)
   */
  getTitle(key){
    if(key=='id')
      return '门店id:';
    if(key=='name')
      return '门店名称:';
    if(key=='cms_code')
      return '门店编号:';
    if(key=='create_time')
      return '创建时间:';
    if(key=='update_time')
      return '更新时间:';
    if(key=='message')
      return '驳回备注:';
    return '';
  }

  /**
   * 获取删除按钮tag
   */
  getDelTag(rowData){
    // 如果为草稿则显示删除按钮
    return this.props.status==store[0].code?
      <TouchableHighlight
        underlayColor='#fafafa'
        onPress={()=>this.delData(rowData.id)}
      >
        <Image
          style={{
            width: 15,
            height: 15
          }}
          source={require('../../../../sources/images/store/del_store.png')}
        />
      </TouchableHighlight>:
      null;
  }


  /**
   * 点击根据id删除数据
   */
  delData(id){
    // 提示是否确认删除
    Alert.alert(
      '提示',
      '是否确认删除？',
      [
        {text: '取消', onPress: () => {}},
        // 跳转到门店详情，状态为编辑状态
        {text: '确认', onPress: ()=> {
          this.props.myactions.loadData(
            '/am_api/am/store/deleteDetail',
            {
              _AT:global.UserInfo.token,
              id:id,
            },
            this.delLocalData
          );
        }},
      ]
    )
  }

  async delLocalData(client, path, param){
    try{
      let list = await client.post(path, {data: param});
      // 删除数据后调用获取数据方法重新刷新列表
      this.goReloadData();
      DeviceEventEmitter.emit(emitKey);
      return list;
    }catch(e){
      console.log(e)
    }
  }


  /**
   * 点击提交审核
   */
  subData(id){
    this.props.myactions.loadData(
      '/am_api/am/store/sendApply',
      {
        _AT:global.UserInfo.token,
        id:id,
      },
      this.subLocalData
    );
  }

  async subLocalData(client, path, param){
    try{
      let list = await client.post(path, {data: param});
      if(list.errorCode===1){
        toastShort(list.message);
      }else{
        // 调用监听刷新上一页面（首页列表）数据
        this.goReloadData();
        DeviceEventEmitter.emit(emitKey);
      }
      return list;
    }catch(e){
      toastShort(e);
    }
  }

  /**
   * 获取每一条的所有项
   */
  getInner(data, rowData){
    let Tag = new Array();
    for(var z in data){
      Tag.push(
        <View key={z} style={{flex:1}}>
          <View style={[itemStyle,z==='name'?{justifyContent:'space-between'}:{justifyContent:'flex-start'}]}>
            {
              z==='name'?
                <Text
                  style={{
                    fontSize:16*fontScale,
                    color:'#333',
                    marginBottom:12
                  }}
                >
                  {data[z]}
                </Text>:
                <Text style={innerStyle}>{this.getTitle(z)}</Text>
            }
            {
              z==='name'?
                this.getDelTag(rowData):
                <Text style={innerStyle}>{data[z]}</Text>
            }
          </View>
        </View>
      );
    }
    return Tag;
  }

  /**
   * 组合列表项+按钮
   */
  renderListRow(rowData, sectionID, rowID){
    return (
      <View
        style={{
          borderTopWidth:distances.borderWidth,
          borderBottomWidth:distances.borderWidth,
          borderColor:colors.borderColor,
          backgroundColor:'#fff',
          marginTop:10,
        }}
      >
        <View style={{marginBottom:5, marginTop:15}}>
          {this.getInner(this.getItemData(rowData), rowData)}
        </View>
        <View
          style={{
                width:distances.deviceWidth,
                height:50,
                flexDirection: 'row',
                alignItems:'center',
                backgroundColor:colors.bgColor,
                justifyContent:'flex-end',
                borderTopWidth:distances.borderWidth,
                borderColor:colors.borderColor,
                paddingRight:5,
              }}
        >
          <TouchableHighlight
            underlayColor='#fafafa'
            style={[{backgroundColor:'#fff'}, btnStyle]}
            onPress={()=>
                  Actions.viewStoreInfo({
                    routerData:{id:rowData.id, status:this.getStatus()?'update':'view'},
                    emitKey:emitKey1
                  })
                }
          >
            <Text style={{fontSize:13*fontScale, color:colors.blueColor}}>查看详情</Text>
          </TouchableHighlight>
          {
            this.getStatus()?
              <TouchableHighlight
                underlayColor='#fafafa'
                style={[{backgroundColor:'#fff'}, btnStyle]}
                onPress={()=>{Actions.sendToMerchant({routerData:{id:rowData.id}})}}
              >
                <Text style={{fontSize:13*fontScale, color:colors.blueColor}}>发给商户</Text>
              </TouchableHighlight>:
              null
          }
          {
            this.getStatus()?
              <TouchableHighlight
                underlayColor='#fafafa'
                style={[{backgroundColor:colors.blueColor}, btnStyle]}
                onPress={()=>{this.subData(rowData.id)}}
              >
                <Text style={{fontSize:13*fontScale, color:'#fff'}}>提交申请</Text>
              </TouchableHighlight>:
              null
          }
        </View>
      </View>
    );
  }

  renderFooter(){
    let ended = (typeof this.props.ended === 'boolean' && this.props.ended) ? true : false
    return (
      <ListFoot loadEnd={ended} error={this.props.list_error} moreTouchPress={this.loadMoreDatas}/>
    )
  }

  goReloadData(){
    this.props.myactions.reloadData(
      '/am_api/am/store/listPage',
      {
        _AT:global.UserInfo.token,
        type: this.props.type,
        page: {
          limit:this.props.limit,
          next_key:0
        }
      },
      this.reloadDatas
    )
  }

  async reloadDatas(client, path, param){
    try{
      let data = await client.post(path, {data: param});
      if(data.list.length>0){
        this.props.myactions.setState(
          {
            list:data.list,
            next_key:data.next_key,
            ended:data.ended,
            queryOK:true,
          },
          true
        )
      } else {
        this.props.myactions.setState(
          {
            list:[],
            ended:true,
            queryOK:false,
          },
          true
        )
      }
      return data
    }catch(e){
      console.log('reloadDatas:'+e)
    }
  }

  goLoadMoreData(){
    if(this.props.ended)
      return;
    this.props.myactions.loadMoreData(
      '/am_api/am/store/listPage',
      {
        _AT:global.UserInfo.token,
        type: this.props.type,
        page: {
          limit:this.props.limit,
          next_key:this.props.next_key
        }
      },
      this.loadMoreDatas
    )
  }

  async loadMoreDatas(client, path, param){
    try{
      let data = await client.post(path, {data: param});
      if(data.list.length>0){
        let list = this.props.list.concat(data.list);
        this.props.myactions.setState(
          {
            list:list,
            next_key:data.next_key,
            ended:data.ended,
            queryOK:true,
          },
          true
        )
      } else {
        this.props.myactions.setState(
          {
            ended:true,
            queryOK:false,
          },
          true
        )
      }
      return data
    }catch(e){
      console.log('loadMoreData:'+e)
    }
  }

  render(){
    let { list=new Array(), queryOK, list_loading, list_refreshing } = this.props;
    return(
      queryOK?
      <ListView
        style={{flex: 1}}
        data={list}
        renderListRow={this.renderListRow}
        renderFooter={this.renderFooter}
        loadMoreData={this.goLoadMoreData}
        reloadLists={this.goReloadData}
        loading={list_loading}
        refreshing={list_refreshing}
      />:
      <ListNoData
        visible={true}
        icon={require('./../../../../sources/images/list_no_data.png')}
        des='暂时没有哦'
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreListItem)