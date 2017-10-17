/**
 * Created by Joe on 2017/5/3.
 */
const STORECOURSE_SETSTATE = 'haoqix/STORECOURSE_SETSTATE'
const STORECOURSE_RSETSTATE = 'haoqix/STORECOURSE_RSETSTATE'
const STORECOURSE_LOAD_START = 'haoqix/STORECOURSE_LOAD_START'
const STORECOURSE_LOAD_SUCCESS = 'haoqix/STORECOURSE_LOAD_SUCCESS'
const STORECOURSE_LOAD_FAIL = 'haoqix/STORECOURSE_LOAD_FAIL'

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
  data: {
    id: '',
    name: '',
    student_min: '',
    student_max: '',
    class_min: '',
    desc: '',
    album: {}
  }
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case STORECOURSE_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case STORECOURSE_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case STORECOURSE_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case STORECOURSE_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case STORECOURSE_RSETSTATE:
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
        data: {
          id: '',
          name: '',
          student_min: '',
          student_max: '',
          class_min: '',
          desc: '',
          album: {}
        }
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
    types: [ STORECOURSE_LOAD_START, STORECOURSE_LOAD_SUCCESS, STORECOURSE_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: STORECOURSE_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: STORECOURSE_RSETSTATE
  }
}