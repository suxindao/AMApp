//
// Created by Uncle Charlie, 2016/12/19
//
// @flow
//

import loadLocalData, {saveLocalData, clearLocalData} from '../localDataLoader'
import ApiClient from '../../helpers/ApiClient'

export default function fetchData(searchCondition: Object, localKey: string, path: string): Promise<*> {
    return async (client: Object) => {
        try {
            // there is local data
            console.log(`===>FETCH DATA start===>`)
            let localData = await fetchLocalData(localKey)
            let syncKey = localData.sync_key

            let reqData = await requestRemoteData(client, path, searchCondition, syncKey)
            if (reqData.sync_key === syncKey) {
                return localData// server data and local data is the same
            }

            saveFetchedData(localKey, reqData)

            return reqData
        } catch (e) {
            console.log(`===>FETCH DATA ERROR`, e)
            try {
                // there is not local data
                let reqData = await requestRemoteData(client, path, searchCondition, '')
                console.log(`===>FETCH DATA: localKey: ${localKey}`, reqData)
                saveFetchedData(localKey, reqData)
                return reqData
            } catch (e) {
                console.log(`===>FETCH DATA: localKey: ${localKey}`, e)
                throw e
            }
        }
    }
}

export async function requestRemoteData(client: Object, path: string,
                                        searchCondition: Object, syncKey: string): Promise<*> {
    let requestClient = client
    if (!requestClient) {
        requestClient = new ApiClient()
    }

    // console.log(`REQUEST =====> input`, {data: searchCondition})

    try {
        searchCondition.sync_key = syncKey
        let ret = await requestClient.post(path, {data: searchCondition})
        return ret
    } catch (e) {
        throw e
    }
}

export function fetchLocalData(localKey: string): Promise<*> {
    // try {
    let localData = loadLocalData(localKey)
    return localData
    // } catch(e) {
    //   throw e
    // }
}

export function saveFetchedData(localKey: string, data: any, dataId: ?string) {
    saveLocalData(localKey, dataId, data)
}
