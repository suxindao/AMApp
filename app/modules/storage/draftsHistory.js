/**
 * create at 03/20/17
 */

const DRAFTS_HISTORY_KEY = 'draftsHistory'

const EXPIRES_TIME = 1000 * 3600 * 24 * 30	// 30天

/**
 * 拼接表名： key + userId
 */
async function handleKey() {
    try {
        // console.log('UserInfo===>', global.UserInfo)
        if (Boolean(global.UserInfo) && Boolean(global.UserInfo.user_id)) {
            return DRAFTS_HISTORY_KEY + global.UserInfo.user_id
        } else {
            throw new Error('draftsHistory userId is undefined')
        }
    } catch (e) {
        throw e
    }
}

/**
 * 添加一条数据
 * params:
 *                type: string, 类型， 'main', 'server'
 *                code: string, 合同编号
 *                companyName: string, 公司名称
 *                objInfo: obj, 合同具体信息
 *                userId: 用户id ,必须有
 *
 * @return {boolean}    true 添加成功  false 添加失败
 */
export async function addOneDrafts(type, code, companyName, statusDes = '未提交', objInfo) {
    try {
        let baseInfo = {
            type: type,
            code: code,
            statusDes: statusDes,
            companyName: companyName,
            time: new Date().Format('MM-dd hh:mm'),
        }

        let tabKey = await handleKey()
        // 去掉id里面的下划线
        let idKey = code + companyName
        idKey = idKey.replaceAll('_', '')
        await storage.save({
            key: tabKey,
            id: idKey,		// Do not use underscore("_") in id!
            rawData: {
                baseInfo: baseInfo,
                detailInfo: JSON.stringify(objInfo)
            },
            expires: EXPIRES_TIME
        })
        console.log('addOneDrafts success===>')
        return true
    } catch (e) {
        console.log('addOneDrafts e===>', e)
        return false
    }
}

/**
 * 取一条数据
 * params:
 *            code: string, 合同编号+公司名
 */
export async function loadOneDrafts(code) {
    try {
        let tabKey = await handleKey()
        let ret = await storage.load({
            key: tabKey,
            id: code,
            autoSync: false,
            syncInBackground: false
        })
        // console.log('loadOneDrafts ret===>', ret)
        return ret
    } catch (e) {
        console.log('loadOneDrafts e===>', e)
        throw e
    }
}

/**
 * 获取 草稿箱列表所有id
 */
export async function getAllIdsOfDrafts() {
    try {
        let tabKey = await handleKey()
        let ret = await storage.getIdsForKey(tabKey)
        return ret
    } catch (e) {
        throw e
    }
}

/**
 * 取所有数据
 * params:
 *                userId, 用户id
 */
export async function loadAllDrafts() {
    try {
        let tabKey = await handleKey()
        // console.log('loadAllDrafts tabKey===>', tabKey)
        // console.log('-------')
        let ret = await storage.getAllDataForKey(tabKey)
        // console.log('loadAllDrafts ret===>', ret)
        // 排序
        if (Array.isArray(ret)) {
            ret = ret.reverse()
        }
        return ret
    } catch (e) {
        // console.log('loadAllDrafts e===>', e)
        throw e
    }
}

/**
 * 获取所有草稿数组长度
 * @param
 */
export async function getDraftsLength() {
    try {
        let ret = await _getLength()
        return ret
    } catch (e) {
        throw e
    }
}

/**
 * 私有方法： 所有草稿数组长度
 */
async function _getLength() {
    try {
        let tabKey = await handleKey()
        let ret = await storage.getAllDataForKey(tabKey)
        if (Array.isArray(ret)) {
            return ret.length
        } else {
            return 0
        }
    } catch (e) {
        // console.log('_getLength e===>', e)
        return 0
    }
}

/**
 * 删除一条数据
 * params:
 *                code: string, 合同编号+公司名
 * @return {boolean}    true 删除成功  false 删除失败
 */
export async function deleteOneDrafts(code) {
    try {
        // 去掉下划线
        code = code.replaceAll('_', '')
        let tabKey = await handleKey()
        await storage.remove({
            key: tabKey,
            id: code
        })
        console.log('deleteOneDrafts success===>')
        return true
    } catch (e) {
        console.log('deleteOneDrafts e===>', e)
        return false
    }
}

/**
 * 删除所有数据
 * params:
 * @return {boolean}    true 删除成功  false 删除失败
 */
export async function deleteAllDrafts() {
    try {
        let tabKey = await handleKey()
        await storage.clearMapForKey(tabKey)
        console.log('deleteAllDrafts success===>')
        return true
    } catch (e) {
        console.log('deleteAllDrafts e===>', e)
        return false
    }
}

