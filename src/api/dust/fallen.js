import request from '@/router/axios';

export const getList = (current, size, siteId, params) => {
  return request({
    url: '/api/ms-ficm/dustdeviceinfo/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      siteId,
    }
  })
}

export const getDeptTree = (treeType) => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/dustdeviceinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/dustdeviceinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/dustdeviceinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/dustdeviceinfo/submit',
    method: 'post',
    data: row
  })
}

