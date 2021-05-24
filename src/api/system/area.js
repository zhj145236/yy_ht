import request from '@/utils/request'
import qs from 'qs'

export function getAreas(params) {
  return request({
    url: 'api/area',
    method: 'get',
    params
  })
}

export function getAreaSuperior(ids) {
  const params = {
    ids: ids
  }
  return request({
    url: 'api/area/superior?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/area',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/area',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/area',
    method: 'put',
    data
  })
}

export default { add, edit, del, getAreas, getAreaSuperior }
