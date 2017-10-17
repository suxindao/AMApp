/**
 * Created by Joe on 2017/3/14.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { checkPhone, checkBankNo } from '../../../../constants/utils/validate'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import ServiceContract from '../../contract/components/ServiceContract'
import {ButtonComponent} from '../components/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {setData, resetData} from '../../../../redux/modules/contract/info/showServerReducer'

const mapStateToProps = state=>({
  isRender:state.infoShowServer.isRender,                      //是否渲染
  editable:state.infoShowServer.editable,                      //是否可编辑
  main_contract_id:state.infoShowServer.main_contract_id,      //主体合同id
  name:state.infoShowServer.name,              //企业名称
  enterprise_id:state.infoShowServer.enterprise_id,              //企业id
  reg_code:state.infoShowServer.reg_code,                      //工商注册号
  code:state.infoShowServer.code,                              //编号
  signed_date:state.infoShowServer.signed_date,                //签约日期
  from_date:state.infoShowServer.from_date,                    //开始日期
  to_date:state.infoShowServer.to_date,                        //结束日期
  am_name:state.infoShowServer.am_name,                        //签约AM
  srv_instalment:state.infoShowServer.srv_instalment,          //签约服务_分期合作: 0-无 1-有
  fin_codes:state.infoShowServer.fin_codes,                    //金融产品，多个用逗号分隔
  fin_names:state.infoShowServer.fin_names,                    //金融产品，多个用逗号分隔
  fin_codes_info:state.infoShowServer.fin_codes_info,          //金融产品，多个用逗号分隔
  srv_straight:state.infoShowServer.srv_straight,      //签约服务_直通车合作: 0-无 1-有
  straight_fee:state.infoShowServer.straight_fee,      //签约服务_直通车金额
  srv_mini:state.infoShowServer.srv_mini,                      //签约服务_MINI课推广: 0-无 1-有
  srv_roll:state.infoShowServer.srv_roll,                      //签约服务_客多多推广: 0-无 1-有
  stores:state.infoShowServer.stores,                          //门店信息
  contract_pics:state.infoShowServer.contract_pics             //图片信息
})

const mapDispatchToProps = (dispatch)=>({
  myactions: bindActionCreators({setData, resetData}, dispatch), dispatch
})
/**
 * 主体合同组件
 */
class ShowServerContract extends Component{
  constructor(props){
    super(props)
    
    this.getServiceContactData = this.getServiceContactData.bind(this);
  }

  componentWillMount(obj){
    if(this.props.routerData)
      this.props.myactions.setData( this.props.routerData, true );
  }

  componentWillUnmount(){
    this.props.myactions.resetData();
  }

  shouldComponentUpdate(np, ns){
    return np.isRender;
  }

  getServiceContactData(){
    return {
      editable:this.props.editable,
      main_contract_id:this.props.main_contract_id,
      name:this.props.name,
      enterprise_id:this.props.enterprise_id,
      reg_code:this.props.reg_code,
      code:this.props.code,
      signed_date : this.props.signed_date,
      from_date : this.props.from_date,
      to_date : this.props.to_date,
      am_name : this.props.am_name,
      srv_instalment : this.props.srv_instalment,
      fin_codes : this.props.fin_codes,
      fin_names : this.props.fin_names,
      fin_codes_info : this.props.fin_codes_info,
      srv_straight : this.props.srv_straight,
      straight_fee : this.props.straight_fee,
      srv_mini : this.props.srv_mini,
      srv_roll : this.props.srv_roll,
      stores : this.props.stores,
      contract_pics : this.props.contract_pics,
    }
  }

  render(){
    return(
      <ScrollView
        style={{backgroundColor: colors.bgColor, flex: 1}}
        scrollEnabled={typeof this.props.scrollEnabled != 'undefined' ?this.props.scrollEnabled:true}
      >
        <ServiceContract data={this.getServiceContactData()} contractCallback={this.contractCallback}/>
        <ButtonComponent 
          type={(typeof this.props.btnType == 'number') ? this.props.btnType : 0}
          btnTouch={this.props.editTouch}
        />
      </ScrollView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowServerContract)