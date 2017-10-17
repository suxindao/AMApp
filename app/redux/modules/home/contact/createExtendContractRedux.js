/**
 * Created by Joe on 2017/7/18.
 */
const CREATEEXTENDCONTRACT_SETSTATE = 'haoqix/CREATEEXTENDCONTRACT_SETSTATE'
const CREATEEXTENDCONTRACT_RSETSTATE = 'haoqix/CREATEEXTENDCONTRACT_RSETSTATE'
const CREATEEXTENDCONTRACT_LOAD_START = 'haoqix/CREATEEXTENDCONTRACT_LOAD_START'
const CREATEEXTENDCONTRACT_LOAD_SUCCESS = 'haoqix/CREATEEXTENDCONTRACT_LOAD_SUCCESS'
const CREATEEXTENDCONTRACT_LOAD_FAIL = 'haoqix/CREATEEXTENDCONTRACT_LOAD_FAIL'

const initialState = {
  loading: false,
  loading_success: false,
  isRender: true,
  data : {
    enterprise_id:1,
    contract_id:270,
    main_contract_id:59,
    name:'测试名称',
    code:'',
    signed_date:new Date().Format('yyyy-MM-dd'),
    from_date:new Date().Format('yyyy-MM-dd'),
    to_date:new Date().Format('yyyy-MM-dd'),
    am_name:'张三',
    contacts:[
      {
        "status": "hz",
        "duty":'',
        "contact": "",
        "contact_detail": ""
      },
      {
        "status": "sc",
        "contact": "",
        "contact_detail": ""
      },
      {
        "status": "cw",
        "contact": "",
        "contact_detail": ""
      },
      {
        "status": "xs",
        "contact": "",
        "contact_detail": ""
      }
    ],
    stores:[],
    pics:[]
  },
  editable:{
    name:true,
    code:true,
    signed_date:true,
    from_date:true,
    to_date:true,
    am_name:true,
    contacts:true,
    stores:true,
    pics:true,
  }
}
// const initialState = {
//   loading: false,
//   loading_success: false,
//   isRender: true,
//   data : {
//     enterprise_id:'',
//     contract_id:'',
//     main_contract_id:'',
//     name:'',
//     code:'',
//     signed_date:new Date().Format('yyyy-MM-dd'),
//     from_date:new Date().Format('yyyy-MM-dd'),
//     to_date:'',
//     am_name:'',
//     contacts:[
//       {
//         "status": "hz",
//         "duty":'',
//         "contact": "",
//         "contact_detail": ""
//       },
//       {
//         "status": "sc",
//         "contact": "",
//         "contact_detail": ""
//       },
//       {
//         "status": "cw",
//         "contact": "",
//         "contact_detail": ""
//       },
//       {
//         "status": "xs",
//         "contact": "",
//         "contact_detail": ""
//       }
//     ],
//     stores:[],
//     pics:[]
//   },
//   editable:{
//     name:true,
//     code:true,
//     signed_date:true,
//     from_date:true,
//     to_date:true,
//     am_name:true,
//     contacts:true,
//     stores:true,
//     pics:true,
//   }
// }

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case CREATEEXTENDCONTRACT_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case CREATEEXTENDCONTRACT_RSETSTATE:
      state = {
        loading: false,
        loading_success: false,
        isRender: true,
        data : {
          enterprise_id:1,
          contract_id:270,
          main_contract_id:59,
          name:'测试名称',
          code:'',
          signed_date:new Date().Format('yyyy-MM-dd'),
          from_date:new Date().Format('yyyy-MM-dd'),
          to_date:new Date().Format('yyyy-MM-dd'),
          am_name:'张三',
          contacts:[
            {
              "status": "hz",
              "duty":'',
              "contact": "",
              "contact_detail": ""
            },
            {
              "status": "sc",
              "contact": "",
              "contact_detail": ""
            },
            {
              "status": "cw",
              "contact": "",
              "contact_detail": ""
            },
            {
              "status": "xs",
              "contact": "",
              "contact_detail": ""
            }
          ],
          stores:[],
          pics:[]
        },
        editable:{
          name:true,
          code:true,
          signed_date:true,
          from_date:true,
          to_date:true,
          am_name:true,
          contacts:true,
          stores:true,
          pics:true,
        }
      };
      return state
    case CREATEEXTENDCONTRACT_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case CREATEEXTENDCONTRACT_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case CREATEEXTENDCONTRACT_LOAD_FAIL:
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
    types: [ CREATEEXTENDCONTRACT_LOAD_START, CREATEEXTENDCONTRACT_LOAD_SUCCESS, CREATEEXTENDCONTRACT_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: CREATEEXTENDCONTRACT_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: CREATEEXTENDCONTRACT_RSETSTATE
  }
}