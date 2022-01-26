import request from '@/router/axios';

//扬尘智能管理系统 环境监测 分析折线图
// 获取折线图
// export const getLine = (factorCodeId) => {
//   return request({
//     url: '/api/squirrel-dust/environmentmonitor/getMonitorData',
//     method: 'get',
//     params: {
//       factorCodeId,
//     }
//   })
// }
// PM2.5 折线
export const getPM25Data = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getMonitorData?factorCodeId=a34004',
    method: 'get'
  })
}
// PM10 折线
export const getPM10Data = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getMonitorData?factorCodeId=a34002',
    method: 'get'
  })
}
// 实时天气 getWeather

// 降尘控制
export const getdDustfallData = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getDustDeviceData',
    method: 'get'
  })
}
// 预警记录 getAbnormalData
export const getAbnormalData = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getAbnormalData',
    method: 'get'
  })
}
// TSP监测 折线
export const getTSPData = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getMonitorData?factorCodeId=a34001',
    method: 'get'
  })
}
//   折线
export const getNoiseData = () => {
  return request({
    url: '/api/squirrel-dust/environmentmonitor/getMonitorData?factorCodeId=B03',
    method: 'get'
  })
}
