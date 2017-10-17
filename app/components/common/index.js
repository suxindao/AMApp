/**
 * create at 07/14/17
 * 业务的一些通用组件
 */
import React, {Component} from 'react';
import {View, Text, TouchableHighlight, Image, StyleSheet} from 'react-native'
import Rx from 'rx'

// style
import {colors, distances, fontScale} from '../../constants/style'

/**
 * 部门选择 (记录筛选、订单筛选、联系人筛选)
 */
export class DepartmentComponent extends Component {
    constructor(props) {
        super(props)

        this._touchClick = this._touchClick.bind(this)
    }

    _touchClick() {
        let {departmentPress} = this.props
        if (typeof departmentPress === 'function') {
            departmentPress()
        }
    }

    render() {
        let {selectDepartmentName} = this.props
        return (
            <TouchableHighlight underlayColor={colors.touchBgColor} onPress={this._touchClick}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 110 / 2}}>
                    <Text style={{color: '#333', fontSize: 15 * fontScale, flex: 1}}>{'部门'}</Text>
                    {
                        (selectDepartmentName && selectDepartmentName.length > 0) ?
                            <Text style={{color: '#333', fontSize: 15 * fontScale}}>{selectDepartmentName}</Text> :
                            <Text style={{color: '#ccc', fontSize: 15 * fontScale}}>{'请选择'}</Text>
                    }
                    <Image style={{marginRight: 15, marginLeft: 10}}
                           source={require('../../sources/images/arrow_right.png')}/>
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 确认按钮 (记录筛选、订单筛选、联系人筛选)
 */
export class ConfirmButton extends Component {
    constructor(props) {
        super(props)
        this.isPress = false
        this._onPress = this._onPress.bind(this)
    }

    _onPress() {
        if (this.isPress)
            return
        this.isPress = true

        const sub = Rx.Observable.timer(500)
        sub.subscribe(
            (x) => {
            },
            (err) => {
            },
            () => {
                this.isPress = false
            })

        let {confirmPress = () => null} = this.props;
        // (typeof confirmPress === 'function') ? confirmPress : (()=>null)
        confirmPress()
    }

    render() {
        let {confirmPress = () => null, touchStyle = null, confirmText = ''} = this.props
        return (
            <View style={styles.confirmView}>
                <TouchableHighlight underlayColor={colors.touchBgColor}
                                    onPress={this._onPress}
                                    style={[styles.confirmTouch, touchStyle]}
                >
                    <Text style={{color: '#fff', fontSize: 16 * fontScale}}>{confirmText}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    confirmView: {
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: colors.borderColor,
        borderTopWidth: distances.borderWidth,
    },
    confirmTouch: {
        backgroundColor: colors.blueColor,
        height: 76 / 2,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    }
})