/**
 * create at 03/06/17
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native'

// 界面组件
import {
    NameComponent,
    MessageComponent,
    VersionComponent,
    LogoutComponent,
    HistoryComponent
} from '../components/common'

// style
import {colors, distances} from '../../../constants/style'

export default class Page extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        let {
            userName = '',
            version = '', versionHasUpdate = false, versionPress = () => null,
            historyPress = () => null,
            messagePress = () => null, messageCount = 0,
            logoutPress = () => null,
        } = this.props
        return (
            <View style={{flex: 1, marginBottom: 50}}>
                <NameComponent content={userName}/>
                <MessageComponent content={messageCount} messagePress={messagePress}/>
                <VersionComponent content={version} versionPress={versionPress} isShowPoint={versionHasUpdate}/>
                <HistoryComponent historyPress={historyPress}/>
                <LogoutComponent outPress={logoutPress}/>
            </View>
        )
    }
}