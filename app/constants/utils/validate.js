/**
 * Created by Joe on 2017/3/23.
 */
'use strict';

import {isNull} from '../common';

//校验验数字格式（整数，小数）
export function validate(type, data) {
  let result = {
    pass: true,
    tip: ''
  }
  let reg;
  if (type == 'Integer') {
    reg = /^-?\d+$/;
    if (!reg.test(data)) {
      result.tip = '该字段只能为整数';
      result.pass = false;
    }
    return result
  }
  if (type == 'positiveInteger') {
    reg = /^[0-9]*[1-9][0-9]*$/;
    if (!reg.test(data)) {
      result.tip = '该字段只能为正整数';
      result.pass = false;
    }
    return result
  }
  if (type == 'positiveIntegerZero') {
    reg = /^\d+$/;
    if (!reg.test(data)) {
      result.tip = '该字段只能为非负整数';
      result.pass = false;
    }
    return result
  }
  if (type == 'float2') {
    reg = /^(([1-9]+)|([0-9]+|\.[0-9]{1,2}))$/;
    if (!reg.test(data)) {
      result.tip = '最多只能保留两位小数';
      result.pass = false;
    }
    return result
  }
  if (type == 'integerAndFloat') {
    reg = /^\d+(\.\d+)?$/;
    if (!reg.test(data)) {
      result.tip = '只允许输入数字和小数点';
      result.pass = false;
    }
    return result
  }
  return result
}

//校验验手机号
export function checkPhone(phone) {
  let result = {
    pass: true,
    tip: ''
  }
  if (isNull(phone)) {
    result.tip = '手机号码不能为空'
    result.pass = false
    return result
  }

  // 13, 14, 15, 17, 18开头
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
    result.tip = '请输入正确手机号码'
    result.pass = false
    return result
  }
  // if(/^1[0-9]{10}$/.test(phone))
  return result
}

// 判断固定电话， 首位必须为0
export function checkTel(tel) {
  let result = {
    pass: true,
    tip: ''
  }
  if (!(/^0\d{2,3}(-?)\d{7,9}$/.test(tel))) {
    result.tip = '固定电话有误'
    result.pass = false
  }
  return result
}

// 检验身份证
export function IdentityCodeValid(code) {
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var result = {
    tip: '',
    pass: true
  }

  if (!code || !/^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(code)) {
    result.tip = "身份证号格式错误"
    result.pass = false
  } else if (!city[code.substr(0, 2)]) {
    result.tip = "地址编码错误"
    result.pass = false
  } else {
    //18位身份证需要验证最后一位校验位
    // TODO year 是从身份证取出的年
    if (code.length == 18) {
      var Year = new Date().Format('yyyy')
      var codeYear = code.substr(6, 4);
      // 年龄限制成16到100岁
      if (!(codeYear >= (Year - 100) && codeYear <= (Year - 16))) {
        result.tip = "生日区间错误 "
        result.pass = false
      }
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = code[17] == "x" || code[17] == "X" ? "X" : code[17];
      if (parity[sum % 11] != last) {
        result.tip = "校验位错误";
        result.pass = false;
      }
    } else {
      result.tip = "身份证位数不正确";
      result.pass = false;
    }
  }
  return result
}

//银行卡校验三位连续数字
export function checkThreeNumber(bankno) {
  if(bankno.length<3){
    return true;
  }
  if(bankno[0]==bankno[1]||bankno[1]==bankno[2]||bankno[0]==bankno[2]){
    return checkThreeNumber(bankno.substring(1, bankno.length));
  }else{
    return false;
  }
}

