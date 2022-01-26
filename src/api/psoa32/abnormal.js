import request from '@/router/axios';

export const getAbnormalCount = () => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/getAbnormalCount',
    method: 'get'
  })
}



export const getIndexAbnormalList = (params) => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/getIndexAbnormalList',
    method: 'get',
    params:params 
  })
}