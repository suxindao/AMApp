/**
 * create at 07/18/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

const TRACKTAGS_PATH = 'am_api/am/store/trackTags' // 获取门店记录标签
const STORE_CONTACTS_PATH = 'am_api/am/store/storeContacts' // 门店联系人

/**
 * 获取门店记录标签
 * @param {*} condition 
 * @param {*} syncKey 
 */
export function fetchVisitWorkTags(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, TRACKTAGS_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

/**
 * 门店联系人
 * @param {*} condition 
 * @param {*} syncKey 
 */
export function fetchStoreContacts(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, STORE_CONTACTS_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}