const weather = () => import('./weather.vue')
const environmental = () => import('./environmental.vue')
const earlyWarning = () => import('./early-warning.vue')
const highWarning = () => import('./highWarning.vue')
const peopleDynamic = () => import('./peopleDynamic.vue')
const checkWork = () => import('./checkWork.vue')
const notice = () => import('./notice.vue')
const workMap = () => import('./workMap.vue')
const dustfallTable = () => import('./dustfall-table')
const warningTable = () => import('./warning-table.vue')
const plan = () => import('./plan.vue')
export default {
    widgets: {
        weather:{c:weather,n:'实时天气'},
        environmental:{c:environmental,n:'实时环境指数'},
        earlyWarning:{c:earlyWarning,n:'环境预警'},
        highWarning:{c:highWarning,n:'高危预警'},
        dustfallTable:{c:dustfallTable,n:'降尘控制'},
        warningTable:{c:warningTable,n:'预警记录'},
        notice:{c:notice,n:'公告栏'},
        workMap:{c:workMap,n:'GIS地图'},
        plan:{c:plan,n:'平面图'}
    },
    defaultLayout:  [
                {"i":0,"x":0,"y":0,"w":3,"h":4,"c":"weather","o":{}},
                {"i":1,"x":0,"y":4,"w":3,"h":4,"c":"environmental","o":{}},
                {"i":2,"x":0,"y":8,"w":3,"h":5,"c":"earlyWarning","o":{}},
                {"i":3,"x":3,"y":0,"w":5,"h":8,"c":"workMap","o":{}},
                {"i":4,"x":3,"y":8,"w":5,"h":5,"c":"highWarning","o":{}},
                {"i":5,"x":8,"y":0,"w":4,"h":4,"c":"dustfallTable","o":{}},
                {"i":6,"x":8,"y":4,"w":4,"h":4,"c":"warningTable","o":{}},
                {"i":7,"x":8,"y":8,"w":4,"h":5,"c":"notice","o":{}}
            ]           
}
