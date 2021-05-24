import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/platMessage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/platMessage',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/platMessage',
    method: 'put',
    data
  })
}

export function list() {
  return request({
    url: 'api/platMessage',
    method: 'GET'
  })
}



export default { add, edit, del,list }
