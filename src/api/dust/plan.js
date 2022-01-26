import request from '@/router/axios';

export const getData = (deptInfoId) => {
  return request({
    url: '/api/ms-ficm/effectpic/detail',
    method: 'get',
    params: {
      deptInfoId
    }
  })
}

export const planSubmit = (row) => {
  return request({
    url: '/api/ms-ficm/effectpic/submit',
    method: 'post',
    data: row
  })
}


export const getPlan = () => {
  return request({
    url: '/api/ms-ficm/effectpic/getEffectPic',
    method: 'get'
  })
}