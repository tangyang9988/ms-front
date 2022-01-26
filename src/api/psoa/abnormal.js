import request from '@/router/axios';

export const getAbnormalCount = () => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/getAbnormalCount',
    method: 'get'
  })
}