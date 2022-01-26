import request from '@/router/axios';
// 轮播
export const getBanner = () => {
  return request({
    url: '/api/ms-airq/collectiondatalatest/getBanner',
    method: 'get',
  })
}
// 固定标站
export const getStationFactors = () => {
  return request({
    url: '/api/ms-airq/stat/getFactorCode',
    method: 'get',
  })
}
//获取标站下拉框数据
export const getStatSite = () => {
  return request({
    url: '/api/ms-airq/stat/getStatSite',
    method: 'get',
  })
}
export const getStationMapData = (factorCode,type, time) => {
  return request({
    url: '/api/ms-airq/stat/getMapDate',
    method: 'get',
    params: {
      factorCode,
      type,
      time,
    }
  })
}
export const getPollutionRank = (desc,type, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/stat/getRankList',
    method: 'get',
    params: {
      desc,
      type,
      time,
      factorCode,
      current,
      size
    }
  })
}
export const getDustSourceRanking = (desc,type, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/fixedsite/getDustSourceRanking',
    method: 'get',
    params: {
      desc,
      type,
      time,
      factorCode,
      current,
      size
    }
  })
}
// 全部移动微站自排名
export const getAllMobileSiteRank = (desc,type, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/mobilesite/getAllMobileSiteRank',
    method: 'get',
    params: {
      desc,
      type,
      time,
      factorCode,
      current,
      size
    }
  })
}
// 全部固定微站自排名
export const getAllFixedSiteRankList = (desc,nSize,type, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/fixedsite/getAllFixedSiteRankList',
    method: 'get',
    params: {
      desc,
      nSize,
      type,
      time,
      factorCode,
      current,
      size
    }
  })
}
export const getAroundSite = (distance,factorCode,type, time, lgt, lat) => {
  return request({
    url: '/api/ms-airq/stat/getAroundSite',
    method: 'get',
    params: {
      distance,
      factorCode,
      type,
      time,
      lgt,
      lat
    }
  })
}

export const getFixedSiteFactors = () => {
  return request({
    url: '/api/ms-airq/fixedsite/getFixedSiteFactors',
    method: 'get',
  })
}
export const getMobilesiteFactors = () => {
  return request({
    url: '/api/ms-airq/mobilesite/getMobileSiteFactors',
    method: 'get',
  })
}
export const getMobileSiteCount = () => {
  return request({
    url: '/api/ms-airq/mobilesite/getMobileSiteCount',
    method: 'get',
  })
}


export const getYunPMCode = () => {
  return request({
    url: '/api/ms-airq/stat/getPMCode',
    method: 'get',
  })
}
export const getWeMapData = (timeType, code, time) => {
  return request({
    url: '/api/ms-airq/fixedsite/getMapData',
    method: 'get',
    params: {
      timeType,
      code,
      time,
    }
  })
}
export const getMobilesiteData = (timeType, code, time,current,size) => {
  return request({
    url: '/api/ms-airq/mobilesite/getMapData',
    method: 'get',
    params: {
      timeType,
      code,
      time,
      current,
      size
    }
  })
}
export const getVehicleList = (factorCode) => {
  return request({
    url: '/api/ms-airq/latestData/getVehicleList',
    method: 'get',
    params: {
      factorCode
    }
  })
}

export const getAlertList = (current, size, params, mn, time,factorCode) => {
  return request({
    url: '/api/ms-airq/fixedsite/getAlertList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      mn,
      time,
      factorCode
    }
  })
}
export const getMobileAlertList = (current, size, params, mn, time,factorCode) => {
  return request({
    url: '/api/ms-airq/mobilesite/getAlertList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      mn,
      time,
      factorCode
    }
  })
}

export const getTypes = () => {
  return request({
    url: '/api/ms-airq/fixedsite/getAlertList',
    method: 'get',
  })
}
export const getTimeList = () => {
  return request({
    url: '/api/ms-airq/statreport22/getTypes',
    method: 'get',
  })
}
export const getAreaRank = (desc,timeType, rankType, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/statreport22/getAreaRank',
    method: 'get',
    params: {
      desc,
      timeType,
      rankType,
      time,
      factorCode,
      current,
      size
    }
  })
}
//道路排名
export const getRoadRank = (desc,type, time, factorCode, current, size) => {
  return request({
    url: '/api/ms-airq/mobilesite/getRoadRank',
    method: 'get',
    params: {
      desc,
      type,
      time,
      factorCode,
      current,
      size
    }
  })
}

//获取微站站点详情
export const getMobileSiteDetail = (time,timeType,siteInfoId) => {
  return request({
    url: '/api/ms-airq/mobilesite/getMobileSiteData',
    method: 'get',
    params: {
      time,
      timeType,
      siteInfoId
    }
  })
}
//标站站点详情
export const getBzPonitDetail = (stationCode,time,type) => {
  return request({
    url: '/api/ms-airq/stat/getStatLine',
    method: 'get',
    params: {
      stationCode,
      time,
      type
    }
  })
}
//固定微站排名
export const getStatAroundSiteRankList = (time,type,factorCode,desc,distance,id,current,size) => {
  return request({
    url: '/api/ms-airq/fixedsite/getStatAroundSiteRankList',
    method: 'get',
    params: {
      time,
      type,
      factorCode,
      desc,
      distance,
      id,
      current,
      size
    }
  })
}
//移动微站排名
export const getMobileSiteRank = (time,type,factorCode,desc,distance,current,size) => {
  return request({
    url: '/api/ms-airq/mobilesite/getMobileSiteRank',
    method: 'get',
    params: {
      time,
      type,
      factorCode,
      desc,
      distance,
      current,
      size
    }
  })
}
//固定微站排名
export const getAllStatAroundSiteRankList = (time,type,factorCode,desc,distance,current,size) => {
  return request({
    url: '/api/ms-airq/fixedsite/getAllStatAroundSiteRankList',
    method: 'get',
    params: {
      time,
      type,
      factorCode,
      desc,
      distance,
      current,
      size
    }
  })
}

