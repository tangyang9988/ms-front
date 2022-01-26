import request from '@/router/axios';

// 站点信息
export const getSites = () => {
  return request({
    url: '/api/ms-ficm/siteinfo/getSites',
    method: 'get',
  })
}
// 空气质量等级分布
export const getDatesOfLevels = (siteInfoId) => {
  return request({
    url: '/api/squirrel-airq/index/getDatesOfLevels',
    method: 'get',
    params: {
      siteInfoId
    }
  })
}
// 区域排名 /squirrel-airq/index/seqencing
export const getSeqencing = (code) => {
  return request({
    url: '/api/squirrel-airq/index/seqencing',
    method: 'get',
    params: {
      code
    }
  })
}
// 实时空气质量汇总
export const getDeptAqi = () => {
  return request({
    url: '/api/squirrel-airq/index/getDeptAqi',
    method: 'get',
  })
}
// 最新30日AQI
export const getQualityData = (siteInfoId) => {
  return request({
    url: '/api/squirrel-airq/index/getQualityData',
    method: 'get',
    params: {
      siteInfoId
    }
  })
}

// 最新本月AQI
export const getThisMonthData = (siteInfoId) => {
  return request({
    url: '/api/squirrel-airq/index/getThisMonthData',
    method: 'get',
    params: {
      siteInfoId
    }
  })
}



// 环境评级
export const getTableData = () => {
  return request({
    url: '/api/squirrel-airq/index/getTableData',
    method: 'get',
  })
}

// 环境监测（实时）
export const getLatestData = () => {
  return request({
    url: '/api/squirrel-airq/index/getLatestData',
    method: 'get',
  })
}



// 环境监测（小时）
export const getHourData = () => {
  return request({
    url: '/api/squirrel-airq/index/getHourData',
    method: 'get',
  })
}
