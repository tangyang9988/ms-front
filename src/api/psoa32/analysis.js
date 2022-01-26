import request from '@/router/axios';
export const getGIS = () => {
  return request({
    url: '/api/squirrel-psoa32/GIS/getData',
    method: 'get'
  })
}

// 立即取样
export const executeSample = (params) => {
  return request({
    url: '/api/squirrel-psoa32/GIS/executeSample',
    method: 'post',
    params:params
  })
}

// 获取化验处理列表
export const getTestDealList = (params) => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getTestDealList',
    method: 'get',
    params: {...params}
  })
}

// 获取表头
export const getFactorHead = () => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getFactorHead',
    method: 'get'
  })
}

// 获取处理状态
export const getDealStatus = () => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getDealStatus',
    method: 'get'
  })
}

// 获取取样方式
export const getCollectionMethods = () => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getCollectionMethods',
    method: 'get'
  })
}

// 化验处理详情
export const getTestDetail = (id) => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getTestDetail',
    method: 'get',
    params:{id}
  })
}

// 化验处理提交
export const deal = (params) => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/deal',
    method: 'post',
    params:params
  })
}



// 化验待办列表
export const getTestTodoList = (params) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestTodoList',
    method: 'get',
    params:params
  })
}

// 化验待办状态
export const getTestTodoStatus = () => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestTodoStatus',
    method: 'get'
  })
}

// 化验单详情
export const getTestTodoDetail = (sampleCollectionId) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestTodoDetail',
    method: 'get',
    params:{sampleCollectionId}
  })
}


// 化验人接口
export const getTestUserList = () => {
  return request({
    url: '/api/squirrel-psoa32/testreport/getTestUserList',
    method: 'get'
  })
}


// 提交化验单
export const submitTestTodo = (params) => {
  return request({
    url: '/api/squirrel-psoa32/testreport/submitTestTodo',
    method: 'POST',
    data:params
  })
}

// 阈值配置列表
export const getThresholdvalList = (params) => {
  return request({
    url: '/api/squirrel-psoa32/thresholdval/getList',
    method: 'get',
    params:params
  })
}

// 获取监测因子
export const getFactorList = () => {
  return request({
    url: '/api/squirrel-psoa32/thresholdval/getFactorList',
    method: 'get'
  })
}

// 保存阈值配置
export const submitThresholdval = (params) => {
  return request({
    url: '/api/squirrel-psoa32/thresholdval/submit',
    method: 'POST',
    data:params
  })
}


// 计算
export const getThresholdVal = (params) => {
  return request({
    url: '/api/squirrel-psoa32/thresholdval/getThresholdVal',
    method: 'POST',
    data:params
  })
}
