import request from '@/router/axios';
//样品列表
export const getList = (params) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestAuditList',
    method: 'get',
    params: {...params}
  })
}
//化验审核状态
export const getCheckStatus = () => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestAuditStatus',
    method: 'get'
  })
}
//化验审核 化验报告 查看详情
export const getReportDetail = (sampleCollectionId) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestTodoDetail',
    method: 'get',
    params:{
      sampleCollectionId
    }
  })
}
//提交审查单
export const submiTestAudit = (params) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/submiTestAudit',
    method: 'post',
    data:params

  })
}
// export const uploadFile = ()=>{
//   return request({
//     url:'/file/upload',
//     method:''
//   })
// }
