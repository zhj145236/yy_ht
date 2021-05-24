import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orgWantEmploy',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgWantEmploy',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgWantEmploy',
    method: 'put',
    data
  })
}

export function jobApplyAndView(data) {
  return request({
    url: 'api/orgWantEmploy/jobApplyAndView?id=' + data.id,
    method: 'get'

  })
}

export function getUserResume(data) {
  return request({
    url: 'api/orgWantEmploy/getUserResume?id=' + data.id,
    method: 'get'

  })
}

/**
 * 为未此投递简历设置状态
 * @param data
 */
export function changeInterviewStatus(data) {
  return request({
    url: 'api/orgWantEmploy/changeInterviewStatus?id=' + data.id + "&interviewStatus=" + data.interviewStatus,
    method: 'put'

  })
}


export default {add, edit, del, jobApplyAndView, getUserResume, changeInterviewStatus}
