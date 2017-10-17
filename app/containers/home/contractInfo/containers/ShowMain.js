/**
 * Created by Joe on 2017/3/10.
 */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import MainContract from '../../contract/components/MainContract'
import {ButtonComponent} from '../components/common'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {setData, resetData} from '../../../../redux/modules/contract/info/showMainReducer'

const mapStateToProps = state=>({
  isRender:state.infoShowMain.isRender,                      //是否渲染
  editable:state.infoShowMain.editable,                      //是否可编辑
  id:state.infoShowMain.id,                                  //企业id,新建企业无id
  code:state.infoShowMain.code,                              //编号
  signed_date:state.infoShowMain.signed_date,                //签约日期
  from_date:state.infoShowMain.from_date,                    //开始日期
  to_date:state.infoShowMain.to_date,                        //结束日期
  am_name:state.infoShowMain.am_name,                        //签约AM
  name:state.infoShowMain.name,              //企业名称
  reg_code:state.infoShowMain.reg_code,                      //工商注册号
  area:state.infoShowMain.area,                              //所在地区
  area_code:state.infoShowMain.area_code,                              //所在地区
  address:state.infoShowMain.address,                        //详细地址
  legal_person:state.infoShowMain.legal_person,              //法人姓名
  legal_person_detail:state.infoShowMain.legal_person_detail,//法人联系方式
  legal_person_idcard:state.infoShowMain.legal_person_idcard,//法人身份证号
  account_type:state.infoShowMain.account_type,                      //账号类型 1:对公账号,2:对私账号
  account_name:state.infoShowMain.account_name,                      //账号名称
  bank_name:state.infoShowMain.bank_name,                    //开户银行
  bank_account:state.infoShowMain.bank_account,              //银行账号
  contacts:state.infoShowMain.contacts,                        //联系人信息
  contract_pics:state.infoShowMain.contract_pics             //图片信息
})

const mapDispatchToProps = (dispatch)=>({
  myactions: bindActionCreators({setData, resetData}, dispatch), dispatch
})

class ShowMainContract extends Component{
  constructor(props){
    super(props)
    this.getMainContactData = this.getMainContactData.bind(this)
  }

  componentWillMount(obj){
    // console.log('ShowMain routerData===>', this.props.routerData)
    if(this.props.routerData)
      this.props.myactions.setData( _.cloneDeep(this.props.routerData), true );
  }

  componentWillUnmount(){
    this.props.myactions.resetData();
  }

  shouldComponentUpdate(np, ns){
    return np.isRender;
  }

  getMainContactData(){
		return {
      editable:this.props.editable,
      code:this.props.code,
      signed_date : this.props.signed_date,
      from_date : this.props.from_date,
      to_date : this.props.to_date,
      am_name : this.props.am_name,
      name : this.props.name,
      reg_code : this.props.reg_code,
      area : this.props.area,
      address : this.props.address,
      legal_person : this.props.legal_person,
      legal_person_detail : this.props.legal_person_detail,
      legal_person_idcard : this.props.legal_person_idcard,
      account_type : this.props.account_type,
      account_name : this.props.account_name,
      bank_name : this.props.bank_name,
      bank_account : this.props.bank_account,
      contacts : this.props.contacts,
      contract_pics : this.props.contract_pics,
    }
  }

  render(){
    return(
      <ScrollView
        style={{backgroundColor: colors.bgColor, flex: 1}}
        scrollEnabled={typeof this.props.scrollEnabled != 'undefined' ?this.props.scrollEnabled:true}
      >
        <MainContract data={this.getMainContactData()} contractCallback={this.contractCallback}/>
        <ButtonComponent 
          type={(typeof this.props.btnType == 'number') ? this.props.btnType : 0}
          btnTouch={this.props.editTouch}
        />
      </ScrollView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowMainContract)