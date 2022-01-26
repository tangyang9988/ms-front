import request from '@/router/axios';

// 获取因子列表
export const getStByTenantId = () =>{
  return request({
    url: '/api/ms-ficm/tenantfactor/getStByTenantId',
    method: 'get',
  })
}
//获取表格内容
// export const getList = (current,size,st,factorCodeId) =>{
//   return request({
//     url: '/api/ms-ficm/tenantfactor/getList',
//     method: 'get',
//     params:{
//       current,
//       size,
//       st,
//       factorCodeId
//     }
//   })
// }
//获取表格内容
export const getList = (current, size, params) =>{
  return request({
    url: '/api/ms-ficm/factorcode/getFactorCodeList',
    method: 'get',
    params:{
      current,
      size,
      ...params
    }
  })
}
//删除
export const remove = (id,st) =>{
  return request({
    url: '/api/ms-ficm/factorcode/removeFactorCode',
    method: 'post',
    params:{
      id,
      st
    }
  })
}

//修改提交
export const submit = (row) =>{
  return request({
    url: '/api/ms-ficm/factorcode/submitFactorCode',
    method: 'post',
    data: row
  })
}
