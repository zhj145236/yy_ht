import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orgbackStudyHistory',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgbackStudyHistory',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgbackStudyHistory',
    method: 'put',
    data
  })
}


export function rangeHistory(selectDate) {

  if (selectDate === undefined || selectDate === null) {
    return request({
      url: 'api/orgbackStudyHistory/rangeHistory',
      method: 'GET'
    })
  } else {
    return request({
      url: 'api/orgbackStudyHistory/rangeHistory?selectDate=' + selectDate,
      method: 'GET'
    })
  }
}


export default {add, edit, del, rangeHistory}
