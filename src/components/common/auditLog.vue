<!--历史数据/综合数据-->
<template>
	<div class="tabelContainer auditLog">
		<el-row>
			<el-col :span="leftWidth">
				<div class="box treeBox">
					<basic-container>
						<lcTree @ready="ready" :deviceType='deviceType'></lcTree>
					</basic-container>
				</div>
			</el-col>
			<el-col :span="rightWidth" class="table-wrapper">
				<overlay @changeTreeBox="changeTreeBox"></overlay>
				<basic-container>
					<div class="search-tools">
						<div class="search-left">
							<el-date-picker size="small" v-model="dataTime" type="daterange" placeholder="选择日期时间" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" @change="changeTime" :clearable="true" value-format="yyyy-MM-dd" end-placeholder="结束日期" :picker-options="pickerOptions">
							</el-date-picker>
						</div>
					</div>
					<avue-crud :option="option" :table-loading="loading" :data="data" v-model="form" ref="crud" :page.sync="page" @current-change="currentChange" @size-change="sizeChange">
						<template slot="menu" slot-scope="scope">
							<el-button icon="el-icon-view" size="small" type="text" style="padding: 0;" @click="view(scope.row)">查看</el-button>
						</template>
						<template slot-scope="scope" slot="dataForm">
							<div class="dataForm_page" id="hidePage">
								<!--<auditTabel ref="auditTabel" :menu="false"></auditTabel>-->
								<avue-crud :data="viewData" :option="viewOption">
									<template slot="amenVal" slot-scope="scope">
										<div v-if="scope.row.code!='011'&& scope.row.code!='012'">{{scope.row.amenVal}}</div>
										<el-switch v-else :disabled="true" v-model="scope.row.amenVal" :active-value="activeValue" :inactive-value="inactiveValue" active-color="#13ce66" inactive-color="#ff4949">
										</el-switch>
									</template>
									<template slot="collVal" slot-scope="scope">
										<div v-if="scope.row.code!='011'&& scope.row.code!='012'">{{scope.row.collVal}}</div>
										<el-switch v-else :disabled="true" v-model="scope.row.collVal" :active-value="activeValue" :inactive-value="inactiveValue" active-color="#13ce66" inactive-color="#ff4949">
										</el-switch>
									</template>
								</avue-crud>
							</div>
						</template>
						<template slot-scope="scope" slot="opinionForm">
							<div>
								<el-timeline>
									<el-timeline-item :timestamp="formatStamp(item)" placement="top" v-for="(item,index) in processList" :key="index">
										<div class="timelineBox">
											<div>{{item.comment}}</div>
											<div>
												操作人: {{item.userName}}
												<span style="margin-left: 15px;color: #409EFF;" v-if="item.isPass==1">审核通过</span>
												<span style="margin-left: 15px;color: #409EFF;" v-if="item.isPass==0">审核驳回</span>
											</div>
										</div>
									</el-timeline-item>
								</el-timeline>
								<div style="text-align: center;">
									<el-button type="primary" style="padding: 12px 40px;" @click="confirm">确认</el-button>
								</div>
							</div>
						</template>
					</avue-crud>
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import { system } from "./option/system.js";
	import lcTree from "@/components/common/tree.vue";
	import { column, group } from "./option/auditLog.js"
	import { getAuditLogList, getAuditProcess, getDataAuditRecordList } from "@/api/audit/public";
	import overlay from "@/components/common/overlay.vue";
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			return {
				activeValue: '1.000',
				inactiveValue: '0.000',
				viewData: [],
				viewOption: {
					header: false,
					page: false,
					align: 'center',
					border: true,
					menu: false,
					column: [{
							label: '数据时间',
							prop: 'collTime'
						},
						{
							label: '监测因子',
							prop: 'codeName'
						},
						{
							label: '修约数据',
							prop: 'amenVal',
							slot: true
						},
						{
							label: '初始数据',
							prop: 'collVal',
							slot: true
						}
					]
				},
				processList: [],
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				pickerOptions: {
					shortcuts: [{
						text: '最近周(7天)',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近月(30天)',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				dataTime: '',
				option: {
					stripe: true, // 斑马纹
					menu: true,
					header: false,
					addBtn: false,
					tip: false,
					searchShow: false,
					border: true,
					index: false,
					editBtn: false,
					delBtn: false,
					menuTitle: '审核意见',
					dialogClickModal: true,
					column: column,
					group: group
				},
				leftWidth: this.$leftWidth,
				rightWidth: this.$rightWidth,
				form: {},
				data: [],
				query: {},
				deptInfoName: '',
				deptInfoId: '',
				loading: false,
				nodeId: null,
				factorList: []
			};
		},
		computed: {
			...mapGetters(["permission"]),
			deviceType() {
				let obj = null
				let systemType = localStorage.getItem('systemType');
				for(var i = 0; i < system.length; i++) {
					if(system[i].systemId == systemType) {
						obj = system[i];
						break;
					}
				}
				return obj.treeType
			}
		},
		mounted() {

		},
		watch: {

		},
		methods: {
			formatStamp(item) {
				return item.taskName + ' ' + item.completeTime
			},
			// 每页显示
			sizeChange(pageSize) {
				this.page.pageSize = pageSize
				this.onLoad()
			},
			//  页签点击事件
			currentChange(page) {
				this.page.currentPage = page
				this.onLoad()
			},
			// 获取审核流程时间轴数据
			getAuditProcess(processInstanceId) {
				getAuditProcess(processInstanceId).then(res => {
					this.processList = res.data.data
				})
			},
			getDataAuditRecordList(dataAuditLogId) {
				getDataAuditRecordList(dataAuditLogId).then(res => {
					this.viewData = res.data.data
				})
			},
			confirm() {
				this.$refs.crud.closeDialog()
			},
			changeTime(val) {
				this.page.currentPage = 1
				if(val) {
					this.startTime = val[0]
					this.endTime = val[1]
					this.onLoad()
				} else {
					this.startTime = ''
					this.endTime = ''
					this.onLoad()
				}
			},
			view(row) {
				// 请求数据
				let that = this
				that.$refs.crud.rowView(row, row.$index);
				that.getAuditProcess(row.processInstanceId)
				setTimeout(() => {
					that.getDataAuditRecordList(row.id)
				}, 0)
			},
			ready(data) {
				if(data.nodeType < 2) {
					return false
				}
				this.nodeId = data.key
				this.deptInfoName = data.title
				this.deptInfoId = data.key
				this.onLoad()
			},
			changeTreeBox() {
				this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth
				this.rightWidth = this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth
			},
			onLoad() {
				let params = {
					current: this.page.currentPage,
					end: this.endTime,
					size: this.page.pageSize,
					start: this.startTime,
					id: this.deptInfoId
				}
				let that = this
				this.loading = true
				getAuditLogList(params).then(res => {
					this.loading = false
					this.data = res.data.data.records
					this.page.total = res.data.data.total;
				}, error => {
					that.loading = false
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.box {
		height: 100%;
		margin-bottom: 0;
	}
	
	.timelineBox {
		border: 1px solid #ebeef5;
		padding: 10px;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)
	}
	
	.el-row {
		height: 100%;
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
		.square1 {
			width: 15px;
			height: 16px;
			background: #FADB14;
			margin-right: 10px;
			display: block;
		}
		.square2 {
			width: 15px;
			height: 16px;
			background: #50E3C2;
			margin-right: 10px;
			display: block;
		}
		.square_word {
			font-size: 12px;
			margin-right: 10px;
		}
	}
</style>