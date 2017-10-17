/**
 * Created by Joe on 2017/7/14.
 */
import React, {Component} from 'react';
import {ScrollView, Alert, Text, View, Image, TouchableOpacity, TouchableHighlight, Keyboard} from 'react-native'
import _ from 'lodash'
import uuid from 'uuid'
import {Actions} from 'react-native-router-flux'
import {toastShort} from '../../../../constants/toast'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
//组件
import ContentComponent from '../../../../components/common/ContentComponent'
// style
import {colors, distances, fontScale} from '../../../../constants/style'
//common`
import {isNull} from '../../../../constants/common'
import {checkPhone} from '../../../../constants/utils/validate'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {loadData, setState, rsetState} from '../../../../redux/modules/home/store/editContactRedux'

const CONTACTS_COUNT = 50 // 可添加联系人个数

const mapStateToProps = state => ({
    contacts: state.editContact.contacts,
    data: state.editContact.data,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setState,
        rsetState,
    }, dispatch), dispatch
})

class EditContact extends Component {
    constructor(props) {
        super(props)
        this.conCallback = this.conCallback.bind(this);
        this.addContacts = this.addContacts.bind(this);
        this.editContacts = this.editContacts.bind(this);
        this.delContacts = this.delContacts.bind(this);
        this.renderLable = this.renderLable.bind(this);
        this.getconTag = this.getconTag.bind(this);
        this.checkData = this.checkData.bind(this);
        this.saveInfo = this.saveInfo.bind(this);
    }

    componentWillMount() {
        let contacts = _.cloneDeep(this.props.routerData.data.contacts);
        this.props.myactions.setState({contacts: contacts}, true);
    }

    componentWillUnmount() {
        this.props.myactions.rsetState();
        Keyboard.dismiss()
    }

    /**
     * 编辑联系人双向数据流回调函数
     */
    conCallback(obj, key) {
        let contacts = _.cloneDeep(this.props.contacts);
        for (var z in contacts) {
            // 判断key，编辑当前正在编辑的一组数据
            if (contacts[z].key === key) {
                for (var a in obj) {
                    contacts[z][a] = obj[a];
                }
            }
        }
        this.props.myactions.setState({contacts: contacts}, true);
    }

    /**
     * 点击添加联系人按钮
     */
    addContacts() {
        let {contacts = new Array()} = this.props;
        let con = _.cloneDeep(contacts);
        // 添加一组新的联系人数据
        con.push({key: uuid.v4().replace(/-/g, "")});
        this.props.myactions.setState({contacts: con}, true);
    }

