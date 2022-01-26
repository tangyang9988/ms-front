import request from '@/router/axios';

export const getHead = (treeId) => {
  return request({
    url: '/api/squirrel-service/historyData/getHead',
    method: 'get',
    params: {
      treeId,
    }
  })
}

export const getList = (treeId, start, end) => {
  return request({
    url: '/api/squirrel-service/historyData/getList',
    method: 'get',
    params: {
      treeId,
      start,
      end,
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