/**
 * Created by Joe on 2017/3/14.
 */
const CREATESERVICECON_SETSTATE = 'haoqix/CREATESERVICECON_SETSTATE'
const CREATESERVICECON_RSETSTATE = 'haoqix/CREATESERVICECON_RSETSTATE'
const CREATESERVICECON_LOAD_START = 'haoqix/CREATESERVICECON_LOAD_START'
const CREATESERVICECON_LOAD_SUCCESS = 'haoqix/CREATESERVICECON_LOAD_SUCCESS'
const CREATESERVICECON_LOAD_FAIL = 'haoqix/CREATESERVICECON_LOAD_FAIL'

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
  to_date:'',//结束日期
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
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case CREATESERVICECON_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case CREATESERVICECON_RSETSTATE:
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
        to_date:'',//结束日期
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
      };
      return state
    case CREATESERVICECON_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case CREATESERVICECON_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case CREATESERVICECON_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    default:
      return state
  }
}

export function loadData(path, param, fun){
  return{
    types: [ CREATESERVICECON_LOAD_START, CREATESERVICECON_LOAD_SUCCESS, CREATESERVICECON_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setCreateServiceConState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: CREATESERVICECON_SETSTATE,
    obj,
  }
}

export function rsetCreateServiceConState(){
  return {
    type: CREATESERVICECON_RSETSTATE
  }
}