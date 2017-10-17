/**
 * Created by Joe on 2017/3/24.
 */
const ENTERPRISE_SETSTATE = 'haoqix/ENTERPRISE_SETSTATE'
const ENTERPRISE_RSETSTATE = 'haoqix/ENTERPRISE_RSETSTATE'

const ENTERPRISE_LOAD_START = 'haoqix/ENTERPRISE_LOAD_START'
const ENTERPRISE_LOAD_SUCCESS = 'haoqix/ENTERPRISE_LOAD_SUCCESS'
const ENTERPRISE_LOAD_FAIL = 'haoqix/ENTERPRISE_LOAD_FAIL'
const ENTERPRISE_MORE_START = 'haoqix/ENTERPRISE_MORE_START'
const ENTERPRISE_MORE_SUCCESS = 'haoqix/ENTERPRISE_MORE_SUCCESS'
const ENTERPRISE_MORE_FAIL = 'haoqix/ENTERPRISE_MORE_SUCCESS'
const ENTERPRISE_RELOAD_START = 'haoqix/ENTERPRISE_RELOAD_START'
const ENTERPRISE_RELOAD_SUCCESS = 'haoqix/ENTERPRISE_RELOAD_SUCCESS'
const ENTERPRISE_RELOAD_FAIL = 'haoqix/ENTERPRISE_RELOAD_FAIL'
import {LIST_ITEM_COUNT} from '../../../../constants/default.config';

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  list_loading: false,
  list_refreshing: false,
  list_error: null,
  ended: false,
  next_key: '',
  limit: LIST_ITEM_COUNT,
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case ENTERPRISE_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case ENTERPRISE_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case ENTERPRISE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case ENTERPRISE_MORE_START:
      return {
        ...state,
        list_loading: true,
        list_error: null,
      }
    case ENTERPRISE_MORE_SUCCESS:
      return {
        ...state,
        list_loading: false,
        list_error: null,
      }
    case ENTERPRISE_MORE_FAIL:
      return {
        ...state,
        list_loading: false,
        list_error: action.error,
      }
    case ENTERPRISE_RELOAD_START:
      return {
        ...state,
        list_refreshing: true,
        list_error: null,
      }
    case ENTERPRISE_RELOAD_SUCCESS:
      return {
        ...state,
        list_refreshing: false,
        list_error: null,
      }
    case ENTERPRISE_RELOAD_FAIL:
      return {
        ...state,
        list_refreshing: false,
        list_error: action.error,
      }
    case ENTERPRISE_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case ENTERPRISE_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        list_loading: false,
        list_refreshing: false,
        list_error: null,
        ended: false,
        next_key: '',
        limit: LIST_ITEM_COUNT,
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
    types: [ ENTERPRISE_LOAD_START, ENTERPRISE_LOAD_SUCCESS, ENTERPRISE_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function loadMoreData(path, param, fun){
  return {
    types: [ ENTERPRISE_MORE_START, ENTERPRISE_MORE_SUCCESS, ENTERPRISE_MORE_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function reloadData(path, param, fun){
  return {
    types: [ ENTERPRISE_RELOAD_START, ENTERPRISE_RELOAD_SUCCESS, ENTERPRISE_RELOAD_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function setEnterpriseState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: ENTERPRISE_SETSTATE,
    obj,
  }
}

export function rsetEnterpriseState(){
  return {
    type: ENTERPRISE_RSETSTATE
  }
}