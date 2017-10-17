/**
 * create at 04/19/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const PATH = 'am_api/am/data/storeList'  // 首页门店列表
const SIGN_PATH = 'am_api/am/data/monthlySignedStorelist' // 月签约门店列表

export function fetchStoreWithoutCache(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function fetchSignStoreList(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, SIGN_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}