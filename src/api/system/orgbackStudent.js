import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orgbackStudent',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgbackStudent',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgbackStudent',
    method: 'put',
    data
  })
}


export function myCustom(data) {
  return request({
    url: 'api/orgbackStudent/myCustom',
    method: 'get',
    data
  })
}

export function myEmployee(data) {
  return request({
    url: 'api/orgbackStudent/myEmployee',
    method: 'get',
    data
  })
}

export function myCourse(data) {
  return request({
    url: 'api/orgbackStudent/myCourse',
    method: 'get',
    data
  })
}

export function getStudyHistory(data) {
  return request({
    url: 'api/orgbackStudyHistory?stuId=' + data.stuId + "&courseId=" + data.courseId,
    method: 'get',

  })
}


export default {add, edit, del}
