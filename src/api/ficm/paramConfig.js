import request from '@/router/axios';

export const getDetail = () => {
  return request({
    url: '/api/ms-ficm/paramconfig/getDetail',
    method: 'get'
  })
}
export const submit = (row) => {
  return request({
    url: '/api/ms-ficm/paramconfig/submit',
    method: 'post',
    data: row
  })
}
