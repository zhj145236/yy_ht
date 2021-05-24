import request from '@/utils/request'

export function del(ids) {
  return request({
    url: 'api/pictures',
    method: 'delete',
    data: ids
  })
}

export function delByUrl(urls) {

  return request({
    url: 'api/pictures/url',
    method: 'delete',
    data: urls
  })
}


export function sync() {
  return request({
    url: 'api/pictures/synchronize',
    method: 'post'
  })
}

// 注意导出 相关函数
export default { del, sync ,delByUrl}
