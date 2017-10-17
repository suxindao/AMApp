/**
 * Created by Joe on 2017/3/3.
 */
import React, {Component} from 'react';
import {View, Text, TouchableHighlight, Image, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Getui from 'react-native-getui'
import DeviceInfo from 'react-native-device-info'

// 组件
import {TopComponent, RemindTop, RemindBottom, LoginBtn} from './components/common'
import InputComponent from './components/Input'
import LoadingFloatingLayer from '../../components/common/LoadingFloatingLayer'
import WithConnection from '../../modules/enhanced/WithConnection'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loginSubmit} from '../../redux/reducers/login/loginReducer'
// presenter
import {fetchUserInfoData} from './presenters/loginPresenter'

// modules
import upgrade from '../../modules/upgrade'
// storage
import {saveUserInfoToStorage, saveCurrentUser} from '../../modules/storage/option'

// Navigation
import {NavigationActions} from 'react-navigation';

// style
import {colors, distances, fontScale} from '../../constants/style'
// common js
import {toastShort} from '../../constants/toast'

const mapStateToProps = state => ({
    submit_loading: state.login.submit_loading,
    submit_loading_success: state.login.submit_loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({loginSubmit}, dispatch),
    dispatch,
})

class Login extends Component {
    constructor(props) {
        super(props)

        // data
        this.state = {
            account: '',
            password: '',
            passwordSecure: true,
            pageRefresh: false
        }

        // function
        this._nextFun = this._nextFun.bind(this)
        this.accountInputUpdate = this.accountInputUpdate.bind(this)
        this.passwordInputUpdate = this.passwordInputUpdate.bind(this)
        // click
        this.loginClick = this.loginClick.bind(this)
        this.passwordEyeClick = this.passwordEyeClick.bind(this)
        // request
        this._requestLogin = this._requestLogin.bind(this)
        this._getCurrentVersion = this._getCurrentVersion.bind(this) // 获取当前版本
    }

    componentWillMount() {
        // 设置当前用户账号和密码
        if (global.CurUser) {
            this.setState({
                account: global.CurUser.account,
                password: global.CurUser.password,
            })
        }
        this._getCurrentVersion()
        // 获取 pushid
        // Getui.clientId((param) => {
        //     // console.log('clientId param===>', param)
        //     this.clientId = param
        // })
        this.clientId = 'ThisIsATestClientID'
    }

    // 获取当前版本
    async _getCurrentVersion() {
        try {
            if (Platform.OS == 'ios') {
                // ios 通过deviceinfo 获取
                this.version = await DeviceInfo.getVersion()
            } else {
                // android通过upgrade获取
                // let ret = await upgrade.getCurrentInfo()
                // this.version = Boolean(ret.versionName) ? ret.versionName : ''
                this.version = await DeviceInfo.getVersion()
            }
            console.log("version = ", this.version)
            this.setState({
                pageRefresh: !this.state.pageRefresh
            })
        } catch (e) {
            console.log(' _getCurrentVersion e===>', e)
        }
    }

    // 密码 eyeBtn click
    passwordEyeClick() {
        this.setState({
            passwordSecure: !this.state.passwordSecure
        })
    }

    // 账号input update
    accountInputUpdate(content) {
        this.setState({
            account: content
        })
    }

    // 密码input update
    passwordInputUpdate(content) {
        this.setState({
            password: content
        })
    }

    loginClick() {
        // 登录验证
        let {account, password} = this.state
        if (account.length == 0) {
            toastShort('请输入账号')
            return
        }
        if (password.length == 0) {
            toastShort('请输入密码')
            return
        }
        this.refs.loginFloatingLayer.show()
        this.props.myactions.loginSubmit(this._requestLogin)
    }

    async _requestLogin() {
        try {
            let {account, password} = this.state
            let body = {
                loginName: account,
                password: password,
                device_type: Platform.OS,
                push_id: this.clientId
            }
            console.log('body===>', body)
            let ret = await fetchUserInfoData(body, '')()
            console.log('ret===>', ret)
            if (Boolean(ret)) {
                let currentRet = await saveCurrentUser(ret.user_id, account, password)
                let userInfoRet = await saveUserInfoToStorage(ret)
                if (currentRet && userInfoRet) {
                    global.UserInfo = ret
                    this._nextFun(true)
                    return true
                } else {
                    throw new Error('saveCurrentUser or saveUserInfoToStorage fail')
                }
            } else {
                throw new Error('获取远程用户信息返回为null')
            }
        } catch (e) {
            this._nextFun(false)
            console.log('_requestLogin e===>', e)
            throw e
        }
    }

    // 跳入
    _nextFun(result) {
        this.refs.loginFloatingLayer.hide()
        if (result) {
            // Actions.look()
            // navigation.dispatch({type: 'Login'})
            this.props.dispatch(NavigationActions.navigate({routeName: 'Main'}))
        } else {
            if (this.props.connection) {
                toastShort('账号或密码错误')
            } else {
                toastShort('网络连接失败')
            }
        }
    }

    render() {
        console.log("Login props = ", this.props)
        let {account, password, passwordSecure} = this.state
        return (
            <View style={{flex: 1, backgroundColor: colors.bgColor}}>
                <KeyboardAwareScrollView
                >
                    <View style={{marginLeft: 75 / 2, marginRight: 75 / 2, marginTop: 164 / 2}}>
                        <TopComponent versionCode={this.version}/>
                        <View style={{marginTop: 60}}>
                            <RemindTop/>
                            <InputComponent style={{marginTop: 26}} placeText='请输入账号' returnKeyType='done'
                                            showText={account} searchSubmit={() => null}
                                            updateSearch={this.accountInputUpdate}
                                            eyeVisible={false}
                            />
                            <InputComponent style={{marginTop: 20}} placeText='请输入密码' returnKeyType='go'
                                            showText={password} searchSubmit={this.loginClick}
                                            updateSearch={this.passwordInputUpdate}
                                            eyeVisible={true} secureTextEntry={passwordSecure}
                                            securePress={this.passwordEyeClick}
                            />
                            <RemindBottom/>
                            <LoginBtn loginPress={this.loginClick}/>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <LoadingFloatingLayer ref="loginFloatingLayer"/>
            </View>
        )
    }
}

export default WithConnection(connect(mapStateToProps, mapDispatchToProps)(Login))
