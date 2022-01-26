<template>
	<div class="lc_wrap">
		<el-row class="deviceinfo">
			<el-col :span="24">
				<basic-container>
					<avue-crud :option="option" :table-loading="loading" :data="data" 
						:page="page" :permission="permissionList" 
					    v-model="form" ref="crud" @row-update="rowUpdate" 
						@row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" 
						 @current-change="currentChange" @size-change="sizeChange" 
						@refresh-change="refreshChange" @on-load="onLoad">
					</avue-crud>
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	import { getList,submitFlowconfig,remove} from "@/api/system/processConfiguration";
	import { mapGetters } from "vuex";
	import website from "@/config/website";
	export default {
		data() {
			return {
				tenantId:'',
				form: {},
				loading: false,
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				option: {
					addBtn: true,
					editBtn: true,
					delBtn: true,
					viewBtn: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					dialogClickModal: false,
					column: [
						{
							label: "租户名称",
							prop: "tenantName",
							align: "center",
							display:false
						},
						{
							label: "租户名称",
							prop: "tenantId",
							align: "center",
							search: true,
						    type: "select",
						    hide:true,
						    dicUrl: "/api/blade-system/tenant/select",   
						    props: {
								label: "tenantName",
								value: "tenantId"
						    }							
						},	
						{
							label: "系统类型",
							prop: "stName",
							align: "center",
							display:false
						},						
						{
							label: "系统类型",
							prop: "st",
							align: "center",
						    type: "select",
						    dataType: "number",
						    hide:true,
						    dicUrl: "/api/blade-system/dict/dictionary?code=biz_type",   
						    props: {
						        label: "dictValue",
						        value: "dictKey"
						    }
						},						
						{
							label: "流程类型",
							prop: "flowTypeName",
							align: "center",
							display:false
						},						
						{
							label: "流程类型",
							prop: "flowType",
							align: "center",
							hide:true,
							dataType: "number",
						    type: "select",
						    dicUrl: "/api/blade-system/dict/dictionary?code=flow",   
						    props: {
						        label: "dictValue",
						        value: "dictKey"
						    }								
						},
						{
							label: "流程名称",
							prop: "flowName",
							align: "center"
						}
					]
				},
				data: []
			};
		},
		computed: {
			...mapGetters(["permission"]),
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.templateconfig_add, false),
					viewBtn: this.vaildData(this.permission.templateconfig_view, false),
					delBtn: this.vaildData(this.permission.templateconfig_delete, false),
					editBtn: this.vaildData(this.permission.templateconfig_edit, false),
				};
			}

		},
		methods: {
			onLoad() {
				this.loading = true;
				getList(this.page.currentPage,this.page.pageSize,this.tenantId).then(res => {
					console.log(res)
					this.loading = false
					this.data=res.data.data.records
					this.page.total=res.data.data.total
				},error=>{
					this.loading = false
				})
			},		
			rowSave(row, done, loading) {			
				submitFlowconfig(row).then(() => {
					this.onLoad();
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					loading();
					
				});
			},
			rowUpdate(row, index, done, loading) {
				submitFlowconfig(row).then(() => {
					this.onLoad();
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					loading();
				
				});
			},
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
						this.onLoad(this.page);
						this.$message({
							type: "success",
							message: "操作成功!"
						});
					});
			},
            // 清空按钮
			searchReset() {
				this.tenantId=''
				this.onLoad();
			},
			// 搜索按钮
			searchChange(params, done) {
				this.tenantId=params.tenantId
				this.page.currentPage = 1;
				this.onLoad();
				done();
			},
			currentChange(currentPage) {
				this.page.currentPage = currentPage;
				this.onLoad();
			},
			sizeChange(pageSize) {
				this.page.pageSize = pageSize;
				this.onLoad();
			},
			refreshChange() {
				this.onLoad();
			}
		}
	};
</script>
<style lang="scss">
	.deviceinfo {
		.el-card__body {
			height: calc(100% - 35px);
			.avue-crud {
				height: calc(100% - 105px);
			}
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
	}

	.el-row {
		height: calc(100% - 20px);
	}

	.el-col {
		height: 100%;
		overflow: auto;
	}

	.overlay {
		position: absolute;
		width: 200px;
		height: 100%;
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
