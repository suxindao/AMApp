/**
 * create 06/19/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const PATH = 'am_api/am/data/orderList'

export function fetchOrderListData(condition, syncKey, typeCode) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}