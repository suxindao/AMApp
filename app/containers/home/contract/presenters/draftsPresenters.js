/**
 * create at 03/14/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../../modules/common/dataRequestHandler'

// storage
import {getAllIdsOfDrafts, loadOneDrafts} from '../../../../modules/storage/draftsHistory'

const LOCAL_KEY = 'haoqixAM/ContractDrafts'
const PATH = ''

export function fetchContractDraftsData(searchCondition){
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

export function fetchContractDraftsDataWithoutCache(condition, syncKey) {
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}

export function loadContractDraftsData() {
  return fetchLocalData(LOCAL_KEY)
}

/**
 * 草稿箱 搜索方法
 * @param {*} searchKey 
 */
export async function searchDraftsData(searchKey){
  try{
    let searchResult = []
    // 获取 草稿箱ids
    let ret = await getAllIdsOfDrafts()
    if(Array.isArray(ret) && ret.length > 0){
      for(let i=0; i< ret.length; i++){
        let item = ret[i]
        // 模糊搜索
        if(item.includes(searchKey)){
          let searchRet = await getOneDrafts(item)
          // 只有成功 load 一条草稿时，添加到返回 array
          if(Boolean(searchRet)){
            searchResult.push(searchRet)
          }
        }
      }     

      return searchResult
    } else {
      throw new Error('searchDraftsData ret is not array or lenght equal 0')
    }
  }catch(e){
    throw e
  }
}

/**
 * 
 * @param {*} searchCode, string 搜索drafts数据库的 id
 * 
 * return 成功返回 一条草稿 obj, 失败返回 null
 */
async function getOneDrafts(searchCode){
  try{
    let ret = await loadOneDrafts(searchCode)
    return ret
  }catch(e){
    return null
  }
}