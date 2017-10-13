import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addNavigationHelpers, StackNavigator} from 'react-navigation'

import LoginScreen from '../containers/test/LoginScreen'
import MainScreen from '../containers/test/MainScreen'
import ProfileScreen from '../containers/test/ProfileScreen'

export const AppNavigator = StackNavigator({   // 堆栈导航，所有屏幕的集合
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
    Profile: {
        screen: ProfileScreen
    },
})

class AppWithNavigationState extends React.Component {
    render() {
        console.log("this.props = ", this.props)
        return (
            <AppNavigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
            })}/>
        )
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    nav: state.nav,
})

export default connect(mapStateToProps)(AppWithNavigationState)    // 将AppNavigator连接到redux
