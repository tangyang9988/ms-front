import request from '@/router/axios';

export const getDetail = (tenantId,st, deptType,type) => {
  return request({
    url: '/api/ms-ficm/dashboardopts/getDetail',
    method: 'get',
    params: {
      tenantId,
      st,
      deptType,
      type
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/ms-ficm/dashboardopts/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/ms-ficm/dashboardopts/submit',
    method: 'post',
    data: row
  })
}

export const getChartSelectOption = (code) => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=index'+code,
    method: 'get',
  })
}

export const getChartData = (id) => {
  return request({
    url: '/api/squirrel-service/Index/getChartData',
    method: 'get',
    params: {
      id: id
    }
  })
}

export const getEntTypeApi = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=org_category',
    method: 'get',
  })
}

export const getDizTypeApi = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=biz_type',
    method: 'get',
  })
}

export const getDefaultTemplate = (deptType,st,type) => {
  return request({
    url: '/api/ms-ficm/dashboardopts/getDefaultTemplate',
    method: 'get',
    params: {
      deptType,
      st,
      type
    }
  })
}

export const getDeptCategory = () => {
  return request({
    url: '/api/ms-ficm/deptinfo/getDeptCategory',
    method: 'get',
  })
}
