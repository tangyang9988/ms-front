import request from '@/router/axios';

// 获取异常督办列表
export const getList = ( deptId, start, end, current, size) => {
  return request({
    url: '/api/squirrel-loam/abnormalreport/getList',
    method: 'get',
    params: {
      deptId,
      start,
      end,
      current,
      size
    }
  })
}