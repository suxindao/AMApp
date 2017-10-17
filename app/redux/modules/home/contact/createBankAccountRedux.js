/**
 * Created by Joe on 2017/3/24.
 */
const CREATEBANKACCOUNT_SETSTATE = 'haoqix/CREATEBANKACCOUNT_SETSTATE'
const CREATEBANKACCOUNT_RSETSTATE = 'haoqix/CREATEBANKACCOUNT_RSETSTATE'

const CREATEBANKACCOUNT_LOAD_START = 'haoqix/CREATEBANKACCOUNT_LOAD_START'
const CREATEBANKACCOUNT_LOAD_SUCCESS = 'haoqix/CREATEBANKACCOUNT_LOAD_SUCCESS'
const CREATEBANKACCOUNT_LOAD_FAIL = 'haoqix/CREATEBANKACCOUNT_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  account_type:'',
  account_name:'',
  bank_name:'',
  bank_account:'',
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case CREATEBANKACCOUNT_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case CREATEBANKACCOUNT_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case CREATEBANKACCOUNT_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case CREATEBANKACCOUNT_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case CREATEBANKACCOUNT_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        account_type:'',
        account_name:'',
        bank_name:'',
        bank_account:'',
      };
      return state
    default:
      return {
        ...state,
      }
  }
}

export function loadData(path, param, fun){
  return{
    types: [ CREATEBANKACCOUNT_LOAD_START, CREATEBANKACCOUNT_LOAD_SUCCESS, CREATEBANKACCOUNT_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setCreateBankAccountState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: CREATEBANKACCOUNT_SETSTATE,
    obj,
  }
}

export function rsetCreateBankAccountState(){
  return {
    type: CREATEBANKACCOUNT_RSETSTATE
  }
}