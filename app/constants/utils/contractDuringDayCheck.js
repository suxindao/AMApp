/**
 * Created by suxindao on 2017/9/1 .
 */

'use strict';

/**
 * 检查协议有效期时间是否大于180天
 *
 * @param from_data, 格式 'YYYY-MM-DD'
 * @param to_date, 格式 'YYYY-MM-DD'
 */
export const VALID_DAYS = 180 //合同最短有效期

export function contractDuringDays(from_data, to_date) {
    return parseInt(1 + (new Date(to_date) - new Date(from_data)) / 1000 / 60 / 60 / 24)
}