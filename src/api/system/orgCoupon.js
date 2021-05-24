import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orgCoupon',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgCoupon',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgCoupon',
    method: 'put',
    data
  })
}


export function availableCourseList(data) {
  return request({
    url: 'api/orgCoupon/availableCourseList',
    method: 'GET'
  });

}


export default {add, edit, del, availableCourseList}
