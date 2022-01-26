import request from '@/router/axios';

export const getList = (current, size, id, params) => {
  return request({
    url: '/api/ms-ficm/siteinfo/getList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/ms-ficm/siteinfo/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/siteinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/siteinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/siteinfo/submit',
    method: 'post',
    data: row
  })
}

export const getDeptTree = () => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType:'1',
    }
  })
}

export const getExtraOption = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getExtraOption',
    method: 'get',
    params: {
      type:'2',
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
export const getOperations = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getOperationsOrRegulators',
    method: 'get',
    params:{deptType:3}
  })
}
//业务类型
export const dictionary = () => {
  return request({
    url: '/api/blade-system/dict/dictionary',
    method: 'get',
    params:{
      code:'biz_type'
    }
  })
}
//第四方监管
export const getOperationsOrRegulators = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getOperationsOrRegulators',
    method: 'get',
    params:{deptType:5}
  })
}
