/**
 * create at 07/04/17
 * 首页门店类型
 */
import {outputdollars} from '../utils/validate'

/**
 * 数据时间维度类型
 */
export const lookDateType = {
	day: 'LOOK_DAY_DATA', // 日数据
	month: 'LOOK_MONTH_DATA' // 月数据
}
/**
 * 门店活跃状态类型
 */ 
export const storeStatusType = {
	dayBails: 'bails', // 日进件
	dayLoans: 'loans', // 日放款
	monthBails: 'bails',    // 本月进件
	monthLoans: 'loans',    // 本月放款
  monthNewSign: 'newly_activated',   // 本月新签激活门店
  monthFrozen: 'frozen_activated',      // 本月冰冻激活门店
  monthNoActive: 'inactive', // 本月非活跃门店
  guardActive: 'active',      // 防守门店 活跃门店
  guardWillActive: 'almost_active', // 防守门店 即将活跃门店
  guardLastMonth: 'active_last_month',   // 防守门店 上月出单门店
  noActiveNoLoan: 'no_loan',  // 未激活门店 未出单门店
  noActiveFrozen: 'almost_frozen',  // 未激活门店 转冰冻门店
}

// 月数据 
export const storeCode = {
	active: 'ACTIVE_STORE', 	// 活跃门店
	frozen: 'FROZEN_STORE',		// 冰冻门店
	inactive: 'INACTIVE_STORE', // 非活跃门店
}
// 月数据
export const keepStatus = {
	active: 'KEEP_ACTIVE',	// 活跃门店
	willActive: 'KEEP_WILL_ACTIVE',	// 即将活跃门店
	previousMonth: 'KEEP_PREVIOUS_MONTH'	// 上月出单门店
}
// 月数据
export const toBeStatus = {
	noLoan: 'NO_LOAN', // 未出单
	almostFrozen: 'ALMOST_FROZEN' // 转冰冻
}
// 日和月数据
export const loanBail = {
	loans: 'CURRENT_LOANS', // 本月/日放款
	bails: 'CURRENT_BAILS', // 本月/日进件
}

// 签约门店类型
export const signStoreType = {
	commit: 'COMMIT_SIGN', // 提交签约门店
	pass: 'SIGN_PASS', // 签约通过门店
}

// 本周和本月AM数据
export const currentStatsType = {
	week: 'CURRENT_WEEK_STATS', // 本周
	month: 'CURRENT_MONTH_STATS', // 本月
}
// 本周、本月数据升降序状态
export const currentSortStatus = {
	default: 'SORT_DEFAULT', // 无序
	ascend: 'SORT_ASCENDING_ORDER', // 升序
	descend: 'SORT_DESCENDING_ORDER' // 降序
}
// 本周、本月需要排序的元素
export const currentSortElement = {
	bailValue: 'SORT_ELEMENT_BAIL_VALUE', // 进件额度
	loanValue: 'SORT_ELEMENT_LOAN_VALUE', // 放款额度
	activeStore: 'SORT_ELEMENT_ACTIVE_STORE', // 活跃门店
	inactiveStore: 'SORT_ELEMENT_INACTIVE_STORE', // 非活跃门店
	noLoanStore: 'SORT_ELEMENT_NO_LOAN_STORE', // 未出单门店
	almostFrozenStore: 'SORT_ELEMENT_ALMOST_FROZEN_STORE', // 转冰冻门店
}

/**
 * 首页 日数据 和 月数据（在线门店）展示有单位的金钱
 * @param {*} money number or string
 */
export function manageMonney(money){
	if(typeof money === 'number' || typeof money === 'string'){
		// 先将money转换成number类型
		let moneyNum = parseInt(money)
		if(moneyNum>1000000){
			// 百万级别
			moneyNum = Math.round(moneyNum/10000)
			moneyNum = outputdollars(moneyNum)+'万'
		} else {
			moneyNum = outputdollars(moneyNum)
		}
		return moneyNum
	} else {
		return 0
	}
}

/**
 * 处理订单列表头部时间
 * @param {*} data 
 */
export function manageOrderTitleTime(data){
	let timeStr = ''
	if(!data){

	} else{
		if(data.year && data.month){
			// 有年和月
			timeStr = data.year+'年'+data.month+'月'
		} else if(data.year){
			timeStr = data.year+'年'
		} else if(data.month){
			timeStr = data.month+'月'
		}
	}
	return timeStr
}

