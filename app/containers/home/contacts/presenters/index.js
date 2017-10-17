/**
 * create at 05/25/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

export const CONTACTS_LIST_PATH = 'am_api/am/store/myStoreContacts'

export function fetchContactsData(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, CONTACTS_LIST_PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}