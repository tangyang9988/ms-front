import request from '@/router/axios';

export const getGISData = () => {
  return request({
    url: '/api/squirrel-service/GIS/getData',
    method: 'get',
    params: {}
  })
}

export const getSiteWqi = () => {
  return request({
    url: '/api/squirrel-service/GIS/getSiteWqi',
    method: 'get',
    params: {}
  })
}