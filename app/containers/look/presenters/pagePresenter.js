/**
 * create at 04/19/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const LOCAL_KEY = 'haoqixAM/LookPage'
export const PATH = 'am_api/am/data/main'    // 获取首页数据
const GROUP_LIST_PATH = 'am_api/am/data/groups'   // 获取部门组数据
const MEMBER_LIST_PATH = 'am_api/am/data/members' // 获取部门成员数据

export function fetchPageData(searchCondition){
  return async(client) => {
    try {
      let ret = await fetchData({
          searchCondition
        },
        LOCAL_KEY, PATH)(client)
      return ret
    } catch (e) {
      throw e
    }
  }
}
// 获取首页数据
export function fetchPageWithoutCache(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

/**
 * 获取组列表
 */
export function fetchPageGetGroups(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, GROUP_LIST_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

/**
 * 获取成员列表
 */
export function fetchPageGetMembers(condition, syncKey){
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, MEMBER_LIST_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function loadPageData() {
  return fetchLocalData(LOCAL_KEY)
}