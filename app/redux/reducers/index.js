import {combineReducers} from 'redux';

import nav from './nav/navReducer'
import auth from './auth/authReducer'

const AppReducer = combineReducers({
    nav,
    auth,
});

export default AppReducer;
