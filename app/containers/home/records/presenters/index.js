/**
 * create at 05/26/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

const RECORD_SLIST_PATH = 'am_api/am/store/trackAllList'

export function fetchRecordsData(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, RECORD_SLIST_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}