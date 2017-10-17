/**
 * Created at 2017/3/3.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Image} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../constants/style'

/**
 * TOP 部分
 */
export class TopComponent extends Component {
    render() {
        let {versionCode} = this.props
        return (
            <View style={{alignItems: 'center', alignSelf: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Image source={require('../../../sources/images/login/beidou_logo.png')}/>
                    <Text style={{marginLeft: 5, color: '#999', fontSize: 13 * fontScale}}>{
                        Boolean(versionCode) ? versionCode : ''
                    }</Text>
                </View>
                <Text style={{marginTop: 18, color: '#999', fontSize: 15 * fontScale}}>
                    {'一个账号，开启企业号工具。'}
                </Text>
            </View>
        )
    }
}

/**
 * 输入框上部提示
 */
export class RemindTop extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <Text style={{color: '#666', fontSize: 15 * fontScale}}>
                    {'账号'}
                </Text>
                <Text style={{color: '#999', fontSize: 12 * fontScale}}>
                    {'(使用的是公司后台账号)'}
                </Text>
            </View>
        )
    }
}

/**
 * 输入框下部提示
 */
export class RemindBottom extends Component {
    render() {
        return (
            <Text style={{marginTop: 15, color: '#999', fontSize: 12 * fontScale}}>
                {'暂不支持重置密码，请直接联系公司产品技术'}
            </Text>
        )
    }
}

/**
 * login btn
 */
export class LoginBtn extends Component {
    render() {
        let {loginPress} = this.props
        return (
            <TouchableHighlight onPress={loginPress} style={{
                justifyContent: 'center', alignItems: 'center', marginTop: 25,
                height: 76 / 2, backgroundColor: colors.blueColor, borderRadius: 3,
            }}
                                underlayColor={colors.touchBgColor}
            >
                <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>
                    登录
                </Text>
            </TouchableHighlight>
        )
    }
}