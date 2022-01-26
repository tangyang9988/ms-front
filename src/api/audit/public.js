import request from '@/router/axios';

// 获取因子表头
export const getHead = (treeId,url) => {
  return request({
    url: url,
    method: 'get',
    params: {
      treeId,
    }
  })
}



//获取列表 空气质量 修改接口 需要传值 server
export const getList = (treeId,start,end,current,size,server) => {
  let server1 = server ? server : 'service'
  return request({
    url: '/api/squirrel-' + server1 + '/historyData/getAuditDataList',
    method: 'get',
    params: {
      treeId,
      start,
      end,
      current,
      size,
      server
    }
  })
}


export const saveHistoryData = (saveHistoryData) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/saveHistoryData',
    method: 'post',
    data:{saveHistoryData}
  })
}


export const getAgencyList = (params) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/getAuditTodoList',
    method: 'get',
    params: {
    	...params
    }
  })
}



export const getDataAuditRecordList = (dataAuditLogId) => {
  return request({
    url: '/api/squirrel-dvas/dataauditrecord/getDataAuditRecordList',
    method: 'get',
    params: {
    	dataAuditLogId
    }
  })
}

export const getAuditProcess = (processInstanceId) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/getAuditProcess',
    method: 'get',
    params: {
    	processInstanceId
    }
  })
}



export const getAuditLogList = (params) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/getAuditLogList',
    method: 'get',
    params: {
    	...params
    }
  })
}


export const completeTask = (params) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/completeTask',
    method: 'post',    
    params:{
    	dataAuditLogId:params.dataAuditLogId,
    	processInstanceId:params.processInstanceId,
    	taskId:params.taskId
    },
    data:{
    	comment:params.comment,
    	pass:params.pass
    }
  })
}



export const checkAuditData = (params) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/checkAuditData',
    method: 'get',
    params: {
    	...params
    }
  })
}


export const saveAuditLog = (params) => {
  return request({
    url: '/api/squirrel-dvas/dataauditlog/saveAuditLog',
    method: 'post',
    params:{
    	...params
    }
  })
}

