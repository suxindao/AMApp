/**
 * create at 03/11/17
 */

const CONTAINER_START = 'haoqix/HOME_CONTRACT_FIRST_CONTAINER_START'
const CONTAINER_SUCCESS = 'haoqix/HOME_CONTRACT_FIRST_CONTAINER_SUCCESS'
const CONTAINER_FAIL = 'haoqix/HOME_CONTRACT_FIRST_CONTAINER_FAIL'

const initialState = {
    loading: true,
    loading_success: false,
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
		case CONTAINER_START:
			return {
				...state,
				loading: true,
				loading_success: false,
			}
		case CONTAINER_SUCCESS:
			return {
				...state,
				loading: false,
				loading_success: true,
			}
		case CONTAINER_FAIL:
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
	return{
		types: [CONTAINER_START, CONTAINER_SUCCESS, CONTAINER_FAIL],
		promise: fun
	}
}