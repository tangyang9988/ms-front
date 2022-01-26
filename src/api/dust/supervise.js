import request from '@/router/axios';

export const getWeatherMini = (city) => {
    return request({
        url: `/api/squirrel-service/Index/getWeather`,
        method: 'get'
    })
}

export const getData = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getRealTime`,
        method: 'get'
    })
}


export const getEnvironWarning = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getEnvironWarning`,
        method: 'get'
    })
}


export const getHighWarning = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getHighWarning`,
        method: 'get'
    })
}

export const getStaffTrends = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getStaffTrends`,
        method: 'get'
    })
}

export const getAttendanceStatistics = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getAttendanceStatistics`,
        method: 'get'
    })
}
export const getNotices = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getNotices`,
        method: 'get'
    })
}

export const getBuildingSiteCycle = () => {
    return request({
        url: `/api/squirrel-dust/todayBuildingSite/getBuildingSiteCycle`,
        method: 'get'
    })
}



export const devicematerialdata = () => {
    return request({
        url: `/api/squirrel-dust/devicematerialdata/getRealTimeData`,
        method: 'get'
    })
}


export const deviceelevatordata = () => {
    return request({
        url: `/api/squirrel-dust/deviceelevatordata/getRealTimeData`,
        method: 'get'
    })
}

export const devicetowerdata = () => {
    return request({
        url: `/api/squirrel-dust/devicetowerdata/getRealTimeData`,
        method: 'get'
    })
}


export const getTwentyFourWarning = () => {
    return request({
        url: `/api/squirrel-dust/highriskMonitor/getTwentyFourWarning`,
        method: 'get'
    })
}


export const getRealTimeOnlineRate = () => {
    return request({
        url: `/api/squirrel-dust/highriskMonitor/getRealTimeOnlineRate`,
        method: 'get'
    })
}


