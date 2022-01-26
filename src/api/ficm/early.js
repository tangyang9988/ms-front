import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/ms-ficm/monitornotice/getList',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getUserList = (params) => {
  return request({
    url: '/api/ms-ficm/monitornotice/getUserList',
    method: 'get',
    params: {
     ...params
    }
  })
}

export const submitData = (params) => {
  return request({
    url: '/api/ms-ficm/monitornotice/submit',
    method: 'post',
    data:params
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/monitornotice/getDetail',
    method: 'get',
    params: {
     id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/monitornotice/remove',
    method: 'post',
    params: {
     ids
    }
  })
}

