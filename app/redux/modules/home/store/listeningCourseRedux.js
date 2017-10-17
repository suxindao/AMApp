/**
 * Created by Joe on 2017/4/25.
 */
const LOAD_START = 'haoqix/AM_HOME_STORE_LISTENINGCOURSE_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_HOME_STORE_LISTENINGCOURSE_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_HOME_STORE_LISTENINGCOURSE_LOAD_FAIL'
const PAGE_REFRESH = 'haoqix/AM_HOME_STORE_LISTENINGCOURSE_PAGE_REFRESH'

const initialState = {
  loading: true,
  loading_success: false,
  pageRefresh: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
        pageRefresh: false
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
    case PAGE_REFRESH:
      return {
        ...state,
        pageRefresh: true
      }
    default:
      return {
        ...state,
      }
  }
}

export function loadData(fun){
  return{
    types: [ LOAD_START, LOAD_SUCCESS, LOAD_FAIL ],
    promise: fun,
  }
}

export function setPageRefresh(){
  return {
    type: PAGE_REFRESH
  }
}