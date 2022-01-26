<template>
	<div class="lc_wrap">
		<el-row class="CountreportTabel">
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
						<div class="search-left">
							<!-- 日 -->
							<div v-if="dateType==2">
								<el-date-picker v-model="dateTime" type="date" size="small" value-format="yyyy-MM-dd" :picker-options="pickerOption" placeholder="选择日期" :clearable='false'></el-date-picker>
							</div>
							<!-- 周 -->
							<div v-if="dateType==3">
								<el-date-picker v-model="dateTime" type="week" size="small" format="yyyy 第 WW 周" value-format="yyyy-MM-dd" :picker-options="pickerOption" placeholder="选择周" :clearable='false'></el-date-picker>
							</div>
							<!-- 月 -->
							<div v-if="dateType==4">
								<el-date-picker v-model="dateTime" type="month" size="small" value-format="yyyy-MM" :picker-options="pickerOption" placeholder="选择月份" :clearable='false'></el-date-picker>
							</div>
							<!-- 年 -->
							<div v-if="dateType==5">
								<el-date-picker v-model="dateTime" type="year" size="small" value-format="yyyy" :picker-options="pickerOption" placeholder="选择年份" :clearable='false'></el-date-picker>
							</div>
						</div>
						<div class="search-right">
							<div class="search-tabs">
								<el-radio v-model="dateType" v-for="(item, index) in dateTypeList" :key="index" 
									:label="item.label" :disabled="item.disable">{{ item.value }}
								</el-radio>
							</div>
							<div class="searcg-btns">
								<el-button type="primary" size="small" icon="el-icon-search" @click="search">搜 索</el-button>
							</div>
						</div>
					</div>
					<avue-crud v-if="isTableShow" :option="option" :table-loading="loading" :data="data" 
						:permission="permissionList" ref="crud"  
                        @refresh-change="refreshChange">
						<template slot="menuLeft">
							<el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport" v-if="this.commonExportBtn">导出</el-button>
						    <el-button type="success" size="small" plain icon="el-icon-picture-outline" @click="rule=true" v-if="systemInfo.systemId==21">水质标准规则</el-button>
						</template>
						<!--水质等级模板-->
						<template slot="pointWqiLevel" slot-scope="scope">
						    <span class="level level1" v-if="scope.row.pointWqiLevel=='I类'">{{scope.row.pointWqiLevel}}</span>
						    <span class="level level2" v-else-if="scope.row.pointWqiLevel=='II类'">{{scope.row.pointWqiLevel}}</span>
						    <span class="level level3" v-else-if="scope.row.pointWqiLevel=='III类'">{{scope.row.pointWqiLevel}}</span>
						    <span class="level level4" v-else-if="scope.row.pointWqiLevel=='IV类'">{{scope.row.pointWqiLevel}}</span>
						    <span class="level level5" v-else-if="scope.row.pointWqiLevel=='V类'">{{scope.row.pointWqiLevel}}</span>
						    <span class="level level6" v-else-if="scope.row.pointWqiLevel=='劣V类'">{{scope.row.pointWqiLevel}}</span>
						</template>						
						<template slot="menuRight">
							<el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
								<el-button type="default" icon="el-icon-refresh" circle size="small" @click="search"></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="显隐" placement="top-start" v-if="userInfo.role_name.includes('admin')">
								<el-button type="default" icon="el-icon-s-operation" circle size="small" @click="showColumn"></el-button>
							</el-tooltip>
						</template>
					</avue-crud>
				</basic-container>
			</el-col>
			<columnShow :data="tabelHeader" ref="columnShow" @success="confirmColumn"></columnShow>
			<el-dialog
			  title="水质标准限值表"
			  :visible.sync="rule"
			  width="50%"
			  :append-to-body="true"
			  :before-close="handleClose">
			  <div>
			  	<img src="/img/system/rule.png" alt="" style="width: 100%;"/>
			  </div>
			  <span slot="footer" class="dialog-footer">
			    <el-button type="primary" @click="rule = false" size="small">确 定</el-button>
			  </span>
			</el-dialog>			
		</el-row>
	</div>
