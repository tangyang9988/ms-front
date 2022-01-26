import request from '@/router/axios';
import {getToken} from '@/util/auth';
import website from '@/config/website';
import {Base64} from 'js-base64';
export const getList = (params) => {
  return request({
    url: '/api/squirrel-dust/staffManage/getList',
    method: 'get',
    params: {
    	...params
    }
  })
}
export const addPersonnel = (row) => {
  return request({
    url: '/api/ms-ficm/staffinfo/save',
    method: 'post',
    data: row
  })
}
export const updatePersonnel = (row) => {
  return request({
    url: '/api/ms-ficm/staffinfo/update',
    method: 'post',
    data: row
  })
}


export const headers = () => {
	 let obj={}
	 obj[website.tokenHeader]= 'bearer ' + getToken()
	 obj['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
   return obj
}

export const getDeptInfoList = () => {
  return request({
    url: '/api/ms-ficm/deptinfo/getProjectList',
    method: 'get',
  })
}


export const remove = (id) => {
  return request({
    url: '/api/ms-ficm/staffinfo/remove',
    method: 'post',
    params: {
      id,
    }
  })
}

export const getInOutList = (params) => {
  return request({
    url: '/api/ms-ficm/attendancerecord/getList',
    method: 'get',
    params: {
    	...params
    }
  })
}


export const removeInOut = (ids) => {
  return request({
    url: '/api/ms-ficm/attendancerecord/remove',
    method: 'post',
    params: {
    	ids,
    }
  })
}

//实时进出
export const inAndOutByDayList = (params) => {
  return request({
    url: '/api/ms-ficm/attendancerecord/getList',
    method: 'get',
    params: {
      ...params
    }
  })
}
//实时考勤
export const workByDayList = (params) => {
  return request({
    url: '/api/ms-ficm/attendancerecord/getList',
    method: 'get',
    params: {
      ...params
    }
  })
}
