/**
 * Created by Joe on 2017/3/24.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// 组件
import ContentComponent from '../../../../components/common/ContentComponent'
import {toastShort} from '../../../../constants/toast'

// common
import {subsectionText, isNull} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import {checkBankNo} from '../../../../constants/utils/validate'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    setCreateBankAccountState,
    rsetCreateBankAccountState
} from '../../../../redux/modules/home/contact/createBankAccountRedux'

const mapStateToProps = state => ({
    isRender: state.createBankAccount.isRender,                      //是否渲染
    account_type: state.createBankAccount.account_type,                          //门店信息
    account_name: state.createBankAccount.account_name,                          //门店信息
    bank_name: state.createBankAccount.bank_name,                          //门店信息
    bank_account: state.createBankAccount.bank_account,                          //门店信息
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setCreateBankAccountState,
        rsetCreateBankAccountState
    }, dispatch), dispatch
})

/**
 * 服务合同组件
 */
class CreateBankAccount extends Component {
    constructor(props) {
        super(props)

        this.setValue = this.setValue.bind(this);
        this.validate = this.validate.bind(this);
        this.subInfo = this.subInfo.bind(this);
        this.setBankAccount = this.setBankAccount.bind(this);
    }

    componentWillUnmount() {
        this.props.myactions.rsetCreateBankAccountState();
    }

    setValue(obj) {
        for (var key in obj) {
            if (key == 'bank_account') {
                obj[key] = obj[key].replaceAll(' ', '');
            }
        }
        this.props.myactions.setCreateBankAccountState(obj, true);
    }

    validate() {
        if (isNull(this.props.account_type)) {
            toastShort('请选择账号类型');
            return false;
        }
        if (isNull(this.props.account_name)) {
            toastShort('账户名称不允许为空');
            return false;
        }
        if (isNull(this.props.bank_name)) {
            toastShort('开户银行不允许为空');
            return false;
        }
        if (isNull(this.props.bank_account)) {
            toastShort('银行账号不允许为空');
            return false;
        }
        let res = checkBankNo(this.props.bank_account);
        if (!res.pass) {
            toastShort('银行账号格式有误');
            return false;
        }
        return true;
    }

    subInfo() {
        if (this.validate()) {
            this.props.myactions.loadData(
                '/am_api/am/contract/createPayAccount',
                {
                    _AT: global.UserInfo.token,
                    // enterprise_id: this.props.routerData.storeInfo.store_info.enterprise_id,
                    enterprise_id: this.props.routerData.enterprise_id,
                    account_type: this.props.account_type,
                    account_name: this.props.account_name,
                    bank_name: this.props.bank_name,
                    bank_account: this.props.bank_account,
                },
                this.setBankAccount
            )
        }
    }

    async setBankAccount(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            let stores = this.props.routerData.stores;
            let storeInfo = this.props.routerData.storeInfo;
            for (var a = 0; a < stores.length; a++) {
                if (storeInfo.store_info.id == stores[a].store_info.id) {
                    if (!stores[a].account_info) {
                        stores[a].account_info = {}
                    }
                    stores[a].account_info.id = data.id
                    stores[a].account_info.name = data.name
                    stores[a].account_info.bank_name = data.bank_name
                    stores[a].account_info.bank_account = data.bank_account
                    break;
                }
            }
            if (this.props.routerData.callback && typeof this.props.routerData.callback === 'function') {
                this.props.routerData.callback({stores: _.cloneDeep(stores)})
            }
            Actions.pop();
            toastShort('创建收款账号成功！');
            return data
        } catch (e) {
            toastShort('创建收款账号失败！');
            console.log('subContract:' + e)
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.labBgColor
                }}
            >
                <ScrollView>
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '账号类型',
                            type: 'radio',
                            radio: [
                                {
                                    id: 1,
                                    name: '对公账号'
                                },
                                {
                                    id: 2,
                                    name: '对私账号'
                                }
                            ],
                            editable: true,
                            key: 'account_type',
                            value: this.props.account_type
                        }}
                        callback={data => {
                            this.setValue(data);
                        }}
                    />
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '账户名称',
                            type: 'input',
                            placeholder: '请输入账户名称',
                            editable: true,
                            key: 'account_name',
                            value: this.props.account_name
                        }}
                        callback={data => {
                            this.setValue(data);
                        }}
                    />
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '开户银行',
                            type: 'input',
                            placeholder: '请输入开户银行',
                            editable: true,
                            key: 'bank_name',
                            value: this.props.bank_name
                        }}
                        callback={data => {
                            this.setValue(data);
                        }}
                    />
                    <ContentComponent
                        config={{
                            hasLine: true,
                            title: '银行账号',
                            type: 'input',
                            placeholder: '请输入银行账号',
                            keyboardType: 'numeric',
                            maxLength: 32,
                            editable: true,
                            key: 'bank_account',
                            value: subsectionText(this.props.bank_account, 4)
                        }}
                        callback={data => {
                            this.setValue(data);
                        }}
                    />
                </ScrollView>
                <View
                    style={{
                        width: distances.deviceWidth,
                        height: 60,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: distances.deviceWidth - 50,
                            height: 38,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.blueColor,
                            borderRadius: 3,
                        }}
                        onPress={this.subInfo}
                    >
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#fff'
                            }}
                        >
                            保存
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBankAccount)