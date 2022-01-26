<!--实时数据-->
<template>
	<el-row class="RealdataTabel">
		<el-col :span="leftWidth" v-show="false">
			<div class="box treeBox">
				<basic-container>
					<lcCheckBoxTree @ready="ready" :deviceType='systemInfo.treeType'></lcCheckBoxTree>
				</basic-container>
			</div>
		</el-col>
		<el-col :span="24" class="table-wrapper">
			<!--<overlay @changeTreeBox="changeTreeBox"></overlay>-->
			<basic-container>
				<avue-crud ref="crud"  :option="option" :table-loading="loading" 
					:data="filterData(data)" 
					:page="page"  
					:cell-style="cellStyle" v-if="showTabel">
					<template slot="menu" slot-scope="scope">
						<el-button icon="el-icon-video-play" type="text" style="padding: 0;" @click="showVideo(scope.row)"></el-button>
					</template>
					<template slot="menuLeft">
						<div>
			              <el-input
			                :placeholder="systemInfo.searchPlaceholder"
			                prefix-icon="el-icon-search"
			                style="width: 400px;"
			                size="small"
			                v-model="searchName">
			              </el-input>					
						</div>
					</template>
					<template slot="menuRight">
						<div class="table-tools" v-if="showTabel" style="padding: 0;display: inline">
							<el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport" >导出</el-button>	
							<el-button type="success" size="small" plain icon="el-icon-picture-outline" @click="rule=true" v-if="systemInfo.systemId==21">水质标准规则</el-button>
							<el-button class="refresh-count" size="small" type="primary" icon="el-icon-refresh" @click="countNum=0">
								刷新倒计时 {{ countNum }}s
							</el-button>
						</div>						
						<el-tooltip class="item" effect="dark" content="显隐" placement="top-start" v-if="userInfo.role_name.includes('admin')">
							<el-button type="default" icon="el-icon-s-operation" circle size="small" @click="showColumn"></el-button>
						</el-tooltip>
					</template>
					<template :slot="item.factorCode" slot-scope="scope" v-for="(item,index) in factorList">
						<div v-if="scope.row[item.factorCode+'isAbnormal']==1" style="color: red;">
							{{ scope.row[item.factorCode] }}
						</div>
						<div v-else>{{ scope.row[item.factorCode] }}</div>
					</template>
				</avue-crud>
			</basic-container>
		</el-col>
		<columnShow :data="tabelHeader" ref="columnShow" @success="columnSuccess"></columnShow>
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
</template>

