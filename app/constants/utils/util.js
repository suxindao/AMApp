/**
 * Created by Joe on 2017/3/9.
 */
(function(_S){
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  /**
   * 替换全部
   * @param oldStr 要替换的字符
   * @param newStr 替换成的字符
   * @returns {*} 替换后的字符
   */
  String.prototype.replaceAll = function (oldStr, newStr){
    return this.replace(new RegExp(oldStr,"gm"),newStr);
  }

  /**
   * 将空转换为空串
   * @param 要处理的内容
   * @returns 处理后的结果
   */
  var getNull2Str = text => {
    if(text===null||typeof text === 'undefined')
      return '';
    return text;
  }

  /**
   * 将空转换为0
   * @param 要处理的内容
   * @returns 处理后的结果
   */
  var getNull2Zero = text => {
    if(text===null||typeof text === 'undefined'||isNaN(text)||text==='')
      return 0;
    return text;
  }
  var isEmptyObject = obj => {
    if (Object.getOwnPropertyNames(obj).length===0){
      return true;//返回true，不为空对象
    }
    return false;//返回false，为空对象
  }

  var util = {
    getNull2Str : getNull2Str,
    getNull2Zero : getNull2Zero,
    isEmptyObject : isEmptyObject,
  }
  _S.util = util;
})(global)