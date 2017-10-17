/**
 * create at 04/13/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {manageMonney} from '../../../../constants/operation/lookManage'

const viewHeight = 68

/**
 * 日数据 item
 *
 */
/**
 * 活跃门店 item
 * 结构        左 | 中 | 右
 */
export default class MonthShowItem extends Component {
    constructor(props) {
        super(props)

        this._rightClick = this._rightClick.bind(this)
    }

    _rightClick() {
        let {code = '', itemPress = () => null} = this.props
        if (typeof itemPress === 'function') {
            itemPress(code)
        } else {
            console.log('ShowItem itemPress is not a function')
        }
    }

    render() {
        let {
            leftTitle = '', leftContent = '', rightContent = '',
            middleLeftTitle = '', middleLeftContent = '', middleRightContent = '',
        } = this.props
        return (
            <View style={styles.monthItemContainer}>
                <TouchableHighlight onPress={this._rightClick}
                                    underlayColor={colors.touchBgColor}
                                    style={{height: viewHeight, justifyContent: 'center'}}
                >
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <MonthItemLeft title={leftTitle} content={leftContent}/>
                        <MonthMiddleLeft title={middleLeftTitle} content={middleLeftContent}/>
                        <MonthItemMiddleRight content={middleRightContent}/>
                        <MonthItemRight content={rightContent}/>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

/**
 * 活跃门店 item left
 */
class MonthItemLeft extends Component {
    render() {
        let {content, title} = this.props
        return (
            <View style={styles.monthItemMiddleRight}>
                <Text style={[
                    {textAlign: 'left'}, styles.contentText
                ]}>{content}</Text>
                <Text style={[
                    {textAlign: 'left'}, styles.titleText
                ]}>{title}</Text>
            </View>
        )
    }
}

/**
 * 活跃门店 item left
 */
class MonthMiddleLeft extends Component {
    render() {
        let {content, title} = this.props
        return (
            <View style={styles.monthItemMiddleRight}>
                <Text style={[
                    {textAlign: 'left'}, styles.contentText
                ]}>{content}</Text>
                <Text style={[
                    {textAlign: 'left'}, styles.titleText
                ]}>{title}</Text>
            </View>
        )
    }
}

/**
 * 活跃门店 item middle right
 */
class MonthItemMiddleRight extends Component {
    render() {
        let {content} = this.props
        let contentNum = manageMonney(content)
        return (
            <View style={styles.monthItemMiddleRight}>
                <Text style={[
                    {textAlign: 'left'}, styles.contentText
                ]}>{contentNum}</Text>
                <Text style={[
                    {textAlign: 'left'}, styles.titleText
                ]}>{'总额'}</Text>
            </View>
        )
    }
}

/**
 * 活跃门店 item right
 */
class MonthItemRight extends Component {
    render() {
        let {content} = this.props
        let contentColor = colors.redColor2
        if (content < 0) {
            contentColor = colors.greenColor
        }
        return (
            <View style={styles.monthItemMiddleRight}>
                <Text style={[
                    {textAlign: 'left', color: contentColor, fontSize: 20 * fontScale}
                ]}>{content + '%'}</Text>
                <Text style={[
                    {textAlign: 'left'}, styles.titleText
                ]}>{'总额环比'}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentText: {
        color: colors.blueColor,
        fontSize: 20 * fontScale,
        fontWeight: 'bold'
    },
    titleText: {
        marginTop: 10,
        color: '#999',
        fontSize: 12 * fontScale,
    },
    monthItemContainer: {
        flex: 1,
        height: viewHeight,
        paddingRight: distances.contractLeftMargin,
        borderColor: colors.borderColor,
        borderTopWidth: distances.borderWidth
    },
    monthItemMiddleRight: {
        flex: 1,
        borderColor: colors.borderColor,
        borderLeftWidth: distances.borderWidth,
        paddingLeft: 15,
    },
    monthItemRight: {
        borderColor: colors.borderColor,
        borderLeftWidth: distances.borderWidth,
        flexDirection: 'row',
        alignItems: 'center',
        width: 240 / 2 - distances.contractLeftMargin,
    }
})