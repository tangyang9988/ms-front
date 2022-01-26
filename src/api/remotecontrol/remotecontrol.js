import request from '@/router/axios';

export const getList = (params) => {
    return request({
        url: '/api/squirrel-service/reverseControl/getList',
        method: 'get',
        params:{...params}
    })
}


export const getMnBySiteInfoId = (id) => {
    return request({
        url: '/api/squirrel-service/reverseControl/getMnBySiteInfoId',
        method: 'get',
        params:{id}
    })
}




// 获取MN列表
export const getMNList = () => {
    return request({
        url: '/api/squirrel-service/reverseControl/getMNList',
        method: 'get',
    })
}

// 获取智控分类列表
export const getControlTypeList = () => {
    return request({
        url: '/api/blade-system/dict/dictionary?code=remote_control_type',
        method: 'get',
    })
}

// 获取设备类型列表
export const getDeviceTypeList = (rtuMN) => {
    return request({
        url: '/api/squirrel-service/reverseControl/getFactorListByMn',
        method: 'get',
        params: {
            rtuMN
        }
    })
}

// 数采仪设备校时
export const updateRtuTime = (siteInfoId,rtuMN, systemTime) => {
    return request({
        url: '/api/squirrel-service/reverseControl/updateRtuTime',
        method: 'post',
        params: {
        	siteInfoId,
            rtuMN,
            systemTime
        }
    })
}

// 设备设备校时
export const updateDeviceTime = (siteInfoId,rtuMN, polId,systemTime) => {
    return request({
        url: '/api/squirrel-service/reverseControl/updateDeviceTime',
        method: 'post',
        params: {
        	siteInfoId,
            rtuMN,
            polId,
            systemTime
        }
    })
}

// 留样立即留样
export const executeSample = (siteInfoId,rtuMN) => {
    return request({
        url: '/api/squirrel-service/reverseControl/executeSample',
        method: 'post',
        params: {
        	siteInfoId,
            rtuMN
        }
    })
}

// 测量立即测量
export const executeMeasure = (siteInfoId,rtuMN, polIds) => {
    return request({
        url: '/api/squirrel-service/reverseControl/executeMeasure',
        method: 'post',
        params: {
        	siteInfoId,
            rtuMN,
            polIds
        }
    })
}