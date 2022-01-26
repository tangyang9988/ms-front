import request from '@/router/axios';

export const getDeptNum = () => {
  return request({
    url: '/api/ms-ficm/deptinfo/getDeptNum',
    method: 'get'
  })
}