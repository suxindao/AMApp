/**
 * Created by Joe on 2017/3/22.
 */

import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    DeviceEventEmitter,
    TouchableHighlight
} from 'react-native'
import {Actions} from 'react-native-router-flux'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
import {notification} from '../../../../constants/common'
// 组件
import WrapLoading from '../../../../components/load/wraploading'
import EnterpriseDetails from '../components/EnterpriseDetails'
import EnterpriseTables from '../components/EnterpriseTables'
import ElementAlert from '../../../../components/common/ElementAlert'
import {toastShort} from '../../../../constants/toast'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    loadMoreData,
    reloadData,
    setEnterpriseState,
    rsetEnterpriseState,
} from '../../../../redux/modules/home/contact/enterpriseRedux'

const mapStateToProps = state => ({
    loading: state.enterpriseRedux.loading,
    loading_success: state.enterpriseRedux.loading_success,
    isRender: state.enterpriseRedux.isRender,
    list_loading: state.enterpriseRedux.list_loading,
    list_refreshing: state.enterpriseRedux.list_refreshing,
    list_error: state.enterpriseRedux.list_error,
    ended: state.enterpriseRedux.ended,
    next_key: state.enterpriseRedux.next_key,
    limit: state.enterpriseRedux.limit,
    list: state.enterpriseRedux.list,
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        loadMoreData,
        reloadData,
        setEnterpriseState,
        rsetEnterpriseState,
    }, dispatch), dispatch
})
const emitKey = notification.Enterprise;

/**
 * 主体合同组件
 */
class Enterprise extends Component {
    constructor(props) {
        super(props)
        this.changeButton = this.changeButton.bind(this);
        this.getData = this.getData.bind(this);
        this.initLocalData = this.initLocalData.bind(this);
        this.getButton = this.getButton.bind(this);
        this.getCreateContractElement = this.getCreateContractElement.bind(this);
        this.state = {
            isShowBtn: false
        }
        this.refresh = '';
    }

    changeButton(data) {
        if (data.i == 1) {
            this.setState({
                isShowBtn: true
            });
        } else {
            this.setState({
                isShowBtn: false
            });
        }
    }

    componentWillMount() {
        this.getData();
        this.refresh = DeviceEventEmitter.addListener(emitKey, param => this.getData());
    }

    componentWillUnmount() {
        this.props.myactions.rsetEnterpriseState();
        this.refresh.remove();
    }

    getData() {
        this.props.myactions.loadData(
            '/am_api/am/enterprise/id',
            {
                _AT: global.UserInfo.token,
                id: this.props.routerData.id,
            },
            this.initLocalData
        );
    }

    async initLocalData(client, path, param) {
        let data = await client.post(path, {data: param}).then(data => {
            this.props.myactions.setEnterpriseState({list: data}, true);
        }).catch(e => {
            console.log(e)
        });
        return data
    }

