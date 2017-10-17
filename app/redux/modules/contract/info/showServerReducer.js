/**
 * create at 03/27/17
 */
const SET_DATA = 'haoqix/AM_CONTRACT_INFO_SERVER_SET_DATA'
const RESET = 'haoqix/AM_CONTRACT_INFO_SERVER_RESET'

const initialState = {
  loading: false,
  loading_success: false,
  load: true,
  isRender: true,
  editable:{
    name:false,
    code:true,
    signed_date:true,
    from_date:true,
    to_date:true,
    am_name:false,
    srv_instalment:true,
    fin_codes:true,
    srv_straight:true,
    straight_fee:true,
    srv_mini:true,
    srv_roll:true,
    stores:true,
    contract_pics:true,
  },
  name:'',//企业名称
  enterprise_id:1,//企业id
  main_contract_id:'',//主体合同id
  contract_id:'',//合同id
  code:'',//编号
  signed_date:new Date().Format('yyyy-MM-dd'),//签约日期
  from_date:new Date().Format('yyyy-MM-dd'),//开始日期
  to_date:new Date().Format('yyyy-MM-dd'),//结束日期
  am_name:'',//签约AM
  srv_instalment:0,//签约服务_分期合作: 0-无 1-有
  fin_codes:'',//金融产品，多个用逗号分隔
  fin_names:'',//金融产品，多个用逗号分隔
  fin_codes_info:'',//金融产品，多个用逗号分隔
  srv_straight:0,//签约服务_直通车合作: 0-无 1-有
  straight_fee:0,//签约服务_直通车金额
  srv_mini:0,//签约服务_MINI课推广: 0-无 1-有
  srv_roll:0,//签约服务_客多多推广: 0-无 1-有
  stores:[],//门店信息
  contract_pics:[]//图片信息
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case SET_DATA:
      return {
        ...state,
        ...action.obj
      }
    case RESET:
      state = {
        loading: false,
        loading_success: false,
        load: true,
        isRender: true,
        editable:{
          name:false,
          code:true,
          signed_date:true,
          from_date:true,
          to_date:true,
          am_name:false,
          srv_instalment:true,
          fin_codes:true,
          srv_straight:true,
          straight_fee:true,
          srv_mini:true,
          srv_roll:true,
          stores:true,
          contract_pics:true,
        },
        name:'',//企业名称
        enterprise_id:1,//企业id
        main_contract_id:'',//主体合同id
        contract_id:'',//合同id
        code:'',//编号
        signed_date:new Date().Format('yyyy-MM-dd'),//签约日期
        from_date:new Date().Format('yyyy-MM-dd'),//开始日期
        to_date:new Date().Format('yyyy-MM-dd'),//结束日期
        am_name:'',//签约AM
        srv_instalment:0,//签约服务_分期合作: 0-无 1-有
        fin_codes:'',//金融产品，多个用逗号分隔
        fin_names:'',//金融产品，多个用逗号分隔
        fin_codes_info:'',//金融产品，多个用逗号分隔
        srv_straight:0,//签约服务_直通车合作: 0-无 1-有
        straight_fee:'',//签约服务_直通车金额
        srv_mini:0,//签约服务_MINI课推广: 0-无 1-有
        srv_roll:0,//签约服务_客多多推广: 0-无 1-有
        stores:[],//门店信息
        contract_pics:[]//图片信息
      };
      return state
    default:
      return state
  }
}

export function setData(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: SET_DATA,
    obj,
  }
}

export function resetData(){
  return {
    type: RESET
  }
}