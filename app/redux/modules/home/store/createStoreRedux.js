/**
 * Created by Joe on 2017/4/21.
 */

import moment from 'moment-timezone'

const CREATESTORE_SETSTATE = 'haoqix/CREATESTORE_SETSTATE'
const CREATESTORE_RSETSTATE = 'haoqix/CREATESTORE_RSETSTATE'
const CREATESTORE_LOAD_START = 'haoqix/CREATESTORE_LOAD_START'
const CREATESTORE_LOAD_SUCCESS = 'haoqix/CREATESTORE_LOAD_SUCCESS'
const CREATESTORE_LOAD_FAIL = 'haoqix/CREATESTORE_LOAD_FAIL'

const initialState = {
    isRender: true,
    loading: false,
    loading_success: false,
    date: moment().format('yyyyMMdd'),
    code: '',
    store_info: {},
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CREATESTORE_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case CREATESTORE_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case CREATESTORE_LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loading_success: false,
            }
        case CREATESTORE_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case CREATESTORE_RSETSTATE:
            state = {
                isRender: true,
                loading: false,
                loading_success: false,
                date: moment().format('yyyyMMdd'),
                code: '',
                store_info: {},
            };
            return state
        default:
            return {
                ...state,
            }
    }
}

export function loadData(path, param, fun) {
    return {
        types: [CREATESTORE_LOAD_START, CREATESTORE_LOAD_SUCCESS, CREATESTORE_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: CREATESTORE_SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: CREATESTORE_RSETSTATE
    }
}