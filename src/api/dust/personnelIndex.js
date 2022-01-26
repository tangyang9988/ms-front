import request from '@/router/axios';

//扬尘智能管理系统 人员管理首页
// 人员实时过闸信息 pass
// export const getPass = (factorCodeId) => {
//   return request({
//     url: '/api/',
//     method: 'get',
//     params: {
//       factorCodeId,
//     }
//   })
// }
//
// 工作岗位 station
export const getStation = () => {
  return request({
    url: '/api/squirrel-dust/staffManage/getTypeCount',
    method: 'get'
  })
}
// 人员统计 statistics
export const getStatistics = () => {
  return request({
    url: '/api/',
    method: 'get'
  })
}
// 进出状态 access
export const getAccess = () => {
  return request({
    url: '/api/ms-ficm/attendancerecord/getIndexList',
    method: 'get'
  })
}
// //  ：check
export const getCheck = () => {
  return request({
    url: '/api/',
    method: 'get'
  })
}
// // 工种统计：job
export const getJob = () => {
  return request({
    url: '/api/squirrel-dust/staffManage/getDustWorkTypeCount',
    method: 'get'
  })
}
