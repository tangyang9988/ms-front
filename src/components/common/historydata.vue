<!--历史数据/综合数据-->
<template>
	<div class="lc_wrap">
		<el-row class="HistorydataTabel">
			<el-col :span="leftWidth">
				<div class="box treeBox">
					<basic-container>
						<lcTree @ready="ready" :deviceType='systemInfo.treeType'></lcTree>
					</basic-container>
				</div>
			</el-col>
			<el-col :span="rightWidth" class="table-wrapper">
				<overlay @changeTreeBox="changeTreeBox"></overlay>
				<basic-container>
					<div class="search-tools">
						<div class="search-left" v-if="dateType==0">
							<el-date-picker v-model="dateFrom" type="date" size="small" placeholder="开始日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>
							<div>&nbsp;至&nbsp;</div>
							<el-date-picker v-model="dateTo" type="date" size="small" placeholder="结束日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>
							<div>&nbsp;&nbsp;</div>
						</div>
						<div class="search-left" v-else>
							<el-date-picker v-model="dateFrom2" type="datetime" size="small" placeholder="开始日期" :picker-options="pickerOption" value-format="yyyy-MM-dd HH:mm:ss" disabled></el-date-picker>
							<div style="color: #ccc;">&nbsp;至&nbsp;</div>
							<el-date-picker v-model="dateTo2" type="datetime" size="small" placeholder="结束日期" :picker-options="pickerOption" value-format="yyyy-MM-dd HH:mm:ss" disabled></el-date-picker>
							<div>&nbsp;&nbsp;</div>
						</div>
						<div class="search-right">
							<div class="search-tabs">
								<el-radio v-model="dateType" v-for="(item, index) in dateTypeList" :key="index" :label="item.label" :disabled="item.disable" @change="changeDateType">{{ item.value }}
								</el-radio>
							</div>
							<div class="searcg-btns">
								<el-button type="primary" size="small" icon="el-icon-search" @click="search">搜 索</el-button>
							</div>
						</div>
					</div>
					<div class="thCellWrap">
						<avue-crud v-if="isTableShow" :option="option" :table-loading="loading"
							:data="data" :page="page" :permission="permissionList"
							ref="crud" @search-reset="searchReset" @current-change="currentChange"
							@size-change="sizeChange" @refresh-change="refreshChange">
							<template slot="menuLeft">
								<div class="table-tools"  style="padding: 0;display: inline">
									<el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport" >导出</el-button>
								</div>
							</template>
							<template slot="menuRight">
								<el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
									<el-button type="default" icon="el-icon-refresh" circle size="small" @click="searchReset"></el-button>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="显隐" placement="top-start" v-if="userInfo.role_name.includes('admin')">
									<el-button type="default" icon="el-icon-s-operation" circle size="small" @click="showColumn"></el-button>
								</el-tooltip>
							</template>
						</avue-crud>
					</div>
				</basic-container>
			</el-col>
			<columnShow :data="tabelHeader" ref="columnShow" @success="searchReset"></columnShow>
		</el-row>
	</div>
