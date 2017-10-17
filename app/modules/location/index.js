/**
 * copy for xnjh at 04/21/17
 * @author qian
 */
import {NativeModules, Platform} from "react-native"
import {checkGeoLocationPermissions, getGeoLocationPermissions} from '../permission'
import {toastShort} from './../../constants/toast'

const {BaiduGeolocationModule} = NativeModules;

import {Geolocation} from 'react-native-baidu-map';

/**
 * 获取用户经纬度信息
 * @return {promise} [description]
 */
export async function getLocation() {
    try {
        let granted = await checkGeoLocationPermissions()
        if (!granted) {
            granted = await getGeoLocationPermissions()
        }
        if(granted){
            if (Platform.OS === 'android') {
                const position = await _getGeoPositionAndroid()
                console.log('getLocation position===>', position)
                if (position.latitude < 1 || position.longitude < 1) {
                    throw new Error('no get geo location permission')
                }
                return {lat: position.latitude, lng: position.longitude}
            }
            const position = await Geolocation.getCurrentPosition();
            return {lat: position.latitude, lng: position.longitude}
            // return {lat: position.coords.latitude, lng: position.coords.longitude}
        }else {
            throw new Error('no get geo location permission')
         }
    } catch (e) {
        toastShort('当前位置获取失败，请允许北斗获取您的位置信息。');
        console.log('getLocation e===>', e)
        throw e
    }
}

/**
 * BaiduGeolocationModule 是BaiduMap sdk 提供工程里需要集成该sdk
 */
async function _getGeoPositionAndroid() {
    try {
        // return await BaiduGeolocationModule.getCurrentPosition()
        return await Geolocation.getCurrentPosition()
    } catch (e) {
        throw e
    }
}

/**
 * navigator 是iOS提供的
 */
async function _getGeoPositionIos() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position)
            },
            (err) => {
                reject(err)
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        )
    })
}