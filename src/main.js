import './styles/common.scss';

import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache'; //页面缓存
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import TIMERS from '@/config/timer';
import {
	iconfontUrl,
	iconfontVersion
} from '@/config/env';

import { options } from './common';
import i18n from './lang' // Internationalization
import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'
import columnShow from './components/columnShow/main'
import thirdRegister from './components/third-register/main'
import avueUeditor from 'avue-plugin-ueditor';
import BaiduMap from 'vue-baidu-map'

import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video

Vue.prototype.$TIMERS = TIMERS
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// Vue.prototype.$L = L

// 引入baidu地图
Vue.use(BaiduMap, {
	ak: 'pr9OvF8jfWcvEpojMlYuOWKCzccuaesn'
});
// 定义一个时间格式化函数
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element, {
	i18n: (key, value) => i18n.t(key, value)
});
Vue.use(window.AVUE, {
	size: 'small',
	tableSize: 'small',
	i18n: (key, value) => i18n.t(key, value)
});
//注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('columnShow', columnShow);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister);
Vue.component('avueUeditor', avueUeditor);
//注册echarts
Vue.component('e-chart', r => require.ensure([], () => {
	// 引入 ECharts 主模块
	// var echarts = require('echarts/lib/echarts')
	// 引入柱状图
	require('echarts/lib/chart/map')
	require('echarts/lib/chart/line')
	require('echarts/lib/chart/bar')
	require('echarts/lib/chart/pie')
	require('echarts/lib/chart/gauge')
	require('echarts/lib/chart/candlestick')
    require('echarts/lib/chart/custom')//引入自定义


	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')
	//引入markline
	require('echarts/lib/component/markLine')
	// 引入图例
	require('echarts/lib/component/legend')
	require('echarts/lib/component/visualMap')
	// 引入vue包装组件
	r(require('./components/echarts/echarts.vue'))
}, 'echarts'))
// 加载相关url地址
Object.keys(urls).forEach(key => {
	Vue.prototype[key] = urls[key];
});
for(let x in options) {
	Vue.prototype[x] = options[x]
}
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
	loadStyle(iconfontUrl.replace('$key', ele));
});
Vue.config.productionTip = false;
new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app')
