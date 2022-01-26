import request from '@/router/axios';

export const getList = ( treeId, time) => {
  return request({
    url: '/api/squirrel-loam/statreport/getGovernanceList',
    method: 'get',
    params: {
      treeId,
      time,
    }
  })
}