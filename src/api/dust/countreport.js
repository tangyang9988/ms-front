import request from '@/router/axios';

export const getReportHead = (treeId) => {
  return request({
    url: '/api/squirrel-service/statreport/getReportHead',
    method: 'get',
    params: {
      treeId,
    }
  })
}

// current, size,
export const getList = ( treeId, type, time, params,treeType) => {
  return request({
    url: '/api/squirrel-service/statreport/getReportList',
    method: 'get',
    params: {
        ...params,
        // current,
        // size,
        treeId,
        type,
        time,
        treeType
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