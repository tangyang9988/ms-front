import request from '@/router/axios';
/**
 * 信息舱
 */

// 达标率区域排名
export const getRegionalRanking = () => {
  return request({
    url: '/api/squirrel-loam/Index/getRegionalRanking',
    method: 'get'
  })
}

// 企业排名
export const getEnterpriseRanking = () => {
  return request({
    url: '/api/squirrel-loam/Index/getEnterpriseRanking',
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

// 异常情况（信息舱）处理率、及时率
export const getExceptions = () => { 
  return request({
    url: '/api/squirrel-loam/Index/getExceptions',
    method: 'get'
  })
}

// 地图数据
export const getData = () => {
  return request({
    url: '/api/squirrel-loam/GIS/getData',
    method: 'get'
  })
}

// 报警类型
export const getAlertType = () => {
  return request({
    url: '/api/squirrel-loam/Index/getAlertType',
    method: 'get'
  })
}

// 监测设备总览
export const getDeviceOverview = () => {
  return request({
    url: '/api/squirrel-loam/Index/getDeviceOverview',
    method: 'get'
  })
}

// 督办工单
export const getSuperviseReport = () => {
  return request({
    url: '/api/squirrel-loam/Index/getSuperviseReport',
    method: 'get'
  })
}