    /**
     * 获取编辑联系人按钮标签
     */
    editContacts() {
        let {contacts = new Array()} = this.props;
        return (
            contacts.length < CONTACTS_COUNT ?
                <TouchableOpacity
                    style={{
                        width: distances.deviceWidth,
                        height: 60,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onPress={
                        () => {
                            this.addContacts()
                        }
                    }
                >
                    <Image
                        style={{
                            width: 18,
                            height: 18,
                            marginRight: 10,
                        }}
                        source={require('../../../../sources/images/store/add_contacts.png')}
                    />
                    <Text
                        style={{
                            fontSize: 16 * fontScale,
                            color: colors.blueColor,
                        }}
                    >
                        添加联系人
                    </Text>
                </TouchableOpacity> :
                null
        )
    }

    // 点击删除按钮
    delContacts(key) {
        // 提示是否确认删除
        Alert.alert(
            '提示',
            `是否确认删除？`,
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确认', onPress: () => {
                    let contacts = _.cloneDeep(this.props.contacts);
                    for (var z in contacts) {
                        // 根据key，获取正在编辑的一组数据，并删除
                        if (contacts[z].key === key) {
                            contacts.splice(z, 1);
                        }
                    }
                    this.props.myactions.setState({contacts: contacts}, true);
                }
                },
            ]
        )
    }

    /**
     * 返回分割标签
     */
    renderLable(text, key) {
        return (
            <View
                style={{
                    width: distances.deviceWidth,
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: colors.labBgColor,
                }}
            >
                <Text
                    style={{
                        fontSize: 13 * fontScale,
                        color: '#999',
                        marginLeft: distances.contractLeftMargin
                    }}
                >
                    {text}
                </Text>

                <TouchableHighlight
                    underlayColor='#fafafa'
                    onPress={() => this.delContacts(key)}
                >
                    <Image
                        style={{
                            width: 15,
                            height: 15,
                            marginRight: distances.contractLeftMargin,
                        }}
                        source={require('../../../../sources/images/store/del_store.png')}
                    />
                </TouchableHighlight>
            </View>
        )
    }

    /**
     * 获取联系人相关表单内容的标签
     */
    getconTag() {
        let {contacts = new Array()} = this.props;
        let conTag = new Array();
        if (contacts.length > 0) {
            for (var z = 0; z < contacts.length; z++) {
                let key = contacts[z].key;
                conTag.push(
                    <View key={"con_" + z}>
                        {this.renderLable('联系人' + (z + 1), key)}
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '姓名',
                                type: 'input',
                                placeholder: '请填写',
                                editable: true,
                                key: 'name',
                                value: contacts[z].name
                            }}
                            callback={obj => this.conCallback(obj, key)}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '手机',
                                type: 'input',
                                keyboardType: 'numeric',
                                maxLength: 11,
                                placeholder: '请填写',
                                editable: true,
                                key: 'phone_num',
                                value: contacts[z].phone_num
                            }}
                            callback={obj => this.conCallback(obj, key)}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '职务',
                                type: 'input',
                                placeholder: '请填写',
                                editable: true,
                                key: 'duty',
                                value: contacts[z].duty
                            }}
                            callback={obj => this.conCallback(obj, key)}
                        />
                        <ContentComponent
                            config={{
                                hasLine: true,
                                title: '关键联系人',
                                type: 'radio',
                                radio: [
                                    {
                                        id: 1,
                                        name: '是'
                                    },
                                    {
                                        id: 2,
                                        name: '否'
                                    }
                                ],
                                editable: true,
                                key: 'is_kp',
                                value: Number(contacts[z].is_kp)
                            }}
                            callback={obj => this.conCallback(obj, key)}
                        />
                    </View>
                );
            }
        }
        return conTag;
    }

    /**
     * 校验数据
     */
    checkData(phone_num) {
        if (!checkPhone(phone_num).pass) {
            toastShort('联系人电话格式有误，请修正！');
            return false;
        }
        return true;
    }

    /**
     * 点击保存按钮
     */
    saveInfo() {
        let contacts = _.cloneDeep(this.props.contacts);
        let new_contacts = new Array();
        let order = new Array();
        // 遍历电话号数据，判断姓名和电话号是否为空
        for (var z in contacts) {
            if (!isNull(contacts[z].name) && !isNull(contacts[z].phone_num)) {
                // 不为空则校验数据并保存
                if (this.checkData(contacts[z].phone_num)) {
                    new_contacts.push(contacts[z]);
                } else {
                    return;
                }
            } else {
                // 为空则保留数据，用于提示信息
                order.push(Number(z) + 1);
            }
        }
        if (order.length > 0)
            toastShort(`联系人${order}未填写姓名或电话，未能成功保存！`)
        // 将数据赋值到上一页面，刷新redux
        this.props.callback(new_contacts);
        Actions.pop();
    }

    render() {
        return (
            <View style={{flex: 1, height: distances.deviceHeight}}>
                <KeyboardAwareScrollView style={{flex: 1, marginBottom: 60}} bounces={false}>
                    {this.getconTag()}
                    {this.editContacts()}
                </KeyboardAwareScrollView>
                <View
                    style={{
                        width: distances.deviceWidth,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderTopWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <TouchableHighlight
                        underlayColor='#fafafa'
                        style={{
                            width: distances.deviceWidth - 100,
                            height: 38,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.blueColor,
                            borderRadius: 3,
                        }}
                        onPress={this.saveInfo}
                    >
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#fff',
                            }}
                        >
                            保存
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditContact)