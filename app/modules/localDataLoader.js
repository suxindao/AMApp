/*
  Created by Uncle Charlie 2016/11/15
  @flow
*/

const EXPIRES = 1000 * 60 * 60 * 24  //默认过期时间是1天

//TODO: what happens when `key` is null too.
export default function loadLocalData(key: string, id: ?string): any {
    if (id != null) {
        return storage.load({
            key,
            id,
            autoSync: false,
            syncInBackground: false
        })
    } else {
        return storage.load({
            key,
            autoSync: false,
            syncInBackground: false
        })
    }
}

export function saveLocalData(key: string, id: ?string, data: any) {
    if (id != null) {
        storage.save({
            key,
            id,
            rawData: data,
            autoSync: false,
            syncInBackground: false,
            expires: EXPIRES
        })
    } else {
        storage.save({
            key,
            rawData: data,
            autoSync: false,
            syncInBackground: false,
            expires: EXPIRES
        })
    }
}

export function clearLocalData(key: string): void {
    // if (!id) {
    //   storage.remove({
    //     key
    //   })
    // } else {
    //   storage.remove({
    //     key,
    //     id,
    //   })
    // }
    storage.clearMapForKey(key).catch(() => {
    })
}
