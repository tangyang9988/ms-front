import request from '@/router/axios';

//区域选择
export const getListByRegionCode = (regionCode) => {
    return request({
        url: '/api/ms-ficm/region/getListByRegionCode',
        method: 'get',
        params: {
            regionCode
        }
    })
    
}
//区域树
export const getRegionTree = (treeType) => {
    return request({
        url: '/api/ms-ficm/siteinfo/getRegionTree',
        method: 'get',
        params:{
            treeType
        }
    })
    
}
//折线图
export const getLine = (regionCode, time, factorCode, type) => {
    return request({
        url: '/api/ms-airq/statreport22/getLine',
        method: 'get',
        params: {
            regionCode,
            time,
            factorCode,
            type
        }
    })
}
//列表
export const getList = (regionCode, time, current, size) => {
    return request({
        url: '/api/ms-airq/statreport22/getList',
        method: 'get',
        params: {
            regionCode,
            time,
            current,
            size
        }
    })
}
