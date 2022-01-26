import request from '@/router/axios';

export const getListHead = (TreeIdsVO) => {
  return request({
    url: '/api/squirrel-loam/latestData/getHead',
    method: 'post',
    data: TreeIdsVO
  })
}
export const getListData = (TreeIdsVO) => {
  return request({
    url: '/api/squirrel-loam/latestData/getList',
    method: 'post',
    data: TreeIdsVO
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