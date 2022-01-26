import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/factorcode/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//获取租户列表
export const getTenant = () => {
  return request({
    url: '/api/ms-ficm/factorcode/getTenantList',
    method: 'get',
  })
}
//获取系统类型
export const getSystem = (tenantId) => {
  return request({
    url: '/api/ms-ficm/factorcode/getStByTenantId',
    method: 'get',
    params: {
      tenantId
    }
  })
}
//获取租户因子列表
export const getTenantGene = (st,tenantId) => {
  return request({
    url: '/api/ms-ficm/factorcode/getTenantFactorListBySt',
    method: 'get',
    params: {
      st,
      tenantId
    }
  })
}
//获取系统因子列表
export const getSystemGene = (st,tenantId) => {
  return request({
    url: '/api/ms-ficm/factorcode/getFactorListBySt',
    method: 'get',
    params: {
      st,
      tenantId
    }
  })
}
//保存
export const submit = (tenantId,factorCodeList) => {
  return request({
    url: '/api/ms-ficm/factorcode/submit',
    method: 'post',
    data: {
      tenantId,
      factorCodeList
    }
  })
}
//删除
export const deleteApi = (tenantId,st) => {
  return request({
    url: '/api/ms-ficm/factorcode/remove',
    method: 'post',
    data: {
      tenantId,
      st
    }
  })
}

// export const getDetail = (id) => {
//   return request({
//     url: '/api/blade-system/post/detail',
//     method: 'get',
//     params: {
//       id
//     }
//   })
// }

// export const remove = (ids) => {
//   return request({
//     url: '/api/blade-system/post/remove',
//     method: 'post',
//     params: {
//       ids,
//     }
//   })
// }

// export const add = (row) => {
//   return request({
//     url: '/api/blade-system/post/submit',
//     method: 'post',
//     data: row
//   })
// }

// export const update = (row) => {
//   return request({
//     url: '/api/blade-system/post/submit',
//     method: 'post',
//     data: row
//   })
// }

