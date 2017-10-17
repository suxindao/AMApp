'use strict'
// import superagent from 'superagent'
// import Immutable from 'immutable'
import {Platform} from 'react-native'
import fetch from 'react-native-fetch-polyfill'
import DeviceInfo from 'react-native-device-info'
import {apiHost, apiPort} from './config'

const methods = ['get', 'post', 'put', 'patch', 'del']

function formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path
    return 'http://' + apiHost + ':' + apiPort + adjustedPath
}

function toQueryString(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
        var val = obj[key]
        if (Array.isArray(val)) {
            return val.sort().map(function (val2) {
                // return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                return key + '=' + val2
            }).join('&');
        }

        //return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        return key + '=' + val
    }).join('&') : ''
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
    constructor(req) {
        methods.forEach((method) => {
            this[method] = (path, {params, data} = {}) => new Promise((resolve, reject) => {
                // const request = superagent[method](formatUrl(path))
                // if (params) {
                //   request.query(params)
                // }

                // if (data) {
                //   request.send(data)
                // }
                // request.end((err, { body } = {}) =>{
                //   console.log('body===>', body)
                //   err ? reject(body || err) : resolve(body)
                // })
                path = formatUrl(path) + toQueryString(params)
                console.log(path + ' request data ===>', data)
                let userAgent = 'system:' + Platform.OS + ' build:AMAPP/' + DeviceInfo.getBuildNumber() + ' version:' +
                    DeviceInfo.getSystemVersion() + ' brand:' + DeviceInfo.getBrand() + ' model:' +
                    DeviceInfo.getModel()
                // console.log('userAgent===>', userAgent)
                fetch(path, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'User-Agent': userAgent
                    },
                    body: JSON.stringify(data || {}),
                    timeout: 30 * 1000,
                }).then((response) => {
                    return response.json()
                }).then((response) => {
                    console.log(path + ' response json ===>', response)
                    if (Boolean(response)) {
                        let receive = response
                        if (receive.code == 0) {
                            resolve(receive.data)
                        } else {
                            reject(new Error(receive.message))
                        }
                    } else {
                        reject(new Error('responseText为null'))
                    }
                    // let tmp = Immutable.fromJS(receive)
                    // receive = tmp.toJS()
                    // console.log('tmp===>', tmp)
                }).catch((err) => {
                    console.log(path + ' fetch err===>', err)
                    reject(err)
                })
            })
        })
    }
}

const ApiClient = _ApiClient
export default ApiClient
