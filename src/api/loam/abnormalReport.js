import request from '@/router/axios';

// 获取异常清单列表
export const getList = ( deptInfoId, deptName, id ) => {
  return request({
    url: '/api/squirrel-loam/abnormalreport/getDetail',
    method: 'get',
    params: {
      deptInfoId,
      deptName,
      id
    }
  })
}

// 获取异常原因列表
export const getReason = () => { 
  return request({
    url: "/api/blade-system/dict/dictionary?code=abnormal_reason",
    method: "get"
  })
}

// 编辑异常清单
export const editAbnormal = (abnormalIds, abnormalReason, feedback) => { 
  return request({
    url: '/api/squirrel-loam/abnormalreport/addFeedback',
    method: "post",
    data: {
      abnormalIds,
      abnormalReason,
      feedback
    }
  })
}

// 获取审核流程
export const getAuditProcess = (processInstanceId) => {
  return request({
    url: '/api/squirrel-loam/abnormalreport/getAuditProcess',
    method: 'get',
    params: {
    	processInstanceId
    }
  })
}

// 提交审核
export const handleAbnormal = (task) => {
  return request({
    url: '/api/squirrel-loam/abnormalreport/completeTask',
    method: 'post', 
    params:{
    	abnormalReportId: task.abnormalReportId,
    	processInstanceId: task.processInstanceId,
    	taskId: task.taskId
    },
    data:{
    	comment: task.comment,
    	pass: task.pass
    }
  })
}