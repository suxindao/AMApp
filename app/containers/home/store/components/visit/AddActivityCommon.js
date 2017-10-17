/**
 * create at 07/17/17
 */
import React, {Component} from 'react'
import {View, TextInput, Image, Text, TouchableHighlight, StyleSheet} from 'react-native'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

// 组件 
import {multilineTextInput} from '../../components/listeningCourse/editCommon'
import ElementAlert from './../../../../../components/common/ElementAlert'
import PayoffType from './../../components/PayoffType'

/**
 * 返回分栏标签
 */
export class TitleLabel extends Component {
    render() {
        let {labelText = ''} = this.props
        return (
            <View style={styles.labelView}>
                <Text style={styles.labelText}>{labelText}</Text>
            </View>
        )
    }
}

/**
 * 多行输入框
 */
export class DesComponent extends Component {
    constructor(props) {
        super(props)
        this._inputUpdate = this._inputUpdate.bind(this)
    }

    _inputUpdate(text) {
        let {updateInput} = this.props
        updateInput(text)
    }

    render() {
        let {data, editable, visiable = false} = this.props
        if (!visiable) {
            return null
        }
        return (
            <View style={styles.desView}>
                {multilineTextInput(data, this._inputUpdate, '请输入', null, editable)}
            </View>
        )
    }
}

/**
 * 展示拜访位置
 */
export class ShowPositionComponent extends Component {
    render() {
        let {address = '', positionTouch = () => null, visiable = false} = this.props
        if (!visiable) {
            return null
        }
        return (
            <TouchableHighlight onPress={
                (typeof positionTouch === 'function') ? positionTouch : (() => null)
            } underlayColor={colors.touchBgColor} style={{
                backgroundColor: '#fff',
            }}>
                <View style={styles.touchView}>
                    <View style={[styles.touchLeftView, {minHeight: 60}
                    ]}>
                        <Image
                            style={{width: 14, height: 17, marginRight: 15}}
                            source={require('../../../../../sources/images/home/location_grays.png')}
                        />
                        <Text style={{flex: 1, fontSize: 16 * fontScale, color: '#333', marginRight: 22}}
                              numberOfLines={1}>
                            {address}
                        </Text>
                    </View>
                    <Image
                        style={{width: 6, height: 10, marginRight: distances.contractLeftMargin}}
                        source={require('../../../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 展示拜访工作内容
 */
export class ShowWorkContentComponent extends Component {
    render() {
        let {
            workTouch = () => null, touchStyle = null, workTitle = '', workContent = '', visiable = false
        } = this.props
        if (!visiable) {
            return null
        }
        return (
            <TouchableHighlight onPress={
                (typeof workTouch === 'function') ? workTouch : (() => null)
            } underlayColor={colors.touchBgColor} style={[
                {backgroundColor: '#fff'}, touchStyle
            ]}>
                <View style={[styles.touchView, {borderTopWidth: distances.borderWidth}]}>
                    <View style={[styles.touchLeftView]}>
                        <View style={{
                            justifyContent: 'center', alignItems: 'flex-start', width: 116
                        }}>
                            <Text style={{fontSize: 16 * fontScale, color: '#333'}}>{workTitle}</Text>
                        </View>
                        <Text style={{flex: 1, fontSize: 15 * fontScale, color: '#666', marginRight: 22}}
                              numberOfLines={1}>
                            {workContent}
                        </Text>
                    </View>
                    <Image
                        style={{width: 6, height: 10, marginRight: distances.contractLeftMargin}}
                        source={require('../../../../../sources/images/arrow_right.png')}
                    />
                </View>
            </TouchableHighlight>
        )
    }
}

/**
 * 展示运营情况收集内容
 */
export class ShowOperationContentComponent extends Component {
    render() {
        let {onChangeTextCallback, operatorData = {}, touchStyle = null, visiable = false} = this.props
        console.log("operatorData => ", operatorData)
        if (!visiable) {
            return null
        }

        return (
            <View>
                <TouchableHighlight
                    onPress={() => {
                        this.refs.payoffType.slideModal()
                    }}
                    underlayColor={colors.touchBgColor}
                    style={[{backgroundColor: '#fff'}, touchStyle]}
                >
                    <View style={styles.operationView}>
                        <Text style={styles.operationLabel}>是否正常发工资</Text>
                        <TextInput
                            style={styles.operationInputText}
                            editable={false}
                            placeholderTextColor={'#d3d3d3'}
                            placeholder='请选择'
                            underlineColorAndroid={'transparent'}
                            value={operatorData.hasOwnProperty('payoff') ? (operatorData.payoff === 1 ? '是' : '否') : ''}
                        />
                        <Image
                            style={{width: 6, height: 10, marginRight: distances.contractLeftMargin}}
                            source={require('../../../../../sources/images/arrow_right.png')}
                        />
                    </View>
                </TouchableHighlight>
                <ElementAlert
                    ref="payoffType"
                    tapBackHide={false}
                    innerElement={
                        <PayoffType
                            touchItem={onChangeTextCallback}
                            callback={() => {
                                this.refs.payoffType.hide()
                            }}
                        />
                    }
                />
                <View style={styles.operationView}>
                    <Text style={styles.operationLabel}>上月流水(万)</Text>
                    <TextInput
                        style={styles.operationInputText}
                        placeholderTextColor={'#d3d3d3'}
                        placeholder='必填'
                        keyboardType='numeric'
                        underlineColorAndroid={'transparent'}
                        onChangeText={v => {
                            onChangeTextCallback({sales: v})
                        }}
                    />
                </View>
                <View style={styles.operationView}>
                    <Text style={styles.operationLabel}>本月业绩目标(万)</Text>
                    <TextInput
                        style={styles.operationInputText}
                        placeholderTextColor={'#d3d3d3'}
                        placeholder='必填'
                        keyboardType='numeric'
                        underlineColorAndroid={'transparent'}
                        onChangeText={v => {
                            onChangeTextCallback({target: v})
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    labelView: {
        backgroundColor: colors.labBgColor,
        height: 30,
        justifyContent: 'center',
        borderTopWidth: distances.borderWidth,
        borderBottomWidth: distances.borderWidth,
        borderColor: '#d3d3d3',
    },
    labelText: {
        fontSize: 13 * fontScale,
        color: '#999',
        marginLeft: distances.contractLeftMargin
    },
    desView: {
        backgroundColor: '#fff',
        height: 125,
        paddingLeft: distances.contractLeftMargin,
        paddingRight: distances.contractLeftMargin,
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: colors.borderColor,
        borderBottomWidth: distances.borderWidth,
    },
    touchView: {
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: distances.contractLeftMargin,
        paddingRight: distances.contractLeftMargin,
        borderColor: colors.borderColor,
        borderBottomWidth: distances.borderWidth,
    },
    touchLeftView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    operationView: {
        minHeight: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.borderColor,
        backgroundColor: '#fff',
        paddingLeft: distances.contractLeftMargin,
        borderBottomWidth: distances.borderWidth,
    },
    operationLabel: {
        fontSize: 16 * fontScale,
        color: '#333',
        width: 130,
    },
    operationInputText: {
        fontSize: 15 * fontScale,
        color: colors.inputColor,
        flex: 1,
        marginRight: distances.leftMargin,
        backgroundColor: '#fff',
        paddingRight: 0,
        paddingLeft: 10,
    }
})