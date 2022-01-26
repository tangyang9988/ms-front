import request from '@/router/axios';

export const getWeList = (current, size, mn,startTime,endTime,isHandled,queryType) => {
  return request({
    url: '/api/ms-airq/abnormalinfo/getList',
    method: 'get',
    params: {
      current, size, mn,startTime,endTime,isHandled,queryType
      }
  })
}
export const getVehicleAlertList = (current, size, mn,startTime,endTime,isHandled,queryType) => {
  return request({
    url: '/api/ms-airq/abnormalinfo/getVehicleAlertList',
    method: 'get',
    params: {
      current, size, mn,startTime,endTime,isHandled,queryType
      }
  })
}
export const handleSubmit = (abnormalConclusionVO) => {
  return request({
    url: '/api/ms-airq/abnormalinfo/submit',
    method: 'post',
    data:abnormalConclusionVO
  })
}
export const getDeviceList = (current, size,params) => {
  return request({
    url: '/api/ms-airq/abnormalinfo/getDeviceList',
    method: 'get',
    params: {
      current, size,
      ...params,
      }
  })
}