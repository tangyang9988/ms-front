import request from '@/router/axios';

export const getReport = (siteInfoId, type, time) => {
    return request({
        url: '/api/ms-airq/statreport22/getReport',
        method: 'get',
        params: {
            siteInfoId,
            type,
            time
        }
    })
}
export const getWind = (siteInfoId, type, time) => {
    return request({
        url: '/api/ms-airq/statreport22/getWind',
        method: 'get',
        params: {
            siteInfoId,
            type,
            time
        }
    })
}


