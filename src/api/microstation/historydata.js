import request from '@/router/axios';

export const getHead = (treeId) => {
    return request({
      url: '/api/ms-airq/history/getHead',
      method: 'get',
      params: {
        treeId
      }
    })
  }
  export const getList = (treeId ,start, end,current, size) => {
    return request({
      url: '/api/ms-airq/history/getList',
      method: 'get',
      params: {
        treeId,
        start, 
        end,
        current, 
        size
      }
    })
  }
  export const getFactorHeadByVehicle = (vehicleIds) => {
    return request({
      url: '/api/ms-ficm/devicefactor/getFactorHeadByVehicle',
      method: 'get',
      params: {
        vehicleIds
      }
    })
  }
  export const getVehicleList = (treeId ,start, end,current, size) => {
    return request({
      url: '/api/ms-airq/vehicletrajectory/getList',
      method: 'get',
      params: {
        treeId,
        start, 
        end,
        current, 
        size
      }
    })
  }


