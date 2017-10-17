/**
 * Created by suxindao on 2017/10/13 .
 */

'use strict';

import {NavigationActions} from 'react-navigation';

import {AppNavigator} from '../../../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
// const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
// const tempNavState = AppNavigator.router.getStateForAction(firstAction);
// const secondAction = AppNavigator.router.getActionForPathAndParams('Login');

const firstAction = AppNavigator.router.getActionForPathAndParams('Start');
const firstState = AppNavigator.router.getStateForAction(firstAction);

// const initialNavState = AppNavigator.router.getStateForAction(secondAction, tempNavState);
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

export default function nav(state = initialNavState, action) {
    let nextState;
    switch (action.type) {
        case 'Login':
            console.log("bbb")
            nextState = AppNavigator.router.getStateForAction(  //  getStateForAction: 根据给定的action来定义返回的navigation sate
                NavigationActions.back(),   // action  返回上一屏幕并关闭当前屏幕
                state                       // state
            );
            break;
        case 'Logout':
            nextState = AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: 'Login'}),   　// 通过navigat action 改变当前state
                state
            );
            break;
        default:
            nextState = AppNavigator.router.getStateForAction(
                action,
                state
            );
            break;
    }

    // Simply return the original `state` if `nextState` is null or undefined.
    console.log("nextState => ", nextState)
    return nextState || state;
}
