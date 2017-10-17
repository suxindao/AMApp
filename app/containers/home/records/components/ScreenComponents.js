/**
 * Created by Joe on 2017/5/27.
 */
import React, {Component} from 'react';
import {View, Text, TouchableHighlight, Image, StyleSheet} from 'react-native';

// 组件
import {showTitleLable, ButtonComponent, SelectItem} from './common'

// op common
import {timeSelectObj, typeSelectObj} from '../../../../constants/operation/recordScreenManage'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// toast
import {toastShort} from '../../../../constants/toast'

export class TimeSwitchComponent extends Component {
    constructor(props) {
        super(props)

        this._btnBack = this._btnBack.bind(this)
    }

    _btnBack(code) {
        let {type, callBack} = this.props
        if (typeof callBack === 'function') {
            callBack(type, code)
        }
    }

    render() {
        let {currentCode} = this.props
        return (
            <View style={[styles.viewRow, {paddingBottom: 2}]}>
                <ButtonComponent name='全部' code={timeSelectObj.all} isMarkedCode={currentCode}
                                 btnPress={this._btnBack}
                />
                <ButtonComponent name='今天' code={timeSelectObj.today} isMarkedCode={currentCode}
                                 btnPress={this._btnBack} styleBtn={{marginLeft: 15}}
                />
            </View>
        )
    }
}

export class TypePickerComponent extends Component {
    constructor(props) {
        super(props)

        this._btnBack = this._btnBack.bind(this)
    }

    _btnBack(code, date) {
        // toastShort(date)
        let {type, callBack} = this.props
        let data = {code: code, date: date}
        if (typeof callBack === 'function') {
            callBack(type, timeSelectObj.custom, data)
        }
    }

    render() {
        let {minValue, maxValue} = this.props
        return (
            <View style={styles.viewRow}>
                <SelectItem content={minValue} code='min'
                            confirmPress={this._btnBack}
                />
                <View style={{width: 45, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#ccc', fontSize: 10 * fontScale}}>{'——'}</Text>
                </View>
                <SelectItem content={maxValue} code='max'
                            confirmPress={this._btnBack}
                />
            </View>
        )
    }
}

export class TypeSwitchComponent extends Component {
    constructor(props) {
        super(props)

        this._btnBack = this._btnBack.bind(this)
    }

    _btnBack(code) {
        let {type, callBack} = this.props
        if (typeof callBack === 'function') {
            callBack(type, code)
        }
    }

    render() {
        let {currentCode} = this.props
        return (
            <View>
                <View style={styles.viewRow}>
                    <ButtonComponent name='全部' code={typeSelectObj.all} isMarkedCode={currentCode}
                                     btnPress={this._btnBack}/>
                    <ButtonComponent name='电话' code={typeSelectObj.tel} isMarkedCode={currentCode}
                                     btnPress={this._btnBack} styleBtn={{marginLeft: 15}}/>
                    <ButtonComponent name='拜访签到' code={typeSelectObj.sign} isMarkedCode={currentCode}
                                     btnPress={this._btnBack} styleBtn={{marginLeft: 15}}/>
                </View>
                <View style={styles.viewRow}>
                    <ButtonComponent name='经营情况' code={typeSelectObj.operation} isMarkedCode={currentCode}
                                     btnPress={this._btnBack}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewRow: {
        paddingLeft: distances.contractLeftMargin,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 11,
        paddingBottom: 11
    }
})