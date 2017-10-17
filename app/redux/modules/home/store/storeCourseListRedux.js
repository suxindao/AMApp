/**
 * Created by Joe on 2017/5/4.
 */
const STORECOURSELIST_SETSTATE = 'haoqix/STORECOURSELIST_SETSTATE'
const STORECOURSELIST_RSETSTATE = 'haoqix/STORECOURSELIST_RSETSTATE'
const STORECOURSELIST_LOAD_START = 'haoqix/STORECOURSELIST_LOAD_START'
const STORECOURSELIST_LOAD_SUCCESS = 'haoqix/STORECOURSELIST_LOAD_SUCCESS'
const STORECOURSELIST_LOAD_FAIL = 'haoqix/STORECOURSELIST_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  editable:{
    name:true,
    student:true,
    class_min:true,
    desc:true,
    album:true,
  },
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case STORECOURSELIST_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case STORECOURSELIST_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case STORECOURSELIST_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case STORECOURSELIST_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case STORECOURSELIST_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        editable:{
          name:true,
          student:true,
          class_min:true,
          desc:true,
          album:true,
        },
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
    types: [ STORECOURSELIST_LOAD_START, STORECOURSELIST_LOAD_SUCCESS, STORECOURSELIST_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: STORECOURSELIST_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: STORECOURSELIST_RSETSTATE
  }
}