import request from '@/router/axios';

// 化合物级联接口
export const getFactors = () => {
  return request({
    url: '/api/ms-ficm/devicefactor/getFactorCodeGroupByGroup',
    method: 'get'
  })
}

// 折线图
export const getLine = (pointId, time, typeId, factorIds) => {
  return request({
      url: '/api/squirrel-air-vocs98/index/getTrendAnalysis',
      method: 'get',
      params: {
        pointId,
        time,
        typeId,
        factorIds
      }
  })
}