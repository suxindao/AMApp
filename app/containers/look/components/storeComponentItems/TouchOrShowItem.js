/**
 * create at 04/13/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, ScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

/**
 * 防守门店、激活门店 item
 */
export default class TouchOrShowItem extends Component {
    constructor(props) {
        super(props)

        this.tsClick = this.tsClick.bind(this)
    }

    tsClick() {
        let {code, pressTouch} = this.props
        pressTouch(code)
    }

    render() {
        let {showRight, rightContent, leftTitle, leftContent, pressAble} = this.props
        if (pressAble) {
            return (
                <TouchableHighlight
                    onPress={this.tsClick} underlayColor={colors.touchBgColor}
                    style={{backgroundColor: '#fff'}}
                >
                    <View>
                        <TOSItemContent leftTitle={leftTitle}
                                        showRight={showRight} rightContent={rightContent} leftContent={leftContent}
                        />
                    </View>
                </TouchableHighlight>
            )
        } else {
            return (
                <View style={{backgroundColor: '#fff'}}>
                    <TOSItemContent leftTitle={leftTitle}
                                    showRight={showRight} rightContent={rightContent} leftContent={leftContent}
                    />
                </View>
            )
        }
    }
}

/**
 * 防守门店、激活门店 item content
 *                                |
 * 构造                左边    | 右边
 *                                |
 *
 *        左边    左 | 右
 */
class TOSItemContent extends Component {
    render() {
        let {
            showRight, rightContent, leftTitle, leftContent,
        } = this.props
        return (
            <View style={{
                marginLeft: distances.contractLeftMargin, flexDirection: 'row', alignItems: 'center',
                borderColor: colors.borderColor, borderTopWidth: distances.borderWidth,
                paddingRight: distances.contractLeftMargin, height: 50,
            }}>
                <View style={{flex: 19, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        color: '#999', fontSize: 12 * fontScale, flex: 1, textAlign: 'left'
                    }}>{leftTitle}</Text>
                    <Text style={{
                        color: colors.blueColor, fontSize: 15 * fontScale, flex: 1, textAlign: 'left'
                    }}>{leftContent}</Text>
                </View>
                <TOSICRight visible={showRight} content={rightContent}/>
                <Image style={{marginLeft: 15, marginRight: 0}}
                       source={require('../../../../sources/images/arrow_right.png')}/>
            </View>
        )
    }
}

/**
 * 防守门店、激活门店 item content  右边
 *
 * 构造      左 | 中    | 右
 */
class TOSICRight extends Component {
    render() {
        let {visible, content} = this.props
        if (!visible) {
            return (
                <View style={{flex: 16, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1}}/>
                </View>
            )
        }
        let contentColor = colors.redColor2
        if (content < 0) {
            contentColor = colors.greenColor
        }
        return (
            <View style={{flex: 16, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{marginLeft: 15, color: '#999', fontSize: 12 * fontScale}}>总额环比</Text>
                <Text style={{
                    marginLeft: 15,
                    flex: 1,
                    fontSize: 15 * fontScale,
                    color: contentColor
                }}>{content + '%'}</Text>
            </View>
        )
    }
}