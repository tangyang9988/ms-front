import request from '@/router/axios';

export const searchVehicleLatestData = () => {
  return request({
    url: '/api/ms-airq/latestData/getVehicleList',
    method: 'get',
    params: {
    }
  })
}
export const getFactorHeadByVehicle = () => {
  return request({
    url: '/api/ms-ficm/devicefactor/getFactorHeadByVehicle',
    method: 'get',
    params: {
      
    }
  })
}
export const getTableHead = () => {
    return request({
      url: '/api/ms-airq/latestData/getHead',
      method: 'get',
      params: {
      }
    })
  }
  export const searchMsSiteLatestData = (regionCode,filter) => {
    return request({
      url: '/api/ms-airq/latestData/getList',
      method: 'get',
      params: {
        regionCode,
        filter
      }
    })
  }


