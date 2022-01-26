import request from '@/router/axios';
export const getGlobalConfig = () => {
  return request({
    url: '/api/squirrel-service/globalConfig/getConfig',
    method: 'get'
  })
}

export const getDynamicHeader = (funCode,pointId) => {
  return request({
    url: '/api/ms-ficm/tableheadsetting/getDynamicHeader',
    method: 'get',
    params: {funCode,pointId}
  })
}

export const getDynamicHeaderByStatistics = (funCode,pointId,treeType) => {
  return request({
    url: '/api/ms-ficm/tableheadsetting/getReportHeader',
    method: 'get',
    params: {funCode,pointId,treeType}
  })
}


export const saveDynamicHeader = (funCode,headerJson) => {
  return request({
    url: '/api/ms-ficm/tableheadsetting/saveDynamicHeader',
    method: 'post',
    data:{headerJson},
    params: {funCode}
  })
}

export const systemRouter = [
  {
		routerUrl:'/swaq/countanalysis/countreport',
    tabelType:2
  },
  {
		routerUrl:'/swaq/history/historydata',
    tabelType:1
  }, 
  {
		routerUrl:'/swaq/realdata/realdata',
    tabelType:1
  },
  {
		routerUrl:'/psoa32/countanalysis/countreport',
    tabelType:2
  },
  {
		routerUrl:'/psoa32/history/historydata',
    tabelType:1
  }, 
  {
		routerUrl:'/psoa32/realdata/realdata',
    tabelType:1
  },  
  {
		routerUrl:'/dust/environmental/report/report',
    tabelType:2
  },
  {
		routerUrl:'/dust/environmental/history/historydata',
    tabelType:1
  }, 
  {
		routerUrl:'/dust/environmental/realdata/realdata',
    tabelType:1
  },    
  {
		routerUrl:'/psoa31/countanalysis/countreport',
    tabelType:2
  },
  {
		routerUrl:'/psoa31/history/historydata',
    tabelType:1
  }, 
  {
		routerUrl:'/psoa31/realdata/realdata',
    tabelType:1
  },  
  {
		routerUrl:'/airq/countreport',
    tabelType:2
  },
  {
		routerUrl:'/airq/history/historydata',
    tabelType:1
  }, 
  {
		routerUrl:'/airq/realdata/realdata',
    tabelType:1
  }    
]