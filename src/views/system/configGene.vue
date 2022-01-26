<template>
	<div class="tabelContainer">
		<basic-container>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="所属租户">
          <el-select size="small" style="width: 150px;" v-model="query.tenantId">
            <el-option :key="index" :label="item.value" :value="item.id" v-for="(item, index) in tenantNameList"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--搜索按钮-->
        <el-form-item label="" style="margin-left: 10px;">
          <el-button @click="searchBtn()" icon="el-icon-search" size="small" type="primary">搜 索</el-button>
          <el-button @click="searchReset" icon="el-icon-delete" size="small" type="">清 空</el-button>
        </el-form-item>
      </el-form>
			<div class="configGene">
				<avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" v-model="form" ref="crud" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
					<template slot="menuLeft">
						<el-button size="small" type="primary" icon="el-icon-plus" @click="toAdd">新 增</el-button>
					</template>
					<template slot="menu" slot-scope="scope">
						<el-link type="primary" icon="el-icon-edit" style="font-size: 12px;margin-right:10px;" :underline="false" @click="toEdit(scope.row)">编 辑</el-link>
						<el-link type="primary" icon="el-icon-delete" style="font-size: 12px" :underline="false" @click="toDel(scope.row)">删 除</el-link>
					</template>
				</avue-crud>
				<el-dialog title="租户因子配置" :visible.sync="dialogVisiable" :modal="false" @close="beforeDialogClose">
					<el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" style="width:300px;float:left;">
						<el-form-item label="租户名称" v-if="dialogType!='edit'" prop='tenantName'>
							<el-select placeholder="请选择" v-model="dialogForm.tenantName" :disabled="dialogType=='edit'">
								<el-option v-for="(item, index) in tenantList" :key="index" :label="item.value" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="系统名称" v-if="dialogType!='edit'" prop='systemName'>
							<el-select placeholder="请选择" v-model="dialogForm.systemName" :disabled="dialogType=='edit'">
								<el-option v-for="(item, index) in systemList" :key="index" :label="item.value" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="editDiv">
						<p v-if="dialogType=='edit'">租户名称：{{tName}}</p>
						<p v-if="dialogType=='edit'">系统名称：{{sName}}</p>
					</div>
					<el-transfer v-model="transferModel" style="width:600px;" :data="transferData" :props="{key:'id',label:'name'}" :titles="['系统因子总表', '租户因子配置']" @change="handleChange"></el-transfer>
					<div style="display:flex;justify-content:center;margin-top:40px;">
						<el-button size="small" type="primary" @click="onsubmit" :loading="submitLoading">提 交</el-button>
						<el-button size="small" @click="closeDialog">取 消</el-button>
					</div>
				</el-dialog>
			</div>
		</basic-container>
	</div>
</template>

