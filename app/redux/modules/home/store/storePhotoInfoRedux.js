/**
 * Created by Joe on 2017/4/27.
 */
const STOREPHOTOINFO_SETSTATE = 'haoqix/STOREPHOTOINFO_SETSTATE'
const STOREPHOTOINFO_RSETSTATE = 'haoqix/STOREPHOTOINFO_RSETSTATE'
const STOREPHOTOINFO_LOAD_START = 'haoqix/STOREPHOTOINFO_LOAD_START'
const STOREPHOTOINFO_LOAD_SUCCESS = 'haoqix/STOREPHOTOINFO_LOAD_SUCCESS'
const STOREPHOTOINFO_LOAD_FAIL = 'haoqix/STOREPHOTOINFO_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case STOREPHOTOINFO_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case STOREPHOTOINFO_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case STOREPHOTOINFO_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case STOREPHOTOINFO_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case STOREPHOTOINFO_RSETSTATE:
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
    types: [ STOREPHOTOINFO_LOAD_START, STOREPHOTOINFO_LOAD_SUCCESS, STOREPHOTOINFO_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: STOREPHOTOINFO_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: STOREPHOTOINFO_RSETSTATE
  }
}