<script>
	import { getListHead, getListData, getDeptTree } from "@/api/swaq/realdata";
	import { getDynamicHeader } from "@/api/common/common";
	import { mapGetters } from "vuex";
	import mixmin from '@/config/mixmin'
	import lcCheckBoxTree from "@/components/common/tree_checkBox.vue";
	import overlay from "@/components/common/overlay.vue";
	export default {
		components: {
			lcCheckBoxTree,
			overlay
		},
		data() {
			return {				
				rule:false,
				tabelHeader: [], // 表头参数 
				showTabel: true, // 防止treeId 为空时 需要				
				loading: false,
				option: {
					columnBtn: false, // 显隐按钮
					excelBtn: false, // 导出按钮
					stripe: true, // 斑马纹
					menu: false,
					menuWidth: 80,
					editBtn: false,
					delBtn: false,
					addBtn: false,
					calcHeight: 30,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					dialogClickModal: false,
					refreshBtn: false,
					header: true,
					column: []
				},
				data: [],
				timer: null,
				countNum: '-', // 刷新的倒计时·
				nodeList: [], // 存放已勾选节点value的数组（底层节点)
				factorList: [],
				t2: null,
			};
		},
        mixins:[mixmin],
		watch: {
			countNum(val) {
				if(val == 0) { // 倒计时结束时刷新表格
					clearInterval(this.timer)
					this.timer = null
					this.loading = true
					this.getRealData()
				}
			},
		},
		methods: {
			handleExport(){
				this.$refs.crud.rowExcel()
			},
			columnSuccess(){
				clearTimeout(this.t2)
				this.t2 = null
				clearTimeout(this.timer)
				this.timer = null
				// 修改显隐后需清除定时器 否则定时器会叠加
				this.getRealData()				
			},
			ready(val) {	
				this.nodeList = val
				clearTimeout(this.t2)
				this.t2 = null
				clearTimeout(this.timer)
				this.timer = null
				// 设置延时器避免重复请求
				this.t2 = setTimeout(() => {
					this.getRealData()
				}, 100)
			},
			getRealData() {
				let hash = window.location.hash.split('?')[0].replace(/#/g, '')
				let treeId = this.nodeList.join(',')
				if(treeId.length <= 0) {
					this.showTabel = false
					return false
				} else {
					this.showTabel = true
				}
				this.loading = true
				getDynamicHeader(hash, treeId).then(res => {	
					this.tabelHeader = res.data.data
					let tableHead = []
					res.data.data.forEach(item => {
						if(item.isShow > 0) {
							if(!item.discriminatingFactor) {
								this.factorList.push(item)
							}
							if(item.istFixed) {
								tableHead.push({
									label: item.unit?item.alias + '\n(' + item.unit + ')':item.alias,
									prop: item.factorCode,
									align: 'center',
									minWidth: item.tableWidth,
									fixed: item.istFixed,
									slot: !item.discriminatingFactor?true:false
								})
							} else {
								tableHead.push({
									label: item.unit?item.alias + '\n(' + item.unit + ')':item.alias,
									prop: item.factorCode,
									align: 'center',
									minWidth: item.tableWidth,
									slot: !item.discriminatingFactor?true:false
								})
							}								

						}
					})
					this.option.column = tableHead					
				}).then(() => {					
					this.getTableData()
				})
			},
			getTableData() {				
				let _this = this
				let treeId = this.nodeList.join(',')
				getListData(treeId, this.systemInfo.server).then(res => {					
					_this.data = [] // 置空
					// 遍历表格体接口返回数据
					res.data.data.forEach(item => {
						let obj = {
							siteName: item.siteName || '-',
							deviceName: item.siteName || '-',
							state: item.state || '-',
							collectTime: item.collectTime || '-',
							deptName: item.deptName || '-'
						}
						// 根据动态表头创建因子字段 并默认初始值
						_this.factorList.forEach(el => {
							obj[el.factorCode] = '-'
							obj[el.factorCode + 'isAbnormal'] = 0
						})
						// 接口因子值
						item.factorList.forEach(el => {
							for(var x in obj) {
								if(el.factorCode + 'isAbnormal' == x) {
									obj[el.factorCode + 'isAbnormal'] = el.isAbnormal
								}
							}
							obj[el.factorCode] = el.collectValue || '-'
						})
						// 表格数据赋值
						_this.data.push(obj)
					})
					_this.countNum = 60
					_this.timer = setInterval(() => {
						_this.countNum--
					}, 1000)
					_this.loading = false
					
				})
			},
		},
		beforeDestroy() {
			clearInterval(this.timer)
			this.timer = null
		}
	};
</script>
<style lang="scss">
	.RealdataTabel {
		.el-table__empty-block {
			width: 100% !important;
		}
		.el-table th>.cell {
			white-space: pre-line;
			/*white-space: nowrap;*/
		}
		.avue-crud__pagination {
			display: none;
		}
		.table-wrapper {
			.el-card {
				overflow: scroll;
				.el-card__body {
					height: calc(100% - 35px);
					.avue-crud {
						height: calc(100% - 65px);
					}
				}
			}
			.el-table__fixed {
				height: calc(100% - 12px) !important;
			}
			.el-table__fixed-right {
				height: calc(100% - 12px) !important;
			}
			.el-table__fixed-right::before,
			.el-table__fixed::before {
				height: 0px;
			}
		}
		.el-tree {
			width: 100%;
			overflow: scroll;
		}
	}
</style>
<style lang="scss" scoped>
	.el-row {
		height: calc(100% - 20px);
	}
	
	.el-col {
		height: 100%;
	}
	
	.box {
		height: 100%;
		margin-bottom: 0;
		margin-right: $common_margin_right;
	}
	
	.table-tools {
		display: flex;
		flex-direction: row-reverse;
		padding: 0 10px;
		margin-bottom: $common_margin_input_bottom;
	}
	
	.dialog-top {
		display: flex;
		justify-content: space-between;
	}
	
	.dialog-content {
		display: flex;
		justify-content: center;
		padding: 20px 100px 0px;
		.dialog-video {
			width: 1400px;
			height: 780px;
		}
	}
</style>