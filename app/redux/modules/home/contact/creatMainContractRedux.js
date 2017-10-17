/**
 * Created by Joe on 2017/3/10.
 */

const moment = require('moment-timezone')

const CREATEMAINCON_SETSTATE = 'haoqix/CREATEMAINCON_SETSTATE'
const CREATEMAINCON_RSETSTATE = 'haoqix/CREATEMAINCON_RSETSTATE'
const CREATEMAINCON_LOAD_START = 'haoqix/CREATEMAINCON_LOAD_START'
const CREATEMAINCON_LOAD_SUCCESS = 'haoqix/CREATEMAINCON_LOAD_SUCCESS'
const CREATEMAINCON_LOAD_FAIL = 'haoqix/CREATEMAINCON_LOAD_FAIL'

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
    btnType: 0,
    fromPage: '',
    id: '',//企业id,新建企业无id
    contract_id: '',//合同id
    account_id: '',//账号id
    code: '',//编号
    signed_date: moment().format('YYYY-MM-DD'),//签约日期
    from_date: moment().format('YYYY-MM-DD'),//开始日期
    to_date: '',//结束日期
    am_name: '',//签约AM
    name: '',//企业名称
    reg_code: '',//工商注册号
    operator_brand: '',//运营品牌
    operator_type: '',//运营模式
    operator_types: '',//运营模式
    operator_type_other: '',//运营模式
    tel: '',//联系电话
    email: '',//邮箱
    legal_person: '',//法人姓名
    area: '',//所在地区
    area_code: '',//所在地区代码
    address: '',//详细地址
    contacts: [
        {
            "status": "hz",
            "contact": "",
            "duty": "",
            "contact_detail": ""
        }
    ],//联系人信息
    contract_pics: []//图片信息
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CREATEMAINCON_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case CREATEMAINCON_RSETSTATE:
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
                btnType: 0,
                fromPage: '',
                id: '',//企业id,新建企业无id
                contract_id: '',//合同id
                account_id: '',//账号id
                code: '',//编号
                signed_date: moment().format('YYYY-MM-DD'),//签约日期
                from_date: moment().format('YYYY-MM-DD'),//开始日期
                to_date: '',//结束日期
                am_name: '',//签约AM
                name: '',//企业名称
                reg_code: '',//工商注册号
                operator_brand: '',//运营品牌
                operator_type: '',//运营模式
                operator_types: '',//运营模式
                operator_type_other: '',//运营模式
                tel: '',//联系电话
                email: '',//邮箱
                legal_person: '',//法人姓名
                area: '',//所在地区
                area_code: '',//所在地区代码
                address: '',//详细地址
                contacts: [
                    {
                        "status": "hz",
                        "contact": "",
                        "duty": "",
                        "contact_detail": ""
                    }
                ],//联系人信息
                contract_pics: []//图片信息
            };
            return state
        case CREATEMAINCON_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case CREATEMAINCON_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case CREATEMAINCON_LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loading_success: false,
            }
        default:
            return state
    }
}

export function loadData(path, param, fun) {
    return {
        types: [CREATEMAINCON_LOAD_START, CREATEMAINCON_LOAD_SUCCESS, CREATEMAINCON_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setCreateMainConState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: CREATEMAINCON_SETSTATE,
        obj,
    }
}

export function rsetCreateMainConState() {
    return {
        type: CREATEMAINCON_RSETSTATE
    }
}