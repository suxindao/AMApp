/**
 * create at 06/21/17
 */
const LOAD_START = 'haoqix/AM_MINE_MESSAGE_LIST_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_MINE_MESSAGE_LIST_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_MINE_MESSAGE_LIST_LOAD_FAIL'
const MORE_START = 'haoqix/AM_MINE_MESSAGE_LIST_MORE_START'
const MORE_SUCCESS = 'haoqix/AM_MINE_MESSAGE_LIST_MORE_SUCCESS'
const MORE_FAIL = 'haoqix/AM_MINE_MESSAGE_LIST_MORE_FAIL'
const RELOAD_START = 'haoqix/AM_MINE_MESSAGE_LIST_RELOAD_START'
const RELOAD_SUCCESS = 'haoqix/AM_MINE_MESSAGE_LIST_RELOAD_SUCCESS'
const RELOAD_FAIL = 'haoqix/AM_MINE_MESSAGE_LIST_RELOAD_FAIL'
const SETSTATE = 'haoqix/AM_MINE_MESSAGE_SETSTATE'
const RSETSTATE = 'haoqix/AM_MINE_MESSAGE_RSETSTATE'
import {LIST_ITEM_COUNT} from '../../../constants/default.config';

const initialState = {
	list_loading: false,
  list_refresh: false,
  list_error: null,
	ended: true,
	next_key: '',
	limit: LIST_ITEM_COUNT,
	list: []
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
		case SETSTATE:
			return {
				...state,
				...action.obj
			}
		case RSETSTATE:
			state = {
				list_loading: false,
				list_refresh: false,
				list_error: null,
				ended: true,
				next_key: '',
				limit: LIST_ITEM_COUNT,
				list: []
			};
			return state
		default:
			return state
	}
}

export function loadData(fun, list){
	return {
		types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => fun(list),
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

export function setState(obj, isRender){
	typeof isRender != 'undefined' ? obj.isRender = isRender : null;
	return{
		type:SETSTATE,
		obj
	}
}

export function rsetState(){
	return{
		type:RSETSTATE
	}
}