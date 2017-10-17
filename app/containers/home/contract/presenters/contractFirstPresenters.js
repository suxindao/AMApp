/**
 * create at 03/13/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'
import {getDraftsLength} from '../../../../modules/storage/draftsHistory'

const LOCAL_KEY = 'haoqixAM/ContractFirst'
const PATH = 'am_api/am/contract/main'

export function fetchContractFirstData(searchCondition){
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

export function fetchContractFirstDataWithoutCache(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function loadContractFirstData() {
  return fetchLocalData(LOCAL_KEY)
}


/**
 * 从server 端拿到 合同列表进行 组合
 * params:
 *      serverList: array, 
 */
export async function handleContractList(serverList){
  try{
    if(Array.isArray(serverList) && serverList.length > 0){
      // 成功获取合同列表数据
      let draftsLength = await getDraftsLength()
      let drafts = {
        code: 'drafts',
        title: '草稿箱',
        number: draftsLength
      }
      serverList.unshift(drafts)
      return serverList
    } else {
      throw new Error('handleContractList serverList is not array or length is 0')
    } 
  }catch(e){
    throw e
  }
}