// 检验银行卡号
export function checkBankNo(bankno) {
  let result = {
    pass: true,
    tip: ''
  };
  if(!/^\d{6,32}$/.test(bankno)||checkThreeNumber(bankno)){
    result.pass = false;
  }
  // else if((bankno.match(/0{4,}|1{4,}|2{4,}|3{4,}|4{4,}|5{4,}|6{4,}|7{4,}|8{4,}|9{4,}/g)).length>1){//连续数字
  //   result.pass==false;
  // }else if(/123456789|23456789|3456789|987654321|98765432|9876543/g.test(bankno)){//连续数字
  //   result.pass==false;
  // }
  if(!result.pass){
    result.tip = '请输入正确的银行卡号';
  }
  return result;
  let luhmCheck = (bankno) => {
    var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhm进行比较）

    var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array();  //奇数位*2的积 <9
    var arrJiShu2 = new Array(); //奇数位*2的积 >9

    var arrOuShu = new Array();  //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) {//奇数位
        if (parseInt(newArr[j]) * 2 < 9)
          arrJiShu.push(parseInt(newArr[j]) * 2);
        else
          arrJiShu2.push(parseInt(newArr[j]) * 2);
      }
      else //偶数位
        arrOuShu.push(newArr[j]);
    }

    var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }

    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }

    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }

    for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;

    if (lastNum == luhm) {
      return true;
    } else {
      return false;
    }
  }
  if (bankno == "") {
    result.tip = "请填写银行卡号";
    result.pass = false;
    return result;
  }
  if (bankno.length < 16 || bankno.length > 19) {
    result.pass = false;
  } else if (!/^\d*$/.exec(bankno)) {
    result.pass = false;
  }
  //开头6位
  let strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
  if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
    result.pass = false;
  } else if (!luhmCheck(bankno)) {//Luhm校验（新）
    result.pass = false;
  } else {
    result.pass = true;
  }
  if (!result.pass) {
    result.tip = "无效的银行卡号";
  }
  return result;
}

//校验姓名
export function checkChinese(str) {
  let result = true
  if (!(/^[\u4e00-\u9fa5\uF900-\uFA2D]{2,15}$/.test(str)))
    result = false
  return result
}

//校验详细地址
export function checkAddress(str) {
  let count = 0
  let num = 0
  for (let i = 0; i < str.length; i++) {
    if (/[\u4e00-\u9fa5\uF900-\uFA2D]/.test(str.charAt(i))) {
      count++
    } else if (/\d/.test(str.charAt(i))) {
      num++
    }
    if (/\零|一|二|三|四|五|六|七|八|九/.test(str[i])) {
      num++
    }
  }
  if (count >= 5 && num > 0 && str.length >= 8) {
    return true
  }
  return false
}

/**
 * 检查网址格式
 * @param  {} url 网址
 */
export function checkUrlExist(url) {
  if(url != ''){
    let reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if(reg.test(url)){
        return true
    }
    return false
  }
  return false;
}

/**
 * 格式化金钱
 * @param {*} number 
 */
export function outputdollars(number) {
  if(typeof number === 'number'){
    number = number.toString()
  }
  // 将小数与整数分开
  let arr = number.split('.')
  let interNum
  let hasFloat = false
  let floatNum
  if(Array.isArray(arr) && arr.length>1){
    // arr是数组
    interNum = arr[0]
    floatNum = arr[1]
    hasFloat = true
  } else {
    interNum = number
    hasFloat = false
  }
  
  if (interNum.length <= 3)
    return (interNum == '' ? '0' : interNum);
  else {
    let mod = interNum.length % 3;
    let output = (mod == 0 ? '' : (interNum.substring(0, mod)));
    for (let i = 0; i < Math.floor(interNum.length / 3); i++) {
      if ((mod == 0) && (i == 0))
        output += interNum.substring(mod + 3 * i, mod + 3 * i + 3);
      else
        output += ',' + interNum.substring(mod + 3 * i, mod + 3 * i + 3);
    }
    if(hasFloat){
      // 有小数位
      output = output+'.'+floatNum
    }
    return (output);
  }
}
/**
 * 检验一个是否是方法
 * @param {*} fun function
 * @param {*} path string
 * @param {*} funName string
 */
export function verifyFunction(fun, fromPath = '', funName = 'funName'){
  if(typeof fun === 'function'){
    return true
  } else {
    console.log(`${funName} from ${fromPath} is not a function`)
    return false
  }
}
/**
 * 验证obj 是String类型，且length 大于 0
 * @param {*} obj 
 */
export function verifyString(obj){
  if((typeof obj === 'string') && obj.length >0){
    return true
  }
  return false
}
