let str = './widgets/'
// 今日工地首页
const weather = () => import(str + 'weather-custom.vue')                  // 实时天气控件
const environmental = () => import(str + 'environmental-custom.vue')      // 实时环境指数
const earlyWarning = () => import(str + 'earlyWarning-custom.vue')        // 环境预警
const highWarning = () => import(str + 'highWarning-custom.vue')          // 高危预警
const peopleDynamic = () => import(str + 'peopleDynamic-echartsPie.vue')  // 人员动态
const checkWork = () => import(str + 'checkWork-custom.vue')              // 考勤统计
const notice = () => import(str + 'notice-tabel.vue')                     // 公告栏
const workMap = () => import(str + 'workMap-map.vue')                     // 工地地图
const plan = () => import(str + 'plan.vue')                               // 工地平面图

// 高危监管首页
const unloading = () => import(str + 'unloading-tabel.vue')               // 卸料机监测
const tower = () => import(str + 'tower-tabel.vue')                       // 塔吊机监测
const elevator = () => import(str + 'elevator-tabel.vue')                 // 升降机监测
const time = () => import(str + 'time-tabel.vue')                         // 24h预警
const operator = () => import(str + 'operator-tabel.vue')                 // 操作员识别
const onLine = () => import(str + 'onLine-echartsPie.vue')                // 实时在线率
const towerMonitoring = () => import(str + 'towerMonitoring-custom.vue')  // 塔吊机模型图

// 环境监测首页
const pm2Line = () => import(str + 'monitorPM2-echartsLine.vue')          // PM2.5监测
const pm10Line = () => import(str + 'monitorPM10-echartsLine.vue')        // PM10监测
const dustfallTable = () => import(str + 'dustfall-table')                // 降尘控制
const warningTable = () => import(str + 'warning-table.vue')              // 预警记录
const tspLine = () => import(str + 'monitorTSP-echartsLine.vue')          // TSP监测
const monitorNoseLine = () => import(str + 'monitorNoise-echartsLine.vue')// 噪音监测

// 人员管理首页
const job = () => import(str + 'job-echartsBar.vue')                      // 工种统计
const statistics = () => import(str + 'statistics-custom.vue')            // 人员统计
const access = () => import(str + 'access-tabel.vue')                     // 进出状态
const pass = () => import(str + 'pass-tabel.vue')                         // 人员实时过闸信息
const station = () => import(str + 'station-echartsPie.vue')              // 工作岗位统计
const check = () => import(str + 'check-echartsPie.vue')                  // 考勤分布

// 信息舱
const baiduMap = () => import(str + 'baiduMap-map.vue')                      // 百度GIS地图
const yearWqiColumn = () => import(str + 'yearWqi-echartsBar.vue')           // 全年水质等级
const dataValidPie = () => import(str + 'datavalid-echartsPie.vue')          // 全年数据传输有效性
const yearAbnormalColumn = () => import(str + 'yearAbnormal-echartsBar.vue') // 全年超标数量
const monthWqiPie = () => import(str + 'monthWqi-echartsPie.vue')            // 当月水质等级
const monthWqiLine = () => import(str + 'monthWqi-echartsLine.vue')          // 当月水质趋势
const siteMonitorTable = () => import(str + 'siteMonitor-table.vue')         // 站点时报
const currentWqiColumn = () => import(str + 'currentWqi-echartsBar.vue')     // 当月站点统计
const worstSite = () => import(str + 'worst-echartsBar.vue')                 // 当月最差站点排名
const indicator = () => import(str + 'indicator-echartsBar.vue')             // 当月评价指标断面超标率


// 地表水个人首页(这边路径名字写错了 暂时不替换)
const swaqIndexBaiduMap = () => import(str + 'swaqIndexBaiduMap-map.vue')               // 地表水首页百度GIS地图
const swaqIndexYearWqiColumn = () => import(str + 'swaqIndexYearWqi-echartsBar.vue')    // 地表水首页全年水质等级
const swaqDataValidPie = () => import(str + 'swaqDatavalid-echartsPie.vue')             // 地表水首页全年数据传输有效性
const swaqYearAbnormalColumn = () => import(str + 'swaqYearAbnormal-echartsBar.vue')    // 地表水首页全年超标数量
const swaqMonthWqiPie = () => import(str + 'swaqMonthWqi-echartsPie.vue')               // 地表水首页当月水质等级
const swaqSiteMonitorTable = () => import(str + 'swaqSiteMonitor-table.vue')            // 地表水首页站点时报
const swaqSiteMonitorTable2 = () => import(str + 'swaqSiteMonitor-table2.vue')          // 地表水首页站点时报(滚动)
const swaqCurrentWqiColumn = () => import(str + 'swaqCurrentWqi-echartsBar.vue')        // 地表水首页当月站点统计
const swaqMonthWqiLine = () => import(str + 'swaqMonthWqi-echartsLine.vue')             // 地表水首页当月水质趋势
const swaqIndicator = () => import(str + 'swaqIndicator-echartsBar.vue')                // 地表水首页当月评价指标断面超标率


