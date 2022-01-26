import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/dashboarddefopts/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size
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
    url: '/api/ms-ficm/dashboarddefopts/remove',
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
      treeType: '2',//2020/10/9修改 参数1改成2
    }
  })
}

export const checkCountByParentId = ids => {
  return request({
    url: '/api/ms-ficm/dashboarddefopts/remove',
    method: 'post',
    params: {
      ids
    }
  })
}
