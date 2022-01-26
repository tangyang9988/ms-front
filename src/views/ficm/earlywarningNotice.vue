<template>
    <div class="reaizewrap">
		<div class="reaize_box" ref="box" id="reaize_box">
			<div class="left" ref="left" id="left">
				<div class="leftTreeWrap box treeBox">
					<lcTree @ready="ready" :deviceType='systemInfo.treeType'></lcTree>
				</div>
			</div>
			<div class="resize" ref="resize" id="resize">
				<img src="/img/show.png" alt="" class="resize_img"/>
			</div>

			<div class="right table-wrapper" ref="right" id="right">
				<avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" :permission="permissionList" 
					:before-open="beforeOpen" :before-close="beforeClose" v-model="form" ref="crud" 
					@row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" 
					@search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" 
					@size-change="sizeChange" @refresh-change="onLoad">
					<template slot="userIdForm" slot-scope="scope">		
						<div class="childForm">
						    <avue-crud :option="infoOption" :data="infoData" :page.sync="childPage" 
						    	 @search-reset="searchChildReset"
						    	 @search-change="searchChildChange"
						    	 @current-change="currentChildChange">				
							  <template slot-scope="scope" slot="menu">
							     <el-button icon="el-icon-plus" :size="scope.size" :type="scope.type" @click="addPerson(scope.row)">添加</el-button>
							  </template>							    	
						    </avue-crud>								    							    
							<el-card class="box-card">
							  <div slot="header" class="clearfix">
							    <span>已选人员</span>
							    <el-button style="float: right; padding: 3px 0" type="text" @click="clearSelection">全部清除</el-button>
							  </div>
							  <div class="childList">
									<el-tag class="tag"
									  v-for="(item,index) in selectionList"
									  :key="index"
									  closable
									  @close="closeSelection(item)"
									  >
									  {{item.name}}
									</el-tag>							    	
							  </div>
							</el-card>							    
						</div>
					</template>	
					<!-- 自定义培训人列 -->
					<template slot-scope="{row}" slot="userNames">
						<el-popover placement="right" title="通知人员:" width="200" trigger="click" :content="row.userNames">
							<el-button type="text" slot="reference">详情</el-button>
						</el-popover>
					</template>						
				</avue-crud>				
			</div>
		</div>
	</div>	
</template>

