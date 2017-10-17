/**
 * Created by Joe on 2017/4/21.
 */
const VIEWSTOREINFO_SETSTATE = 'haoqix/VIEWSTOREINFO_SETSTATE'
const VIEWSTOREINFO_RSETSTATE = 'haoqix/VIEWSTOREINFO_RSETSTATE'
const VIEWSTOREINFO_LOAD_START = 'haoqix/VIEWSTOREINFO_LOAD_START'
const VIEWSTOREINFO_LOAD_SUCCESS = 'haoqix/VIEWSTOREINFO_LOAD_SUCCESS'
const VIEWSTOREINFO_LOAD_FAIL = 'haoqix/VIEWSTOREINFO_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  store_info:{},
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case VIEWSTOREINFO_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case VIEWSTOREINFO_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case VIEWSTOREINFO_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case VIEWSTOREINFO_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case VIEWSTOREINFO_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        store_info:{},
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
    types: [ VIEWSTOREINFO_LOAD_START, VIEWSTOREINFO_LOAD_SUCCESS, VIEWSTOREINFO_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: VIEWSTOREINFO_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: VIEWSTOREINFO_RSETSTATE
  }
}