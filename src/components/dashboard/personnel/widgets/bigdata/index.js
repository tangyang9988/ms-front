//测试用Dashboard小组件
const job = () => import(/* webpackChunkName: "demo-widgets" */ './job.vue')
const statistics = () => import(/* webpackChunkName: "demo-widgets" */ './statistics.vue')
const access = () => import(/* webpackChunkName: "demo-widgets" */ './access-tabel.vue')
const pass = () => import(/* webpackChunkName: "demo-widgets" */ './pass-tabel.vue')
const station = () => import(/* webpackChunkName: "demo-widgets" */ './station-pie-widget.vue')
const check = () => import(/* webpackChunkName: "demo-widgets" */ './check-pie-widget.vue')
export default {
  // // 人员实时过闸信息 pass
  // // 工作岗位 station
  // // 人员统计 statistics
  // // 进出状态 access
  // // 考勤分布 ：check
  // // 工种统计：job
  widgets: {
    job: {c: job, n: '工种统计'},//工种统计
    access: {c: access, n: '进出状态'},//进出状态 access
    statistics: {c: statistics, n: '人员统计'},//人员统计
    pass: {c: pass, n: '人员实时过闸信息'},//人员实时过闸信息
    station: {c: station, n: '工作岗位'},//工作岗位 station
    check: {c: check, n: '考勤分布'},//考勤分布
  },
  defaultLayout: [
    {"i": 0, "x": 0, "y": 0, "w": 3, "h": 7, "c": "pass", "o": {}},
    {"i": 1, "x": 3, "y": 0, "w": 6, "h": 5, "c": "statistics", "o": {}},
    {"i": 2, "x": 9, "y": 0, "w": 3, "h": 7, "c": "check", "o": {}},
    {"i": 3, "x": 0, "y": 10, "w": 3, "h": 7, "c": "station", "o": {}},
    {"i": 4, "x": 3, "y": 10, "w": 6, "h": 9, "c": "access", "o": {}},
    {"i": 5, "x": 9, "y": 2, "w": 3, "h": 7, "c": "job", "o": {}},
  ]
}
