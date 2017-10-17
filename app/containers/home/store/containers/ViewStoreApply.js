/**
 * Created by Joe on 2017/4/19.
 */
import React, { Component } from 'react';
import { View, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'
import WrapLoading from '../../../../components/load/wraploading'

// 界面组件
import ListViewSample from '../../../../components/list/ListSimple'
import ViewStoreListItem from '../components/ViewStoreListItem'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
//common
import { notification, store } from '../../../../constants/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
  loadData,
  setState,
  rsetState
} from '../../../../redux/modules/home/store/viewStoreApplyRedux'

const emitKey = notification.viewStore;

const mapStateToProps = state=>({
  isRender:state.viewStoreApply.isRender,                      //是否渲染
  loading:state.viewStoreApply.loading,
  loading_success:state.viewStoreApply.loading_success,
  count_data:state.viewStoreApply.count_data,                      //数据
})

const mapDispatchToProps = (dispatch)=>({
  myactions: bindActionCreators({
    loadData,
    setState,
    rsetState
  },dispatch), dispatch
})

/**
 * 建店申请
 */
class ViewStoreApply extends Component{
  constructor(props){
    super(props)
    this.getData = this.getData.bind(this)
    this.initLocalData = this.initLocalData.bind(this)
    this.renderListRow = this.renderListRow.bind(this)
    this.refresh = '';
  }

  componentWillMount(){
    this.getData();
    this.refresh = DeviceEventEmitter.addListener(emitKey, param => {this.getData();});
  }

  componentWillUnmount(){
    this.props.myactions.rsetState();
    this.refresh.remove();
  }

  shouldComponentUpdate(np, ns){
    return np.isRender;
  }

  /**
   * 初始化数据
   */
  getData(){
    this.props.myactions.loadData(
      '/am_api/am/store/main',
      {
        _AT:global.UserInfo.token,
      },
      this.initLocalData
    );
  }

  /**
   * 初始化数据
   */
  async initLocalData(client, path, param){
    try{
      let data = await client.post(path, {data: param});
      let obj = {};
      for (var z of data){
        if(z.code=='draft')
          obj.DRAFT=z.number;
        if(z.code=='rejected')
          obj.AUDITREJECTED=z.number;
        if(z.code=='audited')
          obj.PENDINGAUDIT=z.number;
        if(z.code=='passed')
          obj.AUDITTHROUGH=z.number;
      }
      this.props.myactions.setState({
        count_data:obj
      }, true);
      return data;
    }catch(e){
      console.log(e)
    }
  }

  /**
   * 返回首页列表
   */
  renderListRow(rowData, sectionID, rowID){
    // 获得每种状态门店的数量
    rowData.count = this.props.count_data[rowData.code];
    // 返回列表项
    return <ViewStoreListItem rowData={rowData} emitKey={emitKey}/>
  }

  render(){
    return(
      <WrapLoading {...this.props} onErrorPress={this.getData}>
        <View style={{backgroundColor: colors.bgColor, flex: 1}}>
          <ListViewSample
            style={{flex: 1}}
            scrollEnabled={false}
            renderListRow={this.renderListRow}
            data={store}
          />
        </View>
      </WrapLoading>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewStoreApply)