import request from '@/router/axios';
export const getList = (params) => {
  return request({
    url: '/api/ms-ficm/highriskdeviceinfo/getList',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const addOrUpdate = (row) => {
  return request({
    url: '/api/ms-ficm/highriskdeviceinfo/submit',
    method: 'post',
    data: row
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/highriskdeviceinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const device_type = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=highrisk_device_type',
    method: 'get'
  })
}



export const getDeptTree = (treeType) => {
  return request({
    url: '/api/ms-ficm/client/getTree',
    method: 'get',
    params: {
      treeType,
    }
  })
}


export const checkMn = (mn) => {
  return request({
    url: '/api/ms-ficm/highriskdeviceinfo/checkMn',
    method: 'get',
    params: {
      mn
    }
  })
}