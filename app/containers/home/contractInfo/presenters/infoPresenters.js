/**
 * create at 03/14/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

// common js
import {contractType} from '../../../../constants/operation/contractManage'

const MAIN_PATH = 'am_api/am/contract/mainContract'
const SERVER_PATH = 'am_api/am/contract/serviceContract'
const SERVER_FQ_PATH = 'am_api/am/contract/serviceContract_FQ'
const SERVER_TG_PATH = 'am_api/am/contract/serviceContract_TG'
const SERVER_ZT_PATH = 'am_api/am/contract/serviceContract_ZT'

export function fetchContractInfo(condition, syncKey, typeCode) {
  return async(client) => {
    let path
    if(typeCode == contractType.main){
      path = MAIN_PATH
    } else if(typeCode == contractType.server){
      path = SERVER_PATH
    }  else if(typeCode == contractType.server_FQ){
      path = SERVER_FQ_PATH
    }  else if(typeCode == contractType.server_TG){
      path = SERVER_TG_PATH
    }  else if(typeCode == contractType.server_ZT){
      path = SERVER_ZT_PATH
    } else {
      // 异常处理 正常类型是 main or server
      path = ''
    }
    try {
      let ret = await requestRemoteData(client, path, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}
