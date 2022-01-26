<!--历史数据/综合数据-->
<template>
	<div class="tabelContainer">
		<el-row>
			<el-col :span="leftWidth">
				<div class="box treeBox">
					<basic-container>
						<lcTree @ready="ready" :deviceType='systemInfo.treeType' :queryId="auditTreeParams.bizId"></lcTree>
					</basic-container>
				</div>
			</el-col>
			<el-col :span="rightWidth" class="table-wrapper">
				<overlay @changeTreeBox="changeTreeBox"></overlay>
				<basic-container>
					<div class="search-tools">
						<div class="search-left">
							<span style="font-size: 14px;">日期:</span>
							<el-date-picker v-model="dateTime" type="date" size="small" :picker-options="pickerOption" @change="changeTime" value-format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" class="timePicker">
							</el-date-picker>
							<span class="timePicker" style="font-size: 14px;">时间段:</span>
							<el-time-picker size="small" v-model="startTime" placeholder="开始时间" format="HH:mm:ss" :clearable="false" value-format="HH:mm:ss" @change="changeTime" class="timePicker">
							</el-time-picker>
							<span class="timePicker" style="font-size: 14px;">至</span>
							<el-time-picker size="small" v-model="endTime" @change="changeTime" format="HH:mm:ss" :clearable="false" value-format="HH:mm:ss" placeholder="结束时间" class="timePicker">
							</el-time-picker>
						</div>
						<div class="search-right">
							<div class="search-tabs">
								<div style="display: flex;align-items: center;">
									<span class="square1"></span>
									<span class="square_word">修改</span>
								</div>
								<div style="display: flex;align-items: center;">
									<span class="square2"></span>
									<span class="square_word">补录</span>
								</div>
							</div>
							<div class="searcg-btns">
								<el-button type="primary" size="small" @click="submit" :loading="submitBtnLoading" v-if="permissionList.submitBtn">提交数据</el-button>
							</div>
						</div>
					</div>
					<auditTabel ref="auditTabel" :menu="permissionList.editBtn" :systemInfo="systemInfo"></auditTabel>
				</basic-container>
			</el-col>
		</el-row>
		<el-dialog append-to-body title="提示" :visible.sync="submitTips" width="30%" :before-close="handleClose">
			<p>修改数据 {{auditData.modifiedCount}} 条 补录数据 {{auditData.menRegatherCount}} 条</p>
			<p>请确保今日所有修改补录操作已完成(确认提交后,今日所有数据都将提交)</p>
			<span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="submitData" :loading="submitDataLoading">确认提交</el-button>
		    <el-button  @click="submitTips = false">取消</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
	import { checkAuditData, saveAuditLog } from "@/api/audit/public";
	import { mapGetters } from "vuex";
	import { system } from "./option/system.js";
	import lcTree from "@/components/common/auditTree.vue";
	import auditTabel from "@/components/common/auditTabel.vue";
	import { dateFormat } from "@/util/date";
	import { getStore, removeStore } from '@/util/store'
	import overlay from "@/components/common/overlay.vue";
	export default {
		components: {
			lcTree,
			auditTabel,
			overlay
		},
		data() {
			return {
				submitBtnLoading: false,
				// 已经提交的数据值
				auditData: {
					modifiedCount: 0,
					menRegatherCount: 0
				},
				submitDataLoading: false,
				pickerOption: {
					disabledDate(time) {
						return time.getTime() > Date.now() - 3600 * 1000 * 24
					}
				},
				submitTips: false,
				dateTime: '',
				startTime: '00:00:00', // 初始化日期的开始时间
				endTime: '23:59:59', // 初始化日期的结束时间
				leftWidth: this.$leftWidth,
				rightWidth: this.$rightWidth,
				form: {},
				data: [],
				query: {},
				deptInfoName: '', // 记录当前站点名字 
				deptInfoId: '', // 记录当前站点ID
				nodeId: null
			};
		},
		props: {
			systemId: {
				type: Number,
				default: 0
			}
		},
		beforeDestroy() {
			removeStore({
				name: 'auditTreeParams'
			})
		},
		mounted() {
			// 查询参数分发到tree组件 和页面
			if(this.auditTreeParams.collectionDate) {
				this.dateTime = this.auditTreeParams.collectionDate
			} else {
				this.dateTime = dateFormat(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
			}
		},
		computed: {
			...mapGetters(["permission"]),
			permissionList() {
				return {
					submitBtn: this.permission.auditData_submit,
					editBtn: this.permission.auditData_edit
				};
			},
			auditTreeParams() {
				let str = getStore({
					name: 'auditTreeParams'
				})
				let result = {
					bizId: '',
					collectionDate: ''
				}
				if(str) {
					result = JSON.parse(str)
				}
				return result
			},
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
		methods: {
			// 改变时间
			changeTime() {
				this.$refs.auditTabel.onLoad(true, this.dateTime, this.startTime, this.endTime, this.deptInfoId)
			},
			// 提交数据前查询数据
			submit() {
				this.submitBtnLoading = true
				let params = {
					bizId: this.deptInfoId,
					collectDate: this.dateTime
				}
				let that = this
				checkAuditData(params).then(res => {
					that.submitBtnLoading = false
					that.auditData.modifiedCount = res.data.data.modifiedCount
					that.auditData.menRegatherCount = res.data.data.menRegatherCount
					that.submitTips = true
				}, error => {
					that.submitBtnLoading = false
				})
			},
			// 提交数据
			submitData() {
				let params = {
					bizId: this.deptInfoId,
					collectDate: this.dateTime
				}
				this.submitDataLoading = true
				let that = this
				saveAuditLog(params).then(res => {
					that.submitDataLoading = false
					that.submitTips = false // 关闭弹框
					that.$message({
						message: '操作成功',
						type: 'success'
					})
					that.$refs.auditTabel.onLoad(true, that.dateTime, that.startTime, that.endTime, that.deptInfoId)
				}, error => {
					that.submitDataLoading = false
				})
			},
			ready(data) {
				if(data.nodeType < 2) {
					return false
				}
				this.nodeId = data.key
				this.deptInfoName = data.title
				this.deptInfoId = data.key
				this.$refs.auditTabel.onLoad(true, this.dateTime, this.startTime, this.endTime, this.deptInfoId)
			},
			changeTreeBox() {
				this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth
				this.rightWidth = this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth
			}
		}
	};
</script>
<style lang="scss" scoped>
	.timePicker {
		margin-left: 10px;
	}
	
	.box {
		height: 100%;
		margin-bottom: 0;
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