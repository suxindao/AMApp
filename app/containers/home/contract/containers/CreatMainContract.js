/**
 * Created by Joe on 2017/3/10.
 */
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView, DeviceEventEmitter, Alert} from 'react-native'
import {checkPhone, checkBankNo, IdentityCodeValid} from '../../../../constants/utils/validate'
import {Actions} from 'react-native-router-flux'
// common
import {isNull} from '../../../../constants/common'
import {contractType} from '../../../../constants/operation/contractManage'
import {addOneDrafts, deleteOneDrafts} from '../../../../modules/storage/draftsHistory'
import AutoKeywordScrollView from '../../../../components/common/AutoKeywordScrollView'
import {getTitle} from './../presenters/contractContact'

// style
import {colors, distances, fontScale} from '../../../../constants/style'
// 组件
import MainContract from '../../../../containers/home/contract/components/MainContract'
import {toastShort} from '../../../../constants/toast'
import ContractButton from '../components/ContractButton'
// redux
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';
import {
    loadData,
    setCreateMainConState,
    rsetCreateMainConState
} from '../../../../redux/modules/home/contact/creatMainContractRedux'

import {VALID_DAYS, contractDuringDays} from '../../../../constants/utils/contractDuringDayCheck'

const mapStateToProps = state => ({
    isRender: state.createMainCon.isRender,                      //是否渲染
    editable: state.createMainCon.editable,                      //是否可编辑
    id: state.createMainCon.id,                                  //企业id,新建企业无id
    contract_id: state.createMainCon.contract_id,                //合同id
    account_id: state.createMainCon.account_id,                  //账号id
    code: state.createMainCon.code,                              //编号
    signed_date: state.createMainCon.signed_date,                //签约日期
    from_date: state.createMainCon.from_date,                    //开始日期
    to_date: state.createMainCon.to_date,                        //结束日期
    am_name: state.createMainCon.am_name,                        //签约AM
    name: state.createMainCon.name,              //企业名称
    reg_code: state.createMainCon.reg_code,                      //工商注册号
    operator_brand: state.createMainCon.operator_brand,                      //运营品牌
    operator_type: state.createMainCon.operator_type,                      //运营模式
    operator_types: state.createMainCon.operator_types,                      //运营模式
    operator_type_other: state.createMainCon.operator_type_other,                      //运营模式
    tel: state.createMainCon.tel,                      //联系电话
    email: state.createMainCon.email,                      //邮箱
    legal_person: state.createMainCon.legal_person,                      //法人姓名
    area: state.createMainCon.area,                              //所在地区
    area_code: state.createMainCon.area_code,                              //所在地区
    address: state.createMainCon.address,                        //详细地址
    contacts: state.createMainCon.contacts,                        //联系人信息
    contract_pics: state.createMainCon.contract_pics,
    btnType: state.createMainCon.btnType,
    fromPage: state.createMainCon.fromPage
})

const mapDispatchToProps = (dispatch) => ({
    myactions: bindActionCreators({
        loadData,
        setCreateMainConState,
        rsetCreateMainConState
    }, dispatch), dispatch
})

/**
 * 主体合同组件
 */
class CreatMainContract extends Component {
    constructor(props) {
        super(props)
        this.getOperatorType = this.getOperatorType.bind(this);
        this.getOperatorTypes = this.getOperatorTypes.bind(this);
        this.getCODE = this.getCODE.bind(this);
        this.getCODEs = this.getCODEs.bind(this);
        this.popRefresh = this.popRefresh.bind(this)
        this.getMainContactData = this.getMainContactData.bind(this)
        this.contractCallback = this.contractCallback.bind(this)
        this.checkedForm = this.checkedForm.bind(this)
        this.checkValidDate = this.checkValidDate.bind(this)
        this.sendCreateInfo = this.sendCreateInfo.bind(this)
        this.sendEditInfo = this.sendEditInfo.bind(this)
        this.subInfo = this.subInfo.bind(this)
        this.editInfo = this.editInfo.bind(this)
        this.subContract = this.subContract.bind(this)
        this.temporary = this.temporary.bind(this)
        this.editContract = this.editContract.bind(this)
        this.editTouch = this.editTouch.bind(this)
    }