</template>

<script>
	import { getReportHead, getList, getDeptTree, toExport } from "@/api/dust/countreport";
	import { getDynamicHeaderByStatistics } from "@/api/common/common";
	import website from '@/config/website';
	import { getToken } from '@/util/auth';
	import lcTree from "@/components/common/tree.vue";
	import overlay from "@/components/common/overlay.vue";
	import mixmin from '@/config/mixmin'	
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			let _this = this
			return {
				rule:false,      // 水质等级规则显隐
				tabelHeader: [], // 表头参数 
				isTableShow: true, // 是否显示表单
				loading: false,
				option: {
					columnBtn: false, // 显隐按钮
					refreshBtn: false, // 刷新按钮
					stripe: true, // 斑马纹				
					menu: false, // 把操作列藏起来
					addBtn: false,			
					calcHeight: 30,
					tip: false,
					printBtn: true,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					dialogClickModal: false,
					column: []
				},
				data: [],
				nodeId: null,
				deptInfoName: '',
				deptInfoId: '',
				dateType: 2, // 日期格式：日、月、年
				dateTime: new Date().format('yyyy-MM-dd hh:mm:ss'), // 默认显示的日期
				dateTypeList: [{
					label: 2,
					value: '日'
				}, {
					label: 3,
					value: '周',					
				}, {
					label: 4,
					value: '月'
				}, {
					label: 5,
					value: '年'
				}],
				pickerOption: {
					firstDayOfWeek: 1,
					disabledDate(time) {
						return _this.dateType == 3 ? false : time.getTime() > Date.now()
					},
				},
				factorList: [], // 存放因子标识的数组，用于给因子赋默认值'-'
				nodeType:null
			};
		},
		computed: {
			commonExportBtn() {
               return this.permission[this.systemInfo.exportBtn]
			},
			permissionList() {
				return {
					printBtn:this.vaildData(this.permission[this.systemInfo.printBtn], false)
				}
			},
		},
		watch: {
			dateType() {
				this.dateTime = new Date().format('yyyy-MM-dd hh:mm:ss') // 默认显示的日期				
				this.onLoad()
			},
		},
		mixins:[mixmin],	
		methods: {
			formatDateTime(){
				let myDate = null
				switch(this.dateType) {
					case 2: // 日
						myDate = this.dateTime.slice(0, 10)
						break;
					case 3: // 周
						myDate = this.dateTime.slice(0, 10)
						break;
					case 4: // 月
						myDate = this.dateTime.slice(0, 7)
						break;
					case 5: // 年
						myDate = this.dateTime.slice(0, 4)
						break;
					default:
						myDate = this.dateTime
						break;
				}
				return myDate;
			},
			confirmColumn(){
                this.onLoad()			
			},
			ready(data) {
                this.nodeType=data.nodeType	
				this.nodeId = data.key
				this.deptInfoName = data.title
				this.deptInfoId = data.key
				this.onLoad()
			},
			handleExport() {
				this.$confirm("是否导出报表数据?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {					
					let myDate = this.formatDateTime()
					window.open(`api/squirrel-service/statreport/export?${this.website.tokenHeader}=${getToken()}&treeId=${this.nodeId}&type=${this.dateType}&time=${myDate}&treeType=${this.nodeType}&st=${this.systemInfo.systemId}`);
				});
			},
			/**
			 * 获取表头数据+
			 */
			getTableHead(nodeId) {
				let systemType = localStorage.getItem('systemType');
				
				let _this = this
				return new Promise(function(resolve, reject) {
					let hash = window.location.hash.split('?')[0].replace(/#/g, '')
					getDynamicHeaderByStatistics(hash, nodeId,_this.nodeType).then(res => {
						if(res.data.success) {							
							_this.tabelHeader = res.data.data
							if(res.data.data.length == 0) {
								_this.isTableShow = false
								return
							} else {
								_this.isTableShow = true
							}
							// 封装表头
							let tableHead = []
							_this.factorList = [] // 存放因子的列表，用于设置默认'-'值
							res.data.data.forEach(item => {
								let obj
								if(item.isShow > 0) {
									if(!item.discriminatingFactor) {
										_this.factorList.push(item.factorCode)
										obj={
											label: item.alias + '(' + item.unit + ')',
											align: 'center',
											children: [{
												label: '最大值',
												prop: `${item.factorCode}_max`,
												align: _this.$tabelAlgin
											}, {
												label: '最小值',
												prop: `${item.factorCode}_min`,
												align: _this.$tabelAlgin
											}, {
												label: '平均值',
												prop: `${item.factorCode}_avg`,
												align: _this.$tabelAlgin
											}, {
												label: '在线率（%）',
												prop: `${item.factorCode}_online`,
												align: _this.$tabelAlgin,
												width: 100,
												hide:_this.hideOnlineAndStand(systemType,"online")
											}, {
												label: '达标率（%）',
												prop: `${item.factorCode}_standard`,
												align: _this.$tabelAlgin,
												width: 100,
												hide:_this.hideOnlineAndStand(systemType,"stand")
											}]											
										}
									} else {
										obj={
											label: item.alias,
											prop: item.factorCode,
											align: 'center',
											minWidth: item.tableWidth,
											slot:item.factorCode=='pointWqiLevel'											
										}
									}
									if(item.istFixed) {											
										obj.fixed=item.istFixed
									} 
									tableHead.push(obj)									
								}
							})
							// 将表头放入option
							_this.option.column = tableHead							
							resolve()
						} else {
							reject('网络拥堵，请退出重试')
						}
					})
				})
			},
			onLoad() {
				this.loading = true;
				this.getTableHead(this.deptInfoId).then(resHead => {
					if(this.nodeId) {
	                    let myDate = this.formatDateTime()					
						getList(this.nodeId, this.dateType, myDate,{},this.nodeType).then(res => {
							const data = res.data.data;
							if(data) {							
								this.data = [] // 置空
								data.forEach(item => {
									// 点位时间的值
									let obj = {
										siteName: item.siteName,
										time: '-',
										statTime: item.statTime,
										pointWqiLevel: item.pointWqiLevel
									}
									// 根据表头的因子列表给所有因子一个默认值'-'
									this.factorList.forEach(el => {
										obj[`${el}_max`] = '-'
										obj[`${el}_min`] = '-'
										obj[`${el}_avg`] = '-'
										obj[`${el}_online`] = '-'
										obj[`${el}_standard`] = '-'
									})
									// 因子的值
									item.factorList.forEach(el => {
										obj[`${el.factorCode}_max`] = el.maxVal
										obj[`${el.factorCode}_min`] = el.minVal
										obj[`${el.factorCode}_avg`] = el.avgVal
										obj[`${el.factorCode}_online`] = el.onlineRate
										obj[`${el.factorCode}_standard`] = el.standardRate
									})
									this.data.push(obj)
								})
							}
							this.loading = false						
						})
					}					
				})
			}
		}
	};
</script>
<style lang="scss">
	.CountreportTabel {
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
		.table-wrapper {
			.el-card__body {
				height: calc(100% - 35px);
				.avue-crud {
					height: calc(100% - 155px);
				}
			}
			.el-table__fixed {
				height: calc(100% - 12px) !important;
			}
			.el-table__fixed-right {
				height: calc(100% - 12px) !important;
			}
		}
	}
</style>
<style lang="scss" scoped>
    .level{border-radius: 10px;display: inline-block;padding: 5px 20px;color: #000;}
    .level1{background: #caddfd;}
    .level2{background: #6196fd;}
    .level3{background: #64c676;}
    .level4{background: #ffdd19;}
    .level5{background: #ff9a00;}
    .level6{background: #da4d4d;}
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
	
	.search-right {
		display: flex;
	}
	
	.search-tabs {
		height: 33px;
		display: flex;
		align-items: center;
		margin-right: 40px;
	}

</style>