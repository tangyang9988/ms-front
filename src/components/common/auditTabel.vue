<template>
	<div class="auditData">
		<avue-crud :option="option" :table-loading="tableLoading" :data="data" 
			@current-change="currentChange" 
			@size-change="sizeChange" :page.sync="page" v-model="form" ref="crud">
			<template slot="menu" slot-scope="scope">
				<el-button icon="el-icon-edit" size="small" type="text" style="padding: 0;" @click="edit(scope.row)" v-if="!scope.row.showInput">修改</el-button>
				<el-button icon="el-icon-edit" size="small" type="text" style="padding: 0;" @click="save(scope.row)" v-if="scope.row.showInput">保存</el-button>
				<el-button icon="el-icon-edit" size="small" type="text" style="padding: 0;" @click="cancel(scope.row)" v-if="scope.row.showInput">取消</el-button>
				<el-button icon="el-icon-magic-stick" size="small" type="text" style="padding: 0;" @click="contrast(scope.row)">化验对比</el-button>			
			</template>

			<template :slot="item.factorCode" slot-scope="scope" v-for="(item,index) in factorList">
				<div v-if="formatFactorList(item)=='011_2'">						
					<el-switch
					  v-if="scope.row.showInput"
					  :disabled="false"
					  v-model="scope.row['011_2Edit']"	
					  active-color="#13ce66"
					  :active-value="activeValue"
					  :inactive-value="inactiveValue"
					  inactive-color="#ff4949">
					</el-switch>
					<el-switch
					  v-if="!scope.row.showInput"
					  :disabled="true"
					  v-model="scope.row['011_2']"	
					  active-color="#13ce66"
					  :active-value="activeValue"
					  :inactive-value="inactiveValue"
					  inactive-color="#ff4949">
					</el-switch>						
				</div>				
				<div v-else-if="formatFactorList(item)=='011_1'">						
					<el-switch
					  v-if="scope.row.showInput"
					  v-model="scope.row['011_1Edit']"	
					  :disabled="false"
					  active-color="#13ce66"
					  :active-value="activeValue"
					  :inactive-value="inactiveValue"
					  inactive-color="#ff4949">
					</el-switch>	
					<el-switch
					  v-if="!scope.row.showInput"	
					  v-model="scope.row['011_1Edit']"	
					  :disabled="true"
					  active-color="#13ce66"
					  :active-value="activeValue"
					  :inactive-value="inactiveValue"
					  inactive-color="#ff4949">
					</el-switch>						
				</div>
				<div v-else>
					<div v-if="scope.row.showInput">
						<el-input size="mini" v-model="scope.row[item.factorCode+'Edit']"></el-input>
					</div>
					<div v-if="!scope.row.showInput">
						<!--补录-->
						<el-tag type="success" style="height: 28px;line-height: 24px;" v-if="scope.row[item.factorCode+'modificationMethod']==1" effect="dark" color="#50E3C2" :disable-transitions="true">
							{{scope.row[item.factorCode]}}
						</el-tag>
						<!--修约-->
						<el-tag type="warning" style="height: 28px;line-height: 24px;" v-else-if="scope.row[item.factorCode+'modificationMethod']==2" effect="dark" :disable-transitions="true">
							{{scope.row[item.factorCode]}}
						</el-tag>
						<!--正常数据-->
						<div v-else>{{scope.row[item.factorCode]}}</div>
					</div>
				</div>				
			</template>
		</avue-crud>
		<el-dialog title="化验对比" :visible.sync="showDialog" width="50%" :append-to-body="true" class="Dialog_title">
			<el-divider></el-divider>
			<avue-form ref="contrastForm" v-model="formParams" :option="formOption" 
				@reset-change="emptytChange" @submit="submit">	
			</avue-form>
		</el-dialog>			
	</div>
</template>