    componentWillMount(obj) {
        this.getOperatorType();
        let {routerData} = this.props;
        if (routerData.fromPage == 'drafts') {
            this.props.myactions.setCreateMainConState({...routerData})
        } else {
            if (routerData && routerData.fromPage !== 'enterprise') {
                let obj = new Object();
                let bank = routerData.account && routerData.account.length > 0 ? true : false;
                routerData.editable ? obj.editable = routerData.editable : null;
                !isNull(routerData.enterprise && routerData.enterprise.id) ? obj.id = routerData.enterprise.id : null;
                !isNull(routerData.id) ? obj.contract_id = routerData.id : null;
                !isNull(routerData.code) ? obj.code = routerData.code : null;
                !isNull(routerData.signed_date) ? obj.signed_date = routerData.signed_date : null;
                !isNull(routerData.from_date) ? obj.from_date = routerData.from_date : null;
                !isNull(routerData.to_date) ? obj.to_date = routerData.to_date : null;
                !isNull(routerData.am_name) ? obj.am_name = routerData.am_name : null;
                !isNull(routerData.enterprise.name) ? obj.name = routerData.enterprise.name : null;
                !isNull(routerData.main_contract_info.reg_code) ? obj.reg_code = routerData.main_contract_info.reg_code : null;
                !isNull(routerData.main_contract_info.legal_person) ? obj.legal_person = routerData.main_contract_info.legal_person : null;
                !isNull(routerData.main_contract_info.operator_brand) ? obj.operator_brand = routerData.main_contract_info.operator_brand : null;
                !isNull(routerData.main_contract_info.operator_type) ? obj.operator_type = routerData.main_contract_info.operator_type : null;
                !isNull(routerData.main_contract_info.operator_type_other) ?
                    obj.operator_type_other = routerData.main_contract_info.operator_type_other : null;
                !isNull(routerData.main_contract_info.tel) ? obj.tel = routerData.main_contract_info.tel : null;
                !isNull(routerData.main_contract_info.email) ? obj.email = routerData.main_contract_info.email : null;
                !isNull(routerData.main_contract_info.area) ? obj.area = routerData.main_contract_info.area : null;
                !isNull(routerData.main_contract_info.area_code) ? obj.area_code = routerData.main_contract_info.area_code : null;
                !isNull(routerData.main_contract_info.address) ? obj.address = routerData.main_contract_info.address : null;
                routerData.main_contract_info.contacts && routerData.main_contract_info.contacts.length > 0 ?
                    obj.contacts = routerData.main_contract_info.contacts :
                    null;
                routerData.pics ? obj.contract_pics = routerData.pics : null;
                !isNull(routerData.btnType) ? obj.btnType = routerData.btnType : null;
                !isNull(routerData.fromPage) ? obj.fromPage = routerData.fromPage : null;
                this.props.myactions.setCreateMainConState({...obj}, true);
            }
            if (this.props.isNew) {
                this.getCODE();
                this.props.myactions.setCreateMainConState({
                    am_name: global.UserInfo.user_name,
                    btnType: routerData.btnType
                }, true);
            }
        }
    }

    componentWillUnmount() {
        this.props.myactions.rsetCreateMainConState();
    }

    getOperatorType() {
        this.props.myactions.loadData(
            '/am_api/am/contract/operatorType',
            {
                _AT: global.UserInfo.token,
            },
            this.getOperatorTypes
        )
    }

