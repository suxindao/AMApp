/**
 * create at 07/20/17
 * for 合同业务管理
 */
// const 
import {LIST_ITEM_COUNT} from '../default.config'

/**
 * 合同类型
 */
export const contractType = {
  main: 'main_contract',      // 主题合同
  server: 'server_contract',   // 服务合同 (兼容老数据)
  server_FQ: 'server_contract_FQ', // 分期服务合同
  server_ZT: 'server_contract_ZT', // 直通车服务合同
  server_TG: 'server_contract_TG', // 推广服务合同
}

/**
 * 合同状态类型
 */
export const contractStatusType = {
  drafts: 'drafts',       // 草稿箱
  reviewing: 'audit0', // 审核中
  reviewReject: 'audit1',  // 审核驳回
  noHandle: 'archive0', // 未归档
  toBeExpire: 'archive1', // 即将到期
  handling: 'status1', // 执行中
  all: 'all', // 所有合同
}

/**
 * 根据合同类型返回 title
 * @param {*} code 
 */
export function handleContractTitle(code){
  let resultTitle
  switch(code){
    case contractStatusType.reviewing:
      {
        resultTitle = '审核'
      }
      break;
    case contractStatusType.reviewReject:
      {
        resultTitle = '审核驳回'
      }
      break;
    case contractStatusType.noHandle:
      {
        resultTitle = '未归档'
      }
      break;
    case contractStatusType.handling:
      {
        resultTitle = '执行中列表'
      }
      break;
    case contractStatusType.toBeExpire:
      {
        resultTitle = '即将到期'
      }
      break;
    case contractStatusType.all:
      {
        resultTitle = '所有合同'
      }
      break;
    default:
      break;
  }
  return resultTitle
}

/**
 * 根据合同类型处理请求数据
 * @param {*} searchContent 
 * @param {*} code 
 * @param {*} next_key 
 */
export function handleContractsBody(searchContent, code, next_key){
  let body
  switch(code){
    case contractStatusType.reviewing:
      {
        body = {
          _AT: global.UserInfo.token,
          audit_status: 0,
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    case contractStatusType.reviewReject:
      {
        body = {
          _AT: global.UserInfo.token,
          audit_status: 1,
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    case contractStatusType.noHandle:
      {
        body = {
          _AT: global.UserInfo.token,
          archive_flag: 0,
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    case contractStatusType.handling:
      {
        body = {
          _AT: global.UserInfo.token,
          status: 1,
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    case contractStatusType.toBeExpire:
      {
        body = {
          _AT: global.UserInfo.token,
          dueToExpire: 30,  
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    case contractStatusType.all:
      {
        body = {
          _AT: global.UserInfo.token,
          all: false,
          codeOrName: searchContent,
          page:{
            limit: LIST_ITEM_COUNT,
            next_key: next_key
          }
        }
      }
      break;
    default:
      break;
  }
  return body
}

/**
 * 合同联系人信息
 */
export const contractContact = [
  {
    status: 'hz',
    title: '合作接口人'
  },
  {
    status: 'sc',
    title: '市场负责人'
  },
  {
    status: 'xs',
    title: '销售负责人'
  },
  {
    status: 'cw',
    title: '财务负责人'
  },
]