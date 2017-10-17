/**
 * Created by Joe on 2017/3/14.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, DeviceEventEmitter} from 'react-native'
import {checkPhone, checkBankNo} from '../../../../constants/utils/validate'
import {Actions} from 'react-native-router-flux'
// common
import {isNull} from '../../../../constants/common'
import {contractType} from '../../../../constants/operation/contractManage'
import {addOneDrafts, deleteOneDrafts} from '../../../../modules/storage/draftsHistory'
import {toastShort} from '../../../../constants/toast'
import AutoKeywordScrollView from '../../../../components/common/AutoKeywordScrollView'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import ServiceContract from '../components/ServiceContract'
import ContractButton from '../components/ContractButton'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    setCreateServiceConState,
    rsetCreateServiceConState
} from '../../../../redux/modules/home/contact/creatServiceContractRedux'

const mapStateToProps = state => ({
    isRender: state.createServiceCon.isRender,                      //是否渲染
    editable: state.createServiceCon.editable,                      //是否可编辑
    main_contract_id: state.createServiceCon.main_contract_id,      //主体合同id
    contract_id: state.createServiceCon.contract_id,                //合同id
    name: state.createServiceCon.name,              //企业名称
    enterprise_id: state.createServiceCon.enterprise_id,              //企业id
    code: state.createServiceCon.code,                              //编号
    signed_date: state.createServiceCon.signed_date,                //签约日期
    from_date: state.createServiceCon.from_date,                    //开始日期
    to_date: state.createServiceCon.to_date,                        //结束日期
    am_name: state.createServiceCon.am_name,                        //签约AM
    srv_instalment: state.createServiceCon.srv_instalment,          //签约服务_分期合作: 0-无 1-有
    fin_codes: state.createServiceCon.fin_codes,                    //金融产品，多个用逗号分隔
    fin_names: state.createServiceCon.fin_names,                    //金融产品，多个用逗号分隔
    fin_codes_info: state.createServiceCon.fin_codes_info,          //金融产品，多个用逗号分隔
    srv_straight: state.createServiceCon.srv_straight,      //签约服务_直通车合作: 0-无 1-有
    straight_fee: state.createServiceCon.straight_fee,      //签约服务_直通车合作金额
    srv_mini: state.createServiceCon.srv_mini,                      //签约服务_MINI课推广: 0-无 1-有
    srv_roll: state.createServiceCon.srv_roll,                      //签约服务_客多多推广: 0-无 1-有
    stores: state.createServiceCon.stores,                          //门店信息
    contract_pics: state.createServiceCon.contract_pics             //图片信息
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setCreateServiceConState,
        rsetCreateServiceConState
    }, dispatch), dispatch
})

/**
 * 主体合同组件
 */
class CreatServiceContract extends Component {
    constructor(props) {
        super(props)
        this.popRefresh = this.popRefresh.bind(this)
        this.setFinCodeInfo = this.setFinCodeInfo.bind(this);
        this.getFinCodeInfo = this.getFinCodeInfo.bind(this);
        this.contractCallback = this.contractCallback.bind(this);
        this.getServiceContactData = this.getServiceContactData.bind(this);
        this.checkedForm = this.checkedForm.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.subContract = this.subContract.bind(this)
        this.editInfo = this.editInfo.bind(this)
        this.temporary = this.temporary.bind(this)
    }

    componentWillMount() {
        let {routerData} = this.props;
        if (routerData.fromPage == 'drafts') {
            this.props.myactions.rsetCreateServiceConState({...routerData})
        } else {
            if (routerData) {
                let obj = new Object();
                routerData.editable ? obj.editable = routerData.editable : null;
                !isNull(routerData.enterprise.name) ? obj.name = routerData.enterprise.name : null;
                !isNull(routerData.main_contract_id) ? obj.main_contract_id = routerData.main_contract_id : null;
                !isNull(routerData.enterprise.id) ? obj.id = routerData.enterprise.id : null;
                !isNull(routerData.service_contract_info.id) ? obj.contract_id = routerData.service_contract_info.id : null;
                !isNull(routerData.code) ? obj.code = routerData.code : null;
                !isNull(routerData.signed_date) ? obj.signed_date = routerData.signed_date : null;
                !isNull(routerData.from_date) ? obj.from_date = routerData.from_date : null;
                !isNull(routerData.to_date) ? obj.to_date = routerData.to_date : null;
                !isNull(routerData.am_name) ? obj.am_name = routerData.am_name : null;
                !isNull(routerData.service_contract_info.srv_instalment) ? obj.srv_instalment = routerData.service_contract_info.srv_instalment : null;
                !isNull(routerData.service_contract_info.fin_codes) ? obj.fin_codes = routerData.service_contract_info.fin_codes : null;
                !isNull(routerData.service_contract_info.fin_codes_name) ? obj.fin_names = routerData.service_contract_info.fin_codes_name : null;
                !isNull(routerData.service_contract_info.srv_straight) ? obj.srv_straight = routerData.service_contract_info.srv_straight : null;
                !isNull(routerData.service_contract_info.straight_fee) ? obj.straight_fee = routerData.service_contract_info.straight_fee : null;
                !isNull(routerData.service_contract_info.srv_mini) ? obj.srv_mini = routerData.service_contract_info.srv_mini : null;
                !isNull(routerData.service_contract_info.srv_roll) ? obj.srv_roll = routerData.service_contract_info.srv_roll : null;
                routerData.stores ? obj.stores = routerData.stores : null;
                routerData.pics ? obj.contract_pics = routerData.pics : null;
                this.props.myactions.setCreateServiceConState({...obj}, true);
            } else {
                this.props.myactions.rsetCreateServiceConState({am_name: global.UserInfo.user_name}, true);
            }
        }
        this.setFinCodeInfo();
    }

