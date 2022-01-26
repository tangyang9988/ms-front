import request from '@/router/axios';
export const workRealTimeList = (time) => {
  return request({
    url: '/api/squirrel-dust/staffRealTimeData/queryInAndOutByPeopleAndDay',
    method: 'get',
    params: {
      stTm:time
    }
  })
}
