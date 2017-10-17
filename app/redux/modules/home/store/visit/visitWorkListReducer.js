/**
 * Created on 2017/7/18.
 */
const LOAD_START = 'haoqix/AM_HOME_ACTIVITY_VISIT_WORKLIST_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_HOME_ACTIVITY_VISIT_WORKLIST_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_HOME_ACTIVITY_VISIT_WORKLIST_LOAD_FAIL'

const initialState = {
  loading: true,
  loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    default:
      return state
  }
}

export function loadData(fun){
  return {
    types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
    promise: fun,
  }
}