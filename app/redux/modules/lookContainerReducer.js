/**
 * create at 04/15/17
 */
const LOAD_START = 'haoqix/AM_LOOK_FIRST_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_LOOK_FIRST_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_LOOK_FIRST_LOAD_FAIL'

const RET_DATA = 'haoqix/AM_LOOK_FIRST_RET_DATA'

const initialState = {
	loading: true,
	loading_success: false,
	current_department: null, // 部门选择后的结果
	page_data: null, // 页面数据
	request_body: null, // 存储页面请求的body Data
	department_name: '', // 部门名字
	date_time: '', // 日期时间
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
				page_data: action.result.page_data,
				current_department: action.result.current_department,
				request_body: action.result.request_body,
				department_name: action.result.department_name,
				date_time: action.result.date_time,
			}
		case LOAD_FAIL:
			return {
				...state,
				loading: false,
				loading_success: false,
			}
		case RET_DATA:
			{
				state = initialState
				return {
					...state
				}
			}
		default:
			return state
	}
}

export function loadData(fun){
	return{
		types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
		promise: fun,
	}
}

export function resetLookData(){
	return {
		type: RET_DATA
	}
}