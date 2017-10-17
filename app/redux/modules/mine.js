/**
 * create at 03/31/17
 */
const UPGRADE_START = 'haoqix/AM_MINE_UPGRADE_START'
const UPGRADE_SUCCESS = 'haoqix/AM_MINE_UPGRADE_SUCCESS'
const UPGRADE_FAIL = 'haoqix/AM_MINE_UPGRADE_FAIL'
const MESSAGE_START = 'haoqix/AM_MINE_CHECK_MESSAGE_START'
const MESSAGE_SUCCESS = 'haoqix/AM_MINE_CHECK_MESSAGE_SUCCESS'
const MESSAGE_FAIL = 'haoqix/AM_MINE_CHECK_MESSAGE_FAIL'

const initialState = {
	upgrade_loading: true,
	upgrade_loading_success: false,
	message_loading: true,
	message_loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
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
		case MESSAGE_START:
			return {
				...state,
				message_loading: true,
				message_loading_success: false, 
			}
		case MESSAGE_SUCCESS:
			return {
				...state,
				message_loading: false,
				message_loading_success: true
			}
		case MESSAGE_FAIL:
			return {
				...state,
				message_loading: false,
				message_loading_success: false,
			}
    default:
      return state
  }
}

export function upgradeInfo(fun){
	return{
		types: [UPGRADE_START, UPGRADE_SUCCESS, UPGRADE_FAIL],
		promise: fun
	}
}

export function messageCheck(fun){
	return{
		types: [MESSAGE_START, MESSAGE_SUCCESS, MESSAGE_FAIL],
		promise: fun
	}
}