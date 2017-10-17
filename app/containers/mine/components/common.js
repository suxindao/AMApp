/**
 * update 06/21/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'

// components
import {PointComponent} from '../../../components/common/PointComponent'

//style
import {colors, distances, fontScale} from '../../../constants/style'

/**
 * am name
 * @param {*} content, string
 */
export class NameComponent extends Component {
    render() {
        let {content = ''} = this.props
        return (
            <View style={[styles.itemCommon, styles.itemCommonTouch]}>
                <Text style={styles.itemTitle}>{'姓名'}</Text>
                <Text style={[
                    styles.itemContent, {
                        color: '#999', marginRight: distances.leftMargin
                    }]}>{Boolean(content) ? content : ''}</Text>
            </View>
        )
    }
}

/**
 * show message
 * @param {*} content
 * @param {*} msgPress
 */
export class MessageComponent extends Component {
    render() {
        let {content = 0, messagePress = () => null} = this.props
        let showMessagePoint = (content > 0) ? true : false
        return (
            <TouchableHighlight onPress={(typeof messagePress === 'function') ? messagePress : (() => null)}
                                underlayColor={colors.touchBgColor} style={styles.itemCommonTouch}
            >
                <View style={[styles.itemCommon, {flex: 1}]}>
                    <Text style={styles.itemTitle}>{'消息'}</Text>
                    {(showMessagePoint) ? (
                        <PointComponent isShow={showMessagePoint} showNum={true} num={content}
                                        containerStyle={{
                                            marginRight: 10,
                                            backgroundColor: colors.redColor, width: 16 + 12, height: 16 + 12,
                                            borderRadius: (16 + 10) / 2,
                                        }} numStyle={[
                            {color: '#fff', fontSize: 13 * fontScale}
                        ]}
                        />
                    ) : null}
                    <Image style={{marginRight: distances.leftMargin}}
                           source={require('../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 版本号检查
 * @param {*} content , string
 * @param {*} versionPress , function
 * @param {*} showPoint , boolean
 */
export class VersionComponent extends Component {
    render() {
        let {content = '', versionPress = () => null, isShowPoint = false} = this.props
        return (
            <TouchableHighlight onPress={(typeof versionPress === 'function') ? versionPress : (() => null)}
                                underlayColor={colors.touchBgColor} style={[{marginTop: 10}, styles.itemCommonTouch]}
            >
                <View style={[styles.itemCommon, {
                    borderTopWidth: distances.borderWidth, flex: 1,
                }]}>
                    <Text style={styles.itemTitle}>{'版本号'}</Text>
                    <View style={{height: 20, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text style={[
                            styles.itemContent, {marginRight: 10, color: '#999'}
                        ]}>{Boolean(content) ? content : ''}</Text>
                        <PointComponent isShow={isShowPoint} showNum={false}
                                        containerStyle={{
                                            position: 'absolute', top: 2, right: 6,
                                            backgroundColor: colors.redColor, width: 6, height: 6,
                                            borderRadius: 6 / 2,
                                        }}
                        />
                    </View>
                    <Image style={{marginRight: distances.leftMargin}}
                           source={require('../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 版本历史
 * @param {*} content , string
 * @param {*} versionPress , function
 * @param {*} showPoint , boolean
 */
export class HistoryComponent extends Component {
    render() {
        let {historyPress = () => null} = this.props
        return (
            <TouchableHighlight onPress={(typeof historyPress === 'function') ? historyPress : (() => null)}
                                underlayColor={colors.touchBgColor} style={[styles.itemCommonTouch]}
            >
                <View style={[styles.itemCommon, {borderTopWidth: distances.borderWidth, flex: 1,}]}>
                    <Text style={styles.itemTitle}>{'历史'}</Text>
                    <Image style={{marginRight: distances.leftMargin}}
                           source={require('../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 退出
 * @param {*} onPress, functin
 * @param {*} style, style
 */
export class LogoutComponent extends Component {
    render() {
        let {outPress = () => null} = this.props
        return (
            <TouchableHighlight onPress={(typeof outPress === 'function') ? outPress : (() => null)}
                                style={[styles.itemCommonTouch, {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: colors.borderColor,
                                    marginTop: 10,
                                    borderTopWidth: distances.borderWidth,
                                    borderBottomWidth: distances.borderWidth,
                                }]}
                                underlayColor={colors.bgColor}
            >
                <Text style={{color: colors.redColor, fontSize: 16 * fontScale}}>退出登录</Text>
            </TouchableHighlight>
        )
    }
}

/**
 * 更新
 * @param {*} updatePress , function
 * @param {*} style , style
 */
export function showUpdate(visible, updatePress, style) {
    if (!visible) {
        return null
    }
    return (
        <TouchableHighlight onPress={(typeof updatePress === 'function') ? updatePress : (() => null)}
                            style={[styles.updateTouch, style, styles.touchHight]}
                            underlayColor={colors.bgColor}
        >
            <Text style={{color: '#000', fontSize: 16 * fontScale}}>{'更新'}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    itemCommon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.borderColor,
        borderBottomWidth: distances.borderWidth,
    },
    itemCommonTouch: {
        height: 60,
        backgroundColor: '#fff'
    },
    itemTitle: {
        flex: 1,
        marginLeft: distances.leftMargin,
        color: '#333',
        fontSize: 16 * fontScale
    },
    touchHight: {
        height: 76 / 2,
    },
    itemContent: {
        fontSize: 16 * fontScale
    },
    updateTouch: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: distances.leftMargin,
        marginRight: distances.leftMargin,
        borderColor: colors.borderColor,
        borderWidth: distances.borderWidth,
        borderRadius: 5,
    }
})