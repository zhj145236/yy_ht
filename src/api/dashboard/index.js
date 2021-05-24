import request from '@/utils/request'


/**
 * 获取4条汇总数据
 * @param url
 * @param params
 */

export function summay(url, params) {

  return request({
    url: 'api/orgDashborad/summay',
    method: 'get',
    data: params
  });


}


/**
 * 访问机构的用户 （表格）
 * @param url
 * @param params
 */
export function viewUserList(params) {

  return request({
    url: 'api/orgDashborad/viewUserList?date=' + params.date,
    method: 'get',
    data: params
  });

}

/**
 * 访问机构的用户数量 （条形图）

 * @param params
 */
export function userVisit(params) {

  return request({
    url: 'api/orgDashborad/userVisit',
    method: 'get',
    data: params
  });

}


/**
 * 课程被浏览数量
 * @param url
 * @param params
 */
export function courseView(url, params) {

  return request({
    url: 'api/orgDashborad/courseView',
    method: 'get',
    data: params
  });

}

/**
 * 返回 查看此课程的用户
 * @param param
 */
export function viewCourseUserList(param) {

  return request({
    url: 'api/orgDashborad/viewCourseUserList?date=' + param.date + "&courseId=" + param.courseId,
    method: 'get'

  });

}


export function ysnotice() {

  return request({
    url: 'api/orgDashborad/ysnotice',
    method: 'get'

  });

}




































