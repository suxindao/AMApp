/**
 * Created by Joe on 2017/7/17.
 */

import moment from 'moment-timezone'

const CREATESTAGECONTRACT_SETSTATE = 'haoqix/CREATESTAGECONTRACT_SETSTATE'
const CREATESTAGECONTRACT_RSETSTATE = 'haoqix/CREATESTAGECONTRACT_RSETSTATE'
const CREATESTAGECONTRACT_LOAD_START = 'haoqix/CREATESTAGECONTRACT_LOAD_START'
const CREATESTAGECONTRACT_LOAD_SUCCESS = 'haoqix/CREATESTAGECONTRACT_LOAD_SUCCESS'
const CREATESTAGECONTRACT_LOAD_FAIL = 'haoqix/CREATESTAGECONTRACT_LOAD_FAIL'

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
        fin_codes: '',//金融产品，多个用逗号分隔
        fin_names: '',//金融产品，多个用逗号分隔
        fin_codes_info: '',//金融产品，多个用逗号分隔
        contacts: [
            {
                "status": "hz",
                "duty": '',
                "contact": "",
                "contact_detail": ""
            },
            {
                "status": "sc",
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
        fin_codes: true,
        contacts: true,
        stores: true,
        pics: true,
    },
    btnType: 0,
    fromPage: '',
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CREATESTAGECONTRACT_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case CREATESTAGECONTRACT_RSETSTATE:
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
                    fin_codes: '',//金融产品，多个用逗号分隔
                    fin_names: '',//金融产品，多个用逗号分隔
                    fin_codes_info: '',//金融产品，多个用逗号分隔
                    contacts: [
                        {
                            "status": "hz",
                            "duty": '',
                            "contact": "",
                            "contact_detail": ""
                        },
                        {
                            "status": "sc",
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
                    fin_codes: true,
                    contacts: true,
                    stores: true,
                    pics: true,
                },
                btnType: 0,
                fromPage: '',
            };
            return state
        case CREATESTAGECONTRACT_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case CREATESTAGECONTRACT_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case CREATESTAGECONTRACT_LOAD_FAIL:
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
        types: [CREATESTAGECONTRACT_LOAD_START, CREATESTAGECONTRACT_LOAD_SUCCESS, CREATESTAGECONTRACT_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: CREATESTAGECONTRACT_SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: CREATESTAGECONTRACT_RSETSTATE
    }
}