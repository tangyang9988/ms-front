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

export const getData = (siteInfoId,factorCode, time) => {
    return request({
        url: '/api/squirrel-service/statisticalAnalysis/getIndex',
        method: 'get',
        params: {
            siteInfoId: siteInfoId,
            factorCode:factorCode,
            start: time,
            end: time,
        }
    })
}

export const getGene = (deptInfoIds, time) => {
  return request({
      url: '/api/squirrel-service/statisticalAnalysis/getHead',
      method: 'get',
      params: {
          deptInfoIds: deptInfoIds,
          // start: time,
          // end: time,
      }
  })
}

export const getSiteList = id => {
  return request({
    url: '/api/ms-ficm/devicegroup/getSiteList',
    method: 'get',
    params: {
      id
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
export const getLine = (factorCode, time, treeIds, type) => {
  return request({
      url: '/api/squirrel-service/trendAnalysis/getLine',
      method: 'get',
      params: {
        factorCode,
        time,
        treeIds,
        type
      }
  })
}
//地表水趋势分析因子列表
export const getFactorList = (treeIds) => {
  return request({
      url: '/api/squirrel-service/trendAnalysis/getFactorList',
      method: 'get',
      params: {
        treeIds
      }
  })
}