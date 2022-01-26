import request from '@/router/axios';

export const getList = (current, size, params) => {//传入默认参数 //机构类型deptType:39
  return request({
    url: '/api/ms-ficm/deptinfo/getList',
    method: 'get',
    params: {
      ...params,
      parentId: '',
      deptType:"39",
      // deptCategory:'1',
      // sort:'1',
      // deptLevel:'3'
      // current,
      // size,
    }
  })
}
export const getCategory = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=org_category',
    method: 'get',
    params: {}
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
export const getExtraOption = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getExtraOption',
    method: 'get',
    params: {
      type: '3',
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
//合同备案码唯一性
export const checkBizLics = (bizLics) => {
  return request({
    url: '/api/ms-ficm/deptinfo/checkBizLics',
    method: 'get',
    params: {
      bizLics
    }
  })
}
