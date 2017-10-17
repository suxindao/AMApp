/**
 * create at 03/16/17
 */
const LOAD_START = 'haoqix/AM_START_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_START_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_START_LOAD_FAIL'

const UPGRADE_START = 'haoqix/AM_START_UPGRADE_START'
const UPGRADE_SUCCESS = 'haoqix/AM_START_UPGRADE_SUCCESS'
const UPGRADE_FAIL = 'haoqix/AM_START_UPGRADE_FAIL'

const initialState = {
	initializtion: true,
	upgrade_loading: true,
	upgrade_loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
		case LOAD_START:
			return {
				...state,
				initializtion: true,
			}
		case LOAD_SUCCESS:
			return {
				...state,
				initializtion: false,
			}
		case LOAD_FAIL:
			return {
				...state,
				initializtion: false,
			}
		case UPGRADE_START:
			return {
				...state,
				upgrade_loading: true,
				upgrade_loading_success: false, 
			}
		case UPGRADE_SUCCESS:
			return {
				...state,
				upgrade_loading: false,
				upgrade_loading_success: true
			}
		case UPGRADE_FAIL:
			return {
				...state,
				upgrade_loading: false,
				upgrade_loading_success: false,
			}
    default:
      return state
  }
}

export function initApp(fun){
	let pathValidateToken = '/mobile/auth/validate/token'
	return {
		types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
		promise: client => fun(client, pathValidateToken)
	}
}

export function upgradeInfo(fun){
	return{
		types: [UPGRADE_START, UPGRADE_SUCCESS, UPGRADE_FAIL],
		promise: fun
	}
}