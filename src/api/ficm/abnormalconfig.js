import request from '@/router/axios';

export const getList = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id,
    }
  })
}

export const getListByVehicle = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/getListByVehicle',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/submit',
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

export const getDeviceList = id => {
  return request({
    url: '/api/ms-ficm/monitorconfig/getDeviceList',
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

export const getSiteList = id => {
  return request({
    url: '/api/ms-ficm/devicegroup/getSiteList',
    method: 'get',
    params: {
      id
    }
  })
}

export const updateStatus = (id, status) => {
  return request({
    url: '/api/ms-ficm/monitorconfig/updateStatus',
    method: 'get',
    params: {
      id,
      status
    }
  })
}
// 预警类型
export const getAlertType = () => {
  return request({
    url: 'api/blade-system/dict/dictionary?code=alert_type',
    method: 'get',
  })
}


// 自动计算
export const calMonitorConfig = (params) => {
  return request({
    url: 'api/squirrel-psoa32/thresholdval/calMonitorConfig',
    method: 'get',
    params:params
  })
}
// 批量添加预警配置
export const addBatchMonitorConfig = () => {
  return request({
    url: 'api/ms-ficm/monitorconfig/addBatchMonitorConfig',
    method: 'get',
    params:{}
  })
}

