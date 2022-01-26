import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/squirrel-train/trainrecord/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getListById = (current, size, params) => {
  return request({
    url: '/api/squirrel-train/trainrecord/getListById',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const sign = (ids) => {
  return request({
    url: '/api/squirrel-train/trainrecord/sign',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const unSign = (ids) => {
  return request({
    url: '/api/squirrel-train/trainrecord/unSign',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/squirrel-train/trainrecord/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/squirrel-train/trainrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/squirrel-train/trainrecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-train/trainrecord/submit',
    method: 'post',
    data: row
  })
}

