import request from '@/router/axios';

export const getList = (current, size, params,id) => {
  return request({
    url: '/api/ms-ficm/roadinfo/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/roadinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/roadinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const submit = (row) => {
  return request({
    url: '/api/ms-ficm/roadinfo/submit',
    method: 'post',
    data: row
  })
}

export const getStatistics = (regionCode,time,type) => {
  return request({
    url: '/api/ms-airq/timeperiodstatistics/getStatistics',
    method: 'get',
    params: {
      regionCode,
      time,
      type
    }
  })
}
export const getWuDistList = () => {
  return request({
    url: '/api/ms-ficm/region/getWuDistList',
    method: 'get',
    params: {
    }
  })
}

