import React from 'react';
import {Provider} from 'react-redux';

import AppWithNavigationState from './navigators/AppNavigator';
import store from './redux/store'

export default class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}
