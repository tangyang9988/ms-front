import request from '@/router/axios';
export const inAndOutList = (time) => {
  return request({
    url: '/api/squirrel-dust/staffRealTimeData/queryInAndOutByDay',
    method: 'get',
    params: {
      stTm:time
    }
  })
}
