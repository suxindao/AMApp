/**
 * create at 03/15/17
 * 自定义navBar, 对于一些复杂的navBar情况
 */
import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux'

//组件
import StatusBar from '../common/StatusBar'

//style
import {colors, distances, fontScale, globleStyles} from '../../constants/style'

/**
 * 有右边Img btn NavBar
 */
export class NavBarRightImg extends Component {
    render() {
        let {title, img, rightFun, showRight, showLeft = true} = this.props
        return (
            <View style={globleStyles.navBarStyle}>
                <StatusBar/>
                <View style={styles.navBarView}>
                    <View style={styles.centerTextView}>
                        <Text style={styles.centerText}>
                            {title}
                        </Text>
                    </View>
                    {
                        !showLeft ? null :
                            (
                                <TouchableOpacity onPress={Actions.pop}
                                                  style={styles.customBackButton}
                                >
                                    <Image style={{marginLeft: distances.navBarLeft}}
                                           source={require('../../sources/images/back_white.png')}/>
                                </TouchableOpacity>
                            )
                    }
                    {
                        !showRight ? null :
                            (
                                <TouchableOpacity onPress={rightFun} style={[
                                    styles.rightBtnView
                                ]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1}}/>
                                        <Image style={{marginRight: distances.navBarLeft}} source={img}/>
                                    </View>
                                </TouchableOpacity>
                            )
                    }
                </View>
            </View>
        )
    }
}

/**
 *
 */
export class NavbarWidthTwoRightImg extends Component {
    render() {
        let {title, img1, rightFun1, img2, rightFun2} = this.props
        return (
            <View style={globleStyles.navBarStyle}>
                <StatusBar/>
                <View style={styles.navBarView}>
                    <View style={styles.centerTextView}>
                        <Text style={styles.centerText}>
                            {title}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={Actions.pop}
                                      style={styles.customBackButton}
                    >
                        <Image style={{marginLeft: distances.navBarLeft}}
                               source={require('../../sources/images/back_white.png')}/>
                    </TouchableOpacity>
                    <View style={styles.rightBtnDoubleImgView}>
                        <TouchableOpacity onPress={rightFun1} style={{
                            flex: 1, justifyContent: 'center', height: distances.navHeight
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 1}}/>
                                <Image style={{marginRight: 10}} source={img1}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={rightFun2} style={{
                            height: distances.navHeight, justifyContent: 'center'
                        }}>
                            <Image style={{marginRight: distances.navBarLeft, marginLeft: 10}} source={img2}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    // 自定义 back button style
    customBackButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: distances.navBarLeft + 40,
        justifyContent: 'center',
    },
    navBarView: {
        height: distances.navHeight,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'stretch',
    },
    centerTextView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    centerText: {
        color: '#fff',
        fontSize: 18 * fontScale,
        letterSpacing: 0.5,
        fontWeight: '500'
    },
    rightBtnView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: distances.navBarLeft + 40,
        justifyContent: 'center',
    },
    rightBtnDoubleImgView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: distances.navBarLeft + 20 + 20 + 20 + 20, // 两个20为给的图片大概宽度，实际的图片宽度都是小于20的，另外两个20为图片左边距
        flexDirection: 'row',
        alignItems: 'center'
    }
})