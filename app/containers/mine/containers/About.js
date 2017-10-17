/**
 * update at 06/21/17
 */

import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet, Linking, Platform} from 'react-native'

// modules
import upgrade from '../../../modules/upgrade'

// components
import {showUpdate} from '../components/common'

// styles
import {colors, distances, fontScale} from '../../../constants/style'
// common
import {ios_updateUrl_head} from '../../../helpers/config'
// toast
import {toastShort} from '../../../constants/toast'

export default class AboutComponent extends Component {
    constructor(props) {
        super(props)

        this.isUpdate = false
        this._toDownLoad = this._toDownLoad.bind(this)
    }

    componentWillMount() {
        if (this.props.routerData) {
            let {version, hasUpdate, url} = this.props.routerData
            this.isUpdate = hasUpdate
            this.version = version
            this.iosUpdateUrl = url
        }
    }

    async _toDownLoad() {
        try {
            if (Platform.OS == 'ios') {
                let url = ios_updateUrl_head + this.iosUpdateUrl
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => {
                    throw err
                })
            } else {
                let ret = await upgrade.startUpgrade()
                console.log('_toDownLoad ret===>', ret)
            }
        } catch (e) {
            console.log('_toDownLoad e===>', e)
            toastShort('更新失败')
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.labBgColor,}}>
                <View style={styles.textView}>
                    <Image style={{marginBottom: 10}} source={require('../../../sources/images/start_logo.png')}/>
                    <Text style={{marginBottom: 50, color: '#333', fontSize: 14 * fontScale}}>{this.version}</Text>
                    <Text style={{color: '#333', fontSize: 14 * fontScale}}>{
                        this.isUpdate ? '有新版本, 请点击更新' : '当前已经是最新版本'
                    }</Text>
                </View>
                {showUpdate(this.isUpdate, this._toDownLoad, styles.updateTouch)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textView: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    updateTouch: {
        marginTop: 50
    }
})