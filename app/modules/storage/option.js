/**
 * create at 03/21/17
 * am users info storage
 * 设备上所有用户 数据表
 */

const USER_KEY = 'userInfo'
const CURRENT_USER_KEY = 'currentUser'

const EXPIRES_TIME = 1000 * 3600 * 24 * 30	// 30天

/**
 * （添加和更新）
 * 存储本地 userInfo
 * param:
 *        result: obj
 * return: bool
 *            成功 true, 失败 false
 */
export async function saveUserInfoToStorage(result) {
    try {
        let user_info = {
            token: result.token,
            user_id: result.user_id,
            user_name: result.user_name,
        }
        await storage.save({
            key: USER_KEY,
            id: result.user_id,
            rawData: user_info,
            expires: EXPIRES_TIME
        })
        return true
    } catch (e) {
        console.log('saveUserInfoToStorage e===>', e)
        return false
    }
}

/**
 * 取一个用户数据
 * params:
 *            id: 用户id
 */
export async function loadUserInfo(id) {
    try {
        let ret = await storage.load({
            key: USER_KEY,
            id: id,
            autoSync: false,
            syncInBackground: false
        })
        // console.log('loadUserInfo ret===>', ret)
        return ret
    } catch (e) {
        console.log('loadUserInfo e===>', e)
        throw e
    }
}

/**
 * 取设备上所有用户的数据
 */
export async function loadAllUsers() {
    try {
        let ret = await storage.getAllDataForKey(USER_KEY)
        // console.log('loadAllUsers ret===>', ret)
        return ret
    } catch (e) {
        console.log('loadAllUsers e===>', e)
        throw e
    }
}

/**
 * 删除单个用户数据
 * params:
 *                id: 用户id
 * @return {boolean}    true 删除成功  false 删除失败
 */
export async function deleteOneUser(id) {
    try {
        await storage.remove({
            key: USER_KEY,
            id: id
        })
        console.log('deleteOneUser success===>')
        return true
    } catch (e) {
        console.log('deleteOneUser e===>', e)
        return false
    }
}

/**
 * 删除设备上所有用户的数据
 * @return {boolean}    true 删除成功  false 删除失败
 */
export async function deleteAllUsers() {
    try {
        await storage.clearMapForKey(USER_KEY)
        console.log('deleteAllUsers success===>')
        return true
    } catch (e) {
        console.log('deleteAllUsers e===>', e)
        return false
    }
}

/**
 *  存储当前用户 user_id
 *    params:
 *                id
 *  return
 *                成功 true； 是吧 false
 */
export async function saveCurrentUser(id, account, password) {
    try {
        await storage.save({
            key: CURRENT_USER_KEY,
            rawData: {
                id: id,
                account: account,
                password: password
            },
            expires: EXPIRES_TIME
        })
        return true
    } catch (e) {
        console.log('saveCurrentUser e===>', e)
        return false
    }
}

/**
 * 取当前用户 user_id
 * return
 *            成功 userId； 是吧 error
 */
export async function loadCurrentUser() {
    try {
        let userId = await storage.load({
            key: CURRENT_USER_KEY,
            autoSync: false,
            syncInBackground: false
        })
        return userId
    } catch (e) {
        console.log('loadCurrentUser e===>', e)
        throw e
    }
}

/**
 * 移除当前用户 user_id
 * * return
 *            成功 true； 是吧 false
 */
export async function removeCurrentUser() {
    try {
        await storage.remove({
            key: CURRENT_USER_KEY
        })
        return true
    } catch (e) {
        console.log('removeCurrentUser e===>', e)
        return false
    }
}