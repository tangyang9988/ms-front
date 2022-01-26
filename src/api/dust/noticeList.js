import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/notice/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getNotice = (id) => {
  return request({
    url: '/api/ms-ficm/notice/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/notice/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/notice/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/notice/submit',
    method: 'post',
    data: row
  })
}

