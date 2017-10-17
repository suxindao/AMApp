/**
 * Created by Joe on 2017/1/16.
 * update at 06/29/17
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux'

// components
import {PointComponent} from '../common/PointComponent'

// style
import {distances, colors, fontScale} from '../../constants/style'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
    show_mine_point: state.tabbar.mine_point,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({}, dispatch),
    dispatch,
})

class TabIcon extends Component {
    constructor(props) {
        super(props)

        this.tabClick = this.tabClick.bind(this)
    }

    tabClick(code) {
        switch (code) {
            case TabCode.LOOK_TAB: {
                Actions.look()
            }
                break;
            case TabCode.HOME_TAB: {
                Actions.home()
            }
                break;
            case TabCode.MINE_TAB: {
                Actions.mine()
            }
                break;
            default:
                break;
        }
    }

    render() {
        let {currentCode, show_mine_point} = this.props
        return (
            <View style={styles.container}>
                <TabItem code={TabCode.LOOK_TAB} currentCode={currentCode} title='首页'
                         iconNor={tabIconObj.look.nor} iconSel={tabIconObj.look.sel}
                         touchPress={this.tabClick}
                />
                <TabItem code={TabCode.HOME_TAB} currentCode={currentCode} title='工作台'
                         iconNor={tabIconObj.home.nor} iconSel={tabIconObj.home.sel}
                         touchPress={this.tabClick}
                />
                <TabItem code={TabCode.MINE_TAB} currentCode={currentCode} title='我的'
                         iconNor={tabIconObj.mine.nor} iconSel={tabIconObj.mine.sel} isShowPoint={show_mine_point}
                         touchPress={this.tabClick}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon)

class TabItem extends Component {
    constructor(props) {
        super(props)

        this._tabItemClick = this._tabItemClick.bind(this)
    }

    _tabItemClick() {
        let {code = '', touchPress = () => null} = this.props
        if (typeof touchPress === 'function') {
            touchPress(code)
        }
    }

    render() {
        let {
            title = '', iconNor = '', iconSel = '', currentCode = '', code = '', isShowPoint = false
        } = this.props
        let isSelected = (code === currentCode) ? true : false
        let textColor = isSelected ? colors.blueColor : '#666'
        let iconStr = isSelected ? iconSel : iconNor
        return (
            <TouchableOpacity activeOpacity={colors.touchActive}
                              onPress={this._tabItemClick} style={styles.itemTouch}
            >
                <View style={styles.itemViewOut}>
                    <View style={styles.itemViewIn}>
                        <Image source={iconStr}></Image>
                        <Text style={[styles.itemText, {color: textColor}]}>
                            {title}
                        </Text>
                        <PointComponent isShow={isShowPoint} showNum={false} containerStyle={styles.itemPoint}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export const TabCode = {
    LOOK_TAB: 'look_tab',  // 首页
    HOME_TAB: 'home_tab',  // 工作台
    MINE_TAB: 'mine_tab',  // 我的
}

const tabIconObj = {
    look: {
        sel: require('../../sources/images/assets/home_sel_1.png'),
        nor: require('../../sources/images/assets/home_nor_1.png')
    },
    home: {
        sel: require('../../sources/images/assets/platform_sel.png'),
        nor: require('../../sources/images/assets/platform_nor.png')
    },
    mine: {
        sel: require('../../sources/images/assets/mine_sel_1.png'),
        nor: require('../../sources/images/assets/mine_nor_1.png')
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        height: distances.tabBarHeight,
        backgroundColor: '#f5f5f7',
        borderColor: '#d9d9d9',
        borderTopWidth: distances.tabBarTopWidth,
    },
    itemTouch: {
        flex: 1
    },
    itemViewOut: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemViewIn: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 10 * fontScale,
        lineHeight: 12,
    },
    itemPoint: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 6,
        height: 6,
        borderRadius: 6 / 2,
        backgroundColor: colors.redColor
    }
})
