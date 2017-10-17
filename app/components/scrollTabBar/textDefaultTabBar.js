/**
 *  create at 16/11/05
 *  在 react-native-scrollable-tab-view 中 DefaultTabbar 基础上做了修改，提供每个tab样式给外部
 *  外部需要提供的属性:
 *    style: containerStyle
 *    array: tabArr
 *    style: itemStyle
 *    文字 style: activeTextColor, inactiveTextColor, textStyle
 *    underline: underlineHeight, underlineColor
 *    goToPage func: goToPage
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet, Animated, Image} from 'react-native';

import Button from './button'

export default class DefaultImageTabBar extends Component {
    constructor(props) {
        super(props)

        this._renderTabOption = this._renderTabOption.bind(this)
    }

    componentWillMount() {

    }

    _renderTabOption() {
        return this.props.tabArr.map((tab, page) => {

            const isTabActive = this.props.activeTab === page;
            const {activeTextColor, inactiveTextColor, textStyle} = this.props;
            const textColor = isTabActive ? activeTextColor : inactiveTextColor;
            const fontWeight = isTabActive ? 'bold' : 'normal';

            return (
                <Button
                    style={{flex: 1}}
                    key={page}
                    accessible={true}
                    accessibilityLabel={tab.name}
                    accessibilityTraits='button'
                    onPress={this.btnClick.bind(this, tab, page)}
                >
                    <View style={[this.props.itemStyle, {flexDirection: 'row'}]}>
                        <Text style={[{color: textColor, fontWeight, flex: 1, textAlign: 'center'}, textStyle]}>
                            {tab.name}
                        </Text>
                    </View>
                </Button>
            )
        })
    }

    btnClick(tab, page) {
        this.props.goToPage(page)
    }

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabArr.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: this.props.underlineHeight,
            backgroundColor: this.props.underlineColor,
            bottom: 0,
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs],
        });

        return (
            <View style={[{flexDirection: 'row'}, this.props.containerStyle]}>
                {this._renderTabOption()}
                <Animated.View style={[tabUnderlineStyle, {left}]}/>
            </View>
        )
    }
}