/**
 * 对首页本周、本月数据进行排序
 * @param {*} stats array
 * @param {*} element currentSortElement
 * @param {*} status currentSortStatus
 */
export function sortStatsData(stats, element, status){
	let newStats = []
	if(status === currentSortStatus.default){
		return stats
	}
	if(Array.isArray(stats) && stats.length > 0){
		// 检验数组
		switch(element){
			case currentSortElement.bailValue:
				{
					newStats = bailSort(stats, status)
				}
				break;
			case currentSortElement.loanValue:
				{
					newStats = loanSort(stats, status)
				}
				break;
			case currentSortElement.activeStore:
				{
					newStats = activeStoreSort(stats, status)
				}
				break;
			case currentSortElement.inactiveStore:
				{
					newStats = inactiveStoreSort(stats, status)
				}
				break;
			case currentSortElement.noLoanStore:
				{
					newStats = noloanStoreSort(stats, status)
				}
				break;
			case currentSortElement.almostFrozenStore:
				{
					newStats = almostFrozenStoreSort(stats, status)
				}
				break;
			default:
				break;
		}
		return newStats
	}
	return stats
}
// 进件 排序
function bailSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkBail(a) && checkBail(b)){
				return a.bails.value-b.bails.value
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkBail(a) && checkBail(b)){
				return b.bails.value-a.bails.value
			}
		})
	}
	return newArr
}
// 进件 字段检查
function checkBail(item){
	if(item.bails && (typeof item.bails.value === 'number')){
		return true
	}
	return false
}
// 放款 排序
function loanSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkLoan(a) && checkLoan(b)){
				return a.loans.value-b.loans.value
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkLoan(a) && checkLoan(b)){
				return b.loans.value-a.loans.value
			}
		})
	}
	return newArr
}
// 放款 字段检查
function checkLoan(item){
	if(item.loans && (typeof item.loans.value === 'number')){
		return true
	}
	return false
}
// 活跃门店 排序
function activeStoreSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkActive(a) && checkActive(b)){
				return a.store.active.count-b.store.active.count
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkActive(a) && checkActive(b)){
				return b.store.active.count-a.store.active.count
			}
		})
	}
	return newArr
}
// 活跃门店 字段检查
function checkActive(item){
	if(item.store && item.store.active && (typeof item.store.active.count === 'number')){
		return true
	}
	return false
}
// 非活跃门店 排序
function inactiveStoreSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkInactive(a) && checkInactive(b)){
				return a.store.inactive.count-b.store.inactive.count
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkInactive(a) && checkInactive(b)){
				return b.store.inactive.count-a.store.inactive.count
			}
		})
	}
	return newArr
}
// 非活跃门店 字段检查
function checkInactive(item){
	if(item.store && item.store.inactive && (typeof item.store.inactive.count === 'number')){
		return true
	}
	return false
}
// 未出单门店 排序
function noloanStoreSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkNoloan(a) && checkNoloan(b)){
				return a.store.no_loan.count-b.store.no_loan.count
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkNoloan(a) && checkNoloan(b)){
				return b.store.no_loan.count-a.store.no_loan.count
			}
		})
	}
	return newArr
}
// 未出单门店 字段检查
function checkNoloan(item){
	if(item.store && item.store.no_loan && (typeof item.store.no_loan.count === 'number')){
		return true
	}
	return false
}
// 转冰冻门店 排序
function almostFrozenStoreSort(arr, status){
	let newArr = arr
	if(status === currentSortStatus.ascend){
		// 升序
		newArr = arr.sort(function(a, b){
			if(checkAlmostFrozen(a) && checkAlmostFrozen(b)){
				return a.store.almost_frozen.count-b.store.almost_frozen.count
			}
		})
	} else {
		// 降序
		newArr = arr.sort(function(a, b){
			if(checkAlmostFrozen(a) && checkAlmostFrozen(b)){
				return b.store.almost_frozen.count-a.store.almost_frozen.count
			}
		})
	}
	return newArr
}
// 转冰冻门店 字段检查
function checkAlmostFrozen(item){
	if(item.store && item.store.almost_frozen && (typeof item.store.almost_frozen.count === 'number')){
		return true
	}
	return false
}