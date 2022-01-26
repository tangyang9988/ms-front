const weather = () => import('./weather.vue')
const pm2Line = () => import('./monitorPM2-line.vue')
const pm10Line = () => import('./monitorPM10-line.vue')
const dustfallTable = () => import('./dustfall-table')
const warningTable = () => import('./warning-table.vue')
const tspLine = () => import('./monitorTSP-line.vue')
const monitorNoseLine = () => import('./monitorNoise-line')
export default {
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
    {"i": 0, "x": 0, "y": 0, "w": 3.6, "h": 5, "c": "pm2Line", "o": {}},
    {"i": 1, "x": 0, "y": 5, "w": 3.6, "h": 5, "c": "pm10Line", "o": {}},
    {"i": 2, "x": 3.6, "y": 0, "w": 4.8, "h": 3.5, "c": "weather", "o": {}},
    {"i": 3, "x": 3.6, "y": 3.5, "w": 4.8, "h": 3, "c": "dustfallTable", "o": {}},
    {"i": 4, "x": 3.6, "y": 10, "w": 4.8, "h": 3.5, "c": "warningTable", "o": {}},
    {"i": 5, "x": 8.4, "y": 0, "w": 3.6, "h": 5, "c": "tspLine", "o": {}},
    {"i": 6, "x": 8.4, "y": 5, "w": 3.6, "h": 5, "c": "monitorNoseLine", "o": {}},
  ]
}
