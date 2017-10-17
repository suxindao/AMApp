import {combineReducers} from 'redux';

import nav from './modules/nav/navReducer'
import auth from './modules/auth/authReducer'
/// common
import login from './modules/loginReducer'
import start from './modules/startReducer'
import tabbar from './modules/tabbarReducer'
/// look
import look from './modules/look/lookContainerReducer'
import lookStoreList from './modules/look/storeList'
import lookSignStoreList from './modules/look/signStoreList'
import lookMonthList from './modules/look/monthList'
import lookOrderList from './modules/look/orderList'

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
});

export default AppReducer;