    async getOperatorTypes(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.props.myactions.setCreateMainConState({operator_types: data}, true);
            return data
        } catch (e) {
            toastShort(e.message);
        }
    }

    getCODE() {
        this.props.myactions.loadData(
            '/am_api/am/contract/getContractCode',
            {
                _AT: global.UserInfo.token,
                contract_type: 'BC-KJ'
            },
            this.getCODEs
        )
    }

    async getCODEs(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            this.props.myactions.setCreateMainConState({code: data.code}, true);
            return data
        } catch (e) {
            toastShort(e.message);
        }
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

    contractCallback(obj) {
        this.props.myactions.setCreateMainConState(obj, true)
    }

    getMainContactData() {
        return {
            editable: this.props.editable,
            code: this.props.code,
            signed_date: this.props.signed_date,
            from_date: this.props.from_date,
            to_date: this.props.to_date,
            am_name: this.props.am_name,
            name: this.props.name,
            reg_code: this.props.reg_code,
            operator_brand: this.props.operator_brand,
            operator_type: this.props.operator_type,
            operator_types: this.props.operator_types,
            operator_type_other: this.props.operator_type_other,
            tel: this.props.tel,
            email: this.props.email,
            legal_person: this.props.legal_person,
            area: this.props.area,
            area_code: this.props.area_code,
            address: this.props.address,
            contacts: this.props.contacts,
            contract_pics: this.props.contract_pics,
        }
    }

    checkedForm() {
        let res = {};
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
        if (isNull(this.props.name)) {
            toastShort('企业名称不允许为空');
            return false;
        }
        if (isNull(this.props.reg_code)) {
            toastShort('工商注册号不允许为空');
            return false;
        }
        if (isNull(this.props.legal_person)) {
            toastShort('法定代表人不允许为空');
            return false;
        }
        if (isNull(this.props.operator_brand)) {
            toastShort('运营品牌不允许为空');
            return false;
        }
        if (isNull(this.props.operator_type.id)) {
            toastShort('运营模式不允许为空');
            return false;
        } else if (this.props.operator_type.id === 4) {
            if (isNull(this.props.operator_type_other)) {
                toastShort('运营模式不允许为空');
                return false;
            }
        }
        if (isNull(this.props.tel)) {
            toastShort('联系电话不允许为空');
            return false;
        }
        if (isNull(this.props.email)) {
            toastShort('合作对接专用邮箱不允许为空');
            return false;
        }
        if (isNull(this.props.area_code)) {
            toastShort('企业注册所在地区不允许为空');
            return false;
        }
        if (isNull(this.props.address)) {
            toastShort('办公地址不允许为空');
            return false;
        }
        let contacts = this.props.contacts;
        for (let z of contacts) {
            if (z.status !== 'hz')
                continue;
            if (isNull(z.contact)) {
                toastShort(`请填写${getTitle(z.status)}姓名`);
                return false;
            }
            if (isNull(z.duty)) {
                toastShort(`请填写${getTitle(z.status)}职务`);
                return false;
            }
            if (isNull(z.contact_detail)) {
                toastShort(`请填写${getTitle(z.status)}电话`);
                return false;
            } else {
                res = checkPhone(z.contact_detail);
                if (!res.pass) {
                    toastShort(`${getTitle(z.status)}电话号格式有误`);
                    return false;
                }
            }
        }
        if (isNull(this.props.contract_pics) || this.props.contract_pics.length === 0) {
            toastShort('请上传合同照片');
            return false;
        }
        return true;
    }

    checkValidDate(fun) {
        if (this.checkedForm()) {
            let duringDay = contractDuringDays(this.props.from_date, this.props.to_date)
            if (duringDay < VALID_DAYS) {
                Alert.alert(
                    '协议时间提醒',
                    '协议有效期为 ' + duringDay + ' 天，请确认有效期是否正确',
                    [
                        {text: '取消', onPress: () => null},
                        {text: '确定', onPress: fun}
                    ]
                )
            }else{
                fun()
            }
        }
    }

    subInfo() {
        this.checkValidDate(this.sendCreateInfo)
    }

    sendCreateInfo() {
        this.props.myactions.loadData(
            '/am_api/am/contract/createMain',
            {
                _AT: global.UserInfo.token,
                enterprise_id: this.props.id,
                code: this.props.code,
                signed_date: this.props.signed_date,
                from_date: this.props.from_date,
                to_date: this.props.to_date,
                name: this.props.name,
                reg_code: this.props.reg_code,
                area_code: this.props.area_code,
                address: this.props.address,
                legal_person: this.props.legal_person,
                operator_brand: this.props.operator_brand,
                operator_type: this.props.operator_type.id,
                operator_type_other: this.props.operator_type_other,
                tel: this.props.tel,
                email: this.props.email,
                contacts: this.props.contacts,
                pics: this.props.contract_pics,
            },
            this.subContract
        )
    }

    editInfo() {
        this.checkValidDate(this.sendEditInfo)
    }

    sendEditInfo() {
        this.props.myactions.loadData(
            '/am_api/am/contract/modifyMain',
            {
                _AT: global.UserInfo.token,
                contract_id: this.props.contract_id,
                account_id: this.props.account_id,
                signed_date: this.props.signed_date,
                from_date: this.props.from_date,
                to_date: this.props.to_date,
                name: this.props.name,
                reg_code: this.props.reg_code,
                area_code: this.props.area_code,
                address: this.props.address,
                legal_person: this.props.legal_person,
                operator_brand: this.props.operator_brand,
                operator_type: this.props.operator_type.id,
                operator_type_other: this.props.operator_type_other,
                tel: this.props.tel,
                email: this.props.email,
                contacts: this.props.contacts,
                pics: this.props.contract_pics,
            },
            this.editContract
        )
    }

    async subContract(client, path, param) {
        try {
            let data = await client.post(path, {data: param});
            if (this.props.fromPage === 'drafts' && !isNull(this.props.draftsKey)) {
                deleteOneDrafts(this.props.draftsKey)
            }
            if (this.props.id === '' && this.props.fromPage !== 'drafts') {
                Actions.contractTransitionPage(
                    {
                        routerData: {
                            editable: {
                                name: false,
                                code: true,
                                signed_date: true,
                                from_date: true,
                                to_date: true,
                                am_name: false,
                                srv_instalment: true,
                                fin_codes: true,
                                srv_straight: true,
                                straight_fee: true,
                                srv_mini: true,
                                srv_roll: true,
                                stores: true,
                                contract_pics: true,
                            },
                            name: this.props.name,
                            main_contract_id: data.contract_id,
                            enterprise_id: data.enterprise_id,
                        }
                    }
                );
            } else {
                toastShort('提交审核成功！');
                this.popRefresh();
            }
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
        if (isNull(this.props.name)) {
            toastShort('企业名称不允许为空');
            return false;
        }
        let obj = {
            _AT: global.UserInfo.token,
            code: this.props.code,
            contract_id: this.props.contract_id,
            account_id: this.props.account_id,
            signed_date: this.props.signed_date,
            from_date: this.props.from_date,
            to_date: this.props.to_date,
            am_name: this.props.am_name,
            name: this.props.name,
            reg_code: this.props.reg_code,
            area: this.props.area,
            area_code: this.props.area_code,
            address: this.props.address,
            legal_person: this.props.legal_person,
            operator_brand: this.props.operator_brand,
            operator_type: this.props.operator_type,
            operator_type_other: this.props.operator_type_other,
            tel: this.props.tel,
            email: this.props.email,
            contacts: this.props.contacts,
            contract_pics: this.props.contract_pics,
        }
        if (this.props.id || this.props.id === 0) {
            obj.id = this.props.id;
        }
        if (!addOneDrafts(contractType.main, this.props.code, this.props.name, '未提交', obj)) {
            toastShort('保存草稿失败！');
        }
        toastShort('保存草稿成功！');
        this.popRefresh();
    }

    editTouch() {
        this.props.myactions.setCreateMainConState({
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
            btnType: 3
        });
    }

    render() {
        let {scrollEnabled = true, needKeyWord = true} = this.props
        return (
            <AutoKeywordScrollView scrollEnabled={scrollEnabled} needKeyWord={needKeyWord}
                                   scrollStyle={{backgroundColor: colors.bgColor, flex: 1}}>
                <MainContract data={this.getMainContactData()} contractCallback={this.contractCallback}/>
                <ContractButton
                    btnType={this.props.btnType}
                    fromPage={this.props.fromPage}
                    editTouch={this.editTouch}
                    editInfo={this.editInfo}
                    temporary={this.temporary}
                    subInfo={this.subInfo}
                />
            </AutoKeywordScrollView>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatMainContract)