import request from '@/router/axios';

export const getReportHead = ( treeId, treeType,factorCodes) => {
  return request({
    url: '/api/ms-airq/statreport/getReportHead',
    method: 'get',
    params: { treeId, treeType ,factorCodes}
  })
}

// current, size,
export const getList = (treeId, type, time,treeType,) => {
  return request({
    url: '/api/ms-airq/statreport/getReportList',
    method: 'get',
    params: {
      treeId,
      type,
      time,
      treeType,

    }
  })
}
