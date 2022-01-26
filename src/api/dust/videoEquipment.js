import request from '@/router/axios';

export const getVideoinfo = (params) => {
    return request({
        url: `/api/ms-ficm/videoinfo/getList`,
        method: 'get',
	    params: {
	    	...params
	    }
    })
}

export const getDeptInfoList = () => {
  return request({
    url: '/api/ms-ficm/deptinfo/getProjectList',
    method: 'get',
  })
}

export const addOrUpdate = (row) => {
  return request({
    url: '/api/ms-ficm/videoinfo/submit',
    method: 'post',
    data: row
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/ms-ficm/videoinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const checkChannelNum = (channelNum) => {
  return request({
    url: '/api/ms-ficm/videoinfo/checkChannelNum',
    method: 'get',
    params: {
      channelNum,
    }
  })
}

export const getVideoSupervision = () => {//视频监管
  return request({
    url: `/api/ms-ficm/videoinfo/getVideoList`,
    method: 'get',
  })
}


export const getSiteListByDeptInfoId = (deptInfoId) => {
  return request({
    url: `/api/ms-ficm/videoinfo/getSiteListByDeptInfoId`,
    method: 'get',
    params: {
      deptInfoId
    }    
  })
}


export const getExtraInfoByDeptInfoId = (deptInfoId) => {
  return request({
    url: `/api/ms-ficm/videoinfo/getExtraInfoByDeptInfoId`,
    method: 'get',
    params: {
      deptInfoId
    }    
  })
}
