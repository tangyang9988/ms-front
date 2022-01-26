import request from '@/router/axios';

export const getGISData = () => {
  return request({
    url: '/api/squirrel-airq/GIS/getData',
    method: 'get',
    params: {}
  })
}
//空气站点等级信息
export const getSiteWqi = () => {
  return request({
    url: '/api/squirrel-airq/GIS/getSiteAqi',
    method: 'get',
    params: {}
  })
}
