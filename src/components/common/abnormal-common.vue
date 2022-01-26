<template>
	<div class="lc_wrap">
		
		<el-row class="abnormal swaqAbnormal">
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
					<!--时间选择-->
					<el-form :inline="true" class="demo-form-inline" size="small">
						<el-form-item label="">
							<el-date-picker v-model="dateFrom" type="date" size="small" placeholder="开始日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
						<el-form-item label="">
							至
						</el-form-item>
						<el-date-picker v-model="dateTo" type="date" size="small" placeholder="结束日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>&nbsp;&nbsp;
						<!--预警类型选择-->
						<el-form-item label="类型">
							<el-select size="small" v-model="aliasType" style="width: 150px;">
								<el-option v-for="(item, index) in aliasTypeOption" :key="index" :label="item.dictValue" :value="item.dictKey"></el-option>
							</el-select>
						</el-form-item>
						<!--状态选择-->
						<el-form-item label="状态">
							<el-select size="small" v-model="statusType" style="width: 150px;">
								<el-option v-for="(item, index) in statusTypeOption" :key="index" :label="item.dictValue" :value="item.dictKey"></el-option>
							</el-select>
						</el-form-item>
						
						<!--当前异常-->
						<el-form-item>
							<el-radio-group v-model="abnormalradio">
							    <el-radio  label="1">当前异常</el-radio>
							    <el-radio  label="2">全部异常</el-radio>							   
							</el-radio-group>						    
						</el-form-item>						
						<!--搜索按钮-->
						<el-form-item label="" style="margin-left: 10px;">
							<el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn">搜 索</el-button>
							<el-button type="" size="small" icon="el-icon-delete" @click="searchReset">清 空</el-button>
						</el-form-item>

					</el-form>
					<avue-crud ref="crud" v-model="form" :option="option" :table-loading="loading" :data="data" :page.sync="page" @refresh-change="refreshChange" @search-change="searchChange" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @search-reset="searchReset">
						<template slot="menuLeft">
							<el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport">导出</el-button>
							<el-button size="small" type="danger" icon="el-icon-edit" :disabled="handleDisabled" @click="toDetails" 
								v-if="abnormal_batch">
								批量处理
							</el-button>
							<el-button type="primary" size="small" plain @click="sendInfo" v-if="this.abnormal_sendInfo">发送预警通知</el-button>
						</template>
						<template slot="menu" slot-scope="scope">
							<el-link v-if="scope.row.status" type="primary" icon="el-icon-view" 
								style="font-size: 12px" :underline="false" @click="viewAbnormal(scope.row)">查看
							</el-link>
							<el-link v-else type="danger" icon="el-icon-edit" style="font-size: 12px" 
								:underline="false" @click="handleAbnormal(scope.row)">处理
							</el-link>
						</template>
					</avue-crud>

					<el-dialog title="处理单" :visible.sync="dialogVisiable" :modal="false" @close="beforeDialogClose">
						
						<!--<div class="ab_chartsWrap" v-if="showLine">
							<e-chart  autoresize :options="chartOptions" style="height:92%;"></e-chart>
						</div>-->
						
						<el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules">
							<el-form-item label="处理意见" prop="conclusion">
								<el-input type="textarea" placeholder="请输入处理意见" show-word-limit v-model="dialogForm.conclusion" :rows="4" :resize="false" :disabled="dialogType=='view'"></el-input>
							</el-form-item>
						</el-form>
						<avue-crud ref="handleCrud" :option="handleOption" :table-loading="handleLoading" :data="selectionList">
								
							<template slot="menu" slot-scope="scope">
								<el-link type="primary"  icon="el-icon-view" style="font-size: 12px" :underline="false" @click="info(scope.row)">
									详情
								</el-link>
							</template>							
						</avue-crud>
						<div style="display:flex;justify-content:center;" v-if="dialogType=='edit'">
							<el-button size="small" type="primary" @click="onsubmit" :loading="submitLoading">提 交</el-button>
							<el-button size="small" @click="closeDialog">取 消</el-button>
						</div>
					</el-dialog>
					
					
					<el-dialog title="详情" :visible.sync="infoVisiable" :modal="true" :append-to-body="true">						
						<div class="ab_chartsWrap">
							<e-chart  autoresize :options="chartOptions" style="height:92%;"></e-chart>
						</div>						
					</el-dialog>					
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import { getAliasType, getList, update, getDeptTree,getHistoryData } from "@/api/swaq/abnormal";
	import { getToken } from "@/util/auth";
	import lcTree from "@/components/common/tree.vue";
	import overlay from "@/components/common/overlay.vue";
	import mixmin from '@/config/mixmin'
	import { column,handlecolumn } from "./option/abnorma.js"
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			return {
				abnormalradio:'1',
				infoVisiable:false,
				chartOptions:null,
				abnormalInfoId:"",
				form: {},
				query: {},
				loading: false,
				selectionList: [],
				option: {
					addBtn: false,
					editBtn: false,
					delBtn: false,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					dialogClickModal: false,
					selection: true,
					menuWidth: 120,
					column: column
				},
				data: [],
				pickerOption: {
					firstDayOfWeek: 1,
					disabledDate(time) {
						return time.getTime() > Date.now()
					},
				},
				dateFrom:'',    // new Date(new Date().getTime() - 86400000 * 6).format('yyyy-MM-dd')
				dateTo:'',    // new Date().format('yyyy-MM-dd'),
				handleDisabled: true, // 批处理是否禁用
				dialogVisiable: false,
				handleOption: {
					addBtn: false,
					editBtn: false,
					delBtn: false,
					calcHeight: 30,
					tip: false,
					columnBtn: false,
					refreshBtn: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					dialogClickModal: false,
					menu: true,
					menuWidth:100,
					viewBtn:false,
					column: handlecolumn
				},
				dialogForm: {
					conclusion: null,
				},
				dialogFormRules: {
					conclusion: [{
						required: true,
						message: '请输入处理意见',
						trigger: 'blur'
					}]
				},
				submitLoading: false,
				dialogType: null, // 查看 || 处理
				siteName: '', // 站点下拉绑定值
				siteNameOption: [], // 站点下拉选择项
				aliasType: '', // 预警类型下拉绑定值
				aliasTypeOption: [], // 预警类型下拉选择项
				statusType: '', // 状态下拉绑定值
				statusTypeOption: [], // 状态下拉选择项
				nodeId: null,
				deptInfoName: '',
				deptInfoId: '',
				treeType:null
			}
		},
		computed: {
			/*批量处理按钮权限*/
			abnormal_batch() {
				switch(this.systemInfo.systemId) {
					case 21:
						return this.permission.swaq_abnormal_batch
					case 27: 
						return this.permission.voc_abnormal_batch						
					case 39: 
						return this.permission.dust_abnormal_batch
					case 31: 
						return this.permission.psoa31_abnormal_batch
					case 32: 
						return this.permission.psoa32_abnormal_batch
					case 99: 
						return this.permission.loam_abnormal_batch
					default:
				}
			},
			/*发送预警按钮权限*/
			abnormal_sendInfo() {
				switch(this.systemInfo.systemId) {
					case 21: 
						return this.permission.swaq_abnormal_sendInfo
					case 27: 
						return this.permission.voc_abnormal_sendInfo						
					case 39: 
						return this.permission.dust_abnormal_sendInfo
					case 31: 
						return this.permission.psoa31_abnormal_sendInfo
					case 32: 
						return this.permission.psoa32_abnormal_sendInfo
					case 99:
						return this.permission.loam_abnormal_sendInfo
					default:
				}
			}
		},
		mixins: [mixmin],
		mounted() {		
			this.initData()
		},
		watch: {
			dateFrom() {
				let startDate = new Date(this.dateFrom)
				let endDate = new Date(this.dateTo)
				if(startDate.getTime() > endDate.getTime()) {
					this.dateTo = this.dateFrom
				}
			},
			dateTo() {
				let startDate = new Date(this.dateFrom)
				let endDate = new Date(this.dateTo)
				if(startDate.getTime() > endDate.getTime()) {
					this.dateFrom = this.dateTo
				}
			},
			abnormalradio(val){
				if(val=='1'){
					this.dateFrom='';
					this.dateTo='';
				}else if(val=='2'){
					this.dateFrom=new Date(new Date().getTime() - 86400000 * 30).format('yyyy-MM-dd');
					this.dateTo=new Date().format('yyyy-MM-dd');					
				}
			
			},
			dialogVisiable(val) {
				if(!val) this.selectionClear()
			}
		},
		methods: {
			info(row){
				if(row.type==1){
					this.abnormalInfoId=row.id
					this.getLine()
				}else{
					this.$message.warning('仅限预警类型为超标的才可查看详情')
					return false
				}

			},
			handleExport() {
				this.$confirm("是否导出报表数据?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let str = `api/squirrel-service/abnormalinfo/export?${
			        this.website.tokenHeader
			        }=${getToken()}&treeId=${this.deptInfoId}&start=${
			        this.dateFrom
			        }&end=${this.dateTo}&alertType=${this.aliasType}&isHandled=${this.statusType}&treeType=${this.treeType}&queryType=${this.abnormalradio}&st=${this.systemInfo.systemId}`
					window.open(str);
				});
			},
			ready(data, treeData) {
				this.treeType=data.nodeType
				this.nodeId = data.key
				this.deptInfoName = data.title
				this.deptInfoId = data.id
				this.page.currentPage = 1
				this.onLoad()
			},
			sendInfo() {
				this.$message.success('发送成功')
			},
			searchReset() { //自定义搜索清空事件
				this.dateFrom = '' //当前日期-6
				this.dateTo = '' //当前日期
				this.aliasType = '' //预警类型置空
				this.statusType = '' //状态置空
				this.query = {};
				this.abnormalradio='1'
				this.onLoad();
			},
			searchChange(params, done) {
				this.query = params;
				this.page.currentPage = 1;
				this.onLoad(this.page, params);
				done();
			},
			/**
			 * 初始化
			 */
			initData() {
				// 预警类型下拉
				getAliasType().then(res => {
					if(res.data.success) {
						this.aliasTypeOption = res.data.data
						this.aliasTypeOption.unshift({
							id: '',
							dictValue: '全部'
						})
					}
				})
				//状态类型下拉 20201019
				this.statusTypeOption = [{
						id: '0',
						'dictKey': '',
						dictValue: '全部'
					},
					{
						id: '1',
						'dictKey': '0',
						dictValue: '未处理'
					},
					{
						id: '2',
						'dictKey': '1',
						dictValue: '已处理'
					},
				]
			},
			/**
			 * 关闭弹框
			 */
			closeDialog() {
				this.dialogVisiable = false
				this.submitLoading = false
			},
			/**
			 * 弹框关闭的回调
			 */
			beforeDialogClose() {
				// 清空表单
				this.$refs.dialogForm.resetFields()
			},
			/**
			 * 预警处理表单提交
			 */
			onsubmit() {
				// 验证表单
				this.$refs.dialogForm.validate(vaild => {
					if(vaild) {
						this.submitLoading = true
						let ids = this.selectionList.map(item => item.id)
						update({
							ids: ids.join(','),
							conclusion: this.dialogForm.conclusion
						}).then(res => {
							this.submitLoading = false
							if(res.data.success) {
								this.$message.success('操作成功')
								this.dialogVisiable = false
								this.onLoad()
							} else {
								this.$message.success('操作失败')
							}
						})
					}
				})
			},
			/**
			 *预警批量处理
			 */
			toDetails() {
				this.dialogType = 'edit'
				let handleList = this.selectionList.filter(item => item.status == 1)
				let endTimeNullList = this.selectionList.filter(item => item.endTime == '')
				if(handleList.length) { 
					this.$message.warning('存在已处理预警')
				}else if(endTimeNullList.length>0){ 
					this.$message.warning('有预警没有结束，不能批量处理')									
				}else{
					this.dialogVisiable = true
				}
			},
			/**
			 * 预警单个处理
			 */
			handleAbnormal(row) {
				if(!row.endTime) {
					this.$message.warning('预警没有结束，不能处理')
					return false
				}				
				this.selectionList = [row]
				this.dialogType = 'edit'
				this.dialogForm.conclusion = null;
				this.dialogVisiable = true	
			},
			/**
			 * 预警单个查看
			 */
			viewAbnormal(row) {
				this.selectionList = [row]
				this.dialogType = 'view'
				this.dialogForm.conclusion = row.conclusion;
				this.dialogVisiable = true	
			},
			/**
			 * 行勾选事件
			 */
			selectionChange(list) {
				this.selectionList = list
				this.handleDisabled = this.selectionList.length ? false : true
			},
			/**
			 * 封装清除行勾选的方法
			 */
			selectionClear() {
				this.selectionList = [];
				this.$refs.crud.toggleSelection();
			},
			searchBtn() {
				this.page.currentPage = 1
				this.onLoad()
			},
			getLine() {													
				getHistoryData(this.abnormalInfoId).then(res => {
						this.unit=this.unit=='无量纲'?'':this.unit
						this.chartOptions = {
					        title: {
					          text: ""
					        },
					        tooltip: {
					          trigger: "axis"
					        },
					        xAxis: {
					          boundaryGap: false,
					          data: res.data.data.xarray,
//					          axisLabel:{
//					          	interval:10
//					          }
					        },
					        yAxis: {
								type: 'value',
								axisLabel: {
									color: '#333',
								},
								axisLine: {
									lineStyle: {
										color: '#505b83'
									} // x轴坐标轴颜色
								},
								axisTick: false,
								splitLine: {
									show: true,
									lineStyle: {
										color: '#374062',
										type: 'dashed' //设置背景为虚线
									}
								}						
					        },						
							grid: {
								left: '5%',
								right: '4%',
								bottom: '8%',
								top:'8%',
								containLabel: false
							},
					        visualMap: {
					          show: false,
					          pieces: [
					            {
					              gt: 0,
					              lte: Number(res.data.data.alertValue),
					              color: "green"
					            },
					            {
					              gt: Number(res.data.data.alertValue),
					              color: "red"
					            }
					          ]
					        },
					        series: [
					          {
							    name: '值',
					            type: "line",
					            smooth: true,
					            symbolSize: 0,
					            markLine: {
					              symbolSize: 0.5,
					              lineStyle: {
					                type: "solid",
					                width:2
					              },
					              data: [{
					                  yAxis: res.data.data.alertValue,
					                  lineStyle:{
					                    color:'red',
					                  },
					              }]
					            },
					            data: res.data.data.yarray
					          }
					        ]
						}
						this.infoVisiable=true										
				})									
			},		
			onLoad() {
				this.loading = true;
				getList(this.page.currentPage, this.page.pageSize, this.dateFrom, this.dateTo, this.deptInfoId, this.aliasType, this.statusType,this.treeType,this.abnormalradio,this.systemInfo.systemId).then(res => { //状态类型下拉this.statusType
					if(res.data.success) {
						res.data.data.records.forEach(item => {
							if(item.duration == '' || item.duration == null) {
								item.duration = '-'
							}
							if(item.standardVal == '' || item.standardVal == null) {
								item.standardVal = '-'
							}
						})
						this.data = res.data.data.records
						this.page.total = res.data.data.total;
						this.selectionClear() // 清除行勾选
					} else {
						this.$message.error('操作失败')
					}
					this.loading = false
				})
			},
		}
	};
</script>
<style lang="scss">	
	.swaqAbnormal {
		.el-form-item--mini.el-form-item,
		.el-form-item--small.el-form-item {
			margin-bottom: 10px;
		}
		.table-wrapper {
			.el-card__body {
				height: calc(100% - 35px);
				.avue-crud {
					height: calc(100% - 155px);
				}
			}
			.el-table th>.cell {
				white-space: nowrap;
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
		.el-dialog__body{
			padding-top: 0;
		}
	}
</style>
<style lang="scss" scoped>
    .ab_chartsWrap{
    	width: 100%;
    	height: 300px;
    }
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
		font-size: 14px;
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

</style>