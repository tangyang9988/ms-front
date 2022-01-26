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
//地表水水质分析折线图
export const getLine = (treeId, time, type) => {
  return request({
      url: '/api/squirrel-service/waterQualityAnalysis/getLine',
      method: 'get',
      params: {
        treeId,
        time,
        type
      }
  })
}

//地表水水质评价折线图
export const getChart = (treeId, time, type,treeType) => {
  return request({
      url: '/api/squirrel-service/waterQualityEvaluate/getData',
      method: 'get',
      params: {
        treeId,
        time,
        type,
        treeType
      }
  })
}