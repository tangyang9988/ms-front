import request from '@/router/axios.js';


// 获取预警数量
export const getAbnormalNum = () => {
  return request({
    url: '/api/squirrel-service/statistic/getAbnormalNum',
    method: 'get'
  })
}



export const getChinaMap2 = () => {
  return request({
    url: '/data/chinaMap2.json'
  })
}

// 获取企业分类数量
export const getDeptNum = () => {
  return request({
    url: '/api/squirrel-service/statistic/getDeptNum',
    method: 'get'
  })
}


// 获取预警事件
export const getAbnormalBoard = () => {
  return request({
    url: '/api/squirrel-service/statistic/getAbnormalBoard',
    method: 'get'
  })
}

// 获取异常事件
export const getAbnormalInformation = () => {
  return request({
    url: '/api/squirrel-service/statistic/getAbnormalInformation',
    method: 'get'
  })
}

// 运维看板
export const getMaintenance2 = () => {
	return request({
	    url: '/api/squirrel-service/statistic/getMaintenance',
	    method: 'get'
	})
}

//获取企业、设备、点位、用户数量
export const getNum2 = () => {
  return request({
    url: '/api/squirrel-service/statistic/getNum',
    method: 'get'
  })
}



//获取企业、设备、点位、用户数量
export const getNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getNum',
    method: 'get'
  })
}

// 获取数据总量
export const totoalNum = () => {
  return request({
    url: '/api/squirrel-service/statistic/getNum',
    method: 'get'
  })
}

//点位区域分布top10
export const getRegionDeptCount = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getRegionDeptCount',
    method: 'get'
  })
}

// 近一年接入企业与点位数累计
export const getDeptAndSiteNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getDeptAndSiteNum',
    method: 'get'
  })
}

// 城市分布
export const getCityDataSiteStatistics = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getCityDataSiteStatistics',
    method: 'get'
  })
}



// 客户行业分类
export const getIndustryNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getIndustryNum',
    method: 'get'
  })
}

// 异常事件看板
export const getAbnormalInfoNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getAbnormalInfoNum',
    method: 'get'
  })
}



// 近6个月运维看板
export const getMaintenance = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getMaintenance',
    method: 'get'
  })
}

// 企业热词
export const getHotNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getHotNum',
    method: 'get'
  })
}

// 获取水污染企业、地表水点位的数量
export const getWaterNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getWaterNum',
    method: 'get'
  })
}


// 获取水污染源国控、省控、市控数量 
export const getPsoa32Data = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getPsoa32Data',
    method: 'get'
  })
}


// 获取地表水水国控、省控、市控数量
export const getSwapData = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapData',
    method: 'get'
  })
}

// 获取水污染、地表水企业具体因子数据 /squirrel-service/dataStatistics/getWaterData
export const getWaterData = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getWaterData',
    method: 'get'
  })
}



// 水质等级占比
export const getSwapCityNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapCityNum',
    method: 'get'
  })
}


// 污染源区域占比
export const getPsoaCityNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getPsoaCityNum',
    method: 'get'
  })
}

// 各区水质等级点位分布
export const getSwapLevelData = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapLevelData',
    method: 'get'
  })
}


// 考核点水质优Ⅲ类占比
export const getSwapThreeTypeNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapThreeTypeNum',
    method: 'get'
  })
}

// 考核点污染因子
export const getSwapLatestData = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapLatestData',
    method: 'get'
  })
}


// 考核点年度水质等级变化情况
export const getSwapThisYearLevel = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getSwapThisYearLevel',
    method: 'get'
  })
}



// 获取空气、扬尘、大气污染、餐饮油烟点位的数量
export const getAirNum = () => {
  return request({
    url: '/api/squirrel-service/dataStatistics/getAirNum',
    method: 'get'
  })
}



// 各地优良天数排名 
export const getAirDaysSort = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAirDaysSort',
    method: 'get'
  })
}


// 空气质量排名
export const getAirLevel = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAirLevel',
    method: 'get'
  })
}


// 获取其他空气gis数据
export const getOtherAirGisData = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getOtherAirGisData',
    method: 'get'
  })
}



// 获取其他空气gis数据
export const getAirGisData = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAirGisData',
    method: 'get'
  })
}



// aqi月历图 
export const getThisMouthAqiData = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getThisMouthAqiData',
    method: 'get'
  })
}

// 获取当前点位
export const getThisYearGoodDays = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getThisYearGoodDays',
    method: 'get'
  })
}

// aqi雷达图
export const getAqiRadar = () => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAqiRadar',
    method: 'get'
  })
}

// 点位区域统计
export const getAirCityNum = (st) => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAirCityNum',
    method: 'get',
    params:{
    	st
    }
  })
}

// 获取空气站点国控、省控、市控数量
export const getAirData = (st) => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getAirData',
    method: 'get',
    params:{
    	st
    }
  })
}

// 获取油烟在线、达标、联动比
export const getLoamData = (st) => {
  return request({
    url: '/api/squirrel-airq/dataStatistics/getLoamData',
    method: 'get',
    params:{
    	st
    }
  })
}
