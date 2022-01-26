import request from '@/router/axios';

export const getListHead = (treeIds) => {
  return request({
    url: '/api/squirrel-service/latestData/getHead',
    method: 'get',
    params: {treeIds}
  })
}
//获取列表 空气质量 修改接口 需要传值 server
export const getListData = (treeIds, server) => {
  let server1 = server ? server : 'service'
  return request({
    url: '/api/squirrel-' + server1 + '/latestData/getList',
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
