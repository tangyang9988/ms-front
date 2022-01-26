import request from '@/router/axios';

export const getReportHead = (treeId) => {
  return request({
    url: '/api/squirrel-loam/statreport/getReportHead',
    method: 'get',
    params: {
      treeId,
    }
  })
}

// current, size,
export const getList = ( treeId, type, time, params) => {
  return request({
    url: '/api/squirrel-loam/statreport/getReportList',
    method: 'get',
    params: {
        ...params,
        treeId,
        type,
        time,
    }
  })
}

export const toExport = ( treeId, type, time) => {
  return request({
    url: 'api/squirrel-service/statreport/export',
    method: 'get',
    params: {
        treeId,
        type,
        time,
    }
  })
}