// VOC环境监测首页
const vocAbnormalColumn = () => import(str + 'vocAbnormal-custom.vue')				// VOC异常状况
const vocCompanyBar = () => import(str + 'vocCompany-echartsBar.vue')					// VOC排污企业分布
const vocBaiduMap = () => import(str + 'vocBaiduMap-map.vue')							// VOC百度地图GIS地图
const vocMonitorTable = () => import(str + 'vocMonitoring-table.vue')					// VOC实时监测
const vocMonitorTable2 = () => import(str + 'vocMonitoring-table2.vue')					// VOC实时监测(滚动)
const vocCompanyStatusPie = () => import(str + 'vocComCondition-echartsPie.vue')		// VOC排污企业现状
const vocCompanyTypePie = () => import(str + 'vocComType-echartsPie.vue')				// VOC排污企业类型

// VOC环境监测信息仓
const vocBigAbnormalColumn = () => import(str + 'vocBigAbnormal-custom.vue')				        // VOC信息仓异常状况
const vocBigCompanyBar = () => import(str + 'vocBigCompany-echartsBar.vue')					      // VOC信息仓排污企业分布
const vocBigBaiduMap = () => import(str + 'vocBigBaiduMap-map.vue')							          // VOC信息仓百度地图GIS地图
const vocBigMonitorTable = () => import(str + 'vocBigMonitoring-table.vue')					      // VOC信息仓实时监测
const vocBigCompanyStatusPie = () => import(str + 'vocBigComCondition-echartsPie.vue')		  // VOC信息仓排污企业现状
const vocBigCompanyTypePie = () => import(str + 'vocBigComType-echartsPie.vue')				    // VOC信息仓排污企业类型

// 地表水体环境污染源监测系统首页
const psoa32AbnormalColumn = () => import(str + 'psoa32Abnormal-custom.vue')    // 地表水体异常状况
const psoa32CompanyBar = () => import(str + 'psoa32Company-echartsBar.vue')     // 地表水体排污企业分布
const psoa32BaiduMap = () => import(str + 'psoa32BaiduMap-map.vue')							// 地表水体百度地图GIS地图
const psoa32MonitorTable = () => import(str + 'psoa32Monitoring-table.vue')     // 地表水体实时监测
const psoa32MonitorTable2 = () => import(str + 'psoa32Monitoring-table2.vue')   // 地表水体实时监测(滚动)

// 地表水体环境污染源监测系统信息仓
const psoa32BigAbnormalColumn = () => import(str + 'psoa32BigAbnormal-custom.vue')  // 地表水体信息仓异常状况
const psoa32BigCompanyBar = () => import(str + 'psoa32BigCompany-echartsBar.vue')   // 地表水体信息仓排污企业分布
const psoa32BigBaiduMap = () => import(str + 'psoa32BigBaiduMap-map.vue')           // 地表水体信息仓百度地图GIS地图
const psoa32BigMonitorTable = () => import(str + 'psoa32BigMonitoring-table.vue')   // 地表水体信息仓实时监测

// 餐饮油烟监控管理系统个人首页
const loamAbnormalColumn = () => import(str + 'loamAbnormal-custom.vue')              // 餐饮油烟首页预警状况
const loamStandardRateBar = () => import(str + 'loamStandardRate-echartsBar.vue')     // 餐饮油烟首页达标率区域排名
const loamAreaDivisionBar = () => import(str + 'loamAreaDivision-echartsBar.vue')     // 餐饮油烟首页区域分布
const loamGovernanceRatePie = () => import(str + 'loamGovernanceRate-echartsPie.vue') // 餐饮油烟首页治理评级
const loamGovernanceRatePieZM = () => import(str + 'loamGovernanceRateZM-echartsPie.vue') // 餐饮油烟首页治理评级（A/B/C/D）
const loamBaiduMap = () => import(str + 'loamBaiduMap-map.vue')                       // 餐饮油烟首页地图
const loamRealtimeMonitorTable = () => import(str + 'loamRealtimeMonitor-table.vue')    // 餐饮油烟首页实时监测(合并滚动)
const loamRealtimeMonitorTable2 = () => import(str + 'loamRealtimeMonitor-table2.vue')  // 餐饮油烟首页实时监测(非合并轮播)
const loamRealtimeMonitorTable3 = () => import(str + 'loamRealtimeMonitor-table3.vue')  // 餐饮油烟首页实时监测(合并滚动且无排口)
const loamRealtimeMonitorTable4 = () => import(str + 'loamRealtimeMonitor-table4.vue')  // 餐饮油烟首页实时监测(非合并轮播且无排口)