    getButton() {
        if (this.state.isShowBtn) {
            return (
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
                        onPress={() => {
                            this.refs.createContract.slideModal();
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16 * fontScale,
                                color: '#fff'
                            }}
                        >
                            新建合同
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return null
        }
    }

    getCreateContractElement() {
        let list = this.props.list;
        var bank_info = {};
        if (list.pay_account) {
            for (var z of list.pay_account) {
                if (z.default) {
                    bank_info = z;
                }
            }
        }
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: distances.deviceWidth,
                position: 'absolute',
                left: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0)'
            }}>
                <View
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                >
                    <Text style={{fontSize: 12 * fontScale, color: '#999'}}>新建合同类型</Text>
                </View>
                <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderTopWidth: distances.borderWidth,
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onPress={
                        () => {
                            this.refs.createContract.hide();
                            if (list.main_contract_id === null || list.main_contract_id === '' || typeof list.main_contract_id === 'undefined') {
                                toastShort('当前企业不存在有效的框架协议，请先创建')
                                return;
                            }
                            Actions.createStageContract({
                                routerData: {
                                    data: {
                                        enterprise: {
                                            id: list.id,
                                            name: list.name,
                                        },
                                        main_contract_id: list.main_contract_id,
                                    },
                                    btnType: 2
                                },
                                isNew: true,
                                emitKey: emitKey
                            });
                        }
                    }
                >
                    <Text style={{fontSize: 17 * fontScale, color: '#007aff'}}>新建分期合作协议</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onPress={
                        () => {
                            this.refs.createContract.hide();
                            if (list.main_contract_id === null || list.main_contract_id === '' || typeof list.main_contract_id === 'undefined') {
                                toastShort('当前企业不存在有效的框架协议，请先创建')
                                return;
                            }
                            Actions.createStraightContract({
                                routerData: {
                                    data: {
                                        enterprise: {
                                            id: list.id,
                                            name: list.name,
                                        },
                                        main_contract_id: list.main_contract_id,
                                    },
                                    btnType: 2
                                },
                                isNew: true,
                                emitKey: emitKey
                            });
                        }
                    }
                >
                    <Text style={{fontSize: 17 * fontScale, color: '#007aff'}}>新建直通车合作协议</Text>
                </TouchableHighlight>
                {false && <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderBottomWidth: distances.borderWidth,
                        borderColor: colors.borderColor,
                    }}
                    onPress={
                        () => {
                            this.refs.createContract.hide();
                            if (list.main_contract_id === null || list.main_contract_id === '' || typeof list.main_contract_id === 'undefined') {
                                toastShort('当前企业不存在有效的框架协议，请先创建')
                                return;
                            }
                            Actions.createExtendContract({
                                routerData: {
                                    data: {
                                        enterprise: {
                                            id: list.id,
                                            name: list.name,
                                        },
                                        main_contract_id: list.main_contract_id,
                                    },
                                    btnType: 2
                                },
                                isNew: true,
                                emitKey: emitKey
                            });
                        }
                    }
                >
                    <Text style={{fontSize: 17 * fontScale, color: '#007aff'}}>新建推广合同</Text>
                </TouchableHighlight>}
                <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                    }}
                    onPress={
                        () => {
                            this.refs.createContract.hide();
                            Actions.creatMainContract(
                                {
                                    routerData: {
                                        editable: {
                                            code: true,
                                            signed_date: true,
                                            from_date: true,
                                            to_date: true,
                                            am_name: false,
                                            name: true,
                                            reg_code: true,
                                            operator_brand: true,
                                            operator_type: true,
                                            operator_type_other: true,
                                            tel: true,
                                            email: true,
                                            legal_person: true,
                                            area: true,
                                            address: true,
                                            contact: true,
                                            contact_detail: true,
                                            contract_pics: true,
                                        },
                                        enterprise: {
                                            id: list.id,
                                            name: list.name,
                                        },
                                        main_contract_info: {
                                            id: list.id,
                                            name: list.name,
                                            reg_code: list.reg_code,
                                            area: list.area,//所在地区
                                            area_code: list.area_code,//所在地区代码
                                            address: list.address,
                                            legal_person: list.legal_person,
                                            legal_person_idcard: list.legal_person_idcard,
                                            legal_person_detail: list.legal_person_detail,
                                            contacts: list.contacts,
                                        },
                                        account: list.pay_account,
                                        btnType: 2
                                    },
                                    isNew: true,
                                    emitKey: emitKey
                                }
                            );
                        }
                    }
                >
                    <Text style={{fontSize: 17 * fontScale, color: '#007aff'}}>新建框架协议</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    underlayColor='#fafafa'
                    style={{
                        width: distances.deviceWidth - 30,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        marginTop: 8,
                        marginBottom: 15,
                    }}
                    onPress={() => {
                        this.refs.createContract.hide();
                    }}
                >
                    <Text style={{fontSize: 17 * fontScale, color: '#007aff'}}>取消</Text>
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        let list = this.props.list;
        let detials = {
            name: list.name,
            reg_code: list.reg_code,
            address: list.address,
            legal_person: list.legal_person,
            legal_person_idcard: list.legal_person_idcard,
            legal_person_detail: list.legal_person_detail,
        }
        return (
            <WrapLoading {...this.props} onErrorPress={this.getData}>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <ScrollView
                        style={{
                            backgroundColor: colors.labBgColor,
                            flex: 1,
                        }}
                        bounces={false}
                    >
                        <EnterpriseDetails
                            data={detials}
                            style={{
                                width: distances.deviceWidth,
                                backgroundColor: colors.blueColor,
                                flex: 1
                            }}
                        />
                        <EnterpriseTables
                            data={this.props.list}
                            onClickTab={this.changeButton}
                        />
                    </ScrollView>
                    <ElementAlert ref="createContract" innerElement={this.getCreateContractElement()}/>
                    {this.getButton()}
                </View>
            </WrapLoading>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enterprise)