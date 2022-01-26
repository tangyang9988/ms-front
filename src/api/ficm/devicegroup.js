import request from '@/router/axios';

export const getList = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/devicegroup/getList',
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
    url: '/api/ms-ficm/devicegroup/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/devicegroup/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/devicegroup/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/devicegroup/submit',
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

export const getSiteList = id => {
  return request({
    url: '/api/ms-ficm/devicegroup/getSiteList',
    method: 'get',
    params: {
      id
    }
  })
}

// export const getExtraOption = () => {
//   return request({
//     url: '/api/ms-ficm/siteinfo/getExtraOption',
//     method: 'get'
//   })
// }
