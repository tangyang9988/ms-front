import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/ms-ficm/deptinfo/getList',
    method: 'get',
    params: {
      ...params,
      parentId:''
      // current,
      // size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/deptinfo/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/deptinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/deptinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/deptinfo/submit',
    method: 'post',
    data: row
  })
}

export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/blade-system/dept/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const getLazyList = (parentId, params) => {
  return request({
    url: '/api/blade-system/dept/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getLazyTree = (parentCode, params) => {
  return request({
    url: '/api/ms-ficm/deptinfo/getReginTree',
    method: 'get',
    params: {
      ...params,
      parentCode
    }
  })
}
//组织机构代码 唯一性
export const getDeptCode = (deptCode) => {
  return request({
    url: '/api/ms-ficm/deptinfo/checkDeptCode',
    method: 'get',
    params: {
      deptCode
    }
  })
}

export const getExtraOption = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getExtraOption',
    method: 'get',
    params: {
      type: '1',
    }
  })
}

