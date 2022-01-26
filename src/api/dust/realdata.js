import request from '@/router/axios';

export const getListHead = (treeIds) => {
  return request({
    url: '/api/squirrel-service/latestData/getHead',
    method: 'get',
    params: {treeIds}
  })
}
export const getListData = (treeIds) => {
  return request({
    url: '/api/squirrel-service/latestData/getList',
    method: 'get',
    params: {treeIds}
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