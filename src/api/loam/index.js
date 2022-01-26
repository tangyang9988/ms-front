import request from '@/router/axios';
/**
 * 首页
 */

// 异常状况
export const getAbnormalCount = () => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/getAbnormalCount',
    method: 'get'
  })
}

// 区域分布
export const getDeptNum = () => {
  return request({
    url: '/api/ms-ficm/deptinfo/getDeptNum',
    method: 'get'
  })
}

// 达标率区域排名
export const getRegionalRanking = () => {
  return request({
    url: '/api/squirrel-loam/Index/getRegionalRanking',
    method: 'get'
  })
}

// 治理评级
export const getGovernanceRating = () => {
  return request({
    url: '/api/squirrel-loam/Index/governanceRating',
    method: 'get'
  })
}

// 实时监测表头（因子）
export const getHead = () => {
  return request({
    url: '/api/squirrel-loam/Index/getHead',
    method: 'get'
  })
}

// 实时监测、地图数据
export const getData = () => { 
  return request({
    url: '/api/squirrel-loam/GIS/getData',
    method: 'get'
  })
}