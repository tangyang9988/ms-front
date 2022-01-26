import request from '@/router/axios';

export const formSubmit = (row) => {
  return request({
    url: '/api/ms-ficm/devicefactor/submit',
    method: 'post',
    data: row
  })
}

export const getFactorDetail = id => {
  return request({
    url: '/api/ms-ficm/devicefactor/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getFactorList = (id,codeType)=> {
  return request({
    url: '/api/ms-ficm/devicefactor/getFactorList',
    method: 'get',
    params: {
      id,
      codeType
    }
  })
}