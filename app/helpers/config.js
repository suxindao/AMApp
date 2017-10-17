// 苏新道环境
export const apiPort = __DEV__ ? 8094 : 80
export const apiHost = __DEV__ ? '192.168.1.124' : 'api.t-xiaoniu.com'

// 测试包
// export const apiHost = __DEV__ ? 'api.t-xiaoniu.com' : 'api.t-xiaoniu.com'
// export const apiPort = __DEV__ ? 80 : 80

// 外网环境
// export const apiHost = __DEV__ ? 'api.t-xiaoniu.com' : 'api.xiaoniujh.com'
// export const apiPort = __DEV__ ? 80 : 80

// iOS update url 更新头部（固定url）
export const ios_updateUrl_head = 'itms-services:///?action=download-manifest&url='
