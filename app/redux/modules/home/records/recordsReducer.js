/**
 * create at 05/26/17
 */
const LOAD_START = 'haoqix/AM_HOME_RECORD_RECORDLIST_LOAD_START'
const LOAD_SUCCESS = 'haoqix/AM_HOME_RECORD_RECORDLIST_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/AM_HOME_RECORD_RECORDLIST_LOAD_FAIL'
const SEND_LOAD_START = 'haoqix/AM_HOME_RECORD_RECORDLIST_SEND_LOAD_START'
const SEND_LOAD_SUCCESS = 'haoqix/AM_HOME_RECORD_RECORDLIST_SEND_LOAD_SUCCESS'
const SEND_LOAD_FAIL = 'haoqix/AM_HOME_RECORD_RECORDLIST_SEND_LOAD_FAIL'
const MORE_START = 'haoqix/AM_HOME_RECORD_RECORDLIST_MORE_START'
const MORE_SUCCESS = 'haoqix/AM_HOME_RECORD_RECORDLIST_MORE_SUCCESS'
const MORE_FAIL = 'haoqix/AM_HOME_RECORD_RECORDLIST_MORE_FAIL'
const RELOAD_START = 'haoqix/AM_HOME_RECORD_RECORDLIST_RELOAD_START'
const RELOAD_SUCCESS = 'haoqix/AM_HOME_RECORD_RECORDLIST_RELOAD_SUCCESS'
const RELOAD_FAIL = 'haoqix/AM_HOME_RECORD_RECORDLIST_RELOAD_FAIL'
const SETSTATE = 'haoqix/AM_HOME_RECORD_RECORDLIST_SETSTATE'
const RSETSTATE = 'haoqix/AM_HOME_RECORD_RECORDLIST_RSETSTATE'

const initialState = {
    loading: true,
    loading_success: false,
    loading_send: true,
    loading_success_send: false,
    list_loading: false,
    list_refresh: false,
    list_error: null,
    isRender: true,
    init_data: '',
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loading_success: false,
            }
        case SEND_LOAD_START:
            return {
                ...state,
                loading_send: true,
                loading_success_send: false,
            }
        case SEND_LOAD_SUCCESS:
            return {
                ...state,
                loading_send: false,
                loading_success_send: true,
            }
        case SEND_LOAD_FAIL:
            return {
                ...state,
                loading_send: false,
                loading_success_send: false,
            }
        case MORE_START:
            return {
                ...state,
                list_loading: true,
                list_error: null
            }
        case MORE_SUCCESS:
            return {
                ...state,
                list_loading: false,
                list_error: null
            }
        case MORE_FAIL:
            return {
                ...state,
                list_loading: false,
                list_error: action.error
            }
        case RELOAD_START:
            return {
                ...state,
                list_refresh: true,
                list_error: null
            }
        case RELOAD_SUCCESS:
            return {
                ...state,
                list_refresh: false,
                list_error: null
            }
        case RELOAD_FAIL:
            return {
                ...state,
                list_refresh: false,
                list_error: action.error
            }
        case SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case RSETSTATE: {
            state = initialState
            return {
                ...state,
            }
        }
        default:
            return state
    }
}

export function loadData(fun) {
    return {
        types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
        promise: fun,
    }
}

export function loadMoreData(fun) {
    return {
        types: [MORE_START, MORE_SUCCESS, MORE_FAIL],
        promise: fun,
    }
}

export function reloadData(fun) {
    return {
        types: [RELOAD_START, RELOAD_SUCCESS, RELOAD_FAIL],
        promise: fun,
    }
}

export function sendData(path, param, fun) {
    return {
        types: [SEND_LOAD_START, SEND_LOAD_SUCCESS, SEND_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: RSETSTATE
    }
}