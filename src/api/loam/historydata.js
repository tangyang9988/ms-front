import request from '@/router/axios';

export const getHead = (treeId) => {
  return request({
    url: '/api/squirrel-loam/historyData/getHead',
    method: 'get',
    params: {
      treeId,
    }
  })
}

export const getList = (treeId, start, end, current, size) => {
  return request({
    url: '/api/squirrel-loam/historyData/getList',
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

export const getDeptTree = (treeType) => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType,
    }
  })
}