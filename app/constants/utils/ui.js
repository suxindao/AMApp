/**
 * update at 08/07/17
 */
import {distances} from '../style'

/**
 * 转换数据为二维数组，
 * @param  {Array} data 1维数组数据
 * @param  {int}   n    每行多少item
 * @return {Array}      返回二维数组 行列数量
 */
export function nEveryRow(data, n) {
    var result = [],
        temp = [];

    for (var i = 0; i < data.length; ++i) {
      if (i > 0 && i % n === 0) {
        result.push(temp);
        temp = [];
      }
      temp.push(data[i]);
    }

    if (temp.length > 0) {
      // while (temp.length !== n) {
      //   temp.push(null);
      // }
      result.push(temp);
    }

    return result;
}

/**
 * 获取每个item width
 * @param {*} count number, 每行数量
 * @param {*} marginOut number, 外围边距
 * @param {*} marginIn number, 每个item间距
 * @param {*} width number, 总宽
 */
export function nGroupItemWidth(count = 3, marginOut = 0, marginIn = 10, width = distances.deviceWidth){
  let itemWidth = 0
  let marginCount = count -1
  let outMarginTotal = marginOut*2
  itemWidth = (width-outMarginTotal-marginCount*marginIn) / count
  return itemWidth
}