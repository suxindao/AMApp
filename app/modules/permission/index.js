/**
 * copy for xnjh at 04/21/17
 * @author qian
 */

import React, {Component} from 'react';
import {PermissionsAndroid, Platform, NativeModules} from 'react-native'
import Camera from 'react-native-camera'

/**
 * 检测是否有位置的权限
 * @return {boolean} [true 有权限, false 没有权限]
 */
export async function checkGeoLocationPermissions() {
    if (_askPermission()) {
        let granted = true   //ios默认为true
        try {
            granted = granted && await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        } catch (e) {
            granted = false
        }
        return granted
    } else {
        return true
    }
}

/**
 * android6.0以上需要动态获取地理位置权限
 * @return {boolean} [true 用户授权通过, false 用户未授权]
 */
export async function getGeoLocationPermissions() {
    try {
        if (_askPermission()) {
            if (Platform.OS === 'android') {
                const granteds = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION])
                return granteds[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED || granteds[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
            }
            return true
        }
    } catch (e) {
        console.log('getGeoLocationPermissions e===>', e)
    }
    return false
}

/**
 * 检测是否有摄像头的权限
 * @return {boolean} [true 有权限, false 无权限]
 */
export async function checkCameraPermission() {

    if (_askPermission()) {
        let granted = true   //ios默认为true
        try {
            granted = granted && await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        } catch (e) {
            granted = false
        }
        return granted
    } else {
        return true
    }
}

/**
 * 获取摄像头权限
 * @return {boolean} [true 获取了权限, false 未获取权限]
 */
export async function getCameraPermission() {
    try {
        if (_askPermission()) {
            if (Platform.OS === 'android') {
                // return await PermissionsAndroid.request([PermissionsAndroid.PERMISSIONS.CAMERA])
                let granteds = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA])
                return granteds[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED
            } else if (Platform.OS === 'ios') {
                return await Camera.checkDeviceAuthorizationStatus()
            } else {
                return false
            }
        }
        return true
    } catch (e) {
        console.log('getCameraPermission e===>', e)
    }
    return false
}

/**
 * 检测并获取摄像头权限，如果已经有权限返回，否则去获取权限
 * @return {boolean} [true 获取了权限, false 未获取权限]
 */
export async function checkAndGetCameraPermission() {
    try {
        let granted = await checkCameraPermission()
        if (granted)
            return true
        return await getCameraPermission()
    } catch (e) {
    }
    return false
}

/**
 * 检测是否有读取存取的权限
 * @return {boolean} [true 有权限, false 没有权限]
 */
export async function checkStoragePermissions() {
    if (_askPermission()) {
        let granted = true   //ios默认为true
        try {
            granted = granted && await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        } catch (e) {
            granted = false
        }
        return granted
    } else {
        return true
    }
}

/**
 * android6.0以上需要动态获取读取存储权限
 * @return {boolean} [true 用户授权通过, false 用户未授权]
 */
export async function getStoragePermissions() {
    try {
        if (_askPermission()) {
            if (Platform.OS === 'android') {
                let granteds = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE])
                // let granteds = await PermissionsAndroid.request(
                //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                //     {
                //         'title': '权限提醒',
                //         'message': '\n"北斗"上传合同照片需要图片读取权限\n\n'
                //     }
                // )
                return granteds[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
            }
            return true
        }
    } catch (e) {
        console.log('getStoragePermissions e===>', e)
    }
    return false
}

/**
 * 检测并获取本地存储权限，如果已经有权限返回，否则去获取权限
 * @return {boolean} [true 获取了权限, false 未获取权限]
 */
export async function checkAndGetStoragePermission() {
    try {
        let granted = await checkStoragePermissions()
        if (granted)
            return true
        return await getStoragePermissions()
    } catch (e) {
    }
    return false
}

/**
 * 是否需要动态获取权限
 * @return {boolean} [true 需要动态获取权限, false 不需要动态获取权限]
 */
function _askPermission() {
    if (Platform.OS === 'android' && Platform.Version < 23) {
        return false
    }
    return true
}

function _isAndroid() {
    if (Platform.OS === 'android')
        return true
    return false
}
