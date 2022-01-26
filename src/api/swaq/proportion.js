import request from '@/router/axios';

export const getDeptTree = (treeType) => {
    return request({
        url: '/api/ms-ficm/client/getTree',
        method: 'get',
        params: {
          treeType,
        }
    })
}
//统计类型
export const getTypes = () => {
  return request({
      url: '/api/squirrel-service/trendAnalysis/getTypes',
      method: 'get',
  })
}
//地表水趋势分析折线图
export const getLine = (treeId, beforeTime, afterTime,factorCode, type) => {
  return request({
      url: '/api/squirrel-service/compare/getLine',
      method: 'get',
      params: {
        treeId,
        afterTime,
        beforeTime,
        factorCode,
        type
      }
  })
}
//地表水同比环比因子列表
export const getFactorList = (treeId) => {
  return request({
      url: '/api/squirrel-service/compare/getFactorList',
      method: 'get',
      params: {
        treeId
      }
  })
}