import request from '@/router/axios';

export const getAliasType = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=alert_type',
    method: 'get'
  })
}

export const getList = (current, size, start, end, treeId, alertType,isHandled,treeType,queryType,st) => {//isHandled添加状态的查询20201019
  return request({
    url: '/api/squirrel-loam/abnormalinfo/getList',
    method: 'get',
    params: {
      current,
      size,
      start,
      end,
      treeId,
      alertType,
      isHandled,
      treeType,
      st,
      queryType
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-loam/abnormalinfo/submit',
    method: 'post',
    data: row
  })
}