<script>
	import { saveHistoryData,getList,getHead } from "@/api/audit/public";
	import { contrastFormOption } from "@/components/common/option/column.js";
	export default {
		data() {
			return {
				formParams:{},
				formOption:{
				   column:contrastFormOption
				},
				showDialog:false,
				activeValue:1,
				inactiveValue:0,
				one:false,  // 表头是否含有净化器
				tow:false,  // 表头是否含有风机
				dateTime: null,
				startTime: null,
				endTime: null,
				deptInfoId: null,
				tableLoading: false,
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				option: {
					stripe: true, // 斑马纹
					emptyText: '暂无数据',
					menu: true,
					menuWidth: 160,
					header: false,
					addBtn: false,
					tip: false,
					searchShow: false,
					border: true,
					index: false,
					editBtn: false,
					delBtn: false,
					column: []
				},
				factorList: []
			}
		},
		props: {
			// 是否显示操作栏
			menu: {
				type: Boolean,
				default: true
			},
			systemInfo:{
				type: Object,
				default: {}
			}
		},
		mounted() {
			this.option.menu = this.menu
		},
		methods: {
			contrast(obj){
				this.showDialog=true
			},
			formatSwitch_011_1(item){
				if(item["011_1Id"]){
					if(item["011_1amenVal"]){
						return Number(item["011_1amenVal"])
					}else{
						return Number(item["011_1"])
					}
				}else{
					return 0
				}
			},
			formatSwitch_011_2(item){
				if(item["011_2Id"]){
					if(item["011_2amenVal"]){
						return Number(item["011_2amenVal"])
					}else{
						return Number(item["011_2"])
					}
				}else{
					return 0
				}
			},			
			formatFactorList(item){
				return item.factorCode
			},
			validation(dateTime, startTime, endTime) {
				let result = {
					status: true,
					message: ''
				}
				if(startTime >= endTime) {
					result.status = false
					result.message = '开始时间不能大于结束时间'
				}
				if(!dateTime) {
					result.status = false
					result.message = '请选择日期'
				}
				if(!startTime) {
					result.status = false
					result.message = '请选择日期的开始时间'
				}
				if(!endTime) {
					result.status = false
					result.message = '请选择日期的结束时间'
				}
				return result
			},			
			// 每页显示
			sizeChange(pageSize) {
				this.page.pageSize = pageSize
				this.onLoad(true, this.dateTime, this.startTime, this.endTime, this.deptInfoId)
			},
			//  页签点击事件
			currentChange(page) {
				this.page.currentPage = page
				this.onLoad(false, this.dateTime, this.startTime, this.endTime, this.deptInfoId)
			},
			edit(row) {
				row.showInput = true
			},
			cancel(row) {
				row.showInput = false
			},
			save(row) {
				// 需求 小数点不能超过3位 整数部位不超过9位
				let reg = /^\d{1,9}(?:\.\d{1,3})?$/
				let status = true
				for(var x in row) {
					if(x.indexOf('Edit') >= 0 && row[x]) {
						if(!reg.test(Number(row[x]))) {
							status = false
						}
					}
				}
				if(!status) {
					this.$message({
						message: '请输入正确的因子值(小数点不能超过3位)',
						type: 'error'
					});
				} else {
					let params = JSON.stringify(row)
					saveHistoryData(params).then(res => {
						this.onLoad(false, this.dateTime, this.startTime, this.endTime, this.deptInfoId)
					})
				}
			},
			/*** 获取表头数据因子*/
			getTableHead(nodeId) {					
				let _this = this				
				return new Promise(function(resolve, reject) {
					getHead(nodeId,_this.systemInfo.auditHeadUrl).then(res => {			
						let tableHead = []
						tableHead.push({
							label: '时间',
							prop: 'collTime',
							align: 'center',
							fixed: 'left',
							width: 160
						})
						res.data.data.forEach(item => {		
							// 判断表头的代码是否含有011_1和011_2 如果有需要渲染成开关组件
							if(item.factorCode=='011_1'){	
								_this.one=true
								tableHead.push({
									label: '净化器',
									prop: item.factorCode,
									align: 'center',
									width: 120,
									slot: true
								})									
							}
							else if(item.factorCode=='011_2'){
								_this.two=true
								tableHead.push({
									label: '风机',
									prop: item.factorCode,
									align: 'center',
									width: 120,
									slot: true
								})									
							}
							else{
	                            tableHead.push({
									label: item.unit?`${item.alias}(${item.unit})`:`${item.alias}`,
									prop: item.factorCode,
									align: 'center',
									slot: true
								})								
							}
						})						
						_this.factorList = res.data.data
						_this.option.column = tableHead
						resolve(res.data.data)
					},error=>{
						_this.tableLoading = false
					})
				})
			},
			checkArr(arr,field){
				let result=false
				for(var i=0;i<arr.length;i++){
					if(arr[i].code==field){
						result=true
						break;
					}
				}
				return result
			},
			onLoad(resize, dateTime, startTime, endTime, deptInfoId) {				
				this.dateTime = dateTime
				this.startTime = startTime
				this.endTime = endTime
				this.deptInfoId = deptInfoId
				this.tableLoading = true
				let validation = this.validation(dateTime, startTime, endTime)				
				if(!validation.status) {
					this.$message({
						message: validation.message,
						type: 'error'
					});
					return false
				}
				if(resize) {
					this.page.currentPage = 1
				}
				let that = this
				that.data = []
				that.getTableHead(deptInfoId).then(resHead => {
					
					let STARTTIME = dateTime + ' ' + startTime
					let ENDTIME = dateTime + ' ' + endTime
					// 获取时间段
					getList(deptInfoId, STARTTIME, ENDTIME, this.page.currentPage,this.page.pageSize,this.systemInfo.auditServer).then(res => {
						that.tableLoading = false
						// modificationMethod null正常  1补录 2修改
						res.data.data.records.forEach(item => {
							let hasOne=that.checkArr(item.factorList,'011_1')
							let hasTwo=that.checkArr(item.factorList,'011_2')
							
							let obj = {
								collTime: item.collTime || '-',
								showInput: false,
								id: item.id,
								bizId: that.deptInfoId
							}
							// 针对每一个因子 初始化属性
							
							that.factorList.forEach(el => {								
								if(el.factorCode!='011_1' && el.factorCode!='011_2'){
									obj[el.factorCode] = ''
									obj[el.factorCode + 'modificationMethod'] = null
									obj[el.factorCode + 'Edit'] = ''
									obj[el.factorCode + 'amenVal'] = ''
									obj[el.factorCode + 'Id'] = ''	
								}
							})
							// 表头返回了 数据没返回 创造数据
							if(that.one && !hasOne){
								obj["011_1Id"]=''
								obj["011_1Edit"]=0
								obj["011_1"]=0  // 011_1显示值 且不可以点击
							}							
							if(that.two && !hasTwo){
								obj["011_2Id"]=''
								obj["011_2Edit"]=0
								obj["011_2"]=0  // 011_2显示值 且不可以点击
							}
							
							// 接口因子值  value 表示原始值 操作时不会改变（留底）  amenVal表示修约值（一直在修改的值）
							item.factorList.forEach(el => {	
								// 已排除 表头返回数据不返回的情况 现在只可能是 表头返回 数据返回
								if(el.code=="011_1"){
									obj["011_1Id"]=el.id
									// 如果存在修约值 显示值和修约值一样
									if(el.amenVal){
										obj["011_1Edit"]=Number(el.amenVal)
										obj["011_1"]=Number(el.amenVal)
									}else{
										obj["011_1Edit"]=Number(el.value)
										obj["011_1"]=Number(el.value)
									}									
								}
								if(el.code=="011_2"){
									obj["011_2Id"]=el.id
									if(el.amenVal){
										obj["011_2Edit"]=Number(el.amenVal)
										obj["011_2"]=Number(el.amenVal)
									}else{
										obj["011_2Edit"]=Number(el.value)
										obj["011_2"]=Number(el.value)
									}  									
								}

                                if(el.code!='011_1' && el.code!='011_2'){
									// el.code 因子编号
									for(var x in obj) {
										// 数据状态（原始数据/修约/补录）赋值
										if(el.code + 'modificationMethod' == x) {
											obj[el.code + 'modificationMethod'] = el.modificationMethod
										}
										// 最终值赋值（如果原始值为空就是补录/不为空就是修约）
										if(el.code + 'amenVal' == x) {
											obj[el.code + 'amenVal'] = el.amenVal
										}
										// 因子ID
										if(el.code + 'Id' == x){
											obj[el.code + 'Id'] = el.id
										}
									}									
									//  显示值赋值
									//  如果是补录 就显示最终值
									if(el.modificationMethod == 1) {
										obj[el.code] = el.amenVal || ''
									}
									// 如果是修约 
									else if(el.modificationMethod == 2) {
										obj[el.code] = el.amenVal + ' (' + el.value + ')'
									} else {
										obj[el.code] = el.value
									}
									// 显示值 赋值	
									// 编辑值赋值(如果最终值为空就用原始值/如果最终值不为空就用最终值)
									if(!el.amenVal) {
										obj[el.code + 'Edit'] = el.value || ''
									} else {
										obj[el.code + 'Edit'] = el.amenVal || ''
									}																				                                	
                              }
							})
							
							that.data.push(obj)
						})
						that.page.total = res.data.data.total;
					}, error => {						
						that.tableLoading = false
					})
				}, error => {					
					that.tableLoading = false
				})
			}
		}

	}
</script>

<style lang="scss">
	.auditData {
		.el-table th>.cell {
			white-space: nowrap;
		}
		.el-tag--dark.el-tag--warning {
			/*color: #888;*/
			background: #FADB14;
			border-color: #FADB14;
		}
		.el-dialog__body {
			padding: 10px 20px;
		}
		.el-tag--dark.el-tag--success {
			/*color: #888;*/
			background: #50e3c2;
			border-color: #50e3c2;
		}
		.el-table__fixed {
			height: calc(100% - 12px)!important;
		}
		.el-table__fixed-right {
			height: calc(100% - 12px) !important;
		}
		.el-input__inner {
			border: 1px solid #DCDFE6!important;
		}
	}
</style>