</template>
<script>
	import { getHead, getList, getDeptTree } from "@/api/swaq/historydata";
	import { getDynamicHeader } from "@/api/common/common";
	import { dateFormat, getPreDay } from "@/util/date";
	import mixmin from '@/config/mixmin'
	import lcTree from "@/components/common/tree.vue";
	import overlay from "@/components/common/overlay.vue";
    import { getToken } from "@/util/auth";	  // 导出表格的时候用得到
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			return {
				tabelHeader: [], // 表头参数
				dateTypeList: [{label: 0,value: '自定义'}, {label: 1,value: '24小时'},{label: 2,value: '48小时'},{label: 4,value: '96小时'}],
				dateType: 0,
				dateFrom2: dateFormat(getPreDay(1)), // 当dateType>1的时候显示
				dateTo2: dateFormat(new Date()), // 当dateType>1的时候显示
				dateFrom: dateFormat(new Date(), 'yyyy-MM-dd'),
				dateTo: dateFormat(new Date(), 'yyyy-MM-dd'),
				isTableShow: true,
				loading: false,
				option: {
					columnBtn: false, // 显隐按钮
					refreshBtn: false, // 刷新按钮
					stripe: true, // 斑马纹
					menu: false, // 把操作列藏起来
					addBtn: false,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					dialogClickModal: false,
					column: []
				},
				data: [],   // 储存表格数据
				nodeId: null, // 储存当前选中树节点的ID
				deptInfoName: '', // 储存站点名称
				deptInfoId: '',   // 储存站点名称ID
				pickerOption: {   // 时间控件参数
					firstDayOfWeek: 1,
					disabledDate(time) {
						return time.getTime() > Date.now()
					},
				},
				nodeList: [], // 存放已勾选节点value的数组（底层节点
				dataList: [], // 未处理的数据
				exportAllowed: true, // 导出按钮是否可以操作
				t2: null,
			};
		},
		mixins:[mixmin],
		watch: {
			dateFrom() {
				if(this.dateFrom) {
					let startDate = new Date(this.dateFrom)
					let endDate = new Date(this.dateTo)
					if(startDate.getTime() > endDate.getTime()) {
						this.dateTo = this.dateFrom
					} else if(endDate.getTime() > startDate.getTime() + 7 * 24 * 60 * 60 * 1000) {
						startDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
						this.dateTo = dateFormat(new Date(startDate), 'yyyy-MM-dd')
					}
				}
			},
			dateTo() {
				if(this.dateTo) {
					let startDate = new Date(this.dateFrom)
					let endDate = new Date(this.dateTo)
					if(startDate.getTime() > endDate.getTime()) {
						this.dateFrom = this.dateTo
					} else if(endDate.getTime() - 7 * 24 * 60 * 60 * 1000 > startDate.getTime()) {
						endDate.setTime(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
						this.dateFrom = dateFormat(new Date(endDate), 'yyyy-MM-dd')
					}
				}
			},
			nodeList() {
				// 每次勾选节点变化的时候，清除之前的定时器
				clearTimeout(this.t2)
				this.t2 = null
				// 设置定时器，100ms后再请求数据（100ms内没有被再次勾选的话）
				this.t2 = setTimeout(() => {
					this.onLoad()
				}, 100)
			}
		},
		methods: {
			handleExport() {
				this.$confirm("是否导出报表数据?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let time1, time2
					if(this.dateType == 0) {
						time1 = this.dateFrom + ' 00:00:00'
						time2 = this.dateTo + ' 23:59:59'
					} else {
						time1 = this.dateFrom2
						time2 = this.dateTo2
					}
					let str=`api/squirrel-service/historyData/export?${
			        this.website.tokenHeader
			        }=${getToken()}&treeId=${this.nodeId}&start=${
			        time1
			        }&end=${time2}`
					window.open(str);
				});
			},
			ready(data) {
                if(data.nodeType<2){
                	return false
                }
				this.nodeId = data.key
				this.deptInfoName = data.title
				this.deptInfoId = data.key
				this.page.currentPage = 1
				this.onLoad()
			},
			changeDateType(val) {
				if(val > 0) {
					this.dateFrom2 = dateFormat(getPreDay(val))
					this.dateTo2 = dateFormat(new Date())
				}
			},
			/*** 获取表头数据+*/
			getTableHead(nodeId) {
				let _this = this
				let hash = window.location.hash.split('?')[0].replace(/#/g, '')
				return new Promise(function(resolve, reject) {
					getDynamicHeader(hash, nodeId).then(res => {
						let tableHead = []
						if(res.data.success) {
							_this.tabelHeader = res.data.data
							res.data.data.forEach(item => {
								if(item.isShow > 0) {
									if(item.istFixed) {
										tableHead.push({
											label: item.unit?item.alias + '\n(' + item.unit + ')':item.alias,
											prop: item.factorCode,
											align: 'center',
											minWidth: item.tableWidth,
											fixed: item.istFixed,
										})
									} else {
										tableHead.push({
											label: item.unit?item.alias + '\n(' + item.unit + ')':item.alias,
											prop: item.factorCode,
											align: 'center',
											minWidth: item.tableWidth,
										})
									}
								}
							})
							// 将表头放入option
							_this.option.column = tableHead
							resolve(res.data.data)
						} else {
							reject('网络拥堵，请退出重试')
						}
					})
				})
			},
			onLoad() {
				let time1, time2
				if(this.dateType == 0) {
					time1 = this.dateFrom + ' 00:00:00'
					time2 = this.dateTo + ' 23:59:59'
				} else {
					time1 = this.dateFrom2
					time2 = this.dateTo2
				}
				this.getTableHead(this.deptInfoId).then(resHead => {
					if(resHead.length == 0) {
						this.isTableShow = false
						return
					} else {
						this.isTableShow = true
					}
					getList(this.deptInfoId, time1, time2, this.page.currentPage, this.page.pageSize, this.systemInfo.server).then(res => {
						this.dataList = []
						res.data.data.records.forEach(item => { //添加分页数据 后数据结构变化
							let obj = {
								siteName: item.siteName || '-',
								collTime: item.collTime || '-'
							}
							item.factorList.forEach(el => {
								item[el.code] = el.specialValue
							})
							resHead.forEach(el => {
								obj[el.factorCode] = item[el.factorCode] ? item[el.factorCode] : '-'
							})
							this.dataList.push(obj)
						})
						// 有数据则允许导出
						this.exportAllowed = this.dataList.length ? false : true
						this.page.total = res.data.data.total;
						this.data = this.dataList.slice(0, this.page.pageSize)
						this.loading = false
					})
				},error=>{
					this.loading = false
				})

			}
		}
	};
