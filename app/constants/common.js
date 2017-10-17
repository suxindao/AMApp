/**
 * 一些公共的
 */

/**
 * 通知
 *
 *
 */
const notification = {
    contractListNotify: 'ContractListReloadNotification',   // 合同列表
    contractInfoNotify: 'ContractInfoReloadNofification',   // 合同详情
    SearchEnterprise: 'SearchEnterprise',   // 搜索企业列表
    Enterprise: 'Enterprise',   // 企业详情
    SearchStore: 'SearchStore',   // 搜索门店列表
    viewStore: 'viewStore',   // 门店列表
    storeListItem: 'storeListItem',   // 门店列表
    basicStore: 'basicStore',   // 门店基础信息
    viewStoreInfo: 'viewStoreInfo',   // 门店详细信息
    storeCourseList: 'storeCourseList',   // 门店课程信息
    byStagesPackage: 'byStagesPackage',   // 分期课包信息
    myStorePage: 'myStorePage',   // 线下门店列表
    unReadMessage: 'checkUnReadMessage', // 检查未读消息
}
/**
 * 门店列表
 *
 *
 */
const store = [
    {code: 'DRAFT', title: '草稿', icon_uri: require('./../sources/images/contract/drafts.png')},   // 草稿
    {code: 'AUDITREJECTED', title: '驳回', icon_uri: require('./../sources/images/contract/handle_fail.png')},   // 审核驳回
    {code: 'PENDINGAUDIT', title: '待审核', icon_uri: require('./../sources/images/contract/handling.png')},   // 待审核
    {code: 'AUDITTHROUGH', title: '通过', icon_uri: require('./../sources/images/contract/handle_finish.png')},   // 通过
]
/**
 * 通知
 * {
 *    name: 小事件名，
 *    data: 参数data
 * }
 */

/**
 * 门店城市信息
 */
const storeCity = {
    cities: [
        {
            id: 110099,
            name: '北京'
        },
        {
            id: 120099,
            name: '天津'
        },
        {
            id: 310099,
            name: '上海'
        },
    ]
}

/**
 * 内容间隔指定位数使用空格分段
 * eg：1234567898765432123 分段：1234 5678 9876 5432 123
 * @param value：文字内容
 * @param num：间隔位数
 * @returns {string} 分割后结果
 */
function subsectionText(value, num) {
    if (typeof value == 'undefined')
        return '';
    value = value.replaceAll(' ', '');
    let arr = value.split('');
    for (var z = 1; z <= parseInt(arr.length / num); z++) {
        arr[num * z - 1] += ' ';
    }
    return value = arr.join('').trim();
}

/**
 * 判断是否为空
 * @param param 被判断对象
 * @returns {boolean} true：为空， false：不为空
 */
function isNull(param) {
    if (param === '' || typeof param === 'undefined' || param === null)
        return true;
    return false;
}

module.exports = {
    store,
    storeCity,
    notification,
    subsectionText,
    isNull
}
