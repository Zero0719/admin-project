import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/sessions',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/sessions',
    method: 'delete'
  })
}
