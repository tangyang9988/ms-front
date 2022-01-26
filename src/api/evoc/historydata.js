import request from '@/router/axios';

// 化合物级联接口
export const getFactors = () => {
  return request({
    url: '/api/ms-ficm/devicefactor/getFactorCodeGroupByGroup',
    method: 'get'
  })
}

// 表格内容
export const getList = (pointId, startTime, endTime, typeId, factorId, current, size) => {
  return request({
    url: '/api/squirrel-air-vocs98/index/getComprehensiveData',
    method: 'get',
    params: {
      pointId,
      startTime,
      endTime,
      typeId,
      factorId,
      current,
      size
    }
  })
}