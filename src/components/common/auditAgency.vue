<!--历史数据/综合数据-->
<template>
	<div class="tabelContainer auditAgency">
		<el-row>
			<!--<el-col :span="leftWidth">
				<div class="box">
					<basic-container>
						<lcTree @ready="ready" :deviceType='deviceType'></lcTree>
					</basic-container>
				</div>
			</el-col>-->
			<el-col span="24" class="table-wrapper">
				<basic-container>
					<div class="search-tools">
						<div class="search-left">
							<el-date-picker size="small" v-model="dataTime" @change="changeTime" format="yyyy-MM-dd" :clearable="true" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期时间" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
							</el-date-picker>

						</div>
					</div>
					<avue-crud :option="option" :table-loading="loading" :page.sync="page" @current-change="currentChange" @size-change="sizeChange" :data="data" v-model="form" ref="crud">
						<template slot="menu" slot-scope="scope">
							<el-popconfirm title="是否确认提交这条数据？" v-if="scope.row.taskKey=='submit'" @onConfirm="confirmSubmit(scope.row)">
								<el-button slot="reference" icon="el-icon-edit" size="small" type="text">提交</el-button>
							</el-popconfirm>
							<el-button icon="el-icon-folder-checked" size="small" type="text" @click="view(scope.row)" v-if="scope.row.taskKey!='submit'">审核</el-button>
						</template>
						<template :slot="item.factorCode" slot-scope="scope" v-for="(item,index) in factorList">
							<div v-if="scope.row.showInput">
								<el-input size="mini" v-model="scope.row[item.factorCode]" placeholder="请输入内容"></el-input>
							</div>
							<div v-if="!scope.row.showInput">
								<!--<el-tag type="warning" effect="dark" color="#FADB14" >{{scope.row[item.factorCode]}}</el-tag>-->
								<el-tag type="success" effect="dark" color="#50E3C2">{{scope.row[item.factorCode]}}</el-tag>
							</div>
						</template>
						<template slot-scope="scope" slot="dataForm">
							<div class="dataForm_page">
								<auditTabel ref="auditTabel" :menu="false" :systemInfo="systemInfo"></auditTabel>
							</div>
						</template>
						<template slot-scope="scope" slot="opinionForm">
							<div>
								<el-timeline>
									<el-timeline-item :timestamp="item.completeTime" placement="top" v-for="(item,index) in processList" :key="index">
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
							</div>
						</template>
						<template slot-scope="scope" slot="commentForm">
							<div>
								<div>
									<textarea name="" rows="5" cols="5" class="comment_textarea" v-model="taskParams.comment"></textarea>
								</div>
								<div style="text-align: center;margin-top: 20px;">
									<el-button type="primary" style="padding: 12px 40px;" @click="submitTask(1)" :loading="submitTaskLoading">审核通过</el-button>
									<el-button style="padding: 12px 40px;" @click="submitTask(0)" :loading="submitTaskLoading">审核驳回</el-button>
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
	import { getAgencyList, getAuditProcess, completeTask } from "@/api/audit/public";
	import { mapGetters } from "vuex";
	import { system } from "./option/system.js";
	import lcTree from "@/components/common/tree.vue";
	import { column, group } from "./option/auditAgency.js"
	import auditTabel from "@/components/common/auditTabel.vue";
	import $ from 'jquery'
	export default {
		components: {
			lcTree,
			auditTabel
		},
		data() {
			return {
				loading: false,
				submitTaskLoading: false,
				taskParams: {
					dataAuditLogId: '',
					processInstanceId: '',
					taskId: '',
					comment: '',
					pass: null
				},
				startTime: '',
				endTime: '',
				processList: [],
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 3600 * 1000 * 24
					},
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
					menuPosition: 'center',
					menu: true,
					viewTitle: '审核',
					header: false,
					addBtn: false,
					tip: false,
					searchShow: false,
					border: true,
					index: false,
					editBtn: false,
					delBtn: false,
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
				nodeId: null
			};
		},
		props: {
			systemId: {
				type: Number,
				default: 0
			}
		},
		computed: {
			...mapGetters(["permission"]),
			systemInfo() {
				let obj = null
				let systemType = localStorage.getItem('systemType');
				for(var i = 0; i < system.length; i++) {
					if(system[i].systemId == systemType) {
						obj = system[i];
						break;
					}
				}
				return obj
			}
		},
		mounted() {
			this.onLoad()
		},
		methods: {
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
			confirmSubmit(row) {
				let obj = {
					bizId: row.bizId, //id
					collectionDate: row.collectionDate //模板名称			
				}
				this.$store.commit('SET_AUDITTREEPARAMS', {
					value: JSON.stringify(obj)
				})
				this.$router.push({
					path: '/audit/data/index'
				})
			},
			submitTask(pass) {
				let that = this
				this.submitTaskLoading = true
				this.taskParams.pass = pass
				completeTask(this.taskParams).then(res => {
					that.submitTaskLoading = false
					that.$refs.crud.closeDialog()
					that.onLoad()
				}, function(err) {
					that.submitTaskLoading = false
				})
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
			// 获取审核流程时间轴数据
			getAuditProcess(processInstanceId) {
				getAuditProcess(processInstanceId).then(res => {
					this.processList = res.data.data
				})
			},
			view(row) {
				// 请求数据		
				console.log(row)
				let that = this
				this.taskParams.dataAuditLogId = row.id
				this.taskParams.processInstanceId = row.processInstanceId
				this.taskParams.taskId = row.taskId
				this.getAuditProcess(row.processInstanceId)
				that.$refs.crud.rowView(row, row.$index);
				// 必须要延时 否则没有 auditTabel 实例 因为avue 弹框用的是 v-if机制 100是动画时间
				setTimeout(() => {
					that.$refs.auditTabel.onLoad(true, row.collectionDate, '00:00:00', '23:59:59', row.bizId)
				}, 0)
			},
			ready(data) {
				if(data.nodeType != 2) {
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
			edit(row) {
				row.showInput = true
			},
			save(row) {
				row.showInput = false
			},
			onLoad() {
				let params = {
					current: this.page.currentPage,
					end: this.endTime,
					size: this.page.pageSize,
					start: this.startTime,
				}
				let that = this
				this.loading = true
				getAgencyList(params).then(res => {
					this.loading = false
					this.data = res.data.data.records
					this.page.total = res.data.data.total;
				}, error => {
					that.loading = true
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
	
	.comment_textarea {
		width: 100%;
		padding: 15px 20px;
		box-sizing: border-box;
		border: 1px solid #DEDEDE;
		border-radius: 4px;
		color: #666;
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