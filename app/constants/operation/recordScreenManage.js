/**
 * create at 06/08/17
 * 记录筛选
 */

// 时间选择类型
export const timeSelectObj = {
    all: 'TIME_ALL',	// 全部
    today: 'TIME_TODAY', // 今天
    custom: 'TIME_CUSTOM' // 自定义
}

// 类型选择
export const typeSelectObj = {
    all: 'TYPE_ALL',				// 全部
    tel: 'TYPE_TEL',  				// 电话拜访
    sign: 'TYPE_SIGN', 				// 签到拜访
    operation: 'TYPE_OPERATION' 	// 经营情况
}

// 初始化时间和部门数据
export const initTimeAndTypeObj = {
    time: {code: timeSelectObj.all, min: '', max: ''},
    type: {code: typeSelectObj.all}
}