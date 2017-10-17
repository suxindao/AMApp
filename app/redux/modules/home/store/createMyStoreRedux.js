/**
 * Created by Joe on 2017/6/1.
 */
const CREATEMYSTORE_SETSTATE = 'haoqix/CREATEMYSTORE_SETSTATE'
const CREATEMYSTORE_RSETSTATE = 'haoqix/CREATEMYSTORE_RSETSTATE'
const CREATEMYSTORE_LOAD_START = 'haoqix/CREATEMYSTORE_LOAD_START'
const CREATEMYSTORE_LOAD_SUCCESS = 'haoqix/CREATEMYSTORE_LOAD_SUCCESS'
const CREATEMYSTORE_LOAD_FAIL = 'haoqix/CREATEMYSTORE_LOAD_FAIL'

const initialState = {
    isRender: true,
    loading: false,
    loading_success: false,
    data: {
        id: '',// 品牌名称
        brand_name: '',// 品牌名称
        branch: '',// 分店名称
        store_type: '',//
        store_tel: '',//
        store_tel_data: [],
        region_code: '',
        region: '',
        address: '',
        location_lon: 0,
        location_lat: 0,
        area: '',
        found_year: '',
        tag: '',
        tagData: [],
        contacts: [],
        showMap: true,
        city_region: null,
        position: null,
    }
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CREATEMYSTORE_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case CREATEMYSTORE_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case CREATEMYSTORE_LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loading_success: false,
            }
        case CREATEMYSTORE_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case CREATEMYSTORE_RSETSTATE:
            state = {
                isRender: true,
                loading: false,
                loading_success: false,
                data: {
                    brand_name: '',// 品牌名称
                    branch: '',// 分店名称
                    store_type: '',//
                    store_tel: '',//
                    store_tel_data: [],
                    region_code: '',
                    region: '',
                    address: '',
                    location_lon: 0,
                    location_lat: 0,
                    area: '',
                    found_year: '',
                    tag: '',
                    tagData: [],
                    contacts: [],
                    showMap: true,
                }
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
        types: [CREATEMYSTORE_LOAD_START, CREATEMYSTORE_LOAD_SUCCESS, CREATEMYSTORE_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: CREATEMYSTORE_SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: CREATEMYSTORE_RSETSTATE
    }
}


export function loadLocal(fun) {
    return {
        types: [CREATEMYSTORE_LOAD_START, CREATEMYSTORE_LOAD_SUCCESS, CREATEMYSTORE_LOAD_FAIL],
        promise: fun
    }
}