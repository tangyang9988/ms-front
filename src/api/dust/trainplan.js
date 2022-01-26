import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/squirrel-train/trainplan/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getStaffList = (current, size, params) => {
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

export const getStaffListPage = (current, size, params) => {
  return request({
    url: '/api/squirrel-train/trainplan/getStaffListPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/squirrel-train/trainplan/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/squirrel-train/trainplan/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/squirrel-train/trainplan/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-train/trainplan/submit',
    method: 'post',
    data: row
  })
}

export const editRemove = (ids) => {
  return request({
    url: '/api/squirrel-train/trainrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
