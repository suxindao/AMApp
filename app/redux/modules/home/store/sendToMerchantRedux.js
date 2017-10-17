/**
 * Created by Joe on 2017/5/2.
 */
const SENDTOMERCHANT_SETSTATE = 'haoqix/SENDTOMERCHANT_SETSTATE'
const SENDTOMERCHANT_RSETSTATE = 'haoqix/SENDTOMERCHANT_RSETSTATE'
const SENDTOMERCHANT_LOAD_START = 'haoqix/SENDTOMERCHANT_LOAD_START'
const SENDTOMERCHANT_LOAD_SUCCESS = 'haoqix/SENDTOMERCHANT_LOAD_SUCCESS'
const SENDTOMERCHANT_LOAD_FAIL = 'haoqix/SENDTOMERCHANT_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case SENDTOMERCHANT_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case SENDTOMERCHANT_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case SENDTOMERCHANT_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case SENDTOMERCHANT_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case SENDTOMERCHANT_RSETSTATE:
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
    types: [ SENDTOMERCHANT_LOAD_START, SENDTOMERCHANT_LOAD_SUCCESS, SENDTOMERCHANT_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: SENDTOMERCHANT_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: SENDTOMERCHANT_RSETSTATE
  }
}