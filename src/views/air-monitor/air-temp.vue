<template>
	<div class="wz">
		<div class="wz-left">
			<div v-for="item in leftMenus" :key="item.id" @click="menuClick(item.id)" :class="item.id == activeMenu?'active':''" class="wz-left-menu">
				<div class="menu-icon">
					<img :src="item.id == activeMenu? item.selIcon : item.icon" />
				</div>
				<div class="menu-title">{{item.title}}</div>
			</div>
		</div>
		<div class="wz-search">
			<el-form class="dark" size="mini" :model="searchData" :show-message="false" inline label-width="70px">
				<el-form-item label="时间类型:">
					<el-select class="wd-80" v-model="searchData.dateType" placeholder="请选择">
						<el-option label="实时" :value="10"></el-option>
						<el-option label="日" :value="20"></el-option>
						<el-option label="月" :value="30"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间类型:">
					<el-date-picker class="wd-330" v-model="searchData.dateTime" :clearable="false" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label-width="10px">
					<el-button size="mini" type="primary">重置查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="wz-data-layer">
			<div v-show="activeMenu == 'menu-bz'" class="layer-bz">
				<div class="layer-title">
					<i class="el-icon-arrow-right left-first"></i>
					<i class="el-icon-arrow-right"></i>
					<span>数据图层</span>
					<i class="el-icon-arrow-left"></i>
					<i class="el-icon-arrow-left right-second"></i>
				</div>
				<div class="layer-menus">
					<div v-for="item in bzCheckMenus" :key="item.id" @click="bzCheck(item)" :class="item.isCheck?'active':''" class="bz-check-menu">
						<img class="menu-icon" :src="item.isCheck? item.selIcon : item.icon" />
						<div class="menu-title">{{item.title}}</div>
					</div>
				</div>
				<div class="layer-split"></div>
			</div>
			<div v-show="activeMenu == 'menu-wz'" class="layer-wz">
				<div class="layer-title">
					<i class="el-icon-arrow-right left-first"></i>
					<i class="el-icon-arrow-right"></i>
					<span>数据图层</span>
					<i class="el-icon-arrow-left"></i>
					<i class="el-icon-arrow-left right-second"></i>
				</div>
				<div class="layer-menus">
					<div v-for="item in wzCheckMenus" :key="item.id" @click="bzCheck(item)" :class="item.isCheck?'active':''" class="bz-check-menu">
						<img class="menu-icon" :src="item.isCheck? item.selIcon : item.icon" />
						<div class="menu-title">{{item.title}}</div>
					</div>
				</div>
				<div class="layer-split"></div>
				<el-radio-group v-model="activeRankType" size="mini" class="mb-10">
					<el-radio-button v-for="item in rankTypeList" :label="item.value" :key="item.id">{{item.name}}</el-radio-button>
				</el-radio-group>
			</div>
			<el-form class="dark" size="mini" :show-message="false" inline>
				<el-form-item label-width="0">
					<el-select class="wd-70" v-model="pmType" placeholder="请选择">
						<el-option label="pm2.5" :value="10"></el-option>
						<el-option label="pm10" :value="20"></el-option>
						<el-option label="tvoc" :value="30"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-show="activeMenu == 'menu-bz'" label="周边范围:" label-width="68px">
					<el-select :disabled="disabledAreaSelect" class="wd-70" v-model="aroundArea" placeholder="请选择">
						<el-option label="1.5km" :value="1500"></el-option>
						<el-option label="3km" :value="3000"></el-option>
						<el-option label="5km" :value="5000"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<baidu-map class="wz-right" :center="map.center" :mapStyle="mapStyle" :zoom="map.zoom" @ready="handler">
			<bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
			<!--缩放控件-->
			<!-- <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation> -->
			<!--聚合动态添加的点坐标-->
			<!-- <bm-marker v-for="marker of bzList" :icon="marker.iconPth" :key="marker.id" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)">
				<bm-label v-if="showBZMarkerLabel" :content="marker.title" :labelStyle="{color: 'red', fontSize : '16px'}" :offset="{width: -25, height: -30}" />
			</bm-marker>
			<bm-marker v-for="marker of wzList" :key="marker.id" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)"></bm-marker> -->
			<bm-circle v-for="item of bzList" :center="{lng:item.lng,lat:item.lat}" :key="item.id+'cicle'" :radius="aroundArea" stroke-color="orange" :stroke-opacity="1" :fillOpacity="0.1" :stroke-weight="2"></bm-circle>
			<bm-circle v-for="item of circleList" :key="item.id" :center="item.center" :radius="20" stroke-color="yellow" fill-color="yellow" :fillOpacity="1" :stroke-opacity="1" :stroke-weight="5"></bm-circle>
		</baidu-map>

		<color-card class="wz-color"></color-card>
	</div>
