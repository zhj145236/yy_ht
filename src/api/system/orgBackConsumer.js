import request from '@/utils/request'


export function getParentList() {
  return request({
    url: 'api/orgback/orgBackConsumer/getParentList',
    method: 'get',

  })
}


export function add(data) {
  return request({
    url: 'api/orgback/orgBackConsumer',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgback/orgBackConsumer',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgback/orgBackConsumer',
    method: 'put',
    data
  })
}

/**
 * 返回给此家长发送的历史消息
 * @param data
 */
export function getMessageHistory(data) {
  return request({
    url: 'api/orgback/orgBackConsumer/getMessageHistory?parId=' + data.parId,
    method: 'get',
    data
  })
}

/**
 * 返回  给家长发送学生的学习进度 模板
 * @param data
 */
export function loadProcessText(data) {
  return request({
    url: 'api/orgback/orgBackConsumer/loadProcessText',
    method: 'post',
    data
  })
}

/**
 * 批量发送消息
 * @param data
 */
export function sendBatchMessage(data) {
  return request({
    url: 'api/orgback/orgBackConsumer/sendBatchMessage',
    method: 'post',
    data
  })
}


export default {add, edit, del, getMessageHistory, getParentList, loadProcessText,sendBatchMessage}
