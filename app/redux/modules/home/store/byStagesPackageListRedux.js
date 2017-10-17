/**
 * Created by Joe on 2017/6/26.
 */
const BYSTAGESPACKAGELIST_SETSTATE = 'haoqix/BYSTAGESPACKAGELIST_SETSTATE'
const BYSTAGESPACKAGELIST_RSETSTATE = 'haoqix/BYSTAGESPACKAGELIST_RSETSTATE'
const BYSTAGESPACKAGELIST_LOAD_START = 'haoqix/BYSTAGESPACKAGELIST_LOAD_START'
const BYSTAGESPACKAGELIST_LOAD_SUCCESS = 'haoqix/BYSTAGESPACKAGELIST_LOAD_SUCCESS'
const BYSTAGESPACKAGELIST_LOAD_FAIL = 'haoqix/BYSTAGESPACKAGELIST_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  editable:{
    name:true,
    course_num:true,
    original_price:true,
    current_price:true,
    instalment:true,
    monthly_repayment:true,
    album:true,
  },
  list: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case BYSTAGESPACKAGELIST_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case BYSTAGESPACKAGELIST_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case BYSTAGESPACKAGELIST_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case BYSTAGESPACKAGELIST_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case BYSTAGESPACKAGELIST_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        editable:{
          name:true,
          course_num:true,
          original_price:true,
          current_price:true,
          instalment:true,
          monthly_repayment:true,
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
    types: [ BYSTAGESPACKAGELIST_LOAD_START, BYSTAGESPACKAGELIST_LOAD_SUCCESS, BYSTAGESPACKAGELIST_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: BYSTAGESPACKAGELIST_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: BYSTAGESPACKAGELIST_RSETSTATE
  }
}