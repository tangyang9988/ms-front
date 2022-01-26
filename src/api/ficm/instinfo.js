import request from '@/router/axios';

// 获取其他设备因子
export const getDeviceFactorList = (siteType) => {
  return request({
    url: '/api/ms-ficm/devicefactor/getDeviceFactorList',
    method: 'get',
    params: {siteType}
  })
}

// 保存复制其他设备因子
export const copyDeviceFactor = (params) => {
  return request({
    url: '/api/ms-ficm/devicefactor/copyDeviceFactor',
    method: 'post',
    params: {
      ...params
    }
  })
}

// 获取批量添加因子分组列表
export const getVocs98Group = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=vocs98_group',
    method: 'get'
  })
}

// 保存批量添加因子
export const saveBatchDeviceFactor = (params) => {
  return request({
    url: '/api/ms-ficm/devicefactor/saveBatchDeviceFactor',
    method: 'get',
    params: {
      ...params
    }    
  })
}
export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/devicefactor/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/rdtuinfo/submit',
    method: 'post',
    data: row
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

export const formSubmit = (row) => {
  return request({
    url: '/api/ms-ficm/deviceinfo/submit',
    method: 'post',
    data: row
  })
}

export const getInstDetail = id => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getGroupList = id => {
  return request({
    url: '/api/ms-ficm/deviceinfo/getDeviceGroupList',
    method: 'get',
    params: {
      id
    }
  })
}

export const getFactorList = id => {
  return request({
    url: '/api/ms-ficm/devicefactor/getList',
    method: 'get',
    params: {
      id
    }
  })
}

export const checkMn = mn => {
  return request({
    url: '/api/ms-ficm/deviceinfo/checkMn',
    method: 'get',
    params: {
      mn
    }
  })
}