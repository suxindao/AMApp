/**
 * Created by suxindao on 2017/10/13 .
 */

'use strict';

const initialAuthState = {
    isLoggedIn: false
};

export default function auth(state = initialAuthState, action) {
    switch (action.type) {
        case 'Login':
            console.log("aaa")
            return {...state, isLoggedIn: true};
        case 'Logout':
            return {...state, isLoggedIn: false};
        default:
            return state;
    }
}