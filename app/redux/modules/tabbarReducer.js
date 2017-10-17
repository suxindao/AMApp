/**
 * create at 06/29/17
 */
const SET_MINE_POINT = 'haoqix/AM_COMMON_TABBAR_SET_MINE_POINT'

const initialState = {
    mine_point: false
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_MINE_POINT:
            return {
                ...state,
                mine_point: action.able
            }
        default:
            return state
    }
}

export function setMineTabbarPoint(able) {
    return {
        type: SET_MINE_POINT,
        able
    }
}