import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/list',
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
    url: '/api/ms-ficm/rdtuinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/submit',
    method: 'post',
    data: row
  })
}

export const getSiteList = id => {
  return request({
    url: '/api/ms-ficm/devicegroup/getSiteList',
    method: 'get',
    params: {
      id
    }
  })
}

export const formSubmit = (row) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/submit',
    method: 'post',
    data: row
  })
}

export const getRdtuDetail = id => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getInstList = id => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getChildren',
    method: 'get',
    params: {
      id
    }
  })
}

export const checkMn = mn => {
  return request({
    url: '/api/ms-ficm/deviceinfo/checkMn',
    method: 'get',
    params: {
      mn
    }
  })
}