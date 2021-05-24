import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/orgCircleMessage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/orgCircleMessage',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/orgCircleMessage',
    method: 'put',
    data
  })
}

export function myDynamic(page) {
  return request({
    url: 'api/orgCircleMessage/myDynamic?page=' + page,
    method: 'get'
  })
}


export function myfollow(data) {


  return request({
    url: 'api/orgcenter/myfollow',
    method: 'GET',
    data
  })
}


export function followedMe(data) {
  return request({
    url: 'api/orgcenter/followedMe',
    method: 'get',
    data
  })
}

export function collectMyCourse(data) {
  return request({
    url: 'api/orgcenter/collectMyCourse',
    method: 'get',
    data
  })
}


export function messageList(pid) {
  return request({
    url: 'api/orgCircleMessage/messageList?pid=' + pid,
    method: 'get'
  })
}

export function likeUsers(pid) {
  return request({
    url: 'api/orgCircleMessage/likeUsers?pid=' + pid,
    method: 'get'
  })
}


export function myComment() {
  return request({
    url: 'api/orgcenter/myComment',
    method: 'get'
  })
}

/**
 * 回复用户
 */replyUser

export function replyUser(data) {
  return request({
    url: 'api/orgcenter/replyUser',
    method: 'PUT',
    data
  })
}


export default {
  add,
  edit,
  del,
  myDynamic,
  myfollow,
  followedMe,
  collectMyCourse,
  messageList,
  likeUsers,
  myComment,
  replyUser
}
