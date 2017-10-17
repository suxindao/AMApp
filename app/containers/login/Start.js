/**
 * Created by Joe on 2017/3/3.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, InteractionManager, Platform, Alert, Linking} from 'react-native'
import TimerMixin from 'react-timer-mixin'
import codePush from 'react-native-code-push'
import DeviceInfo from 'react-native-device-info'

//redux相关
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {initApp, upgradeInfo} from '../../redux/modules/startReducer'

// presenters
import {validateTokenFromRemote} from './presenters/loginPresenter'
import {fetchCheckUpdate} from '../mine/presenters/versionPresenter'

import {toastShort} from '../../constants/toast'
import {ios_updateUrl_head} from '../../helpers/config'

// Navigation
import {NavigationActions} from 'react-navigation';

const mapStateToProps = state => ({
    initialization: state.start.initialization,
    upgrade_loading: state.start.upgrade_loading,
    upgrade_loading_success: state.start.upgrade_loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({initApp, upgradeInfo}, dispatch),
    dispatch,
})

class Start extends Component {
    constructor(props) {
        super(props)

        this.mixin = TimerMixin
        // func
        this._doStart = this._doStart.bind(this)
        this._toUpdateRemind = this._toUpdateRemind.bind(this) // 更新提示
        this._toDownLoad = this._toDownLoad.bind(this)  // 下载
        // request
        this._checkJsUpdate = this._checkJsUpdate.bind(this)
        this._initApp = this._initApp.bind(this)
        this._fetchUpdate = this._fetchUpdate.bind(this) // 检查更新
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            //执行耗时的同步任务
            this._doStart()
        })
    }

    _doStart() {
        // this._checkJsUpdate()
        this.props.myactions.initApp(this._initApp)
    }

    async _checkJsUpdate() {
        try {
            const update = await codePush.checkForUpdate()
            if (update) {
                console.log("有更新哦")
                codePush.sync() //默认方式，默认不弹出提示框，静默安装
                // codePush.sync({
                //     installMode: codePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE,
                //     updateDialog: {
                //         title: '版本升级提示',  //要显示的更新通知的标题. Defaults to “Update available”.,
                //         appendReleaseDescription: true,     //是否显示更新description，默认为false
                //         mandatoryUpdateMessage: "有新版本了，请立即更新。",      //- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
                //         descriptionPrefix: "\n\n",   //更新说明的前缀。 默认是” Description:
                //         mandatoryContinueButtonLabel: "立即更新",   //强制更新的按钮文字，默认为continue
                //         optionalUpdateMessage: '有新版本了，是否更新？',   //非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.,
                //         optionalIgnoreButtonLabel: '稍后',            //非强制更新时，取消按钮文字,默认是ignore
                //         optionalInstallButtonLabel: '后台更新', //非强制更新时，确认文字. Defaults to “Install”
                //     }
                // })
            } else {
                console.log("app是最新版了")
            }
        } catch (e) {
            console.log('codePush err===>', e)
        }
    }

    async _initApp(client, pathValidateUser) {
        try {
            let ret = await validateTokenFromRemote(client, pathValidateUser)
            this.mixin.setTimeout(() => {
                if (ret) {
                    // Actions.login()
                    this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
                    return true
                } else {
                    // Actions.login()
                    this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
                    throw new Error('_initApp ret is null')
                }
            }, 2000)
        } catch (e) {
            console.log('Start _initApp e===>', e)
            // Actions.login()
            this.props.dispatch(NavigationActions.navigate({routeName: 'Login'}))
            throw e
        }
    }

    componentDidMount() {
        // codePush.notifyAppReady()   // 如果 CodePush 采用 updateDialog 方式 则必须手工调用此方法
        // InteractionManager.runAfterInteractions(() => {
        // 检查更新
        if (Platform.OS == 'ios') {
            this.props.myactions.upgradeInfo(this._fetchUpdate)
        }
        // })
    }

    // 检查更新
    async _fetchUpdate() {
        try {
            // iOS 获取当前版本
            let buildNumber = await DeviceInfo.getBuildNumber()
            let body = {
                ios_build_number: parseInt(buildNumber)
            }
            let ret = await fetchCheckUpdate(body, '')()
            // 检查是否有更新
            if (ret && (typeof ret.force_update === 'boolean')) {
                // 更新提醒
                this.updateRemind = Boolean(ret.description) ? ret.description : ''
                this.update_footer_url = Boolean(ret.url) ? ret.url : ''
                this._toUpdateRemind(ret.force_update)
            }
            return true
        } catch (e) {
            console.log('_fetchUpdate e===>', e)
            throw e
        }
    }

    _toUpdateRemind(isStrong) {
        if (isStrong) {
            // 强制更新
            Alert.alert(
                '版本更新',
                this.updateRemind,
                [
                    {text: '更新', onPress: this._toDownLoad}
                ]
            )
        } else {
            // 不强制更新
            Alert.alert(
                '版本更新',
                this.updateRemind,
                [
                    {text: '取消', onPress: () => null},
                    {text: '更新', onPress: this._toDownLoad}
                ]
            )
        }
    }

    async _toDownLoad() {
        try {
            let url = ios_updateUrl_head + this.update_footer_url
            console.log('url===>', url)
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => {
                throw err
            })
        } catch (e) {
            console.log('_toDownLoad e===>', e)
            toastShort('更新失败')
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex: 1}}/>
                <View style={{alignItems: 'center'}}>
                    <Image style={{marginBottom: 30}} source={require('../../sources/images/start_logo.png')}/>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Start)