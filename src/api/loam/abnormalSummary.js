import request from '@/router/axios';

// 获取登录用户信息
export const getUserInfo = () => { 
  return request({
    url: '/api/squirrel-loam/statistics/getTheLoginCompanyType',
    method: 'get'
  })
}

// 获取环保分局列表
export const getDeptList = () => {
  return request({
    url: '/api/squirrel-loam/statistics/getBranchInformation',
    method: 'get'
  })
}

// 获取督办单统清单
export const getList = ( startTime, endTime, entType, environType, environId ) => {
  return request({
    url: '/api/squirrel-loam/statistics/getTheSupervisionListStatistics',
    method: 'get',
    params: {
      startTime,
      endTime,
      entType,
      environType,
      environId
    }
  })
}