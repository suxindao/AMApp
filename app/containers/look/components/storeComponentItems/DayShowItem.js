/**
 * create at 08/04/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// common
import {manageMonney} from '../../../../constants/operation/lookManage'
import {verifyFunction} from '../../../../constants/utils/validate'

export default class DayShowItem extends Component {
    constructor(props) {
        super(props)

        this._dayItemClick = this._dayItemClick.bind(this)
    }

    _dayItemClick() {
        let {dayItemPress = () => null, code = ''} = this.props
        if (verifyFunction(dayItemPress, 'look day DayShowItem', 'dayItemPress')) {
            dayItemPress(code)
        }
    }

    render() {
        let {
            leftTitle = '', leftContent = '', middleTitle = '', middleContent = '',
            rightTitle = '', rightContent = '',
            showTopLine = false,
        } = this.props
        return (
            <TouchableHighlight underlayColor={colors.touchBgColor} style={styles.dayItemTouch}
                                onPress={this._dayItemClick}
            >
                <View style={[styles.dayItemView,
                    showTopLine ? {borderTopWidth: distances.borderWidth} : null
                ]}>
                    <ItemLeft title={leftTitle} content={leftContent}/>
                    <MiddleItem title={middleTitle} content={middleContent}/>
                    <ItemRight title={rightTitle} content={rightContent}/>
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * item left
 */
class ItemLeft extends Component {
    render() {
        let {content, title} = this.props
        return (
            <View style={styles.itemLeft}>
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
 * item middle
 */
class MiddleItem extends Component {
    render() {
        let {content, title} = this.props
        return (
            <View style={styles.itemMiddle}>
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
 * item right
 */
class ItemRight extends Component {
    render() {
        let {content, title} = this.props
        let contentNum = manageMonney(content)
        return (
            <View style={styles.itemRight}>
                <Text style={[
                    {textAlign: 'left'}, styles.contentText
                ]}>{contentNum}</Text>
                <Text style={[
                    {textAlign: 'left'}, styles.titleText
                ]}>{title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dayItemTouch: {
        height: 68,
    },
    dayItemView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: distances.contractLeftMargin,
        borderColor: colors.borderColor,
    },
    itemLeft: {
        flex: 1,
        paddingLeft: distances.contractLeftMargin
    },
    itemMiddle: {
        flex: 1,
        borderColor: colors.borderColor,
        borderLeftWidth: distances.borderWidth,
        paddingLeft: distances.contractLeftMargin
    },
    itemRight: {
        flex: 1,
        borderColor: colors.borderColor,
        borderLeftWidth: distances.borderWidth,
        paddingLeft: distances.contractLeftMargin
    },
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
})