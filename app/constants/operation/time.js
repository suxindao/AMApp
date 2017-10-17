/**
 * 处理时间和日期
 */
// verify 
import {verifyString} from '../utils/validate'

var moment = require('moment')

/**
 * 获取今天
 * 返回 string format("YYYY-MM-DD")
 */
export function getToday(){
	let today = moment().format('YYYY-MM-DD')
	return today
}

/**
 * 获取今天几个月前的一天或者几个月后的一天,（-,+）
 * @param {*} count number
 * 返回 string format("YYYY-MM-DD")
 */
export function getTargetDay(count){
	let targetDay = moment().add(count,'month').format('YYYY-MM-DD')
	return targetDay
}

/**
 * 获取某一天的开始时间和结束时间（毫秒）
 * @param {*} date string format("YYYY-MM-DD")
 */
export function getDayStartAndEnd(date){
	let startNum= 0, endNum = 0
	if(verifyString(date)){
		startNum = moment(date, 'YYYY-MM-DD').startOf('day').format('x')
		endNum = moment(date, 'YYYY-MM-DD').endOf('day').format('x')
	}
	return {startNum, endNum}
}

/**
 * 通过 某一具体日期，获取该月月初日期和月末日期
 * @param {*} date string format("YYYY-MM-DD")
 */
export function getMonthStartAndEnd(date){
	let startDay = '', endDay = ''
	if(verifyString(date)){
		startDay = moment(date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD')
		endDay = moment(date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
	}
	return {startDay, endDay}
}