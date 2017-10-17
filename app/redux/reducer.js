import {combineReducers} from 'redux';

import nav from './modules/nav/navReducer'
import auth from './modules/auth/authReducer'
/// common
import login from './modules/loginReducer'
import start from './modules/startReducer'
import tabbar from './modules/tabbarReducer'
/// look
import look from './modules/lookContainerReducer'
import lookStoreList from './modules/look/storeList'
import lookSignStoreList from './modules/look/signStoreList'
import lookMonthList from './modules/look/monthList'
import lookOrderList from './modules/look/orderList'
/// home
// enterprise
import city from './modules/city'
import createMainCon from './modules/home/contact/creatMainContractRedux'
import createStageContract from './modules/home/contact/createStageContractRedux'
import createStraightContract from './modules/home/contact/createStraightContractRedux'
import createExtendContract from './modules/home/contact/createExtendContractRedux'
import createServiceCon from './modules/home/contact/creatServiceContractRedux'
import searchEnterprise from './modules/home/contact/SearchEnterpriseRedux'
import enterpriseRedux from './modules/home/contact/enterpriseRedux'
import replaceBankAccount from './modules/home/contact/replaceBankAccountRedux'
import createBankAccount from './modules/home/contact/createBankAccountRedux'
import searchStore from './modules/home/contact/SearchStoreRedux'
// store
import viewStoreApply from './modules/home/store/viewStoreApplyRedux'
import sendToMerchant from './modules/home/store/sendToMerchantRedux'
import viewStoreInfo from './modules/home/store/viewStoreInfoRedux'
import createStore from './modules/home/store/createStoreRedux'
import basicStoreInfo from './modules/home/store/basicStoreInfoRedux'
import editContact from './modules/home/store/editContactRedux'
import storePhotoInfo from './modules/home/store/storePhotoInfoRedux'
import storeCourse from './modules/home/store/storeCourseRedux'
import storeCourseList from './modules/home/store/storeCourseListRedux'
import byStagesPackage from './modules/home/store/byStagesPackageRedux'
import byStagesPackageList from './modules/home/store/byStagesPackageListRedux'
import listeningCourse from './modules/home/store/listeningCourseRedux'
import listenCourseEdit from './modules/home/store/listenCourseEditRedux'
import myStorePage from './modules/home/store/myStorePageRedux'
import createMyStore from './modules/home/store/createMyStoreRedux'
import myStoreViewInfo from './modules/home/store/myStoreViewInfoRedux'
import choiceColleague from './modules/home/store/choiceColleagueRedux'
import addActivity from './modules/home/store/visit/addActivityRedux'
import visitWorkList from './modules/home/store/visit/visitWorkListReducer'
import visitContactList from './modules/home/store/visit/visitContactListReducer'
import storeListItem from './modules/home/store/storeListItemRedux'
// contact
import contactsList from './modules/home/contact/contactsReducer'
// record
import recordsList from './modules/home/records/recordsReducer'
// contract
import contractFirst from './modules/contractFirstReducer'
import contractOther from './modules/contract/otherListReducer'
import contractDrafts from './modules/contract/draftsListReducer'
import contractSearch from './modules/contract/searchListReducer'
import contractInfo from './modules/contract/infoReducer'
import infoShowMain from './modules/contract/info/showMainReducer'
import infoShowServer from './modules/contract/info/showServerReducer'
// refer order
import referOrderList from './modules/home/order/referOrderListReducer'
import referOrderInfo from './modules/home/order/referOrderInfoReducer'
import referOrderSearch from './modules/home/order/referOrderSearchReducer'
/// mine
import mine from './modules/mine'
import mineMessage from './modules/mine/message'

const AppReducer = combineReducers({
    nav,
    auth,
    /// common
    login,
    start,
    tabbar,
    /// look
    look,
    lookStoreList,
    lookSignStoreList,
    lookMonthList,
    lookOrderList,
    /// home
    // home contract
    contractFirst,
    contractOther,
    contractDrafts,
    contractSearch,
    contractInfo,
    infoShowMain, // 详情主体合同
    infoShowServer, // 详情服务合同
    createMainCon, // 创建主体合同
    createStageContract, // 创建分期合同
    createStraightContract, // 创建直通车合同
    createExtendContract, // 创建推广合同
    createServiceCon, // 创建服务合同
    // home enterprise
    city,
    searchEnterprise,
    enterpriseRedux,
    replaceBankAccount,
    createBankAccount,
    searchStore,
    // home store
    viewStoreApply,
    sendToMerchant,
    viewStoreInfo,
    createStore,
    basicStoreInfo,
    editContact,
    storePhotoInfo,
    storeCourse,   // 门店课程
    storeCourseList,
    byStagesPackage,
    byStagesPackageList,
    listeningCourse,  // 试听课程
    listenCourseEdit,
    myStorePage,
    createMyStore,
    myStoreViewInfo,
    choiceColleague,
    addActivity,
    visitWorkList, // 活动记录拜访内容标签
    visitContactList, // 活动记录拜访人
    // home contacts
    contactsList,
    // home records
    recordsList,
    // home order
    referOrderList,
    referOrderInfo,
    referOrderSearch,
    /// mine
    mine,
    mineMessage,
    storeListItem,
});

export default AppReducer;
