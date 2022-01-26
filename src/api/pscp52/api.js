import request from '@/router/axios';

export const getTemp = () => {
  return request({
    url: '/api/squirrel-pscp52/pscp52ConfigMonitor/getTemp',
    method: 'get'
  })
}


export const getDate = () => {
  return request({
    url: '/api/squirrel-pscp52/pscp52ConfigMonitor/getDate',
    method: 'get'
  })
}


export const getLatestData = () => {
  return request({
    url: '/api/squirrel-pscp52/pscp52Index/getLatestData',
    method: 'get'
  })
}
