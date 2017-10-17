import {combineReducers} from 'redux';

import nav from './nav/navReducer'
import auth from './auth/authReducer'
/// common
import login from './loginReducer'
import start from './startReducer'
import tabbar from './tabbarReducer'
/// look
import look from './look/lookContainerReducer'
import lookStoreList from './look/storeList'
import lookSignStoreList from './look/signStoreList'
import lookMonthList from './look/monthList'
import lookOrderList from './look/orderList'

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