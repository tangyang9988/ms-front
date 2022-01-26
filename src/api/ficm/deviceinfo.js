import request from '@/router/axios';

export const getList = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}
// 车辆列表
export const getListByVehicle = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getListByVehicle',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/submit',
    method: 'post',
    data: row
  })
}

export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType:'2',//2020/10/9修改 参数1改成2
    }
  })
}
export const getListByMn = (current, size, mn) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getListByMn',
    method: 'get',
    params: {
      current,
      size,
      mn
    }
  })
}
export const getVehicleListByMn = (current, size, mn) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getVehicleListByMn',
    method: 'get',
    params: {
      current,
      size,
      mn
    }
  })
}
export const checkCountByParentId = ids => {
  return request({
    url: '/api/ms-ficm/deviceinfo/checkCountByParentId',
    method: 'post',
    params: {
      ids
    }
  })
}
export const getFactorByCode = (st) => {
  return request({
    url: '/api/ms-ficm/tenantfactor/getFactorByCode',
    method: 'get',
    params: {
      st
    }
  })
}

export const addBatchMsFactors = (tenantFactorIds,siteType) => {
  return request({
    url: '/api/ms-ficm/devicefactor/addBatchMsFactors',
    method: 'post',
    params:{tenantFactorIds,siteType}
  })
}