/**
 * create at 03/14/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

const LOCAL_KEY = 'haoqixAM/ContractSearch'
const PATH = 'am_api/am/contract/search'

export function fetchContractSearchData(searchCondition){
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

export function fetchContractSearchDataWithoutCache(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function loadContractSearchData() {
  return fetchLocalData(LOCAL_KEY)
}