/**
 * create at 06/22/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

const ORDER_LIST_PATH = 'am_api/am/order/list'
const ORDER_INFO_PATH = 'am_api/am/order/info'

// 查询订单状态列表
export function fetchReferOrderList(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, ORDER_LIST_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

// 查询订单详情
export function fetchReferOrderInfo(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, ORDER_INFO_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}