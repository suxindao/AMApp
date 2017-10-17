/**
 * create 03/03/17
 *
 * common style
 */

import {PixelRatio, Dimensions, StyleSheet, Platform} from 'react-native'

const fontScale = 1  // 36/42

const colors = {
    bgColor: '#fff',
    redColor: '#ff6c45',
    navBorderColor: '#828287',
    borderColor: '#d3d3d3',
    blueColor: '#73b1fa',
    textBlue: '#649ff9',
    greenColor: '#62da46',
    touchBgColor: '#f6f7fa',
    touchActive: 0.8,
    inputColor: '#666',
    labBgColor: '#f5f5f5',
    redColor2: '#f7647e',
    redColor3: '#f35e5e'
}

const distances = {
    leftMargin: 23,
    contractLeftMargin: 15,
    navBarLeft: 17,
    borderWidth: 1 / PixelRatio.get(),
    navHeight: Platform.OS === 'ios' ? 44 : 54,
    statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
    navBorderWidth: 0.5 / PixelRatio.get(),
    scrollTabActiveBorderWidth: 2 / PixelRatio.get(),
    tabBarTopWidth: 1 / PixelRatio.get(),
    tabBarHeight: 44,
}

const shadowStyles = {
    shadowOffset: {width: -5},
    shadowColor: 'black',
    shadowOpacity: 0.2,
}

const globleStyles = StyleSheet.create({
    leftIconStyle: {
        width: 10,
        height: 18,
    },
    // 系统back button style
    backButtonStyle: { //TODO 之前版本 iOS 和android 返回样式有不一样的情况，所以这里先区分开
        ...Platform.select({
            ios: {
                paddingLeft: distances.navBarLeft - 2,  //iOS NavBar left 是 left:2
                paddingRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
            },
            android: {
                paddingLeft: distances.navBarLeft - 2,
                paddingRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
            },
        }),
    },
    rightButtonnStyle: { // 有img时的
        backgroundColor: colors.blueColor, // 如果想显示rightImg rightButtonnStyle属性必须有
    },
    rightButtonStyle: {
        ...Platform.select({
            ios: {
                paddingTop: 0,
                paddingRight: 7, // router-flux 中 NavBar left 是 left:2, padding: 8
                paddingBottom: 0,
                paddingLeft: 17 + 10,  // 额外加10使响应区域更大（区域无法大于NavBar设置）
                flex: 1,
            },
            android: {
                height: distances.navHeight,
                position: 'absolute',
                top: -8,
                right: -2,
                padding: 10,
            },
        }),
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitleStyle: {
        color: '#fff',
        fontSize: 18 * fontScale,
        letterSpacing: 0.5,
        fontWeight: '500',
        width: 180,
    },
    navTitleWrapperStyle: {
        height: distances.navHeight,
        ...Platform.select({
            ios: {},
            android: {
                marginTop: 0,
                top: 0,
                flex: 1,
                justifyContent: 'center'
            },
        }),
    },
    rightTitle: {
        fontSize: 17 * fontScale,
        letterSpacing: 0.5,
        color: '#324f76'
    },
    tabBarStyle: {
        borderTopWidth: distances.borderWidth,
        borderTopColor: '#dfe1e1',
        backgroundColor: '#fff'
    },
    navBarStyle: {
        backgroundColor: '#73b1fa',
        borderBottomWidth: 0,
        // height: distances.navHeight+distances.statusBarHeight,
    },
})

module.exports = {colors, distances, fontScale, globleStyles, shadowStyles};