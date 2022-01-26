import request from '@/router/axios';

export const getList = (current, size, tenantId) => {
  return request({
    url: '/api/ms-ficm/flowconfig/getList',
    method: 'get',
    params: {
      current,
      size,
      tenantId
    }
  })
}



export const submitFlowconfig = (params) => {
  return request({
    url: '/api/ms-ficm/flowconfig/submit',
    method: 'post',
    data:{
      ...params
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/flowconfig/remove',
    method: 'post',
    params:{
      ids
    }
  })
}


