/**
 * Created by Joe on 2017/3/22.
 */
const SEARCHSTORE_SETSTATE = 'haoqix/SEARCHSTORE_SETSTATE'
const SEARCHSTORE_RSETSTATE = 'haoqix/SEARCHSTORE_RSETSTATE'

const SEARCHSTORE_LOAD_START = 'haoqix/SEARCHSTORE_LOAD_START'
const SEARCHSTORE_LOAD_SUCCESS = 'haoqix/SEARCHSTORE_LOAD_SUCCESS'
const SEARCHSTORE_LOAD_FAIL = 'haoqix/SEARCHSTORE_LOAD_FAIL'
const SEARCHSTORE_MORE_START = 'haoqix/SEARCHSTORE_MORE_START'
const SEARCHSTORE_MORE_SUCCESS = 'haoqix/SEARCHSTORE_MORE_SUCCESS'
const SEARCHSTORE_MORE_FAIL = 'haoqix/SEARCHSTORE_MORE_SUCCESS'
const SEARCHSTORE_RELOAD_START = 'haoqix/SEARCHSTORE_RELOAD_START'
const SEARCHSTORE_RELOAD_SUCCESS = 'haoqix/SEARCHSTORE_RELOAD_SUCCESS'
const SEARCHSTORE_RELOAD_FAIL = 'haoqix/SEARCHSTORE_RELOAD_FAIL'
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
  list: [],
  account: {},
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case SEARCHSTORE_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case SEARCHSTORE_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case SEARCHSTORE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case SEARCHSTORE_MORE_START:
      return {
        ...state,
        list_loading: true,
        list_error: null,
      }
    case SEARCHSTORE_MORE_SUCCESS:
      return {
        ...state,
        list_loading: false,
        list_error: null,
      }
    case SEARCHSTORE_MORE_FAIL:
      return {
        ...state,
        list_loading: false,
        list_error: action.error,
      }
    case SEARCHSTORE_RELOAD_START:
      return {
        ...state,
        list_refreshing: true,
        list_error: null,
      }
    case SEARCHSTORE_RELOAD_SUCCESS:
      return {
        ...state,
        list_refreshing: false,
        list_error: null,
      }
    case SEARCHSTORE_RELOAD_FAIL:
      return {
        ...state,
        list_refreshing: false,
        list_error: action.error,
      }
    case SEARCHSTORE_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case SEARCHSTORE_RSETSTATE:
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
        list: [],
        account: {},
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
    types: [ SEARCHSTORE_LOAD_START, SEARCHSTORE_LOAD_SUCCESS, SEARCHSTORE_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function loadMoreData(path, param, fun){
  return {
    types: [ SEARCHSTORE_MORE_START, SEARCHSTORE_MORE_SUCCESS, SEARCHSTORE_MORE_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function reloadData(path, param, fun){
  return {
    types: [ SEARCHSTORE_RELOAD_START, SEARCHSTORE_RELOAD_SUCCESS, SEARCHSTORE_RELOAD_FAIL ],
    promise: (client) => fun(client, path, param)
  }
}

export function setSearchStoreState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: SEARCHSTORE_SETSTATE,
    obj,
  }
}

export function rsetSearchStoreState(){
  return {
    type: SEARCHSTORE_RSETSTATE
  }
}