// 餐饮油烟监控管理系统信息仓
const loamBigTitle = () => import(str + 'loamBigTitle.vue')                                 // 餐饮油烟信息仓标题
const loamAreaRankBar = () => import(str + 'loamAreaRank-echartsBar.vue')
const loamAreaRankBar1 = () => import(str + 'loamBigAreaRank-echartsBar.vue')                   // 餐饮油烟信息仓区域排名
const loamAlertType = () => import(str + 'loamBigAlertType-echartsRadar.vue')
const loamMonitorEquipmentOverview = () => import(str + 'loamMonitorEquipmentOverview-table.vue')
const loamSupervisionOverview = () => import(str + 'loamSupervisionOverview-custom.vue')
const loamSupervisionOverviewPie = () => import(str + 'loamSupervisionOverview-echartsPie.vue')
const loamCompanyRankColumn = () => import(str + 'loamCompanyRank-custom.vue')              // 餐饮油烟信息仓企业排名
const loamCompanyRankColumn1 = () => import(str + 'loamBigCompanyRank-custom.vue')
const loamBigBaiduMap = () => import(str + 'loamBigBaiduMap-map.vue')                       // 餐饮油烟信息仓地图
const loamBigGovernanceRatePie = () => import(str + 'loamBigGovernanceRate-echartsPie.vue') // 餐饮油烟信息仓治理评级
const loamBigGovernanceRatePieZM = () => import(str + 'loamBigGovernanceRateZM-echartsPie.vue') // 餐饮油烟信息仓治理评级（A/B/C/D）
const loamBigAbnormalPie = () => import(str + 'loamAbnormal-echartsPie.vue')                // 餐饮油烟信息仓预警情况
const loamBigRealtimeTable = () => import(str + 'loamBigRealtimeMonitor-table.vue')         // 餐饮油烟信息仓实时监测(合并滚动)
const loamBigRealtimeTable2 = () => import(str + 'loamBigRealtimeMonitor-table2.vue')       // 餐饮油烟信息仓实时监测(非合并轮播)
const loamBigRealtimeTable3 = () => import(str + 'loamBigRealtimeMonitor-table3.vue')       // 餐饮油烟信息仓实时监测(合并滚动且无排口)
const loamBigRealtimeTable4 = () => import(str + 'loamBigRealtimeMonitor-table4.vue')       // 餐饮油烟信息仓实时监测(非合并轮播且无排口)
const loamBigRealtimeTable5 = () => import(str + 'loamBigRealtimeMonitor-table5.vue')       // 餐饮油烟信息仓实时监测(非合并轮播且无因子)
// type 2 代表 表示个人首页（所有系统的个人首页都是2）

// 空气智能监管系统首页
const airqQualityGradePie = () => import(str + 'airqQualityGrade-echartsPie')//空气智能监管系统首页 空气质量等级分布
const airqAreaRanking = () => import(str + 'airqAreaRanking-Bar')//空气智能监管系统首页 实时站点因子浓度排名
const airqCurrentQuality = () => import(str + 'airqCurrentQuality-echartsBar')//空气智能监管系统首页 实时空气质量汇总
const airqNewestAQI = () => import(str + 'airqNewestAQI-custom')//空气智能监管系统首页 最新30日AQI
const airqNewestAQI2 = () => import(str + 'airqNewestAQI-custom2')//空气智能监管系统首页 当月AQI
const airqTable = () => import(str + 'airqTable-Table')//空气智能监管系统首页 环境监测
const airqTable2 = () => import(str + 'airqTable-Table2')//空气智能监管系统首页 环境监测(小时)
const airqTable3 = () => import(str + 'airqTable-Table3')//空气智能监管系统首页 环境监测(实时)

// 空气智能监管信息舱
const airqBigQualityGradePie = () => import(str + 'airqBigQualityGrade-echartsPie')//空气智能监管系统信息 空气质量等级分布
const airqBigAreaRanking = () => import(str + 'airqBigAreaRanking-Bar')//空气智能监管系统信息 实时站点因子浓度排名
const airqBigCurrentQuality = () => import(str + 'airqBigCurrentQuality-echartsBar')//空气智能监管系统信息 实时空气质量汇总
const airqBigNewestAQI = () => import(str + 'airqBigNewestAQI-custom')//空气智能监管系统信息 最新30日AQI
const airqBigNewestAQI2 = () => import(str + 'airqBigNewestAQI-custom2')//空气智能监管系统信息 当月AQI
const airqBigTable = () => import(str + 'airqBigTable-Table')//空气智能监管系统信息 环境监测
const airqBigTable2 = () => import(str + 'airqBigTable-Table2')//空气智能监管系统信息 环境监测(小时)
const airqBigTable3 = () => import(str + 'airqBigTable-Table3')//空气智能监管系统信息 环境监测(实时)

