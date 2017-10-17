/**
 * Created by Joe on 2017/5/31.
 */
const LOAD_START = 'haoqix/STORE_MYSTOREPAGE_LOAD_START'
const LOAD_SUCCESS = 'haoqix/STORE_MYSTOREPAGE_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/STORE_MYSTOREPAGE_LOAD_FAIL'
const MORE_START = 'haoqix/STORE_MYSTOREPAGE_MORE_START'
const MORE_SUCCESS = 'haoqix/STORE_MYSTOREPAGE_MORE_SUCCESS'
const MORE_FAIL = 'haoqix/STORE_MYSTOREPAGE_MORE_FAIL'
const RELOAD_START = 'haoqix/STORE_MYSTOREPAGE_RELOAD_START'
const RELOAD_SUCCESS = 'haoqix/STORE_MYSTOREPAGE_RELOAD_SUCCESS'
const RELOAD_FAIL = 'haoqix/STORE_MYSTOREPAGE_RELOAD_FAIL'
const SETSTATE = 'haoqix/STORE_MYSTOREPAGE_SETSTATE'
const RSETSTATE = 'haoqix/STORE_MYSTOREPAGE_RSETSTATE'
import {LIST_ITEM_COUNT} from '../../../../constants/default.config';

const initialState = {
  loading: true,
  loading_success: false,
  list_loading: false,
  list_refresh: false,
  list_error: null,
  ended: false,
  next_key: '',
  limit: LIST_ITEM_COUNT,
  queryOK: true,
  list: [],
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case MORE_START:
      return {
        ...state,
        list_loading: true,
        list_error: null
      }
    case MORE_SUCCESS:
      return {
        ...state,
        list_loading: false,
        list_error: null
      }
    case MORE_FAIL:
      return {
        ...state,
        list_loading: false,
        list_error: action.error
      }
    case RELOAD_START:
      return {
        ...state,
        list_refresh: true,
        list_error: null
      }
    case RELOAD_SUCCESS:
      return {
        ...state,
        list_refresh: false,
        list_error: null
      }
    case RELOAD_FAIL:
      return {
        ...state,
        list_refresh: false,
        list_error: action.error
      }
    case SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case RSETSTATE:
      state = {
        loading: true,
        loading_success: false,
        list_loading: false,
        list_refresh: false,
        list_error: null,
        ended: false,
        next_key: '',
        limit: LIST_ITEM_COUNT,
        queryOK: true,
        list: [],
      };
      return state
    default:
      return state
  }
}

export function loadData(path, param, fun){
  return {
    types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => fun(client, path, param),
  }
}

export function loadMoreData(path, param, fun){
  return {
    types: [MORE_START, MORE_SUCCESS, MORE_FAIL],
    promise: (client) => fun(client, path, param),
  }
}

export function reloadData(path, param, fun){
  return {
    types: [RELOAD_START, RELOAD_SUCCESS, RELOAD_FAIL],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: RSETSTATE
  }
}