import React, {Component} from 'react';
import RNFetchBlob from 'react-native-fetch-blob'

/**
 * [doIdCardUpload description]
 * @param  {[type]} data       input {card_img, side, card_info}  side:0 正面  side:1 反面
 * @param  {[type]} progressCb 上传进度回调函数
 * @return {[type]}            promise
 */
// 生产
// export const httpIP = __DEV__ ? 'http://m.t-xiaoniu.com/' : 'http://m.xiaoniujh.com/';
// 测试
export const httpIP = __DEV__ ? 'http://m.t-xiaoniu.com/' : 'http://m.t-xiaoniu.com/';

/**
 * 图片资源上传
 * @param  {String or StringArray}  data       base64格式图片字符串或者base64格式图片字符串array
 * @param  {String or StringArray}  imgType    图片格式(jpg,png)
 * @param  {function}                progressCb    进度回调
 * @return {Promise}                promise
 */
export function doPhotoUpload(data, imgType, progressCb) {
    let params = []
    if (typeof data === 'string') {
        params.push({name: 'image', filename: 'image1', type: `image/${imgType}`, data})
    } else if (Array.isArray(data)) {
        data.forEach(idx => {
            params.push({name: 'image' + idx, filename: 'image' + idx, type: `image/${imgType[idx]}`, data: data[idx]})
        })
    }
    return upload(`${httpIP}img/app/upload/photo`, params, progressCb)
}

function upload(path, params, progressCb) {
    return new Promise((resolve, reject) => {
        RNFetchBlob.fetch('POST', path, {'Content-Type': 'multipart/form-data'}, params)
            .uploadProgress({interval: 250}, progressCb)
            .then(resp => {
                let result
                if (typeof resp.data === 'string')
                    result = JSON.parse(resp.data)
                else if (typeof resp.data === 'object')
                    result = resp.data
                if (Boolean(result.errcode))
                    throw new Error(result.errmsg + ', ' + result.reason)
                resolve(result)
            })
            .catch(e => {
                console.log('e===>', e)
                reject(e)
            })
    })
}