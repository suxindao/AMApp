/**
 * Created at 03/27/17.
 */

import moment from 'moment-timezone'

const SET_DATA = 'haoqix/AM_CONTRACT_INFO_MAIN_SET_DATA'
const RESET = 'haoqix/AM_CONTRACT_INFO_MAIN_RESET'

const initialState = {
    loading: false,
    loading_success: false,
    load: true,
    isRender: true,
    editable: {
        code: true,
        signed_date: true,
        from_date: true,
        to_date: true,
        am_name: false,
        name: true,
        reg_code: true,
        area: true,
        address: true,
        legal_person: true,
        legal_person_detail: true,
        legal_person_idcard: true,
        account_type: true,
        account_name: true,
        bank_name: true,
        bank_account: true,
        contact: true,
        contact_detail: true,
        contract_pics: true,
    },
    id: '',//企业id,新建企业无id
    contract_id: '',//合同id
    account_id: '',//账号id
    code: '',//编号
    signed_date: moment().format('YYYY-MM-DD'),//签约日期
    from_date: moment().format('YYYY-MM-DD'),//开始日期
    to_date: moment().format('YYYY-MM-DD'),//结束日期
    am_name: '',//签约AM
    name: '',//企业名称
    reg_code: '',//工商注册号
    area: '',//所在地区
    area_code: '',//所在地区代码
    address: '',//详细地址
    legal_person: '',//法人姓名
    legal_person_detail: '',//法人联系方式
    legal_person_idcard: '',//法人身份证号
    account_type: 0,//账号类型 1:对公账号, 2:对私账号
    account_name: '',//账号名称
    bank_name: '',//开户银行
    bank_account: '',//银行账号
    contacts: [],//联系人信息
    contract_pics: []//图片信息
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_DATA:
            return {
                ...state,
                ...action.obj
            }
        case RESET:
            state = {
                loading: false,
                loading_success: false,
                load: true,
                isRender: true,
                editable: {
                    code: true,
                    signed_date: true,
                    from_date: true,
                    to_date: true,
                    am_name: false,
                    name: true,
                    reg_code: true,
                    area: true,
                    address: true,
                    legal_person: true,
                    legal_person_detail: true,
                    legal_person_idcard: true,
                    account_type: true,
                    account_name: true,
                    bank_name: true,
                    bank_account: true,
                    contact: true,
                    contact_detail: true,
                    contract_pics: true,
                },
                id: '',//企业id,新建企业无id
                contract_id: '',//合同id
                account_id: '',//账号id
                code: '',//编号
                signed_date: moment().format('YYYY-MM-DD'),//签约日期
                from_date: moment().format('YYYY-MM-DD'),//开始日期
                to_date: moment().format('YYYY-MM-DD'),//结束日期
                am_name: '',//签约AM
                name: '',//企业名称
                reg_code: '',//工商注册号
                area: '',//所在地区
                area_code: '',//所在地区代码
                address: '',//详细地址
                legal_person: '',//法人姓名
                legal_person_detail: '',//法人联系方式
                legal_person_idcard: '',//法人身份证号
                account_type: 0,//账号类型 1:对公账号, 2:对私账号
                account_name: '',//账号名称
                bank_name: '',//开户银行
                bank_account: '',//银行账号
                contacts: [],//联系人信息
                contract_pics: []//图片信息
            };
            return state
        default:
            return state
    }
}

export function setData(obj, isRender) {
    // console.log(obj, isRender)
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: SET_DATA,
        obj,
    }
}

export function resetData() {
    return {
        type: RESET
    }
}