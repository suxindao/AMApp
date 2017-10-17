/**
 * create at 04/26/17
 */
import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'

// components
import PhotoSelect from '../../../../../components/photoSelect'

// component function
import {
    textInput, multilineTextInput, groupContentLeft, middleShow, showGroupTitle, styles
} from './editCommon'

// style
import {colors, distances, fontScale} from '../../../../../constants/style'

/**
 * 课程名称和开班人数
 */
export class TopComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {name, max, min, updateInput, editable} = this.props
        return (
            <View style={{
                backgroundColor: '#fff', borderColor: colors.borderColor, borderBottomWidth: distances.borderWidth,
            }}>
                <NameGroup content={name} updateInput={updateInput} editable={editable}/>
                <PeopleCountGroup max={max} min={min} updateInput={updateInput} editable={editable}/>
            </View>
        )
    }
}

class NameGroup extends Component {
    constructor(props) {
        super(props)
        this._inputUpdate = this._inputUpdate.bind(this)
    }

    _inputUpdate(text) {
        let {updateInput} = this.props
        updateInput(text, 'name')
    }

    render() {
        let {content, updateInput, editable} = this.props
        return (
            <View style={[
                styles.groupContent,
                {marginLeft: distances.contractLeftMargin}
            ]}>
                {groupContentLeft('课程名称')}
                {textInput(content, () => null, this._inputUpdate, '请填写', 'default', 30, 'while-editing', null, editable)}
            </View>
        )
    }
}

class PeopleCountGroup extends Component {
    render() {
        let {min, max, inputSubmit, updateInput, editable} = this.props
        return (
            <View style={[
                styles.groupContent,
                {marginLeft: distances.contractLeftMargin, borderBottomWidth: 0}
            ]}>
                {groupContentLeft('开班人数')}
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <CountItem content={min} code='min' inputSubmit={inputSubmit} updateInput={updateInput}
                               editable={editable}/>
                    {middleShow('至')}
                    <CountItem content={max} code='max' inputSubmit={inputSubmit} updateInput={updateInput}
                               editable={editable}/>
                </View>
            </View>
        )
    }
}

class CountItem extends Component {
    constructor(props) {
        super(props)
        this._inputUpdate = this._inputUpdate.bind(this)
    }

    _inputUpdate(text) {
        let {updateInput, code} = this.props
        updateInput(text, code)
    }

    render() {
        let {content, editable} = this.props
        if (typeof content === 'number') {
            content = content.toString()
        }
        return (
            <View style={{
                backgroundColor: colors.labBgColor, borderRadius: 4, width: 60, height: 35,
                justifyContent: 'center', alignItems: 'center'
            }}>
                {textInput(content, () => null, this._inputUpdate, '', 'numeric', 4, 'never', {
                    paddingLeft: 5,
                    paddingRight: 5
                }, editable)}
            </View>
        )
    }
}

/**
 * 教师联系人信息
 */
export class TeacherInfo extends Component {
    constructor(props) {
        super(props)

        this._updateNameInput = this._updateNameInput.bind(this)
        this._updateTelInput = this._updateTelInput.bind(this)
        this._updateDutyInput = this._updateDutyInput.bind(this)
    }

    // 更新姓名
    _updateNameInput(text) {
        let {updateInput} = this.props
        if (typeof updateInput === 'function') {
            updateInput(text, 'teacher')
        } else {
            console.log('updateInput is not a function')
        }
    }

    // 更新电话
    _updateTelInput(text) {
        let {updateInput} = this.props
        if (typeof updateInput === 'function') {
            updateInput(text, 'teacher_tel')
        } else {
            console.log('updateInput is not a function')
        }
    }

    // 更新职位
    _updateDutyInput(text) {
        let {updateInput} = this.props
        if (typeof updateInput === 'function') {
            updateInput(text, 'teacher_duty')
        } else {
            console.log('updateInput is not a function')
        }
    }

    render() {
        let {teacherName, teacherTel, teacherDuty, editable} = this.props
        return (
            <View>
                {showGroupTitle('教师联系信息')}
                <View style={[
                    styles.groupContent,
                    {
                        paddingLeft: distances.contractLeftMargin,
                        backgroundColor: '#fff',
                        borderTopWidth: distances.borderWidth
                    }
                ]}>
                    {groupContentLeft('姓名')}
                    {textInput(teacherName, () => null, this._updateNameInput, '请输入', 'default', 30, 'while-editing', null, editable)}
                </View>
                <View style={[
                    styles.groupContent,
                    {paddingLeft: distances.contractLeftMargin, backgroundColor: '#fff'}
                ]}>
                    {groupContentLeft('电话')}
                    {textInput(teacherTel, () => null, this._updateTelInput, '请输入', 'numeric', 30, 'while-editing', null, editable)}
                </View>
                <View style={[
                    styles.groupContent,
                    {
                        paddingLeft: distances.contractLeftMargin,
                        borderBottomWidth: distances.borderWidth,
                        backgroundColor: '#fff'
                    }
                ]}>
                    {groupContentLeft('职位')}
                    {textInput(teacherDuty, () => null, this._updateDutyInput, '请输入', 'default', 30, 'while-editing', null, editable)}
                </View>
            </View>
        )
    }
}

/**
 * 课程介绍
 */
export class DesComponent extends Component {
    constructor(props) {
        super(props)
        this._inputUpdate = this._inputUpdate.bind(this)
    }

    _inputUpdate(text) {
        let {updateInput} = this.props
        updateInput(text, 'des')
    }

    render() {
        let {data, updateInput, editable} = this.props
        return (
            <View>
                {showGroupTitle('课程介绍')}
                <View style={{
                    backgroundColor: '#fff', height: 125, borderColor: colors.borderColor,
                    borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
                    paddingLeft: distances.contractLeftMargin, paddingRight: distances.contractLeftMargin,
                    paddingTop: 5, paddingBottom: 5,
                }}>
                    {multilineTextInput(data, this._inputUpdate, '请填写', 50, editable)}
                </View>
            </View>
        )
    }
}

/**
 * 课程照片
 */
export class PhotosComponent extends Component {
    render() {
        let {data, onItemUpload, onItemDelete, onItemClick, editable} = this.props
        return (
            <View style={{marginBottom: 20}}>
                {showGroupTitle('课程照片')}
                <PhotoSelect
                    photoNumber={20}
                    style={{
                        backgroundColor: '#fff', paddingBottom: 15, borderColor: colors.borderColor,
                        borderTopWidth: distances.borderWidth, borderBottomWidth: distances.borderWidth,
                    }}
                    initDataWillMount={true}
                    dataPics={data}
                    imagesPerRow={4}
                    imageMargin={distances.contractLeftMargin}
                    onItemUpload={onItemUpload}
                    onItemDelete={onItemDelete}
                    onItemClick={onItemClick}
                    isAddLast={editable}
                    hideItemDelete={!editable}
                />
            </View>
        )
    }
}

export class SaveComponent extends Component {
    render() {
        let {savePress} = this.props
        return (
            <View style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                right: 0,
                height: 60,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                borderTopWidth: distances.borderWidth,
                borderColor: colors.borderColor,
            }}>
                <TouchableHighlight underlayColor='#fafafa' onPress={savePress}
                                    style={{
                                        width: distances.deviceWidth - 100,
                                        height: 38,
                                        backgroundColor: colors.blueColor,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 3,
                                    }}>
                    <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>
                        保存
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }
}
