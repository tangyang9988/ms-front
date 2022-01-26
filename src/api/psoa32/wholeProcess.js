import request from '@/router/axios';
export const getList = (params) => {
  return request({
    url: '/api/squirrel-psoa-hebei/access/getList',
    method: 'get',
    params: {...params}
  })
}

export const getAbnormalList = (params) => {
  return request({
    url: '/api/squirrel-psoa-hebei/abnormal/getList',
    method: 'get',
    params: {...params}
  })
}

