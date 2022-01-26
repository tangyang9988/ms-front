import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/deviceelevatordata/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getRealTimeData = (current, size, params) => {
  return request({
    url: '/api/squirrel-dust/deviceelevatordata/getRealTimeData',
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
    url: '/api/squirrel-dust/deviceelevatordata/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/squirrel-dust/deviceelevatordata/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/squirrel-dust/deviceelevatordata/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/squirrel-dust/deviceelevatordata/submit',
    method: 'post',
    data: row
  })
}

