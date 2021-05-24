import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/platNotice',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/platNotice',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/platNotice',
    method: 'put',
    data
  })
}

export function makeAllRead(ids, selectAll) {


  if (selectAll === true) {

    return request({
      url: 'api/platNotice/makeAllRead?selectAll=true',
      method: 'PUT'
    })
  } else {
    let data = {
      selectAll
    };
    return request({
      url: 'api/platNotice/makeAllRead?selectAll=false&ids=' + ids.join(","),
      method: 'PUT',
      data

    })
  }


}


export default {add, edit, del, makeAllRead}
