/**
 * create at 03/11/17
 */
'use strict'
const CITY_START = 'haoqix/HOME_COMPANY_LOCATION_CITY_START'
const CHANGE_CITY = 'haoqix/HOME_COMPANY_CHANGE_CITY'

const initialState = {
	loading: true,
	currentCity: {
		id:110099,
		name:'北京'
	},
}

// test data
initialState.cities = [
	{
		id: 110099,
		name: '北京'
	},
	{
		id: 120099,
		name: '天津'
	},
	{
		id: 310099,
		name: '上海'
	},
]

export default function reducer(state = initialState, action = {}){
  switch(action.type){
		case CHANGE_CITY:
			return {
				...state,
				currentCity: action.city,
			}
    default:
      return state
  }
}

export function changeCity(city){
	return {
		type: CHANGE_CITY,
		city
	}
}