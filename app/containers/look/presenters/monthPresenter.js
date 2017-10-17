/**
 * create at 04/19/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const LOCAL_KEY = 'haoqixAM/LookMonth'
const PATH = 'am_api/am/data/storeData'

export function fetchMonthData(searchCondition){
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

export function fetchMonthWithoutCache(condition, syncKey, typeCode) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function loadMonthData() {
  return fetchLocalData(LOCAL_KEY)
}