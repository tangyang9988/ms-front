import request from '@/router/axios';
/**
 * 首页
 */

// 点位
export const getDeptTree = (treeType) => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType,
    }
  })
}

// 化合物类型
export const getFactors = () => {
  return request({
    url: '/api/ms-ficm/devicefactor/getFactorCodeGroupByGroup',
    method: 'get'
  })
}

// 实时监测
export const getData = () => { 
  return request({
    url: '/api/squirrel-air-vocs98/index/getPointInformation',
    method: 'get'
  })
}