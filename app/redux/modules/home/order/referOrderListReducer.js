/**
 * create at 06/22/17
 */
const LOAD_START = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_LOAD_FAIL'
const MORE_START = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_MORE_START'
const MORE_SUCCESS = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_MORE_SUCCESS'
const MORE_FAIL = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_MORE_FAIL'
const RELOAD_START = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_RELOAD_START'
const RELOAD_SUCCESS = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_RELOAD_SUCCESS'
const RELOAD_FAIL = 'haoqix/AM_HOME_REFER_ORDER_ORDERLIST_RELOAD_FAIL'

const initialState = {
	loading: true,
	loading_success: false,
	list_loading: false,
  list_refresh: false,
  list_error: null,
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
		case MORE_START:
			return {
				...state,
				list_loading: true,
				list_error: null
			}
		case MORE_SUCCESS:
			return {
				...state,
				list_loading: false,
				list_error: null
			}
		case MORE_FAIL:
			return {
				...state,
				list_loading: false,
				list_error: action.error
			}
		case RELOAD_START:
			return {
				...state,
				list_refresh: true,
				list_error: null
			}
		case RELOAD_SUCCESS:
			return {
				...state,
				list_refresh: false,
				list_error: null
			}
		case RELOAD_FAIL:
			return {
				...state,
				list_refresh: false,
				list_error: action.error
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

export function loadMoreData(fun){
	return {
		types: [MORE_START, MORE_SUCCESS, MORE_FAIL],
		promise: fun,
	}
}

export function reloadData(fun){
	return {
		types: [RELOAD_START, RELOAD_SUCCESS, RELOAD_FAIL],
		promise: fun,
	}
}