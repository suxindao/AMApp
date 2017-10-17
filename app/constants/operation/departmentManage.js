/**
 * create at 06/03/17
 * 为了处理部门数据
 */

import _ from 'lodash'

// 部门选择之后类型
export const departmentBackType = {
	member: 'DEPARTMENT_MEMBER',  // 筛选之后到组员
	group: 'DEPARTMENT_GROUP',    // 筛选之后只到组
	city: 'DEPARTMENT_CITY'				// 筛选之后只到城市
}

export const departmentInitObj = {
	city:{ id: -1, name: '' },
	group: { id: -1, name: '' },
	member: { id: -1, name: '' }
}

/**
 * 从server得到数据， 处理成客户端显示的cities数据
 * @param {*} data 
 */
export function manageCitys(data){
	let citys = []
	let groups = []
	if(Array.isArray(data) && data.length > 0){
		data.forEach((item, idx)=>{
			let city = {
				name: Boolean(item.city) ? item.city : '',
				id: idx
			}
			citys.push(city)
			let group = Array.isArray(item.groups) ? item.groups : []
			groups.push(group)
		})
	}
	return {citys, groups}
}
/**
 * 从server得到数据， 处理成客户端显示的groups数据
 * @param {*} data 
 * @param {*} index 
 */
export function manageGroups(data, index){
	let groups = []
	if(!Array.isArray(data) || data.length == 0){
		return groups
	}
	let manageGroup = data[index]
	if(Array.isArray(manageGroup) && manageGroup.length > 0){
		manageGroup.forEach((item, idx)=>{
			let group = {
				name: Boolean(item.name) ? item.name : '',
				id: (typeof item.id == 'number') ? item.id : 0
			}
			groups.push(group)
		})
	}
	return groups
}
/**
 * 从server得到数据， 处理成客户端显示的members数据
 * @param {*} data 
 * @param {*} index 
 */
export function manageMembers(data, index){
	let members = []
	if(Array.isArray(data) && data.length > 0){
		data.forEach((item, idx)=>{
			let member = {
				name: Boolean(item.name) ? item.name : '',
				id: (typeof item.id === 'number') ? item.id : 0 
			}
			members.push(member)
		})
	}
	return members
}

/**
 * 处理请求组成员数据
 * @param {*} id 
 */
export function manageRequestMembers(id, groups){
	let arr = [], error = null
	if(id !== 0){
		// id 不为0 的情况
		arr.push(id)
	} else {
		// id 为0 的情况
		if(Array.isArray(groups) && groups.length > 1){
			groups.forEach((item, idx)=>{
				// 提出 item id为0的情况
				if(item.id !== 0){
					arr.push(item.id)
				}
			})
		} else {
			error = new Error('groups is not array or groups length 小于2')
		}
	}
	return {arr, error}
}

/**
 * 处理请求部门的body数据
 * 返回 {code, body}
 * @param {*} requestBody 原body数据
 * @param {*} resultData 选择之后的部门数据
 * @param {*} getData    请求下来的部门全部数据
 */
export function manageRequestBody(requestBody, data, requestData){
	let code = null, body = null, error_msg = '', arr = []
	body = _.cloneDeep(requestBody)

	if(Boolean(data.member) && (typeof data.member.id === 'number') && data.member.id > 0){
		// 有成员且不为全部情况，优先选择成员
		code = departmentBackType.member
		arr.push(data.member.id)

		// 设置参数
		body.am_id = arr
		body.group_id = null
	} else if(Boolean(data.group) && (typeof data.group.id === 'number') && data.group.id > 0) {
		// 组的id不为0的情况
		code = departmentBackType.group
		arr.push(data.group.id)
		// 设置参数
		body.am_id = null
		body.group_id = arr
	} else {
		code = departmentBackType.city
		// 组的id为0，或者只选择城市的情况
		if(Boolean(data.city) && (typeof data.city.id === 'number') && data.city.id > -1){
			let cityId = data.city.id

			if(Array.isArray(requestData) && requestData.length-1 >= cityId ){
				// requestData 是数据且它的长度大于等于（cityId+1）

				let cityItemsData = requestData[cityId]
				if(Array.isArray(cityItemsData.groups) && cityItemsData.groups.length > 0){
					// 把该城市下，组id都加起来
					cityItemsData.groups.forEach((item, idx)=>{
						if(Boolean(item.id) && item.id >0){
							arr.push(item.id)
						} 
					})	
					// 设置参数
					body.am_id = null
					body.group_id = arr
				} else {
					body = null
					error_msg = 'manageRequestBody cityItemsData length is 0 or groups is not array'
				}
			} else {
				body = null
				error_msg = 'manageRequestBody requestData不是数据或者数据长度不够'
			}
		} else {
			body = null
			error_msg = 'manageRequestBody city id is -1 or data中member，group,city数据为 null'
		}
	}
	return {code, body, error_msg}
}

/**
 * 处理显示的部门最终名字
 * @param {*} departmentObj , 符合部门data的结构
 * @param {*} oldName 
 */
export function manageShowName(departmentObj, oldName = ''){
	let nameAll = oldName
	let {city, group, member} = departmentObj
	let nameCity = manageName(city, oldName)		
	let nameCityAddGroup = manageName(group, nameCity)		
	nameAll = manageName(member, nameCityAddGroup)	
	return nameAll	
}
// 处理名字
function manageName(data, oldName){
	let newName = ''
	if(typeof data.id === 'number' && data.id >= 0){
		if(Boolean(data.name) && data.name.length > 0){
			if(oldName.length > 0){
				newName = oldName + "-" + data.name
			} else {
				newName = data.name
			}
		} else {
			newName = oldName
		}
	} else {
		newName = oldName
	}
	return newName
}