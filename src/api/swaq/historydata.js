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
//获取列表 空气质量 修改接口 需要传值 server
export const getList = (treeId, start, end, current, size, server) => {
  let server1 = server ? server : 'service'
  return request({
    url: '/api/squirrel-' + server1 + '/historyData/getList',
    method: 'get',
    params: {
      treeId,
      start,
      end,
      current,
      size,
      server
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
