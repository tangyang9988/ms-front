//测试用Dashboard小组件
const unloading = () => import(/* webpackChunkName: "demo-widgets" */ './unloading-tabel.vue')
const tower = () => import(/* webpackChunkName: "demo-widgets" */ './tower-tabel.vue')
const elevator = () => import(/* webpackChunkName: "demo-widgets" */ './elevator-tabel.vue')
const time = () => import(/* webpackChunkName: "demo-widgets" */ './time-tabel.vue')
const operator = () => import(/* webpackChunkName: "demo-widgets" */ './operator-tabel.vue')
const onLine = () => import(/* webpackChunkName: "demo-widgets" */ './onLine-pie-widget.vue')
const towerMonitoring = () => import(/* webpackChunkName: "demo-widgets" */ './tower-monitoring-widget.vue')
export default {
    widgets: {
        unloading:{c:unloading,n:'卸料机监测'},
        elevator:{c:elevator,n:'升降机监测'},
        tower:{c:tower,n:'塔吊机监测'},
        time:{c:time,n:'24h预警'},
        operator:{c:operator,n:'操作员识别'},
        onLine:{c:onLine,n:'实时在线率'},
        towerMonitoring:{c:towerMonitoring,n:'塔吊机'},
    },
    defaultLayout: [
          {"i":0,"x":0,"y":0,"w":5,"h":4,"c":"unloading","o":{}},
          {"i":1,"x":5,"y":0,"w":4,"h":4,"c":"onLine","o":{}},
          {"i":2,"x":9,"y":0,"w":3,"h":6,"c":"operator","o":{}},
          {"i":3,"x":0,"y":4,"w":5,"h":4,"c":"elevator","o":{}},
          {"i":4,"x":0,"y":8,"w":5,"h":5,"c":"tower","o":{}},
          {"i":5,"x":5,"y":4,"w":4,"h":9,"c":"towerMonitoring","o":{}},
          {"i":6,"x":9,"y":6,"w":3,"h":7,"c":"time","o":{}} 
    ]
}
