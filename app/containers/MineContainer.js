/**
 * create at 03/06/17
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, DeviceEventEmitter, NativeModules} from 'react-native'
import {Actions} from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'

// modules
import upgrade from '../modules/upgrade'
// storage
import {deleteAllDrafts} from '../modules/storage/draftsHistory'
import {removeCurrentUser} from '../modules/storage/option'

// common js
import {toastShort} from '../constants/toast'
import {notification} from '../constants/common'

// 界面组件
import TabIcon, {TabCode} from '../components/Tabbar'
import Page from './mine/containers/MinePage'
import LoadingFloatingLayer from '../components/common/LoadingFloatingLayer'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {upgradeInfo, messageCheck} from '../redux/modules/mine'
import {resetLookData} from '../redux/modules/lookContainerReducer'

// style
import {colors, distances} from '../constants/style'

// presenters
import {fetchCheckUpdate} from './mine/presenters/versionPresenter'
import {checkUnreadMessage} from './mine/presenters/messagePresenter'

const mapStateToProps = state => ({
    upgrade_loading: state.mine.upgrade_loading,
    upgrade_loading_success: state.mine.upgrade_loading_success,
    message_loading: state.mine.message_loading,
    message_loading_success: state.mine.message_loading_success,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({upgradeInfo, messageCheck, resetLookData}, dispatch),
    dispatch,
})

class MineComponent extends Component {
    constructor(props) {
        super(props)

        this.hasUpdate = false
        this.state = {
            pageRefresh: false
        }
        this.userName = '' // 用户姓名

        // request
        this._getCurrentVersion = this._getCurrentVersion.bind(this) // 获取当前版本
        this._fetchUpdate = this._fetchUpdate.bind(this) // 检查更新
        this._checkMessage = this._checkMessage.bind(this) // 检查未读消息
        // message
        this._clickMessage = this._clickMessage.bind(this)
        // about
        this._toAbout = this._toAbout.bind(this)
        this._toHistory = this._toHistory.bind(this)
        // logout
        this.logoutClick = this.logoutClick.bind(this)
        this._removeUser = this._removeUser.bind(this)
        this.deleteCurrentStorageFail = this.deleteCurrentStorageFail.bind(this)
    }

    componentWillUnmount() {
        this.subscription.remove()
    }

    componentWillMount() {
        this.userName = Boolean(global.UserInfo.user_name) ? global.UserInfo.user_name : ''
        this._getCurrentVersion()
        this.subscription = DeviceEventEmitter.addListener(notification.unReadMessage, () => {
            this.props.myactions.messageCheck(this._checkMessage)
        })
    }

    // 获取当前版本
    async _getCurrentVersion() {
        try {
            if (Platform.OS == 'ios') {
                // ios 通过deviceinfo 获取
                this.version = await DeviceInfo.getVersion()
            } else {
                // android通过upgrade获取
                let ret = await upgrade.getCurrentInfo()
                this.version = Boolean(ret.versionName) ? ret.versionName : ''
            }
            this.setState({
                pageRefresh: !this.state.pageRefresh
            })
        } catch (e) {
            console.log(' _getCurrentVersion e===>', e)
        }
    }

    componentDidMount() {
        this.props.myactions.upgradeInfo(this._fetchUpdate)
        this.props.myactions.messageCheck(this._checkMessage)
    }

    // 检查更新
    async _fetchUpdate() {
        try {
            if (Platform.OS == 'ios') {
                // iOS 获取当前版本
                let buildNumber = await DeviceInfo.getBuildNumber()
                let body = {
                    ios_build_number: parseInt(buildNumber)
                }
                let ret = await fetchCheckUpdate(body, '')()
                if (ret) {
                    this.hasUpdate = true
                    this.update_footer_url = Boolean(ret.url) ? ret.url : ''
                }
            } else {
                let ret = await upgrade.getUpgradeInfo()
                if (ret.has_new) {
                    this.hasUpdate = true
                }
            }
            return true
        } catch (e) {
            console.log('_fetchUpdate e===>', e)
            throw e
        }
    }

    async _checkMessage() {
        try {
            let messageBody = {
                _AT: global.UserInfo.token
            }
            let ret = await checkUnreadMessage(messageBody, '')()
            this.messageCount = (Boolean(ret) && Boolean(ret.count)) ? ret.count : 0
            return true
        } catch (e) {
            console.log('_checkMessage e===>', e)
            throw e
        }
    }

    // 消息
    _clickMessage() {
        Actions.mineMsgList()
        //todo 清除所有消息
        const GetuiModule = NativeModules.GetuiModule;
        try {
            GetuiModule.cleanAllNotify()
        } catch (e) {
        }
    }

    _toAbout() {
        // 跳页面
        Actions.mineAbout({routerData: {version: this.version, hasUpdate: this.hasUpdate, url: this.update_footer_url}})
    }

    _toHistory() {
        Actions.mineHistory({
            routerData: {
                version: this.version,
                hasUpdate: this.hasUpdate,
                url: this.update_footer_url
            }
        })
    }

    logoutClick() {
        this.refs.logoutFloatingLayer.show()
        this._removeUser()
    }

    // 移除当前用户信息，并重置首页数据
    async _removeUser() {
        try {
            let currentId = (Boolean(global.UserInfo) && Boolean(global.UserInfo.user_id)) ? global.UserInfo.user_id : 0
            if (currentId !== 0) {
                let ret = await removeCurrentUser(currentId)
                if (ret) {
                    this.refs.logoutFloatingLayer.hide()
                    global.CurUser = null
                    // 重置首页数据平台数据
                    this.props.myactions.resetLookData()
                    Actions.login({routerData: {pushType: 'mine'}})
                } else {
                    this.deleteCurrentStorageFail('_removeUser removeCurrentUser fail')
                    throw new Error('_removeUser removeCurrentUser fail')
                }
            } else {
                this.deleteCurrentStorageFail('_removeUser currentId is length is 0')
                throw new Error('_removeUser currentId is length is 0')
            }
        } catch (e) {
            this.deleteCurrentStorageFail(e)
            throw e
        }
    }

    // 隐藏 layer浮层， 做失败提示
    deleteCurrentStorageFail(reason) {
        this.refs.logoutFloatingLayer.hide()
        console.log('deleteCurrentStorageFail reason===>', reason)
        toastShort('退出登录失败')
    }

    render() {
        return (
            <View style={{backgroundColor: colors.labBgColor, flex: 1}}>
                <Page userName={this.userName}
                      version={this.version} versionHasUpdate={this.hasUpdate}
                      versionPress={this._toAbout}
                      historyPress={this._toHistory}
                      messagePress={this._clickMessage} messageCount={this.messageCount}
                      logoutPress={this.logoutClick}
                />
                <TabIcon currentCode={TabCode.MINE_TAB}/>
                <LoadingFloatingLayer ref="logoutFloatingLayer"/>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MineComponent)