    componentWillUnmount() {
        this.props.myactions.rsetCreateServiceConState();
    }

    popRefresh() {
        let {emitKey} = this.props;
        if (emitKey)
            DeviceEventEmitter.emit(emitKey);
        Actions.pop();
    }

    shouldComponentUpdate(np, ns) {
        return np.isRender;
    }

    setFinCodeInfo() {
        this.props.myactions.loadData(
            '/am_api/am/contract/finProducts',
            {
                _AT: global.UserInfo.token,
            },
            this.getFinCodeInfo
        )
    }

    async getFinCodeInfo(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (data.length > 0) {
                let fin_codes_info_arr = new Array();
                for (var z of data) {
                    let fin_codes_info = {};
                    fin_codes_info.info = z.terms + '期 B端 ' + z.service_rate / 10 + '% C端 ' + z.interest_rate / 10 + '%';
                    fin_codes_info.fincode = z.code;
                    fin_codes_info.isChecked = false;
                    fin_codes_info_arr.push(fin_codes_info);
                }
                this.props.myactions.setCreateServiceConState({
                    fin_codes_info: fin_codes_info_arr
                }, true);
            }
            return data
        } catch (e) {
            toastShort(e.message);
        }
    }

    contractCallback(obj) {
        this.props.myactions.setCreateServiceConState(obj, true)
    }

    getServiceContactData() {
        return {
            editable: this.props.editable,
            main_contract_id: this.props.main_contract_id,
            name: this.props.name,
            enterprise_id: this.props.enterprise_id,
            code: this.props.code,
            signed_date: this.props.signed_date,
            from_date: this.props.from_date,
            to_date: this.props.to_date,
            am_name: this.props.am_name,
            srv_instalment: this.props.srv_instalment,
            fin_codes: this.props.fin_codes,
            fin_names: this.props.fin_names,
            fin_codes_info: this.props.fin_codes_info,
            srv_straight: this.props.srv_straight,
            straight_fee: this.props.straight_fee,
            srv_mini: this.props.srv_mini,
            srv_roll: this.props.srv_roll,
            stores: this.props.stores,
            contract_pics: this.props.contract_pics,
        }
    }

    checkedForm() {
        if (isNull(this.props.code)) {
            toastShort('编号不允许为空');
            return false;
        }
        if (isNull(this.props.signed_date)) {
            toastShort('签约日期不允许为空');
            return false;
        }
        if (isNull(this.props.from_date)) {
            toastShort('开始日期不允许为空');
            return false;
        }
        if (isNull(this.props.to_date)) {
            toastShort('结束日期不允许为空');
            return false;
        }
        if (this.props.to_date < this.props.from_date) {
            toastShort('开始日期不能大于结束日期');
            return false;
        }
        if (isNull(this.props.am_name)) {
            toastShort('签约AM不允许为空');
            return false;
        }
        if (isNull(this.props.srv_instalment)) {
            toastShort('请勾选分期合作');
            return false;
        }
        if (this.props.srv_instalment === 1 && this.props.fin_codes === '') {
            toastShort('请选择金融产品');
            return false;
        }
        if (this.props.srv_straight == 1 && isNull(this.props.straight_fee)) {
            toastShort('请填写直通车金额');
            return false;
        }
        if (this.props.stores.length < 1) {
            toastShort('请选择关联门店');
            return false;
        }
        if (isNull(this.props.contract_pics) || this.props.contract_pics.length === 0) {
            toastShort('请上传合同照片');
            return false;
        }
        return true;
    }

    subInfo() {
        if (this.checkedForm()) {
            let storeInfo = new Array();
            for (var z of this.props.stores) {
                storeInfo.push(
                    (z.account_info && z.account_info.id !== null) ?
                        {
                            store_id: z.store_info.id,
                            account_id: z.account_info.id
                        } :
                        {
                            store_id: z.store_info.id,
                        }
                )
            }
            this.props.myactions.loadData(
                '/am_api/am/contract/createService',
                {
                    _AT: global.UserInfo.token,
                    main_contract_id: this.props.main_contract_id,
                    enterprise_id: this.props.enterprise_id,
                    code: this.props.code,
                    signed_date: this.props.signed_date,
                    from_date: this.props.from_date,
                    to_date: this.props.to_date,
                    srv_instalment: this.props.srv_instalment,
                    srv_straight: this.props.srv_straight,
                    straight_fee: this.props.straight_fee,
                    srv_mini: this.props.srv_mini,
                    srv_roll: this.props.srv_roll,
                    fin_codes: this.props.fin_codes,
                    stores: storeInfo,
                    pics: this.props.contract_pics,
                },
                this.subContract
            )
        }
    }

    editInfo() {
        if (this.checkedForm()) {
            let storeInfo = new Array();
            for (var z of this.props.stores) {
                storeInfo.push(
                    (z.account_info && z.account_info.id !== null) ?
                        {
                            store_id: z.store_info.id,
                            account_id: z.account_info.id
                        } :
                        {
                            store_id: z.store_info.id,
                        }
                )
            }
            this.props.myactions.loadData(
                '/am_api/am/contract/modifyService',
                {
                    _AT: global.UserInfo.token,
                    contract_id: this.props.contract_id,
                    signed_date: this.props.signed_date,
                    from_date: this.props.from_date,
                    to_date: this.props.to_date,
                    srv_instalment: this.props.srv_instalment,
                    srv_straight: this.props.srv_straight,
                    straight_fee: this.props.straight_fee,
                    srv_mini: this.props.srv_mini,
                    srv_roll: this.props.srv_roll,
                    fin_codes: this.props.fin_codes,
                    stores: storeInfo,
                    pics: this.props.contract_pics,
                },
                this.subContract
            )
        }
    }

    async subContract(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (this.props.fromPage === 'drafts' &&
                ( this.props.draftsKey !== '' ||
                    typeof this.props.draftsKey !== 'undefined' )
            ) {
                deleteOneDrafts(this.props.draftsKey)
            }
            toastShort('提交审核成功！');
            this.popRefresh();
            return data
        } catch (e) {
            toastShort(e.message);
        }
    }

    async editContract(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            toastShort('提交审核成功！');
            this.popRefresh();
            return data
        } catch (e) {
            toastShort(e.message);
        }
    }

    temporary() {
        if (isNull(this.props.code)) {
            toastShort('编号不允许为空');
            return false;
        }
        let obj = {
            _AT: global.UserInfo.token,
            main_contract_id: this.props.main_contract_id,
            contract_id: this.props.contract_id,
            enterprise_id: this.props.enterprise_id,
            name: this.props.name,
            code: this.props.code,
            signed_date: this.props.signed_date,
            from_date: this.props.from_date,
            to_date: this.props.to_date,
            am_name: this.props.am_name,
            srv_instalment: this.props.srv_instalment,
            fin_codes: this.props.fin_codes,
            fin_names: this.props.fin_names,
            fin_codes_info: this.props.fin_codes_info,
            srv_straight: this.props.srv_straight,
            straight_fee: this.props.straight_fee,
            srv_mini: this.props.srv_mini,
            srv_roll: this.props.srv_roll,
            stores: this.props.stores,
            contract_pics: this.props.contract_pics,
        }
        if (!addOneDrafts(contractType.server, this.props.code, this.props.name, '未提交', obj))
            toastShort('保存草稿失败！');
        toastShort('保存草稿成功！');
    }

    render() {
        let {scrollEnabled = true, needKeyWord = true} = this.props
        return (
            <AutoKeywordScrollView scrollEnabled={scrollEnabled} needKeyWord={needKeyWord}
                                   scrollStyle={{backgroundColor: colors.bgColor, flex: 1}}>
                <ServiceContract data={this.getServiceContactData()} contractCallback={this.contractCallback}/>
                {false && <ContractButton
                    btnType={this.props.btnType}
                    fromPage={this.props.fromPage}
                    editTouch={this.props.editTouch}
                    editInfo={this.editInfo}
                    temporary={this.temporary}
                    subInfo={this.subInfo}
                />}
            </AutoKeywordScrollView>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatServiceContract)