import request from '@/router/axios';

export const getAliasType = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=alert_type',
    method: 'get'
  })
}

export const getList = (current, size, start, end, treeId, alertType) => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/getList',
    method: 'get',
    params: {
      current,
      size,
      start,
      end,
      treeId,
      alertType,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-service/abnormalinfo/submit',
    method: 'post',
    data: row
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