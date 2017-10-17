/**
 * Created by Joe on 2017/3/20.
 */
const SEARCHENTERPRISE_SETSTATE = 'haoqix/SEARCHENTERPRISE_SETSTATE'
const SEARCHENTERPRISE_RSETSTATE = 'haoqix/SEARCHENTERPRISE_RSETSTATE'

const SEARCHENTERPRISE_LOAD_START = 'haoqix/SEARCHENTERPRISE_LOAD_START'
const SEARCHENTERPRISE_LOAD_SUCCESS = 'haoqix/SEARCHENTERPRISE_LOAD_SUCCESS'
const SEARCHENTERPRISE_LOAD_FAIL = 'haoqix/SEARCHENTERPRISE_LOAD_FAIL'
const SEARCHENTERPRISE_MORE_START = 'haoqix/SEARCHENTERPRISE_MORE_START'
const SEARCHENTERPRISE_MORE_SUCCESS = 'haoqix/SEARCHENTERPRISE_MORE_SUCCESS'
const SEARCHENTERPRISE_MORE_FAIL = 'haoqix/SEARCHENTERPRISE_MORE_SUCCESS'
const SEARCHENTERPRISE_RELOAD_START = 'haoqix/SEARCHENTERPRISE_RELOAD_START'
const SEARCHENTERPRISE_RELOAD_SUCCESS = 'haoqix/SEARCHENTERPRISE_RELOAD_SUCCESS'
const SEARCHENTERPRISE_RELOAD_FAIL = 'haoqix/SEARCHENTERPRISE_RELOAD_FAIL'
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
  queryOK: false,
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case SEARCHENTERPRISE_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case SEARCHENTERPRISE_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case SEARCHENTERPRISE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case SEARCHENTERPRISE_MORE_START:
      return {
        ...state,
        list_loading: true,
        list_error: null,
      }
    case SEARCHENTERPRISE_MORE_SUCCESS:
      return {
        ...state,
        list_loading: false,
        list_error: null,
      }
    case SEARCHENTERPRISE_MORE_FAIL:
      return {
        ...state,
        list_loading: false,
        list_error: action.error,
      }
    case SEARCHENTERPRISE_RELOAD_START:
      return {
        ...state,
        list_refreshing: true,
        list_error: null,
      }
    case SEARCHENTERPRISE_RELOAD_SUCCESS:
      return {
        ...state,
        list_refreshing: false,
        list_error: null,
      }
    case SEARCHENTERPRISE_RELOAD_FAIL:
      return {
        ...state,
        list_refreshing: false,
        list_error: action.error,
      }
    case SEARCHENTERPRISE_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case SEARCHENTERPRISE_RSETSTATE:
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
        queryOK: false,
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
    types: [ SEARCHENTERPRISE_LOAD_START, SEARCHENTERPRISE_LOAD_SUCCESS, SEARCHENTERPRISE_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function loadMoreData(path, param, fun){
  return {
    types: [ SEARCHENTERPRISE_MORE_START, SEARCHENTERPRISE_MORE_SUCCESS, SEARCHENTERPRISE_MORE_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function reloadData(path, param, fun){
  return {
    types: [ SEARCHENTERPRISE_RELOAD_START, SEARCHENTERPRISE_RELOAD_SUCCESS, SEARCHENTERPRISE_RELOAD_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function setSearchEnterpriseState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: SEARCHENTERPRISE_SETSTATE,
    obj,
  }
}

export function rsetSearchEnterpriseState(){
  return {
    type: SEARCHENTERPRISE_RSETSTATE
  }
}