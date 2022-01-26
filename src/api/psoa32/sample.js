import request from '@/router/axios';
//样品列表
export const getList = (params) => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getList',
    method: 'get',
    params: {...params}
  })
}
//采样方式
export const getMethods = () => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getCollectionMethods',
    method: 'get'
  })
}
//状态
export const getStatus = () => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getCollectionStatus',
    method: 'get'
  })
}

//收集 批量收集
export const getColList = (ids) => {
  return request({
    url: '/api/squirrel-psoa32/samplecollection/getCollectionList',
    method: 'get',
    params: {
      ids
    }
  })
}
//弃样
export const giveUp = (ids) =>{
  return request({
    url:"/api/squirrel-psoa32/samplecollection/giveUp",
    method:'post',
    params:{
      ids
    }
  })
}
//查看
export const detail = (id) =>{
  return request({
    url:"/api/squirrel-psoa32/samplecollection/detail",
    method:'get',
    params:{
      id
    }
  })
}
//收集弹窗
export const collectSample = (ids,userId,deptInfoId) =>{
  return request({
    url:"/api/squirrel-psoa32/samplecollection/collection",
    method:'post',
    params:{
      ids,
      userId,
      deptInfoId
    }
  })
}

//
export const getUserld = (deptId, treeType) =>{
  return request({
    url:"/api/ms-ficm/bladeUser/getUser",
    method:'get',
    params:{
      deptId,
      treeType
    }
  })
}


