import request from '@/router/axios';
/**
 * GIS地图
 */

// 地图数据
export const getData = () => {
  return request({
    url: '/api/squirrel-loam/GIS/getData',
    method: 'get'
  })
}

// 获取组织点位机组
export const getSiteWqi = () => { 
  return request({
    url: '/api/squirrel-service/GIS/getDeptSite',
    method: 'get'
  })
}