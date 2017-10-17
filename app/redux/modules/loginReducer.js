/**
 * create at 03/16/17
 */
const SUBMIT_START = 'haoqix/AM_LOGIN_SUBMIT_START'
const SUBMIT_SUCCESS = 'haoqix/AM_LOGIN_SUBMIT_SUCCESS'
const SUBMIT_FAIL = 'haoqix/AM_LOGIN_SUBMIT_FAIL'

const initialState = {
	submit_loading: false,
	submit_loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
		case SUBMIT_START:
			return {
				...state,
				submit_loading: true,
				submit_loading_success: false,
			}
		case SUBMIT_SUCCESS:
			return {
				...state,
				submit_loading: false,
				submit_loading_success: true,
			}
		case SUBMIT_FAIL:
			return {
				...state,
				submit_loading: false,
				submit_loading_success: false,
			}
    default:
      return state
  }
}

export function loginSubmit(fun){
	return {
		types: [SUBMIT_START, SUBMIT_SUCCESS, SUBMIT_FAIL],
		promise: fun
	}
}