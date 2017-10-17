/**
 * Created by Joe on 2017/6/1.
 */
const LOAD_START = 'haoqix/MYSTOREVIEWINFO_LOAD_START'
const LOAD_SUCCESS = 'haoqix/MYSTOREVIEWINFO_LOAD_SUCCESS'
const LOAD_FAIL = 'haoqix/MYSTOREVIEWINFO_LOAD_FAIL'
const SETSTATE = 'haoqix/MYSTOREVIEWINFO_SETSTATE'
const RSETSTATE = 'haoqix/MYSTOREVIEWINFO_RSETSTATE'
import {LIST_ITEM_COUNT} from '../../../../constants/default.config';

const initialState = {
    loading: true,
    loading_success: false,
    isRender: true,
    list: [],
    data: {},
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
        case SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case RSETSTATE:
            state = {
                loading: true,
                loading_success: false,
                isRender: true,
                list: [],
                data: {},
            };
            return state
        default:
            return state
    }
}

export function loadData(path, param, fun) {
    return {
        types: [LOAD_START, LOAD_SUCCESS, LOAD_FAIL],
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