/**
 * update at 06/21/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const PATH = 'am_api/am/message/messages'
const READSTATUSPATH = 'am_api/am/message/setread'
const CHECK_UNREAD_PATH = 'am_api/am/message/unreadcount'

export function fetchMessageListData(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function setRead(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, READSTATUSPATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function checkUnreadMessage(condition, syncKey){
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, CHECK_UNREAD_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}