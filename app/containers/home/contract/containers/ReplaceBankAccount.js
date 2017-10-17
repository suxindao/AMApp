/**
 * Created by Joe on 2017/3/16.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
import {Actions} from 'react-native-router-flux'
import _ from 'lodash'

// common
import {subsectionText} from '../../../../constants/common'

// style
import {colors, distances, fontScale} from '../../../../constants/style'

// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    setReplaceBankAccountState,
    rsetReplaceBankAccountState
} from '../../../../redux/modules/home/contact/replaceBankAccountRedux'

const mapStateToProps = state => ({
    isRender: state.replaceBankAccount.isRender,                      //是否渲染
    list: state.replaceBankAccount.list,                          //门店信息
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setReplaceBankAccountState,
        rsetReplaceBankAccountState,
    }, dispatch), dispatch
})

/**
 * 服务合同组件
 */
class ReplaceBankAccount extends Component {
    constructor(props) {
        super(props)
        this.initData = this.initData.bind(this)
        this.getBankAccountItme = this.getBankAccountItme.bind(this)
        this.setOnselectedBankAccountItem = this.setOnselectedBankAccountItem.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.state = {
            bankAccountItemInfo: ''
        }
    }

    componentWillMount() {
        let enterprise_id = this.props.routerData.enterprise_id
        this.props.myactions.loadData(
            '/am_api/am/contract/payAccount',
            {
                _AT: global.UserInfo.token,
                enterprise_id
            },
            this.initData
        );
    }

    componentWillUnmount() {
        this.props.myactions.rsetReplaceBankAccountState();
    }

    async initData(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            let value = this.props.routerData.account_info;
            for (var z = 0; z < data.length; z++) {
                data[z].onSelected = false;
                if (value && data[z].id == value.id)
                    data[z].onSelected = true;
            }
            this.setState({
                bankAccountItemInfo: _.cloneDeep(data)
            });
            return data
        } catch (e) {
            throw e;
            toastShort('查询收款账号失败！');
            console.log('subContract:' + e)
        }
    }

    getBankAccountItme() {
        let item = new Array();
        for (var z = 0; z < this.state.bankAccountItemInfo.length; z++) {
            let account_id = this.state.bankAccountItemInfo[z].id;
            item.push(
                <TouchableOpacity
                    key={'bankAccountItem' + z}
                    style={{
                        marginBottom: 10,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: this.state.bankAccountItemInfo[z].onSelected ? colors.blueColor : colors.borderColor,
                        borderRadius: 3
                    }}
                    onPress={() => {
                        this.setOnselectedBankAccountItem(account_id);
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 15,
                            marginBottom: 15,
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    borderRadius: 2,
                                    backgroundColor: '#4eb683',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    height: 19,
                                }}
                            >
                                <Text style={{color: '#fff', marginLeft: 4, marginRight: 4, fontSize: 13 * fontScale}}>
                                    {this.state.bankAccountItemInfo[z].type == 1 ? '对公' : '对私'}
                                </Text>
                            </View>
                            <View
                                style={{
                                    borderRadius: 2,
                                    backgroundColor: this.state.bankAccountItemInfo[z].status === 0 ? '#e8b951' : '#73b1fa',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 15,
                                    height: 19,
                                    marginTop: 13,
                                }}
                            >
                                <Text style={{color: '#fff', marginLeft: 4, marginRight: 4, fontSize: 13 * fontScale}}>
                                    {this.state.bankAccountItemInfo[z].status === 0 ? '未生效' : '已生效'}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                marginLeft: 10
                            }}
                        >
                            <Text style={{color: '#333', fontSize: 16 * fontScale}}>
                                {this.state.bankAccountItemInfo[z].name}
                            </Text>
                            <Text style={{color: '#666', marginTop: 13, fontSize: 13 * fontScale}}>
                                {this.state.bankAccountItemInfo[z].bank_name}
                            </Text>
                            <Text style={{color: '#666', marginTop: 9, fontSize: 13 * fontScale}}>
                                {subsectionText(this.state.bankAccountItemInfo[z].bank_account, 4)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return item;
    }

    setOnselectedBankAccountItem(id) {
        let bankAccountItemInfo = this.state.bankAccountItemInfo;
        for (var z = 0; z < bankAccountItemInfo.length; z++) {
            bankAccountItemInfo[z].onSelected = false;
            if (bankAccountItemInfo[z].id == id) {
                bankAccountItemInfo[z].onSelected = true;
            }
        }
        this.setState({
            bankAccountItemInfo: bankAccountItemInfo
        });
    }

    subInfo() {
        let value = this.props.routerData.store_info;
        let bankAccountItemInfo = this.state.bankAccountItemInfo;
        let stores = this.props.stores;
        A: for (var z of bankAccountItemInfo) {
            if (z.onSelected == true) {
                B: for (var a = 0; a < stores.length; a++) {
                    if (value.id == stores[a].store_info.id) {
                        stores[a].account_info = new Object();
                        stores[a].account_info.id = z.id
                        stores[a].account_info.name = z.name
                        stores[a].account_info.bank_name = z.bank_name
                        stores[a].account_info.bank_account = z.bank_account
                        break A;
                    }
                }
            }
        }
        this.props.callback({stores: _.cloneDeep(stores)})
        Actions.pop();
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    width: distances.deviceWidth,
                    height: distances.deviceHeight,
                    backgroundColor: colors.labBgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={{width: distances.deviceWidth - 30}}>
                    <Text
                        style={{
                            marginTop: 15,
                            marginBottom: 15,
                            fontSize: 16 * fontScale,
                            color: '#333'
                        }}
                    >
                        {this.props.routerData.store_info.branch}
                    </Text>
                </View>
                <ScrollView
                    style={{
                        width: distances.deviceWidth - 30,
                        backgroundColor: colors.labBgColor,
                        marginBottom: 60
                    }}
                >
                    <View style={{paddingBottom: 10}}>
                        {this.getBankAccountItme()}
                    </View>
                </ScrollView>
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: distances.deviceWidth,
                        height: 60,
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            () => {
                                Actions.createBankAccount({
                                    routerData: {
                                        storeInfo: this.props.routerData,
                                        stores: this.props.stores,
                                        enterprise_id: this.props.routerData.enterprise_id,
                                        callback: this.props.callback
                                    }
                                })
                            }
                        }
                        style={{
                            height: 38, width: 140, alignItems: 'center',
                            justifyContent: 'center', backgroundColor: colors.labBgColor, borderRadius: 3,
                            marginLeft: 25
                        }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: colors.blueColor}}>新建账号</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this.subInfo}
                        style={{
                            height: 38, width: 140, alignItems: 'center',
                            justifyContent: 'center', backgroundColor: colors.blueColor,
                            borderRadius: 3, marginRight: 25
                        }}
                    >
                        <Text style={{fontSize: 16 * fontScale, color: '#fff'}}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplaceBankAccount)