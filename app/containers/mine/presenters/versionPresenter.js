/**
 * update at 06/21/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'

const CHECK_VERSION_UPDATE = 'am_api/am/app/checkUpdate' // 检查版本更新

export function fetchCheckUpdate(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, CHECK_VERSION_UPDATE, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}