<script>
	import { getList, getTenant, getSystem, getTenantGene, getSystemGene, submit, deleteApi } from "@/api/system/configGene";
	import { mapGetters } from "vuex";

	export default {
		data() {
			return {
				query: {},
        tenantNameList: [],
				loading: true,
				dialogVisiable: false,
				dialogClickModal: false,
				submitLoading: false,
				tName: '',
				sName: '',
				dialogForm: {
					tenantName: '',
					systemName: ''
				},
				dialogFormRules: {
					tenantName: [{
						required: true,
						message: '请选择租户名称',
						trigger: 'change'
					}],
					systemName: [{
						required: true,
						message: '请选择系统名称',
						trigger: 'change'
					}]
				},
				dialogType: null,
				transferModel: [],
				transferModel2: [],
				factorCodeList: [],
				transferData: [],
				tenantList: [],
				systemList: [],
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				selectionList: [],
				option: {
					//        height: 'auto',
					calcHeight: 30,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					addBtn: false,
					editBtn: false,
					delBtn: false,
					// selection: true,
					column: [{
						label: "所属租户",
						prop: "tenantName",
						span: 24,
						minRows: 6,
						// hide: true,
					}, {
						label: "租户ID",
						prop: "tenantId",
						span: 24,
						minRows: 6,
					}, {
						label: "系统名称",
						prop: "stName",
						span: 24,
						minRows: 6,
					}, {
						label: "因子数",
						prop: "icount",
						span: 24,
						minRows: 6,
					}, ]
				},
				data: []
			};
		},
		computed: {
			...mapGetters(["permission"]),
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.post_add, false),
					viewBtn: this.vaildData(this.permission.post_view, false),
					delBtn: this.vaildData(this.permission.post_delete, false),
					editBtn: this.vaildData(this.permission.post_edit, false)
				};
			},
		},
		watch: {
			'dialogForm.tenantName' (val) {
				if(this.dialogType != 'edit' && val) {
					this.dialogForm.systemName = '';
					this.toGetSystem()
				}
			},
			'dialogForm.systemName' (val) {
				if(this.dialogType != 'edit' && val) {
					this.transferData = []
					this.transferModel = []
					this.toGetLeftList()
				}
			}
		},
    mounted(){
      getTenant().then(res=>{
        this.tenantNameList = res.data.data
      })

    },
		methods: {
      //自定义搜索清空事件
      searchReset() {
        this.query.tenantId = ''
        this.page.currentPage = 1
        this.onLoad();
      },
      //搜索
      searchBtn(){
        this.page.currentPage = 1
        this.onLoad(this.page,this.query)
      },
			onLoad(page, params = {}) {
				// this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
					this.page.total = data.total;
					this.data = data.records;
					this.loading = false;
				});
			},
			//新增
			toAdd() {
				this.dialogVisiable = true
				this.dialogType = 'add'
				this.transferData = []
				this.transferModel = []
				this.dialogForm.tenantName = ''
				this.dialogForm.systemName = ''
				this.tenantList = []
				this.systemList = []
				this.toGetTenant()
			},
			//租户列表
			toGetTenant() {
				getTenant().then(res => {
					this.tenantList = res.data.data;
				})
			},
			//系统列表
			toGetSystem() {
				getSystem(this.dialogForm.tenantName).then(res => {
					this.systemList = res.data.data;
				})
			},
			//获取左侧列表
			toGetLeftList() {
				let _this = this
				getSystemGene(_this.dialogForm.systemName, _this.dialogForm.tenantName).then(res => {
					_this.transferData = res.data.data
					_this.toGetrightList()
				})
			},
			//获取右侧列表
			toGetrightList() {
				let _this = this
				_this.transferModel = [];
				getTenantGene(_this.dialogForm.systemName, _this.dialogForm.tenantName).then(res => {
					for(let i = 0; i < res.data.data.length; i++) {
						_this.transferModel.push(res.data.data[i].id)
						res.data.data[i].disabled = res.data.data[i].id
					}
					_this.transferModel2 = _this.transferModel
					if(res.data.data.length) {
						_this.transferData = _this.transferData.concat(res.data.data)
					}
				})
			},
			//因子移动
			handleChange(value, direction, movedKeys) {
				this.transferModel = value;
			},
			//提交
			onsubmit() {
				// 验证表单
				let _this = this;
				_this.$refs.dialogForm.validate(vaild => {
					if(vaild) {
						let transferModel3 = []
						_this.factorCodeList = [];
						_this.transferModel.map(item => {
							if(!_this.transferModel2.includes(item)) {
								transferModel3.push(item)
							}
						})
						if(!transferModel3.length > 0) {
							this.$message({
								type: 'error',
								message: '请配置租户因子'
							})
							return
						}
						_this.submitLoading = true
						_this.transferData.map(item => {
							transferModel3.map(ele => {
								if(ele == item.id) {
									_this.factorCodeList.push(item)
								}
							})
						})
						submit(_this.dialogForm.tenantName, _this.factorCodeList).then(res => {
							_this.submitLoading = false
							if(res.data.success) {
								_this.$message.success('操作成功')
								_this.dialogVisiable = false
								_this.onLoad(_this.page)
							} else {
								_this.$message.success('操作失败')
							}
						})
					}
				})
			},
			/*** 弹框关闭的回调*/
			beforeDialogClose() {
				// 清空表单
				this.$refs.dialogForm.resetFields()
			},
			//关闭弹框
			closeDialog() {
				this.dialogVisiable = false
				this.submitLoading = false
			},
			//编辑
			toEdit(row) {
				this.dialogType = 'edit'
				this.dialogForm.systemName = row.st
				this.dialogForm.tenantName = row.tenantId
				this.sName = row.stName
				this.tName = row.tenantName
				this.dialogVisiable = true
				this.toGetLeftList()
			},
			//删除
			toDel(row) {
				deleteApi(row.tenantId, row.st).then(res => {
					if(res.data.success) {
						this.$message({
							type: "success",
							message: res.data.msg
						});
					} else {
						this.$message({
							message: res.data.msg
						});
					}
					this.onLoad(this.page)
				})
			},
			//切换页面时触发该事件
			currentChange(currentPage) {
				this.page.currentPage = currentPage;
			},
			//页面每页显示的条数触发该事件
			sizeChange(pageSize) {
				this.page.pageSize = pageSize;
			},
			//点击刷新按钮触发该事件
			refreshChange() {
				this.onLoad(this.page, this.query);
			},
		}
	};
</script>

<style lang="scss">
	.configGene {
		.el-transfer-panel__item {
			width: auto;
		}
		.el-transfer__buttons {
			padding: 100px 20px;
		}
		.el-dialog__wrapper {
			background: rgba($color: #000000, $alpha: 0.5)
		}
	}
</style>
<style lang="scss" scoped>
	.configGene {
		.el-transfer-panel__item {
			width: auto;
		}
		.el-transfer__buttons {
			padding: 100px 20px;
		}
		.el-dialog__wrapper {
			background: rgba($color: #000000, $alpha: 0.5)
		}
		.editDiv {
			width: 300px;
			float: left;
		}
	}
</style>
