import request from '@/router/axios';
export const deviceSearch = (params) => {
  return request({
    url: '/api/ms-ficm/thirdpartyrelation/getShcnLoamDeviceInfo',
    method: 'get',
    params: {...params}
  })
}
export const statusUpdate = (params) => {
  return request({
    url: '/api/squirrel-dock/shanghaiChangningLoam/device/statusUpdate',
    method: 'post',
    params: {...params}
  })
}
