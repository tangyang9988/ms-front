import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getCurrentData = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/getRealTimeData',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-dust/devicematerialdata/submit',
    method: 'post',
    data: row
  })
}
