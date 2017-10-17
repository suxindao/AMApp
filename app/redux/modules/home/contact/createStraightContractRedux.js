/**
 * Created by Joe on 2017/7/18.
 */

import moment from 'moment-timezone'

const CREATESTRAIGHTCONTRACT_SETSTATE = 'haoqix/CREATESTRAIGHTCONTRACT_SETSTATE'
const CREATESTRAIGHTCONTRACT_RSETSTATE = 'haoqix/CREATESTRAIGHTCONTRACT_RSETSTATE'
const CREATESTRAIGHTCONTRACT_LOAD_START = 'haoqix/CREATESTRAIGHTCONTRACT_LOAD_START'
const CREATESTRAIGHTCONTRACT_LOAD_SUCCESS = 'haoqix/CREATESTRAIGHTCONTRACT_LOAD_SUCCESS'
const CREATESTRAIGHTCONTRACT_LOAD_FAIL = 'haoqix/CREATESTRAIGHTCONTRACT_LOAD_FAIL'

const initialState = {
    loading: false,
    loading_success: false,
    isRender: true,
    data: {
        enterprise_id: '',
        contract_id: '',
        main_contract_id: '',
        name: '',
        code: '',
        signed_date: moment().format('YYYY-MM-DD'),
        from_date: moment().format('YYYY-MM-DD'),
        to_date: '',
        am_name: '',
        fee_type: '',
        fixed_fee: '',
        flexible_fee_total: '',
        flexible_fee_min: '',
        contacts: [
            {
                "status": "hz",
                "duty": '',
                "contact": "",
                "contact_detail": ""
            },
            {
                "status": "cw",
                "contact": "",
                "contact_detail": ""
            },
            {
                "status": "xs",
                "contact": "",
                "contact_detail": ""
            }
        ],
        srv_mini: '',//签约服务_MINI课推广: 0-无 1-有
        mini_courses: [],
        mini_course_num: '',
        memo: '',
        stores: [],
        pics: []
    },
    editable: {
        name: true,
        code: true,
        signed_date: true,
        from_date: true,
        to_date: true,
        am_name: true,
        fee_type: true,
        contacts: true,
        srv_mini: true,
        mini_course_num: true,
        memo: true,
        stores: true,
        pics: true,
    },
    btnType: 0,
    fromPage: '',
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CREATESTRAIGHTCONTRACT_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case CREATESTRAIGHTCONTRACT_RSETSTATE:
            state = {
                loading: false,
                loading_success: false,
                isRender: true,
                data: {
                    enterprise_id: '',
                    contract_id: '',
                    main_contract_id: '',
                    name: '',
                    code: '',
                    signed_date: moment().format('YYYY-MM-DD'),
                    from_date: moment().format('YYYY-MM-DD'),
                    to_date: '',
                    am_name: '',
                    fee_type: '',
                    fixed_fee: '',
                    flexible_fee_total: '',
                    flexible_fee_min: '',
                    contacts: [
                        {
                            "status": "hz",
                            "duty": '',
                            "contact": "",
                            "contact_detail": ""
                        },
                        {
                            "status": "cw",
                            "contact": "",
                            "contact_detail": ""
                        },
                        {
                            "status": "xs",
                            "contact": "",
                            "contact_detail": ""
                        }
                    ],
                    srv_mini: '',//签约服务_MINI课推广: 0-无 1-有
                    mini_courses: [],
                    mini_course_num: [],
                    memo: '',
                    stores: [],
                    pics: []
                },
                editable: {
                    name: true,
                    code: true,
                    signed_date: true,
                    from_date: true,
                    to_date: true,
                    am_name: true,
                    fee_type: true,
                    contacts: true,
                    srv_mini: true,
                    mini_course_num: true,
                    memo: true,
                    stores: true,
                    pics: true,
                },
                btnType: 0,
                fromPage: '',
            };
            return state
        case CREATESTRAIGHTCONTRACT_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case CREATESTRAIGHTCONTRACT_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case CREATESTRAIGHTCONTRACT_LOAD_FAIL:
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
        types: [CREATESTRAIGHTCONTRACT_LOAD_START, CREATESTRAIGHTCONTRACT_LOAD_SUCCESS, CREATESTRAIGHTCONTRACT_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: CREATESTRAIGHTCONTRACT_SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: CREATESTRAIGHTCONTRACT_RSETSTATE
    }
}