// 重点环境空气监测系统首页
const evocRealtimeMonitorTable = () => import(str + 'evocRealtimeMonitor-table.vue')  // 实时监测

// 污染源治理过程监控 系统
const pscp52RealData=  () => import(str + 'pscp52RealData-table.vue')



export default [
  {
    title: 'swaqIndex',
    name: '地表水个人首页',
    type: '2',
    system: 21,
    widgets: {
      Map: {c: swaqIndexBaiduMap, n: "GIS地图"},
      YearWqiColumn: {c: swaqIndexYearWqiColumn, n: "全年水质等级"},
      DataValidPie: {c: swaqDataValidPie, n: "全年数据传输有效性"},
      YearAbnormalColumn: {c: swaqYearAbnormalColumn, n: "全年超标数量"},
      MonthWqiPie: {c: swaqMonthWqiPie, n: "当月水质等级"},
      MonthWqiLine: {c: swaqMonthWqiLine, n: "当月水质趋势"},
      SiteMonitorTable: {c: swaqSiteMonitorTable, n: "站点时报"},
      SiteMonitorTable2: {c: swaqSiteMonitorTable2, n: "站点时报(滚动)"},
      CurrentWqiColumn: {c: swaqCurrentWqiColumn, n: "当月站点统计"},
      Indicator: {c: swaqIndicator, n: "当月评价指标断面超标率"}
    },
    defaultLayout: [
      {"i": 0, "x": 3, "y": 0, "w": 5, "h": 8, "c": "Map", "o": {}},
      {"i": 1, "x": 8, "y": 8, "w": 4, "h": 5, "c": "MonthWqiLine", "o": {}},
      {"i": 2, "x": 8, "y": 0, "w": 4, "h": 4, "c": "YearAbnormalColumn", "o": {}},
      {"i": 3, "x": 8, "y": 4, "w": 4, "h": 4, "c": "DataValidPie", "o": {}},
      {"i": 4, "x": 0, "y": 4, "w": 3, "h": 4, "c": "MonthWqiPie", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 8, "h": 5, "c": "SiteMonitorTable", "o": {}},
      {"i": 6, "x": 0, "y": 0, "w": 3, "h": 4, "c": "YearWqiColumn", "o": {}}
    ]
  },
  {
    title: 'dustIndex',
    name: '扬尘个人首页',
    type: '2',
    system: 39,
    widgets: {
      weather: {c: weather, n: '实时天气'},
      environmental: {c: environmental, n: '实时环境指数'},
      earlyWarning: {c: earlyWarning, n: '环境预警'},
      highWarning: {c: highWarning, n: '高危预警'},
      dustfallTable: {c: dustfallTable, n: '降尘控制'},
      warningTable: {c: warningTable, n: '预警记录'},
      notice: {c: notice, n: '公告栏'},
      workMap: {c: workMap, n: 'GIS地图'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "weather", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "environmental", "o": {}},
      {"i": 2, "x": 0, "y": 8, "w": 3, "h": 5, "c": "earlyWarning", "o": {}},
      {"i": 3, "x": 3, "y": 0, "w": 5, "h": 8, "c": "workMap", "o": {}},
      {"i": 4, "x": 3, "y": 8, "w": 5, "h": 5, "c": "highWarning", "o": {}},
      {"i": 5, "x": 8, "y": 0, "w": 4, "h": 4, "c": "dustfallTable", "o": {}},
      {"i": 6, "x": 8, "y": 4, "w": 4, "h": 4, "c": "warningTable", "o": {}},
      {"i": 7, "x": 8, "y": 8, "w": 4, "h": 5, "c": "notice", "o": {}}
    ]
  },
  {
    title: 'informationCabin',
    name: '信息舱',
    type: '1',
    system: 21,
    widgets: {
      Map: {c: baiduMap, n: "GIS地图"},
      YearWqiColumn: {c: yearWqiColumn, n: "全年水质等级"},
      DataValidPie: {c: dataValidPie, n: "全年数据传输有效性"},
      YearAbnormalColumn: {c: yearAbnormalColumn, n: "全年超标数量"},
      MonthWqiPie: {c: monthWqiPie, n: "当月水质等级"},
      MonthWqiLine: {c: monthWqiLine, n: "当月水质趋势"},
      SiteMonitorTable: {c: siteMonitorTable, n: "站点时报"},
      CurrentWqiColumn: {c: currentWqiColumn, n: "当月站点统计"},
      worstSite: {c: worstSite, n: '当月最差站点排名'},
      indicator: {c: indicator, n: '当月评价指标断面超标率'}
    },
    defaultLayout: [
      {"i": 0, "x": 3, "y": 0, "w": 5, "h": 8, "c": "Map", "o": {}},
      {"i": 1, "x": 8, "y": 8, "w": 4, "h": 5, "c": "MonthWqiLine", "o": {}},
      {"i": 2, "x": 8, "y": 0, "w": 4, "h": 4, "c": "YearAbnormalColumn", "o": {}},
      {"i": 3, "x": 8, "y": 4, "w": 4, "h": 4, "c": "DataValidPie", "o": {}},
      {"i": 4, "x": 0, "y": 4, "w": 3, "h": 4, "c": "MonthWqiPie", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 8, "h": 5, "c": "SiteMonitorTable", "o": {}},
      {"i": 6, "x": 0, "y": 0, "w": 3, "h": 4, "c": "YearWqiColumn", "o": {}}
    ]
  },
  {
    title: 'todayConstruction',
    name: '今日工地首页',
    type: '3',
    system: 39,
    widgets: {
      weather: {c: weather, n: '实时天气'},
      environmental: {c: environmental, n: '实时环境指数'},
      earlyWarning: {c: earlyWarning, n: '环境预警'},
      highWarning: {c: highWarning, n: '高危预警'},
      dustfallTable: {c: dustfallTable, n: '降尘控制'},
      warningTable: {c: warningTable, n: '预警记录'},
      notice: {c: notice, n: '公告栏'},
      workMap: {c: workMap, n: 'GIS地图'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "weather", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "environmental", "o": {}},
      {"i": 2, "x": 0, "y": 8, "w": 3, "h": 5, "c": "earlyWarning", "o": {}},
      {"i": 3, "x": 3, "y": 0, "w": 5, "h": 8, "c": "workMap", "o": {}},
      {"i": 4, "x": 3, "y": 8, "w": 5, "h": 5, "c": "highWarning", "o": {}},
      {"i": 5, "x": 8, "y": 0, "w": 4, "h": 4, "c": "dustfallTable", "o": {}},
      {"i": 6, "x": 8, "y": 4, "w": 4, "h": 4, "c": "warningTable", "o": {}},
      {"i": 7, "x": 8, "y": 8, "w": 4, "h": 5, "c": "notice", "o": {}}
    ]
  },
  {
    title: 'highRiskRegulation',
    name: '高危监管首页',
    type: '5',
    system: 39,
    widgets: {
      unloading: {c: unloading, n: '卸料机监测'},
      elevator: {c: elevator, n: '升降机监测'},
      tower: {c: tower, n: '塔吊机监测'},
      time: {c: time, n: '24h预警'},
      operator: {c: operator, n: '操作员识别'},
      onLine: {c: onLine, n: '实时在线率'},
      towerMonitoring: {c: towerMonitoring, n: '塔吊机'},
      station: {c: station, n: '工作岗位'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 5, "h": 4, "c": "unloading", "o": {}},
      {"i": 1, "x": 5, "y": 0, "w": 4, "h": 4, "c": "onLine", "o": {}},
      {"i": 2, "x": 9, "y": 0, "w": 3, "h": 6, "c": "station", "o": {}},
      {"i": 3, "x": 0, "y": 4, "w": 5, "h": 4, "c": "elevator", "o": {}},
      {"i": 4, "x": 0, "y": 8, "w": 5, "h": 5, "c": "tower", "o": {}},
      {"i": 5, "x": 5, "y": 4, "w": 4, "h": 9, "c": "towerMonitoring", "o": {}},
      {"i": 6, "x": 9, "y": 6, "w": 3, "h": 7, "c": "time", "o": {}}
    ]
  },
  {
    title: 'personnelManagement',
    name: '人员管理首页',
    type: '6',
    system: 39,
    widgets: {
      job: {c: job, n: '工种统计'},
      access: {c: access, n: '进出状态'},
      statistics: {c: statistics, n: '人员统计'},
      pass: {c: pass, n: '人员实时过闸信息'},
      station: {c: station, n: '工作岗位'},
      check: {c: check, n: '考勤分布'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 7, "c": "pass", "o": {}},
      {"i": 1, "x": 3, "y": 0, "w": 6, "h": 5, "c": "statistics", "o": {}},
      {"i": 2, "x": 9, "y": 0, "w": 3, "h": 7, "c": "check", "o": {}},
      {"i": 3, "x": 0, "y": 10, "w": 3, "h": 7, "c": "station", "o": {}},
      {"i": 4, "x": 3, "y": 10, "w": 6, "h": 9, "c": "access", "o": {}},
      {"i": 5, "x": 9, "y": 2, "w": 3, "h": 7, "c": "job", "o": {}}
    ]
  },
  {
    title: 'environmentalMonitoring',
    name: '环境监测首页',
    type: '4',
    system: 39,
    widgets: {
      weather: {c: weather, n: '实时天气'},
      pm2Line: {c: pm2Line, n: 'pm2.5监测'},
      pm10Line: {c: pm10Line, n: 'pm10监测'},
      dustfallTable: {c: dustfallTable, n: '降尘控制'},
      warningTable: {c: warningTable, n: '预警记录'},
      tspLine: {c: tspLine, n: 'tsp监测'},
      monitorNoseLine: {c: monitorNoseLine, n: '噪音监测'},
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 7, "c": "pm2Line", "o": {}},
      {"i": 1, "x": 0, "y": 7, "w": 3, "h": 7, "c": "pm10Line", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 6, "h": 4, "c": "weather", "o": {}},
      {"i": 3, "x": 3, "y": 4, "w": 6, "h": 5, "c": "dustfallTable", "o": {}},
      {"i": 4, "x": 3, "y": 9, "w": 6, "h": 5, "c": "warningTable", "o": {}},
      {"i": 5, "x": 9, "y": 0, "w": 3, "h": 7, "c": "tspLine", "o": {}},
      {"i": 6, "x": 9, "y": 7, "w": 3, "h": 7, "c": "monitorNoseLine", "o": {}}
    ]
  },
  {
    title: 'vocIndex',
    name: '挥发性有机物监测系统个人首页',
    type: '2',
    system: 27,
    widgets: {
      Map: {c: vocBaiduMap, n: "GIS地图"},
      Abnormal: {c: vocAbnormalColumn, n: "异常状况"},
      CompanyBar: {c: vocCompanyBar, n: "排污企业分布"},
      MonitorTable: {c: vocMonitorTable, n: "实时监测"},
      MonitorTable2: {c: vocMonitorTable2, n: "实时监测(滚动)"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      {"i": 3, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  }, 
  {
    title: 'vocInformationCabin',
    name: '挥发性有机物监测系统信息舱',
    type: '11',
    system: 27,
    widgets: {
      Map: {c: vocBigBaiduMap, n: "GIS地图"},
      Abnormal: {c: vocBigAbnormalColumn, n: "异常状况"},
      CompanyBar: {c: vocBigCompanyBar, n: "排污企业分布"},
      MonitorTable: {c: vocBigMonitorTable, n: "实时监测"}//,
      // CompanyStatusPie: { c: vocBigCompanyStatusPie, n: "排污企业现状" },
      // CompanyTypePie: { c: vocBigCompanyTypePie, n: "排污企业类型" }
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      // {"i": 3, "x": 9, "y": 0, "w": 3, "h": 4, "c": "CompanyStatusPie", "o": {}},
      // {"i": 4, "x": 9, "y": 4, "w": 3, "h": 4, "c": "CompanyTypePie", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },  
  {
    title: 'psoaIndex',
    name: 'VOC环境监测个人首页',
    type: '2',
    system: 31,
    widgets: {
      Map: {c: vocBaiduMap, n: "GIS地图"},
      Abnormal: {c: vocAbnormalColumn, n: "异常状况"},
      CompanyBar: {c: vocCompanyBar, n: "排污企业分布"},
      MonitorTable: {c: vocMonitorTable, n: "实时监测"},
      MonitorTable2: {c: psoa32MonitorTable2, n: "实时监测(滚动)"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      {"i": 3, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'psoaInformationCabin',
    name: 'VOC信息舱',
    type: '7',
    system: 31,
    widgets: {
      Map: {c: vocBigBaiduMap, n: "GIS地图"},
      Abnormal: {c: vocBigAbnormalColumn, n: "异常状况"},
      CompanyBar: {c: vocBigCompanyBar, n: "排污企业分布"},
      MonitorTable: {c: vocBigMonitorTable, n: "实时监测"}//,
      // CompanyStatusPie: { c: vocBigCompanyStatusPie, n: "排污企业现状" },
      // CompanyTypePie: { c: vocBigCompanyTypePie, n: "排污企业类型" }
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      // {"i": 3, "x": 9, "y": 0, "w": 3, "h": 4, "c": "CompanyStatusPie", "o": {}},
      // {"i": 4, "x": 9, "y": 4, "w": 3, "h": 4, "c": "CompanyTypePie", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'psoa32Index',
    name: '地表水体环境污染源监测系统首页',
    type: '2',
    system: 32,
    widgets: {
      Map: {c: psoa32BaiduMap, n: "GIS地图"},
      Abnormal: {c: psoa32AbnormalColumn, n: "异常状况"},
      CompanyBar: {c: psoa32CompanyBar, n: "排污企业分布"},
      MonitorTable: {c: psoa32MonitorTable, n: "实时监测"},
      MonitorTable2: {c: psoa32MonitorTable2, n: "实时监测(滚动)"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      {"i": 3, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'psoa32InformationCabin',
    name: '地表水体环境污染源监测系统信息舱',
    type: '8',
    system: 32,
    widgets: {
      Map: {c: psoa32BigBaiduMap, n: "GIS地图"},
      Abnormal: {c: psoa32BigAbnormalColumn, n: "异常状况"},
      CompanyBar: {c: psoa32BigCompanyBar, n: "排污企业分布"},
      MonitorTable: {c: psoa32BigMonitorTable, n: "实时监测"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "CompanyBar", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 9, "h": 8, "c": "Map", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'loamIndex',
    name: '餐饮油烟监控管理系统首页',
    type: '2',
    system: 99,
    widgets: {
      Map: {c: loamBaiduMap, n: "GIS地图"},
      Abnormal: {c: loamAbnormalColumn, n: "异常状况"},
      StandardRate: {c: loamStandardRateBar, n: "区域排名"},
      AreaDivision: { c: loamAreaDivisionBar, n: "区域分布" },
      GovernanceRate: {c: loamGovernanceRatePie, n: "治理评级"},
      GovernanceRateZM: {c: loamGovernanceRatePieZM, n: "治理评级(A、B、C、D)"},
      MonitorTable: {c: loamRealtimeMonitorTable, n: "首页实时监测(合并滚动)"},
      MonitorTable2: {c: loamRealtimeMonitorTable2, n: "首页实时监测(非合并轮播)"},
      MonitorTable3: {c: loamRealtimeMonitorTable3, n: "首页实时监测(合并滚动且无排口)"},
      MonitorTable4: {c: loamRealtimeMonitorTable4, n: "首页实时监测(非合并轮播且无排口)"}      
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "Abnormal", "o": {}},
      {"i": 1, "x": 0, "y": 4, "w": 3, "h": 4, "c": "StandardRate", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 6, "h": 8, "c": "Map", "o": {}},
      {"i": 3, "x": 9, "y": 0, "w": 3, "h": 4, "c": "AreaDivision", "o": {}},
      {"i": 4, "x": 9, "y": 4, "w": 3, "h": 4, "c": "GovernanceRate", "o": {}},
      {"i": 5, "x": 0, "y": 8, "w": 12, "h": 4, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'loamInformationCabin',
    name: '餐饮油烟监控管理系统信息仓',
    type: '9',
    system: 99,
    widgets: {
    	loamBigTitle: {c: loamBigTitle, n: "信息舱标题"},
      AreaRank: { c: loamAreaRankBar, n: "达标率区域排名" },
      AreaRank1: { c: loamAreaRankBar1, n: "达标率区域排名(达标率区域颠倒)" }, 
      AlertType: { c: loamAlertType, n: "报警类型" }, 
      MonitorEquipmentOverview: { c: loamMonitorEquipmentOverview, n: "监测设备总览" }, 
      SupervisionOverview: { c: loamSupervisionOverview, n: "督办工单" }, 
      SupervisionOverviewPie: {c: loamSupervisionOverviewPie, n: "督办工单(只有饼图)"},
      CompanyRank: { c: loamCompanyRankColumn, n: "企业排名" },
      CompanyRank1: {c: loamCompanyRankColumn1, n: "企业排名(合并为一张表格)"},
      Map: {c: loamBigBaiduMap, n: "信息舱地图"},
      GovernanceRate: { c: loamBigGovernanceRatePie, n: "信息舱治理评级" },
      GovernanceRateZM: { c: loamBigGovernanceRatePieZM, n: "信息舱治理评级(A、B、C、D)" },
      Abnormal: { c: loamBigAbnormalPie, n: "异常情况" },
      Realtime: { c: loamBigRealtimeTable, n: "信息仓实时监测(合并滚动)"},
      Realtime2: { c: loamBigRealtimeTable2, n: "信息仓实时监测(非合并轮播)"},
      Realtime3: { c: loamBigRealtimeTable3, n: "信息仓实时监测(合并滚动且无排口)"},
      Realtime4: { c: loamBigRealtimeTable4, n: "信息仓实时监测(非合并轮播且无排口)"},
      Realtime5: { c: loamBigRealtimeTable5, n: "信息仓实时监测(非合并轮播且无因子)"} 
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 3, "h": 4, "c": "AreaRank", "o": {}},
      {"i": 1, "x": 0, "y": 6, "w": 3, "h": 8, "c": "CompanyRank", "o": {}},
      {"i": 2, "x": 3, "y": 0, "w": 6, "h": 4, "c": "Map", "o": {}},
      {"i": 3, "x": 9, "y": 0, "w": 3, "h": 4, "c": "GovernanceRate", "o": {}},
      { "i": 4, "x": 9, "y": 6, "w": 3, "h": 8, "c": "Abnormal", "o": {} },
      {"i": 5, "x": 3, "y": 4, "w": 6, "h": 7, "c": "Realtime", "o": {}}
    ]
  },
  {
    title: 'airqIndex',
    name: '空气智能监管系统首页',
    type: '2',
    system: 22,
    widgets: {
      airqQualityGrade: {c: airqQualityGradePie, n: '空气质量等级分布'},
      airqAreaRanking: {c: airqAreaRanking, n: '区域排名'},
      airqCurrentQuality: {c: airqCurrentQuality, n: '实时空气质量汇总'},
      airqNewestAQI: {c: airqNewestAQI, n: '最新30日AQI'},
      airqNewestAQI2: {c: airqNewestAQI2, n: '本月AQI'},
      airqTable: {c: airqTable, n: '环境监测'},
      airqTable2: {c: airqTable2, n: '环境监测(小时)'},
      airqTable3: {c: airqTable3, n: '环境监测(实时)'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 2, "h": 4, "c": "airqQualityGrade", "o": {}},
      {"i": 0, "x": 2, "y": 0, "w": 2, "h": 4, "c": "airqAreaRanking", "o": {}},
      {"i": 0, "x": 4, "y": 0, "w": 2, "h": 4, "c": "airqCurrentQuality", "o": {}},
      {"i": 0, "x": 6, "y": 0, "w": 6, "h": 4, "c": "airqNewestAQI", "o": {}},
      {"i": 0, "x": 0, "y": 5, "w": 12, "h": 7, "c": "airqTable", "o": {}}
    ]
  },
  {
    title: 'airqInformationCabin',
    name: '空气智能监管系统信息舱',
    type: '10',
    system: 22,
    widgets: {
      airqBigQualityGrade: {c: airqBigQualityGradePie, n: '空气质量等级分布'},
      airqBigAreaRanking: {c: airqBigAreaRanking, n: '区域排名'},
      airqBigCurrentQuality: {c: airqBigCurrentQuality, n: '实时空气质量汇总'},
      airqBigNewestAQI: {c: airqBigNewestAQI, n: '最新30日AQI'},
      airqBigNewestAQI2: {c: airqBigNewestAQI2, n: '本月AQI'},
      airqBigTable: {c: airqBigTable, n: '环境监测'},
      airqBigTable2: {c: airqBigTable2, n: '环境监测(小时)'},
      airqBigTable3: {c: airqBigTable3, n: '环境监测(实时)'}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 2, "h": 4, "c": "airqBigQualityGrade", "o": {}},
      {"i": 0, "x": 2, "y": 0, "w": 2, "h": 4, "c": "airqBigAreaRanking", "o": {}},
      {"i": 0, "x": 4, "y": 0, "w": 2, "h": 4, "c": "airqBigCurrentQuality", "o": {}},
      {"i": 0, "x": 6, "y": 0, "w": 6, "h": 4, "c": "airqBigNewestAQI", "o": {}},
      {"i": 0, "x": 0, "y": 5, "w": 12, "h": 7, "c": "airqBigTable", "o": {}}
    ]
  },
  {
    title: 'evocIndex',
    name: '重点环境空气监测系统首页',
    type: '2',
    system: 98,
    widgets: {
      MonitorTable: {c: evocRealtimeMonitorTable, n: "实时监测"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 12, "h": 10, "c": "MonitorTable", "o": {}}
    ]
  },
  {
    title: 'pscp52',
    name: '污染源治理过程监控分析系统',
    type: '2',
    system: 52,
    widgets: {
      pscp52RealData: {c: pscp52RealData, n: "污染源治理过程监控"}
    },
    defaultLayout: [
      {"i": 0, "x": 0, "y": 0, "w": 12, "h": 10, "c": "pscp52RealData", "o": {}}
    ]
  }  
]
