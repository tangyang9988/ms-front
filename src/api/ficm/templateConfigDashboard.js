import request from '@/router/axios';

// export const getDetail = (tenantId, st, deptType, type) => {
//   return request({
//     url: '/api/ms-ficm/dashboarddefopts/getDetail',
//     method: 'get',
//     params: {
//       tenantId,
//       st,
//       deptType,
//       type
//     }
//   })
// }
//新增获取详情

export const getDetail = (id, st, deptType, type) => {
  return request({
    url: '/api/ms-ficm/dashboarddefopts/getDetail',
    method: 'get',
    params: {
      id,
      st,
      deptType,
      type
    }
  })
}
export const getDetailConfig = (id) => {
  return request({
    url: '/api/ms-ficm/dashboarddefopts/getDetail',
    method: 'get',
    params: {
      id
    }
  })
}
export const add = (row) => {
  return request({
    url: '/api//ms-ficm/dashboarddefopts/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {//修改
  return request({
    url: '/api//ms-ficm/dashboarddefopts/submit',
    method: 'post',
    data: row
  })
}

export const getChartSelectOption = (code) => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=index' + code,
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

export const getDefaultTemplate = (deptType, isDefault, st, tenantId, type) => {
  return request({
    url: '/api/ms-ficm/dashboardopts/getDefaultTemplate',
    method: 'get',
    params: {
      deptType,
      isDefault,
      st,
      tenantId,
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

