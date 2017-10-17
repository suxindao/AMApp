/**
 * Created by Joe on 2017/6/26.
 */
/**
 * Created by Joe on 2017/3/20.
 */
const STORELITSITEM_SETSTATE = 'haoqix/STORELITSITEM_SETSTATE'
const STORELITSITEM_RSETSTATE = 'haoqix/STORELITSITEM_RSETSTATE'

const STORELITSITEM_LOAD_START = 'haoqix/STORELITSITEM_LOAD_START'
const STORELITSITEM_LOAD_SUCCESS = 'haoqix/STORELITSITEM_LOAD_SUCCESS'
const STORELITSITEM_LOAD_FAIL = 'haoqix/STORELITSITEM_LOAD_FAIL'
const STORELITSITEM_MORE_START = 'haoqix/STORELITSITEM_MORE_START'
const STORELITSITEM_MORE_SUCCESS = 'haoqix/STORELITSITEM_MORE_SUCCESS'
const STORELITSITEM_MORE_FAIL = 'haoqix/STORELITSITEM_MORE_SUCCESS'
const STORELITSITEM_RELOAD_START = 'haoqix/STORELITSITEM_RELOAD_START'
const STORELITSITEM_RELOAD_SUCCESS = 'haoqix/STORELITSITEM_RELOAD_SUCCESS'
const STORELITSITEM_RELOAD_FAIL = 'haoqix/STORELITSITEM_RELOAD_FAIL'
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
    case STORELITSITEM_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case STORELITSITEM_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case STORELITSITEM_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case STORELITSITEM_MORE_START:
      return {
        ...state,
        list_loading: true,
        list_error: null,
      }
    case STORELITSITEM_MORE_SUCCESS:
      return {
        ...state,
        list_loading: false,
        list_error: null,
      }
    case STORELITSITEM_MORE_FAIL:
      return {
        ...state,
        list_loading: false,
        list_error: action.error,
      }
    case STORELITSITEM_RELOAD_START:
      return {
        ...state,
        list_refreshing: true,
        list_error: null,
      }
    case STORELITSITEM_RELOAD_SUCCESS:
      return {
        ...state,
        list_refreshing: false,
        list_error: null,
      }
    case STORELITSITEM_RELOAD_FAIL:
      return {
        ...state,
        list_refreshing: false,
        list_error: action.error,
      }
    case STORELITSITEM_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case STORELITSITEM_RSETSTATE:
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
    types: [ STORELITSITEM_LOAD_START, STORELITSITEM_LOAD_SUCCESS, STORELITSITEM_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function loadMoreData(path, param, fun){
  return {
    types: [ STORELITSITEM_MORE_START, STORELITSITEM_MORE_SUCCESS, STORELITSITEM_MORE_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function reloadData(path, param, fun){
  return {
    types: [ STORELITSITEM_RELOAD_START, STORELITSITEM_RELOAD_SUCCESS, STORELITSITEM_RELOAD_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: STORELITSITEM_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: STORELITSITEM_RSETSTATE
  }
}