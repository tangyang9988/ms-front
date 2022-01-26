import request from '@/router/axios';

export const getList = (current, size, params,id) => {
  return request({
    url: '/api/ms-ficm/vehicleinfo/getList',
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
    url: '/api/ms-ficm/vehicleinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/vehicleinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const submit = (row) => {
  return request({
    url: '/api/ms-ficm/vehicleinfo/submit',
    method: 'post',
    data: row
  })
}
export const getDeptLazyTree = (treeType) => {
  return request({
      url: '/api/ms-ficm/siteinfo/getTree',
      method: 'get',
      params: {
        treeType,
      }
  })
}
export const getDeptTree = (treeType) => {
  return request({
    url: '/api/ms-ficm/siteinfo/getVehicleTree',
    method: 'get',
    params: {
      treeType,
    }
  })
}

