import request from '@/router/axios';

// 因子列表（油烟浓度、悬浮颗粒物、非甲烷总氢）
export const getFactorList = (treeIds) => {
  return request({
      url: '/api/squirrel-loam/trendAnalysis/getFactorList',
      method: 'get',
      params: {
        treeIds
      }
  })
}

// 1. K线图
export const getKLineChart = (groupid, time, deviceFactorId) => {
  return request({
      url: '/api/squirrel-loam/trendAnalysis/getmonthlyChart',
      method: 'get',
      params: {
        groupid,
        time,
        deviceFactorId
      }
  })
}

// 2. 折线图
export const getLine = (factorCode, deviceFactorId, time, treeIds, type) => {
  return request({
      url: '/api/squirrel-loam/trendAnalysis/getLine',
      method: 'get',
      params: {
        factorCode,
        deviceFactorId,
        time,
        treeIds,
        type
      }
  })
}

// 3. 风机、净化器运行状态图
export const getWorkingStatus = (groupid, deviceFactorId, time) => {
  return request({
      url: '/api/squirrel-loam/trendAnalysis/getWorkingStatus',
      method: 'get',
      params: {
        groupid,
        deviceFactorId,
        time
      }
  })
}

// 4. 在线达标率
export const getComplianceRate = (groupid, deviceFactorId, time) => {
  return request({
      url: '/api/squirrel-loam/trendAnalysis/getOnlineComplianceRate',
      method: 'get',
      params: {
        groupid,
        deviceFactorId,
        time
      }
  })
}