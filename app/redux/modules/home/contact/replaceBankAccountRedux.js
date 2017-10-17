/**
 * Created by Joe on 2017/3/24.
 */
const REPLACEBANKACCOUNT_SETSTATE = 'haoqix/REPLACEBANKACCOUNT_SETSTATE'
const REPLACEBANKACCOUNT_RSETSTATE = 'haoqix/REPLACEBANKACCOUNT_RSETSTATE'

const REPLACEBANKACCOUNT_LOAD_START = 'haoqix/REPLACEBANKACCOUNT_LOAD_START'
const REPLACEBANKACCOUNT_LOAD_SUCCESS = 'haoqix/REPLACEBANKACCOUNT_LOAD_SUCCESS'
const REPLACEBANKACCOUNT_LOAD_FAIL = 'haoqix/REPLACEBANKACCOUNT_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case REPLACEBANKACCOUNT_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case REPLACEBANKACCOUNT_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case REPLACEBANKACCOUNT_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case REPLACEBANKACCOUNT_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case REPLACEBANKACCOUNT_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        list: []
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
    types: [ REPLACEBANKACCOUNT_LOAD_START, REPLACEBANKACCOUNT_LOAD_SUCCESS, REPLACEBANKACCOUNT_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setReplaceBankAccountState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: REPLACEBANKACCOUNT_SETSTATE,
    obj,
  }
}

export function rsetReplaceBankAccountState(){
  return {
    type: REPLACEBANKACCOUNT_RSETSTATE
  }
}