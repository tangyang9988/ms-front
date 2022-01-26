<template>
	<div class="lc_wrap">
		<el-row id="threshold">
			<el-col :span="24" class="table-wrapper">
				<!--<overlay @changeTreeBox="changeTreeBox"></overlay>-->
				<basic-container>
					<el-form :inline="true" class="demo-form-inline" size="small">
						<el-form-item label="机构全称">
							<el-input v-model="query.deptName" placeholder="请输入机构全称"></el-input>
						</el-form-item>
						<el-form-item label="监控因子">
							<el-select size="small" v-model="query.fac" style="width: 150px;">
								<el-option v-for="(item, index) in facList" :key="index" :label="item.value" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<!--搜索按钮-->
						<el-form-item label="" style="margin-left: 10px;">
							<el-button type="primary" size="small" icon="el-icon-search" @click="searchBtn">搜 索</el-button>
							<el-button type="" size="small" icon="el-icon-delete" @click="searchReset">清 空</el-button>
						</el-form-item>
					</el-form>

					<avue-crud ref="crud" v-model="form" :option="option" :table-loading="loading" :data="data" :page.sync="page" 
						@refresh-change="refreshChange" @search-change="searchChange" 
						@selection-change="selectionChange" @current-change="currentChange" 
						@size-change="sizeChange" @search-reset="searchReset">
						<template slot="menuLeft">
							<el-button type="primary" size="small"  icon="el-icon-postcard" @click="upData_Some" :disabled="selectionList.length==0">批量更新</el-button>
						</template>
					    <template slot-scope="scope" slot="menu">
					        <el-button icon="el-icon-edit"  :size="scope.size" :type="scope.type" @click="upData_One(scope.row)">更新</el-button>
					    </template>						
					</avue-crud>

					<el-dialog title="阈值计算" :visible.sync="showDialog" width="50%" 
						:before-close="beforeClose"
						:append-to-body="true" class="thresholdDialog Dialog_title">
						<el-divider></el-divider>
						<avue-form ref="form" v-model="formParams" :option="formOption" 
							@reset-change="emptytChange" @submit="submit">
						    <template slot-scope="scope" slot="menuForm">
						      <el-button icon="el-icon-mobile" type="primary" @click="computer_result">计 算</el-button>
							  <el-button icon="el-icon-check" type="primary" @click="handleSubmit" v-if="isComputer">保 存</el-button>
							  <el-button icon="el-icon-delete" @click="resetDialog">清 空</el-button>						      
						    </template>							
							<template slot-scope="scope" slot="fac">					
								<div class="block">	
									<div><el-button size="mini"  type="primary" icon="el-icon-plus" @click="add_fac">添加因子</el-button></div>
								    <div class="facList" style="margin-top: 10px;">
								    	<div class="fac_li" style="display: flex;" v-for="(li,index) in facObj">
								    		<div style="width: 200px;">
												<el-select  placeholder="请选择"  v-model="li.facId" size="mini">
												    <el-option
												      v-for="item in facList"
												      :key="item.value"
												      :label="item.value" 
												      :value="item.id"
												      >
												    </el-option>
												</el-select>								    			
								    		</div>
								    		<div style="margin-left: 10px;">
								    			<el-button size="mini"  type="primary" @click="up_fac(index)"  icon="el-icon-upload2">升序</el-button>
								    			<el-button size="mini"  type="primary" @click="down_fac(index)" icon="el-icon-download">降序</el-button>
								    			<el-button size="mini"  type="primary" @click="del_fac(li)" icon="el-icon-delete">删除</el-button>
								    		</div>
								    	</div>
								    </div>
								</div>								
							</template>	                            
						</avue-form>	
						
						<div  v-if="isComputer">
							<avue-crud :data="computerData" :option="computerOption"></avue-crud>
						</div>
					</el-dialog>
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { getThresholdvalList,getFactorList,submitThresholdval,getThresholdVal } from "@/api/psoa32/analysis";
	import { getToken } from "@/util/auth";
	import lcTree from "@/components/common/tree.vue";
	import overlay from "@/components/common/overlay.vue";
	import mixmin from '@/config/mixmin'
	import { threshold,thresholdFormOption,computerOption} from "./column.js"
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			return {
				initId:0,
				facObj:[],
				facvalue:'',
				showDialog: false,
				form: {},
				query: {
					deptName: '',
					factorCode: ''
				},
				facList: null,			
				loading: false,
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
					menu: true,
					column: threshold
				},
				formParams:{},
				formOption:{
		          emptyBtn:false,
		          submitBtn:false,					
				  labelWidth:100,
				  submitText:'保存',
                  column: thresholdFormOption
				},
				computerData:[],
				computerOption:{
					header:false,
					addBtn: false,
					editBtn: false,
					delBtn: false,
					tip: false,
					searchShow: false,
					searchMenuSpan: 6,
					border: true,
					index: true,
					dialogClickModal: false,
					selection: false,
					menu: false,					
					column: computerOption
				},
				data: [],
				selectionList:[], // 选中的所有项
				isComputer:false  // 是否显示 弹框中的 计算表格
			}
		},
		mixins: [mixmin],
		mounted(){
            this.initSearch();
			this.onLoad();
		},
		methods: {
			beforeClose(done){
				this.selectionList=[]
				done()
			},
			// 保存阈值配置
			handleSubmit(){
				let thresholdValVOList=[]
				let arr=[]				
				this.formParams.fac.forEach(item=>{
					arr.push(item.facId)
				})
				let str=arr.join()
				let calculatedParameters={
					"code":str,
					"jcl":this.formParams.jcl,
					"zql":this.formParams.zql
				}
				this.computerData.forEach(item=>{
					item.calculatedParameters=JSON.stringify(calculatedParameters)
					thresholdValVOList.push(item)
				})
				submitThresholdval(thresholdValVOList).then(res=>{
					this.$message.success('操作成功')
					this.showDialog=false
					this.onLoad();
				})				
			},
			selectionChange(arr){
				this.selectionList=arr
			},
			// 批量更新操作
			upData_Some(){				
				this.showDialog=true
				this.resetDialog()				
			},
			// 更新操作
			upData_One(obj){
				// 清除所有选项
				this.$refs.crud.toggleSelection()
				this.selectionList=[]
				this.selectionList.push(obj)
				this.showDialog=true
				this.resetDialog()
			},
			resetDialog(){
				this.isComputer=false
				this.formParams={"jcl":'',"zql":'',"fac":''}
				this.facObj=[]
			},
			// 计算操作
			computer_result(){				
				// 请选择超标检出率不能为空
				if(!this.formParams.jcl){
					this.$message.warning('请选择超标检出率...')
					return false					
				}
				// 送检正确率不能为空
				if(!this.formParams.zql){
					this.$message.warning('送检正确率不能为空...')
					return false					
				}				
				// 监测是否有空因子
				let isNullArr=this.isNullArr(this.facObj,'facId')
				if(isNullArr){
					this.$message.warning('因子存在空值,请选择或删除...')
					return false
				}
				// 监测 敏感因子是否重复
				let result=this.removal(this.facObj,'facId')
				if(result.num>0){
					this.$message.warning('存在重复敏感因子,请删除...')
					return false
				}else{	
					let arr=[]
					this.computerData=[]
					this.selectionList.forEach(item=>{
						arr.push(item.deptName)
					})
					let params={
				        "jcl": this.formParams.jcl,
				        "zql": this.formParams.zql,
				        "qy": arr
					}
					getThresholdVal(params).then(res=>{
						this.selectionList.forEach(item=>{
							item.thresholdVal=res.data.data
							this.computerData.push(item)
						})
						this.formParams.fac=result.result
						this.isComputer=true					
					})
	
				}

			},
			// 初始化操作搜索栏
			initSearch(){
				getFactorList().then(res=>{
					this.facList=res.data.data
				})
			},				
			up_fac(index){
				this.zIndexUp(this.facObj,index)
			},
			down_fac(index){
				this.zIndexDown(this.facObj,index)
			},
			del_fac(item){
				this.delArr(this.facObj,'id',item.id)
			},
			add_fac(){
				this.initId++
				let obj={
					facId:'',
					sort:0,
					id:this.initId
				}
				this.facObj.push(obj)
			},
			//自定义搜索清空事件
			searchReset() {
				this.query={
					deptName: '',
					factorCode: ''
				},
				this.page.currentPage = 1
				this.onLoad();
			},
			searchBtn() {
				this.page.currentPage = 1
				this.onLoad()
			},
			onLoad() {
				this.loading = true;
		        let params = Object.assign({}, this.query, {
		          current: this.page.currentPage,
		          size: this.page.pageSize
		        })	
		        getThresholdvalList(params).then(res=>{
					this.data = res.data.data.records
					this.page.total =res.data.data.total
					this.loading = false;
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
	
	.el-row {
		height: calc(100% - 20px);
	}
	
	.el-col {
		height: 100%;
		overflow: auto;
	}
</style>