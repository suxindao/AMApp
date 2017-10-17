/**
 * create at 06/27/17
 * 只有android有 upgrade模块
 */
import {NativeModules, Platform} from "react-native"
// const upgrade = NativeModules.RNUpgrade
const upgrade = null

// upgrade.loadUpgradeInfo = async (client, path) => {
// 	if(Platform.OS == 'ios'){
// 		let res = await upgrade.getCurrentInfo()
// 		return await client.post(path, {data:{version_code: res.versionCode, platform: 'ios'}})
// 	}else{
// 		return await upgrade.getUpgradeInfo()
// 	}
// }

export default upgrade