</template>

<script>
import ColorCard from './color-card.vue'
export default {
	name: 'air-temp',
	components: {
		ColorCard
	},
	data() {
		return {
			/* new */
			activeMenu: 'menu-bz',
			leftMenus: [
				{
					id: 'menu-bz',
					title: '标站',
					icon: '/img/map/menu/icon-menu-bz.png',
					selIcon: '/img/map/menu/icon-menu-bz-sel.png'
				}, {
					id: 'menu-wz',
					title: '微站',
					icon: '/img/map/menu/icon-menu-wz.png',
					selIcon: '/img/map/menu/icon-menu-wz-sel.png'
				}, {
					id: 'menu-yuntu',
					title: '移动云图',
					icon: '/img/map/menu/icon-menu-yuntu.png',
					selIcon: '/img/map/menu/icon-menu-yuntu-sel.png'
				},
			],
			searchData: {
				dateType: 10,
				dateTime: [new Date(2021, 5, 25, 10, 0), new Date(2021, 5, 25, 11, 0)]
			},
			bzCheckMenus: [
				{
					id: 'bz-guo',
					title: '国',
					isCheck: true,
					checkEvent: this.guoClick,
					icon: '/img/map/bz/icon-bz-guo.png',
					selIcon: '/img/map/bz/icon-bz-guo-sel.png'
				}, {
					id: 'bz-sheng',
					title: '省',
					isCheck: true,
					checkEvent: this.shengClick,
					icon: '/img/map/bz/icon-bz-sheng.png',
					selIcon: '/img/map/bz/icon-bz-sheng-sel.png'
				}, {
					id: 'bz-shi',
					title: '市',
					isCheck: true,
					icon: '/img/map/bz/icon-bz-shi.png',
					selIcon: '/img/map/bz/icon-bz-shi-sel.png'
				}, {
					id: 'bz-jd',
					title: '街道',
					isCheck: false,
					icon: '/img/map/bz/icon-bz-jd.png',
					selIcon: '/img/map/bz/icon-bz-jd-sel.png'
				}, {
					id: 'bz-bzmc',
					title: '标站名称',
					isCheck: true,
					checkEvent: this.bzmcClick,
					icon: '/img/map/menu/icon-menu-bz.png',
					selIcon: '/img/map/menu/icon-menu-bz-sel.png'
				}, {
					id: 'bz-zbwr',
					title: '周边污染',
					isCheck: false,
					checkEvent: this.zbwrClick,
					icon: '/img/map/bz/icon-bz-zbwr.png',
					selIcon: '/img/map/bz/icon-bz-zbwr-sel.png'
				}, {
					id: 'bz-wrpm',
					title: '污染排名',
					isCheck: false,
					icon: '/img/map/bz/icon-bz-wrpm.png',
					selIcon: '/img/map/bz/icon-bz-wrpm-sel.png'
				}, {
					id: 'bz-guo',
					title: '标站报警',
					isCheck: false,
					icon: '/img/map/bz/icon-bz-guo.png',
					selIcon: '/img/map/bz/icon-bz-guo-sel.png'
				},
			],
			wzCheckMenus: [
				{
					id: 'wz-wzmc',
					title: '微站名称',
					isCheck: true,
					checkEvent: this.guoClick,
					icon: '/img/map/menu/icon-menu-wz.png',
					selIcon: '/img/map/menu/icon-menu-wz-sel.png'
				}, {
					id: 'wz-rdwl',
					title: '热点网络',
					isCheck: false,
					// checkEvent: this.shengClick,
					icon: '/img/map/bz/icon-bz-sheng.png',
					selIcon: '/img/map/bz/icon-bz-sheng-sel.png'
				}, {
					id: 'wz-fc',
					title: '风场',
					isCheck: false,
					icon: '/img/map/bz/icon-bz-shi.png',
					selIcon: '/img/map/bz/icon-bz-shi-sel.png'
				}
			],
			activeRankType: 10,
			rankTypeList: [
				{
					id:'rank-01',
					name:'区县排名',
					value:10
				},{
					id:'rank-02',
					name:'街道排名',
					value:20
				},{
					id:'rank-02',
					name:'道路排名',
					value:30
				},
			],
			pmType: 10,
			disabledAreaSelect: true,
			aroundArea: 1500,
			/* new === end==== */


			showBZMarkerLabel: true,
			map: {
				center: { lng: 120.310761, lat: 31.491839 },//'无锡市',
				zoom: 14,
			},
			// 自带的主题normal、light、dark、redalert、googlelite、grassgreen、midnight、pink、darkgreen、grayscale、hardedge
			mapStyle: {
				// features: ["building"],//隐藏地图上的"poi",
				style: 'midnight',
				// styleJson: require('@/assets/custom_map_config.json'),
				// styleId:'dd5584dc225425d5c5e9ce6424d7345f'
			},
			circlePath: {
				center: { lng: 120.284459, lat: 31.485804 },
				radius: 1500,
			},
			bzList: [
				{
					id: 'bz001',
					title: '蠡湖大道',
					lng: 120.284459,
					lat: 31.485804,
					icon: '/img/left_tree/group.png',
					iconPth: { url: '/img/icon-yellow.png', size: { width: 39, height: 67 } }
				}, {
					id: 'bz002',
					title: '高浪东路',
					lng: 120.345975,
					lat: 31.50945,
					icon: '/img/left_tree/enterprise.png',
					iconPth: { url: '/img/icon-yellow.png', size: { width: 39, height: 67 } }
				}
			],
			wzList: [
				{
					id: 'wz001',
					title: '观山名筑',
					lng: 120.340657,
					lat: 31.506495,
				}, {
					id: 'wz002',
					title: '落霞苑',
					lng: 120.335339,
					lat: 31.512159,
				}, {
					id: 'wz003',
					title: '尚锦城',
					lng: 120.35273,
					lat: 31.510435,
				},
			],
			circleList: [
				{
					id: 'yt001',
					title: '蠡湖大道',
					center: { lng: 120.284172, lat: 31.498367 },
				}, {
					id: 'yt002',
					title: 'yt002',
					center: { lng: 120.284459, lat: 31.497135 },
				}, {
					id: 'yt003',
					title: 'yt003',
					center: { lng: 120.284459, lat: 31.496519 },
				}, {
					id: 'yt004',
					title: 'yt004',
					center: { lng: 120.284603, lat: 31.494795 },
				}
			]
		}
	},
	created() {
	},
	destroyed() {
	},
	methods: {
		menuClick(id) {
			this.activeMenu = id
		},
		bzCheck(item) {
			console.log('item: ', item)
			item.isCheck = !item.isCheck
			if (item.checkEvent)
				item.checkEvent(item)
		},
		guoClick(item) {
			console.log('guo222222')
		},
		shengClick(item) {
			console.log('sheng22222')
		},
		bzmcClick(item) {
			console.log('bzmc')
		},
		zbwrClick(item) {
			this.disabledAreaSelect = !item.isCheck
		},
		handler() {

		},
		// 查看详情
		lookDetail(data, target) {
			//滚动到指定元素位置
			this.$nextTick(() => {

			})
		}
	},
}
</script>
<style scoped>
@import "~@/styles/element-ui-dark.scss";
</style>
<style lang="scss" scoped>
.mb-10{
	margin-bottom: 10px;
}
.wd-70 {
	width: 70px;
}
.wd-80 {
	width: 80px;
}
.wd-330 {
	width: 335px;
}
.wz {
	height: calc(100vh - 125px);
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	position: relative;
	&-left {
		width: 85px;
		height: 100%;
		background-color: #011219;
		border-right: 3px solid #1d262d;
		&-menu {
			cursor: pointer;
			text-align: center;
			padding: 10px 0 5px;
			.menu-title {
				font-size: 14px;
				color: white;
				margin-top: 5px;
			}
			&:hover {
				background-color: #333;
			}
		}
		.active {
			background-color: #06394e;
		}
	}
	&-right {
		width: 100%;
		height: 100%;
		flex: 1;
	}
	&-search {
		position: absolute;
		top: 10px;
		left: 95px;
		// width: 400px;
		// height: 70px;
		background-image: url(/img/border-bg-mini-01.png);
		// border:1px solid #1ad1e3;
		background-size: 100% 100%;
		background-color: rgba(2, 28, 41, 0.7);
		z-index: 9;
		border-radius: 8px;
		padding: 5px 10px;
	}
	&-data-layer {
		position: absolute;
		top: 65px;
		left: 95px;
		width: 243px;
		background-image: url(/img/border-bg-mini-01.png);
		// border:1px solid #1ad1e3;
		background-size: 100% 100%;
		background-color: rgba(2, 28, 41, 0.7);
		z-index: 9;
		padding: 15px;
		.layer-title {
			color: #1ad1e3;
			text-align: center;
			margin-bottom: 10px;
			.left-first {
				color: #05718e;
				margin-right: -7px;
			}
			.right-second {
				color: #05718e;
				margin-left: -7px;
			}
			span {
				margin: 0 20px;
			}
		}
		.layer-menus {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}
		.layer-split {
			height: 1px;
			background-color: #1ad1e3;
			width: 100%;
			margin-bottom: 10px;
			margin-top: 5px;
		}
		.bz-check-menu {
			width: 65px;
			margin-left: 20px;
			margin-bottom: 5px;
			border-radius: 5px;
			cursor: pointer;
			text-align: center;
			padding: 8px 0 3px;
			border: 1px solid transparent;
			.menu-icon {
				width: 40px;
				height: 40px;
			}
			.menu-title {
				font-size: 13px;
				color: white;
				margin-top: 0px;
			}
			&:nth-child(3n + 1) {
				margin-left: 0;
			}
			&:hover {
				background-color: #333;
			}
		}
		.active {
			background-color: #06394e;

			border-color: #1ad1e3;
			&:hover {
				background-color: #06394e;
			}
		}
	}
	&-color {
		position: absolute;
		bottom: 5px;
		right: 15px;
	}
}
/* 修改黑色背景下 element-ui 部分控件样式 */
.dark.el-form {
	.el-form-item {
		margin-bottom: 0;
		&:last-child {
			margin-right: 0;
		}
	}
	::v-deep .el-form-item__label {
		color: white;
	}
	::v-deep .el-input__inner {
		border: 1px solid #1ad1e3;
		background-color: #021f2d;
		color: white;
		padding: 0 8px;
		padding-right: 10px;
	}
	$changeColorList: input__suffix, el-range__icon, el-range-separator;
	@each $name in $changeColorList {
		::v-deep .#{$name} {
			color: white;
			line-height: 28px;
		}
	}
	::v-deep input {
		background-color: #021f2d;
		color: white;
		margin-top: -3px;
		width: 94%;
	}
}
</style>