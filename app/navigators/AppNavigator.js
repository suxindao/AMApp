import React from 'react'
import {BackHandler, ToastAndroid} from "react-native";
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {addNavigationHelpers, StackNavigator, NavigationActions} from 'react-navigation'
import TimerMixin from 'react-timer-mixin'

// import LoginScreen from '../components/test/LoginScreen'
import LoginScreen from '../containers/login/Login'
import StartScreen from '../containers/login/Start'
// import MainScreen from '../components/test/MainScreen'
import MainScreen from '../containers/look/LookerContainer'
import ProfileScreen from '../components/test/ProfileScreen'

export const AppNavigator = StackNavigator({   // 堆栈导航，所有屏幕的集合
    Start: {
        screen: StartScreen
    },
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
    Profile: {
        screen: ProfileScreen
    },
}, {
    initialRouteName: 'Start',
    mode: 'modal',
    headerMode: 'none',
})

class AppWithNavigationState extends React.Component {

    constructor(props) {
        super(props)
        this.exit = false
        this.mixin = TimerMixin
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    onBackPress = () => {
        const {dispatch, nav} = this.props;
        console.log("nav = ", nav)
        // if (nav.index === 0) {
        if (nav.routes[nav.index].routeName === 'Main') {
            if (this.exit) {
                return false
            } else {
                this.exit = true
                this.mixin.setTimeout(() => {
                    this.exit = false
                }, 3 * 1000)
                ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
                return true
            }
        } else {
            dispatch(NavigationActions.back());
            return true;
        }
    };

    render() {
        console.log("AppNavigator props = ", this.props)
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
