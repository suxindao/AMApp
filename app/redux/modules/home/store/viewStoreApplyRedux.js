/**
 * Created by Joe on 2017/4/19.
 */
const VIEWSTOREAPPLY_SETSTATE = 'haoqix/VIEWSTOREAPPLY_SETSTATE'
const VIEWSTOREAPPLY_RSETSTATE = 'haoqix/VIEWSTOREAPPLY_RSETSTATE'

const VIEWSTOREAPPLY_LOAD_START = 'haoqix/VIEWSTOREAPPLY_LOAD_START'
const VIEWSTOREAPPLY_LOAD_SUCCESS = 'haoqix/VIEWSTOREAPPLY_LOAD_SUCCESS'
const VIEWSTOREAPPLY_LOAD_FAIL = 'haoqix/VIEWSTOREAPPLY_LOAD_FAIL'

const initialState = {
  isRender:true,
  count_data:'',
  loading: false,
  loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case VIEWSTOREAPPLY_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case VIEWSTOREAPPLY_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case VIEWSTOREAPPLY_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case VIEWSTOREAPPLY_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case VIEWSTOREAPPLY_RSETSTATE:
      state = {
        isRender:true,
        count_data:'',
        loading: false,
        loading_success: false,
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
    types: [ VIEWSTOREAPPLY_LOAD_START, VIEWSTOREAPPLY_LOAD_SUCCESS, VIEWSTOREAPPLY_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: VIEWSTOREAPPLY_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: VIEWSTOREAPPLY_RSETSTATE
  }
}