<script>
	import {getList,getUserList,submitData,getDetail,remove} from "@/api/ficm/early";
	import mixmin from '@/config/mixmin'
	import lcTree from "@/components/common/tree.vue";
    import overlay from "@/components/common/overlay.vue";
	export default {
		components: {
			lcTree,
			overlay
		},
		data() {
			return {
				//  新增编辑绑定参数
				form: {},
				// 主表格加载等待参数
				loading: false,
				// 子表单分页参数
				childPage:{
					pageSize: 10,
					currentPage: 1,
					total: 0					
				},
				// 子表单表格参数
		        infoOption:{
		          editBtn:false,
		          delBtn:false,		          
		          columnBtn:false,
		          header:false,
		          addBtn:false,
		          refreshBtn:false,
		          tip:false,		          
		          column: [{
		            label: '企业名称',
		            prop: 'deptName'	            
		          },{
		            label: '人员名称',
		            prop: 'name',
		            search:true
		          },{
		            label: '用户名称',
		            prop: 'account'
		          }]
		        },
		        // 子表格数据存储
		        infoData:[],
		        // 主表格参数
				option: {					
					addTitle: '新增',
					editTitle: '编辑',
					stripe: true, // 斑马纹
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: false,
					viewBtn: false,					
					dialogClickModal: false,
					labelWidth: 120,
		            column: [
			            {
				            label: '企业名称',
				            prop: 'deptName',
				            display:false
				        },
				        {
				            label: '点位名称',
				            prop: 'siteName',
				            display:false
				        },
				        {
				            label: '通知人员',
				            prop: 'userNames',
				            slot: true,
				            display:false
				        },				        
				        {
				            label: '通知方式',
				            prop: 'sendTypeName',
				            display:false
				        },				        
			        ],
					group:[
			            {
			              label: '通知方式',			              
			              icon: 'el-icon-edit-outline',
			              column: [
			                {
			                  label: '通知方式',
			                  labelWidth:80,
			                  prop: 'sendType',
			                  dataType: "number",
			                  type: 'select',
			                  span: 8,
			                  dicData:[{value: 1, label: '微信'}]
			                },
						    {
								label: '发送开始时间',
								prop: 'sendStartTime',
								type: "time",
								span: 8,
								format:'HH:mm:ss',
                                valueFormat:'HH:mm:ss'                                 
							},
							{
								label: '发送结束时间',
								prop: 'sendEndTime',
								type: "time",
								span: 8,
								format:'HH:mm:ss',
                                valueFormat:'HH:mm:ss'                                
							}		                
			                
			                
			              ]
			            },
			            {
			              label: '人员选择',			              
			              icon: 'el-icon-edit-outline',
			              column: [
			                {
					            labelWidth:0,
					            label: '',
					            prop: 'userId',
					            span:24,
					            hide:true,
					            formslot:true,
			                }
			              ]
			            }			            
					]
				},
				// 主表格数据存储
				data: [],
				// 当前树选中ID
				currentId:null,
				// 当前树选中Key
				currentKey:null,
				// 当前树选中的层级
				currentNodeType:null,
				// 当前树选中的父级KEY 保存时用到
				parentKey:null,
				// 子表单添加人员存储
				selectionList:[],
			};
		},
		mixins:[mixmin],
		computed: {
			permissionList() {

			}
		},
		mounted() {
            this.dragControllerDiv();
		},
		methods: {
			searchChild(userName,done){
				this.childPage.currentPage=1	
				this.childPage.total=0				
                let params={
               	  id:this.currentId,
               	  current:this.childPage.currentPage,
               	  size:this.childPage.pageSize,
               	  treeType:this.currentNodeType,
               	  userName:userName?userName:''
                }					
				getUserList(params).then(res=>{					
					this.infoData=res.data.data.records
					this.childPage.total=res.data.data.total
					if(done)done()
				})					
			},
			// 子表单清除
			searchChildReset(){
				this.searchChild()				
			},
			// 子表单搜索
			searchChildChange(row,done){
				this.searchChild(row.name,done)
			},
			// 删除
			rowDel(row) {
				this.$confirm("确定将选择数据删除?", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						return remove(row.id);
					})
					.then(() => {
						this.onLoad();
						this.$message({
							type: "success",
							message: "操作成功!"
						});
					});
			},
			// 修改
			rowUpdate(row,index,done,loading){
               this.rowSave(row, done, loading)
			},
			// 新增保存
			rowSave(row, done, loading) {
				let arr=[]
				this.selectionList.forEach(item=>{
					arr.push(item.id)
				})
				let params={
					"deptInfoId":this.currentNodeType==2?this.parentKey:this.currentKey,
					"sendType":row.sendType,
					"userId":arr.join(','),
					"siteInfoId":this.currentNodeType==2?this.currentKey:'',
					"id":row.id?row.id:'',
					"sendEndTime":row.sendEndTime,
					"sendStartTime":row.sendStartTime
				}
				if(!params.sendType){
					this.$message.error('请选择通知方式');		
					loading()
					return false
				}
				if(arr.length==0){
					this.$message.error('请添加至少一个人员');	
					loading()
					return false					
				}
				submitData(params).then(res => {					
					this.$message({
						type: "success",
						message: "操作成功!"
					});  
                    this.onLoad();					
					done();
				}, error => {					
					loading();
				});
			},
			// 子表单删除已添加的人员
			closeSelection(row){
				this.delArr(this.selectionList,'id',row.id)
			},
			// 子表单分页页码点击事件
			currentChildChange(page){
				this.childPage.currentPage=page
				this.childPage.total=0
				this.childOnLoad()
			},
			// 清空所添加的人员
			clearSelection(){
				this.selectionList=[]
			},
			// 添加人员
			addPerson(row){
				// 判断是否存在
				if(this.checkArr(this.selectionList,'id',row.id)){
                    this.$message.error('已添加,请勿重复添加');
				}else{
					this.selectionList.push(row)
				}				
			},
			childOnLoad(done){
                let params={
               	  id:this.currentId,
               	  current:this.childPage.currentPage,
               	  size:this.childPage.pageSize,
               	  treeType:this.currentNodeType
                }					
				getUserList(params).then(res=>{
					this.infoData=res.data.data.records
					this.childPage.total=res.data.data.total
					if(done)done()					
				})				
			},
			beforeOpen(done,type){				
				if(type=='add'){
					this.childPage.currentPage=1	
					this.childPage.total=0
					this.selectionList=[]
					this.childOnLoad(done)
				}else{
					getDetail(this.form.id).then(res=>{						
						this.selectionList=res.data.data.userVOList						
						this.childPage.currentPage=1	
						this.childPage.total=0
						this.childOnLoad(done)								
					})				
				}
			},
			ready(data, treeData) { 
			   if(data.nodeType==2){
			   	 this.parentKey=data.parentKey
			   }else{
			   	 this.parentKey=''
			   }
               this.currentId=data.id
               this.currentKey=data.key
               this.currentNodeType=data.nodeType
               this.onLoad()
			},
			onLoad() {
               let params={
               	  id:this.currentId,
               	  current:this.page.currentPage,
               	  size:this.page.pageSize
               }
               getList(params).then(res=>{
               	 this.data=res.data.data.records
               })
			}
		}
	};
</script>
<style type="text/css">
	.childForm .el-col-24 {width: auto;padding-top: 0!important;} 		
</style>
<style lang="scss" scoped>	
	.box {height: 100%;}	
	.el-row {height: calc(100% - 20px);}	
	.el-col {height: 100%;overflow: auto;}
    .childList{min-height: 100px;border:1px solid #EBEEF5;border-radius: 4px;padding: 10px;box-sizing: border-box;
      .tag{margin-right: 4px;margin-bottom: 5px;}
    }	
	.reaizewrap {
		height: calc(100% - 60px);
		background: #F0F0F0;
		.reaize_box {
			width: 100%;
			height: 100%;
			overflow: hidden;
			display: flex;
		}
		.leftTreeWrap {
			height: 100%;
			margin-bottom: 0;
			padding: 15px;
			overflow: scroll;
		}		
		.left {
			width: 16%;
			height: 100%;
			background: #fff;
			border-radius: 4px;
			::-webkit-scrollbar {
				display: none;
			}
		}		
		.resize {
			width: 5px;
			height: 100%;
			cursor: w-resize;
			position: relative;
			.resize_img{position: absolute;top: 50%;width: 19px;left: -10px;margin-top: -61px;z-index: 100;}
		}		
		.right {
			padding: 15px 15px 0;
			flex: 1;
			height: 100%;
			background: #fff;
			overflow: scroll;
			border-radius: 4px;
		}		
	}
	
	* {
		box-sizing: border-box;
	}    
</style>
