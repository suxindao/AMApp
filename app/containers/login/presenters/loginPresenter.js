/**
 * create at 03/16/17
 */
import fetchData, {requestRemoteData, fetchLocalData} from '../../../modules/common/dataRequestHandler'
import {saveUserInfoToStorage, loadUserInfo, loadCurrentUser, saveCurrentUser} from '../../../modules/storage/option'

const LOCAL_KEY = 'haoqixAM/Login'
const PATH = 'am_api/auth/auth/login'
/**
 * 每次启动 获取 UserInfo
 */
export async function validateTokenFromRemote(client, path){
  try{
    let curUser = await loadCurrentUser()
    if(Boolean(curUser)){
      global.CurUser = curUser
      let userInfo = await loadUserInfo(curUser.id)
      if(Boolean){
        global.UserInfo = userInfo
        return true
      } else {
        throw new Error('local userinfo is null')
      } 
    } else {
      throw new Error('current user is undefined')
    }
  }catch(e){
    console.log('validateTokenFromRemote e===>', e)
    throw e
  }
}

/**
 * // 暂时已经不用，由 fetchUserInfoData 替代
 * @param {*} client 
 * @param {*} path 
 * @param {*} params 
 * @param {*} next , 成功时 next 传入 true, 失败时 next 传入false
 * 
 */
export async function getUserInfoFromRemote(client, path, params, next, account, password){
  try{
    const UserInfo = await client.post(path, params)
    console.log('getUserInfoFromRemote UserInfo===>', UserInfo)
    if(Boolean(UserInfo)){
      let currentRet = await saveCurrentUser(UserInfo.user_id, account, password)
      let userInfoRet = await saveUserInfoToStorage(UserInfo)
      if(currentRet && userInfoRet){
        global.UserInfo = UserInfo
        next(true)
        return true
      } else {
        next(false)
        throw new Error('saveCurrentUser or saveUserInfoToStorage fail')
      }
    }else{
      next(false)
      throw new Error('获取远程用户信息返回为null')
    }
  }catch(e){
    next(false)
    console.log('getUserInfoFromRemote e===>', e)
    throw e
  }
}

export function fetchUserInfoData(condition, syncKey){
  return async(client) => {
    try {
      let ret = await requestRemoteData(client, PATH, condition, syncKey)
      return ret
    } catch (e) {
      throw e
    }
  }
}
