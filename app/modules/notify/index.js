/**
 * create at 06/16/17
 */

import {NativeAppEventEmitter, Alert} from 'react-native'

import Getui from 'react-native-getui'
// const
const RECEIVE_REMOTE_NOTIFICATION = 'receiveRemoteNotification'  // 接收远程通知 事件
const CLICK_REMOTE_NOTIFICATION = 'clickRemoteNotification'    // 点击远程通知  事件

/**
 * 注册 接收远程通知事件
 * @param {*function} receiveFun , function,  接收到通知后的执行事件
 */
export function registerReceiveRemoteNofity(receiveFun) {
    NativeAppEventEmitter.addListener(RECEIVE_REMOTE_NOTIFICATION, (notification) => {
        // android消息类型分为 透传消息 或者 cmd消息
        // iOS消息类型分为 APNs 和 payload 透传消息
        // 但这里我们只统一接收 透传消息
        switch (notification.type) {
            case 'payload': {
                if (typeof receiveFun === 'function') {
                    // 解析
                    let notifyObj = JSON.stringify(notification)
                    // 回传
                    receiveFun(notification)
                }
            }
                break
            default: {
                console.log('receiveRemoteNofity 接收到的消息不为 payload消息')
            }
                break
        }
    })
    // Getui.clientId((param)=> {
    //      console.log('getui client id===>', param)
    //  })
}

/**
 * 移除 接收远程通知事件
 * @param {*} receiveFun
 */
export function removeReceiveRemoteNofify(receiveFun) {
    NativeAppEventEmitter.removeListener(RECEIVE_REMOTE_NOTIFICATION, () => {
        console.log('successfully remove ===>', RECEIVE_REMOTE_NOTIFICATION)
    })
}

/**
 * 注册 点击通知事件
 * @param {*function} clickFun
 */
export function registerClickRemoteNotify(clickFun) {
    NativeAppEventEmitter.addListener(CLICK_REMOTE_NOTIFICATION, (notification) => {
        // console.log('click notification===>', notification)
        if (typeof clickFun === 'function') {
            // 解析
            let notifyObj = JSON.stringify(notification)
            // 回传
            clickFun(notification)
        }
    })
}

/**
 * 移除 点击通知事件
 * @param {*function} clickFun
 */
export function removeClickRemoteNotify(clickFun) {
    NativeAppEventEmitter.removeListener(CLICK_REMOTE_NOTIFICATION, () => {
        console.log('successfully remove ===>', CLICK_REMOTE_NOTIFICATION)
    })
}