</script>
<style lang="scss">
	.HistorydataTabel {
		.el-table__empty-block {
			width: 100% !important;
		}
		.avue-crud__menu {
			margin-bottom: $avue-tabel-menu-btn_margin_bottom;
		}
		.search-tools {
			padding-left: 0 !important;
			height: auto !important;
			margin-bottom: $common_margin_input_bottom;
		}
		.el-card__body {
			height: calc(100% - 35px);
			.avue-crud {
				height: calc(100% - 155px);
			}
		}
		.table-wrapper {
			.el-card {
				overflow: scroll;
			}
		}
		.el-table__empty-block {
			width: 100% !important;
		}
		.el-table th>.cell {
			white-space: pre-line;
			/*white-space: nowrap;*/
		}
		.el-table__fixed {
			height: calc(100% - 12px) !important;
		}
		.el-table__fixed-right {
			height: calc(100% - 12px) !important;
		}
	}
</style>
<style lang="scss" scoped>
	.map {
		width: 100%;
		height: 500px;
	}

	.box {
		height: 100%;
		margin-bottom: 0;
	}

	.el-row {
		height: calc(100% - 20px);
	}

	.el-col {
		height: 100%;
		overflow: auto;
	}

	.search-tools {
		height: 49px;
		display: flex;
		justify-content: space-between;
		padding: 0 8px;
	}

	.search-left {
		display: flex;
		height: 33px;
		line-height: 33px;
	}

	.search-right {
		display: flex;
	}

	.search-tabs {
		height: 33px;
		display: flex;
		align-items: center;
		margin-right: 40px;
	}

	.overlay {
		position: absolute;
		width: 200px;
		height: calc(100% - 35px);
		opacity: 0;
		display: flex;
		align-items: center;
		padding-left: 6px;
		.tree-tool {
			height: 34px;
			width: 18px;
			background: #fff;
			box-shadow: 2px 1px 4px #ccc;
			border-top-right-radius: 3px;
			border-bottom-right-radius: 3px;
			cursor: pointer;
			display: flex;
			padding: 6px 0;
			z-index: 9999;
			.tool-line {
				margin-left: 3px;
				height: 100%;
				border-left: 1px solid #ddd;
			}
		}
	}

	.overlay:hover {
		opacity: 1;
	}
</style>
