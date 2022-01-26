//测试用Dashboard小组件

const map = () => import(/* webpackChunkName: "demo-widgets" */ './map-widget.vue')
const yearWqiColumn = () => import(/* webpackChunkName: "demo-widgets" */ './yearWqi-column-widget.vue')
const dataValidPie = () => import(/* webpackChunkName: "demo-widgets" */ './datavalid-pie-widget.vue')
const yearAbnormalColumn = () => import(/* webpackChunkName: "demo-widgets" */ './yearAbnormal-column-widget.vue')
const monthWqiPie = () => import(/* webpackChunkName: "demo-widgets" */ './monthWqi-pie-widget.vue')
const monthWqiLine = () => import(/* webpackChunkName: "demo-widgets" */ './monthWqi-line-widget.vue')
const siteMonitorTable = () => import(/* webpackChunkName: "demo-widgets" */ './siteMonitor-table-widget.vue')
const currentWqiColumn = () => import(/* webpackChunkName: "demo-widgets" */ './currentWqi-column-widget.vue')
const worstSite = () => import(/* webpackChunkName: "demo-widgets" */ './worst-site-widget.vue')
export default {
    widgets: {
        Map: { c: map, n: "GIS地图" },
        YearWqiColumn: { c: yearWqiColumn, n: "水质的12个月柱形图" },
        DataValidPie: { c: dataValidPie, n: "全年数据有效性-环形图" }, 
        YearAbnormalColumn: { c: yearAbnormalColumn, n: "12个月的超标数量柱形图" }, 
        MonthWqiPie: { c: monthWqiPie, n: "当月总的水质等级饼图" },
        MonthWqiLine: { c: monthWqiLine, n: "当月所有水质的折线趋势图" },
        SiteMonitorTable: { c: siteMonitorTable, n: "所有站点的主要监测的滚动5S列表" },
        CurrentWqiColumn: { c: currentWqiColumn, n: "当月站点统计" },
        worstSite:{c:worstSite,n:'当月最差站点排名'}
    },
    defaultLayout: [
        {"i":0,"x":3,"y":0,"w":5,"h":8,"c":"Map","o":{}},
        {"i":1,"x":8,"y":8,"w":4,"h":5,"c":"MonthWqiLine","o":{}},
        {"i":2,"x":8,"y":0,"w":4,"h":4,"c":"YearAbnormalColumn","o":{}},
        {"i":3,"x":8,"y":4,"w":4,"h":4,"c":"DataValidPie","o":{}},
        {"i":4,"x":0,"y":4,"w":3,"h":4,"c":"MonthWqiPie","o":{}},
        {"i":5,"x":0,"y":8,"w":8,"h":5,"c":"SiteMonitorTable","o":{}},
        {"i":6,"x":0,"y":0,"w":3,"h":4,"c":"YearWqiColumn","o":{}}
    ]
}