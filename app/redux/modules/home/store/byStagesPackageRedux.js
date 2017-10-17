/**
 * Created by Joe on 2017/6/26.
 */
const BYSTAGESPACKAGE_SETSTATE = 'haoqix/BYSTAGESPACKAGE_SETSTATE'
const BYSTAGESPACKAGE_RSETSTATE = 'haoqix/BYSTAGESPACKAGE_RSETSTATE'
const BYSTAGESPACKAGE_LOAD_START = 'haoqix/BYSTAGESPACKAGE_LOAD_START'
const BYSTAGESPACKAGE_LOAD_SUCCESS = 'haoqix/BYSTAGESPACKAGE_LOAD_SUCCESS'
const BYSTAGESPACKAGE_LOAD_FAIL = 'haoqix/BYSTAGESPACKAGE_LOAD_FAIL'

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
  data: {
    id: '',
    course_id: '',
    name: '',
    course_num: '',
    original_price: '',
    current_price: '',
    instalment: 0,
    monthly_repayment: '',
    album: {}
  },
  instalment:[]
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case BYSTAGESPACKAGE_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case BYSTAGESPACKAGE_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case BYSTAGESPACKAGE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case BYSTAGESPACKAGE_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case BYSTAGESPACKAGE_RSETSTATE:
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
        data: {
          id: '',
          course_id: '',
          name: '',
          course_num: '',
          original_price: '',
          current_price: '',
          instalment: 0,
          monthly_repayment: '',
          album: {}
        },
        instalment:[]
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
    types: [ BYSTAGESPACKAGE_LOAD_START, BYSTAGESPACKAGE_LOAD_SUCCESS, BYSTAGESPACKAGE_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: BYSTAGESPACKAGE_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: BYSTAGESPACKAGE_RSETSTATE
  }
}