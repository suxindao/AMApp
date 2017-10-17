/**
 * create at 04/25/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

const LISTEN_COURSE_PATH = 'am_api/am/store/trial' // 查询
const COURSE_ADD_PATH = 'am_api/am/store/createTrial' // 添加
const CHANGE_COURSE_PATH = 'am_api/am/store/modifyTrial' // 修改

/**
 * 试听课程列表请求list
 * @param {*} condition 
 * @param {*} syncKey 
 */
export function fetchListenCourseRequest(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, LISTEN_COURSE_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

/**
 * 试听课程添加课程
 * @param {*} condition 
 * @param {*} syncKey 
 */
export function fetchCourseAddRequest(condition, syncKey){
	return async(client) => {
    try {
      let ret = await requestRemoteData(client, COURSE_ADD_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

/**
 * 修改试听课程
 * @param {*} condition 
 * @param {*} syncKey 
 */
export function fetchCourseChangeRequest(condition, syncKey){
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, CHANGE_COURSE_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}