import request from '@/router/axios';

//历史数据列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/devicetowerdata/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

//实时数据列表
export const getRealTimeData = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/devicetowerdata/getRealTimeData',
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
    url: '/api/squirrel-dust/devicetowerdata/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/squirrel-dust/devicetowerdata/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/squirrel-dust/devicetowerdata/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-dust/devicetowerdata/submit',
    method: 'post',
    data: row
  })
}

