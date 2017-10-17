/**
 * Created by Joe on 2017/4/21.
 */
const BASCSTOREINFO_SETSTATE = 'haoqix/BASCSTOREINFO_SETSTATE'
const BASCSTOREINFO_RSETSTATE = 'haoqix/BASCSTOREINFO_RSETSTATE'
const BASCSTOREINFO_LOAD_START = 'haoqix/BASCSTOREINFO_LOAD_START'
const BASCSTOREINFO_LOAD_SUCCESS = 'haoqix/BASCSTOREINFO_LOAD_SUCCESS'
const BASCSTOREINFO_LOAD_FAIL = 'haoqix/BASCSTOREINFO_LOAD_FAIL'

const initialState = {
    isRender: true,
    loading: false,
    loading_success: false,
    editable: {
        cms_code: false,
        brand_name: true,
        branch: true,
        store_type: true,
        store_tel: true,
        region: true,
        position: true,
        address: true,
        location: true,
        area: true,
        found_year: true,
        tag: true,
        contacts: true,
    },
    data: {
        cms_code: '',
        brand_name: '',// 品牌名称
        branch: '',// 分店名称
        store_type: '',//
        store_tel: '',//
        store_tel_data: [],
        region_code: '',
        region: '',
        position: '',
        address: '',
        location_lon: 0,
        location_lat: 0,
        area: '',
        found_year: '',
        tag: '',
        tagData: [],
        contacts: [],
    }
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case BASCSTOREINFO_LOAD_START:
            return {
                ...state,
                loading: true,
                loading_success: false,
            }
        case BASCSTOREINFO_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                loading_success: true,
            }
        case BASCSTOREINFO_LOAD_FAIL:
            return {
                ...state,
                loading: false,
                loading_success: false,
            }
        case BASCSTOREINFO_SETSTATE:
            return {
                ...state,
                ...action.obj
            }
        case BASCSTOREINFO_RSETSTATE:
            state = {
                isRender: true,
                loading: false,
                loading_success: false,
                editable: {
                    cms_code: false,
                    brand_name: true,
                    branch: true,
                    store_type: true,
                    store_tel: true,
                    region: true,
                    address: true,
                    location: true,
                    area: true,
                    found_year: true,
                    tag: true,
                    contacts: true,
                },
                data: {
                    cms_code: '',
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
        types: [BASCSTOREINFO_LOAD_START, BASCSTOREINFO_LOAD_SUCCESS, BASCSTOREINFO_LOAD_FAIL],
        promise: (client) => fun(client, path, param),
    }
}

export function setState(obj, isRender) {
    typeof isRender != 'undefined' ? obj.isRender = isRender : null;
    return {
        type: BASCSTOREINFO_SETSTATE,
        obj,
    }
}

export function rsetState() {
    return {
        type: BASCSTOREINFO_RSETSTATE
    }
}


export function loadLocal(fun) {
    return {
        types: [BASCSTOREINFO_LOAD_START, BASCSTOREINFO_LOAD_SUCCESS, BASCSTOREINFO_LOAD_FAIL],
        promise: fun
    }
}