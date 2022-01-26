<template>
	<div class="tabelContainer">
		<basic-container>
			<avue-form ref='form' :option="formOption" v-model="formData" @submit="submitForm" @error="error">
				<!--自定义站点名称 2020/10/10-->
				<template slot-scope="scope" slot="siteInfoId">
					<div>
						<el-input v-model="siteInfoId" placeholder="请输入站点名称" disabled></el-input>
					</div>
				</template>
				<template slot-scope="scope" slot="siteName">
					<div>
						<el-input v-model="siteName" placeholder="请输入站点名称" disabled></el-input>
					</div>
				</template>
			</avue-form>
			<avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad" v-if="$route.query.formType=='edit'">
				<template slot="menuLeft">
					<el-button type="primary" size="small" icon="el-icon-plus" plain v-if="permission.instinfo_addfactor" @click="handleAddFactor(1)">新增因子
					</el-button>
					<el-button type="primary" size="small" icon="el-icon-plus" plain v-if="permission.instinfo_addParamsfactor" @click="handleAddFactor(2)">新增设备参数因子
					</el-button>
					<el-button type="primary" size="small" icon="el-icon-plus" plain v-if="permission.instinfo_batchAdd&&(system=='02'||system=='98')" @click="handleAddBatchFactor">批量新增
					</el-button>
					<el-button type="primary" title="复制其他点位的设备因子" size="small" icon="el-icon-plus" plain @click="handleCopyDevice" v-if="permission.instinfo_copyDevice">复制设备因子
					</el-button>
					<el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.instinfo_deletefactor" @click="handleDelete">删 除
					</el-button>
				</template>
				<!-- 自定义表格行内编辑按钮 -->
				<template slot="menu" slot-scope="scope">
					<el-button type="text" icon="el-icon-edit" size="small" v-if="permission.instinfo_editfactor" @click="handleEdit(scope.row)">编辑
					</el-button>
					<el-button type="text" icon="el-icon-delete" size="small" v-if="permission.instinfo_deletefactor" @click="handleDel(scope.row)">删除
					</el-button>
				</template>
			</avue-crud>

			<el-dialog title="重点环境空气监测因子分组" append-to-body :visible.sync="batchAdd" width="345px">
				<el-tabs type="border-card">
					<el-tab-pane label="请选择因子分组">
						<div style="margin-bottom: 10px;" v-for="(item,index) in batchAddList" :key="index">
							<el-radio v-model="batchAddRadio" :label="item.dictKey">{{item.dictValue}}</el-radio>
						</div>
					</el-tab-pane>
				</el-tabs>

				<span slot="footer" class="dialog-footer">
        <el-button @click="batchAdd = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="submitBatchAddLoading" size="small"
                   @click="submitBatchAdd">确 定</el-button>
      </span>
			</el-dialog>

			<el-dialog title="复制其他点位的设备因子" append-to-body :visible.sync="copyDevice" class="copyDevice" width="700px">
				<el-tabs type="border-card">
					<el-tab-pane label="请选择设备">
						<el-collapse accordion v-model="copyDeviceInfoId">
							<el-collapse-item :title="item.siteName +'--'+ item.deviceName" :name="item.deviceInfoId" v-for="(item,index) in copyData" :key="index">
								<div>
									<span v-for="(item2,index2) in item.factorList" style="margin-right: 8px;">{{item2.name}}</span>
								</div>
							</el-collapse-item>
						</el-collapse>
					</el-tab-pane>
				</el-tabs>
				<span slot="footer" class="dialog-footer">
        <el-button @click="copyDevice = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="copyDeviceLoading"
                   @click="submitCopy" size="small">确 定</el-button>
      </span>
			</el-dialog>

		</basic-container>
	</div>
</template>

<script>
	import { validateInter } from "@/util/rulesReg";
	import {
		getDetail,
		add,
		update,
		remove,
		getSiteList,
		formSubmit,
		getGroupList,
		getInstDetail,
		getFactorList,
		checkMn,
		getVocs98Group,
		saveBatchDeviceFactor,
		getDeviceFactorList,
		copyDeviceFactor
	} from "@/api/ficm/instinfo";
	import { mapGetters } from "vuex";

	export default {
		data() {
			return {
				copyDeviceInfoId: '', // 复制的设备ID
				copyData: [], // 复制数据
				copyDevice: false, // 复制其他点位的设备因子
				copyDeviceLoading: false, //  复制其他点位的设备因子添加因子按钮防重
				submitBatchAddLoading: false, // 确认批量添加因子按钮防重
				batchAdd: false, // 批量添加因子选择类别弹框
				batchAddList: [], // 批量添加因子选项列表
				batchAddRadio: '', // 批量添加因子单选框的值
				form: {},
				query: {},
				loading: false,
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				selectionList: [],
				option: {
					addBtn: false,
					// height:'auto',
					calcHeight: 30,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					viewBtn: true,
					selection: true,
					dialogClickModal: false,
					column: [{
							label: '监控因子',
							prop: 'name',
							align: 'center'
						},
						{
							label: '因子别名',
							prop: 'alias',
							align: 'center'
						},
						{
							label: '单位',
							prop: 'unit',
							align: 'center'
						},
						{
							label: '标识',
							prop: 'identify',
							align: 'center'
						},
            {
              label: '系数',
              prop: 'unitCoefficient',
              align: 'center'
            },
						{
							label: '是否数字量',
							prop: 'isDigital',
							align: 'center',
							dicData: [{
								label: '是',
								value: 1
							}, {
								label: '否',
								value: 0
							}]
						},
					]
				},
				data: [],
				formOption: {
					label: '新增仪器',
					submitText: '提交',
					labelWidth: 160,
					column: [{
							label: "站点名称",
							prop: "siteName",
							formslot: true, //自定义插件
							disabled: true, //只读不可点击
							// type: 'select',
							// dicData: [],
							// props: {
							//   label: 'name',
							//   value: 'id',
							// },
							// rules: [{
							//   required: true,
							//   message: '请选择站点名称',
							//   trigger: 'change'
							// }],
							// change: ({value, column}) => {
							//   if(value && value != '') {
							//     // 根据点位id请求机组下拉框内容
							//     getGroupList(value).then(res => {
							//       const column1 = this.findObject(this.formOption.column, "groupId");
							//       column1.dicData = res.data.data;
							//       let arr = res.data.data.filter(item => item.id == this.formData.groupId)
							//       if(!arr || !arr.length) this.formData.groupId = ''
							//     })
							//   }
							// }
						},
						{
							label: "设备仪器名称",
							prop: "name",
							rules: [{
								required: true,
								message: '请输入设备仪器名称',
								trigger: 'blur'
							}]
						},
						{
							label: 'MN号',
							prop: 'mn',
							rules: [{
								required: true,
								message: '请输入MN号',
								trigger: 'blur'
							}]
						},
						{
							label: "机组",
							prop: "groupId",
							type: 'select',
							dicData: [],
							props: {
								label: 'groupName',
								value: 'id',
							},
							rules: [{
								required: localStorage.systemType==="99",
								message: '请选择机组',
								trigger: 'change'
							}]
						},
						{
							label: "安装位置",
							prop: "location",
							rules: [{
								required: true,
								message: "请输入安装位置",
								trigger: "blur"
							}]
						},
						{
							label: "出厂编号",
							prop: "sn",
							rules: [{
								required: false,
								message: "请输入出厂编号",
								trigger: "blur"
							}]
						},
						{
							label: "品牌",
							prop: "brand",
							rules: [{
								required: false,
								message: "请输入品牌",
								trigger: "blur"
							}]
						},
						{
							label: "设备型号",
							prop: "model",
							rules: [{
								required: false,
								message: "请输入设备型号",
								trigger: "blur"
							}]
						},
						{
							label: "在用状态",
							prop: 'state',
							type: "select",
							dicUrl: "/api/blade-system/dict/dictionary?code=device_storing_state",
							props: {
								label: "dictValue",
								value: 'dictKey' //2020/10/20 传参id改为dictKey
							},
							rules: [{
								required: true,
								message: "请选择在用状态",
								trigger: "change"
							}]
						},
						{
							label: "采样周期",
							prop: "period",
							// append: '分',
							rules: [{
								validator: validateInter,
								trigger: 'blur',
								required: true
							}]
						},
            {
              label: "采样周期单位",
              prop: 'periodUnit',
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=periodUnit",
              props: {
                label: "dictValue",
                value: 'dictKey'//2020/10/20 传参id改为dictKey
              },
              rules: [{
                required: true,
                message: "请选择采样周期单位",
                trigger: "change"
              }]
            },
						{
							label: "工作曲线斜率",
							prop: "slopeWorkCurve",
							rules: [{
								required: false,
								message: "请输入工作曲线斜率",
								trigger: "blur"
							}]
						},
						{
							label: "截距",
							prop: "intercept",
							rules: [{
								required: false,
								message: "请输入截距",
								trigger: "blur"
							}]
						},
						{
							label: "测量原理及分析方法",
							prop: "otherInfo",
							type: 'textarea',
							rules: [{
								required: false,
								message: "请输入测量原理及分析方法",
								trigger: "blur"
							}]
						},
						{
							label: "备注",
							prop: "others",
							type: 'textarea',
						},
					]
				},
				formData: {},
				instInfoId: '',
				mn: null, // 记录下编辑时请求到的mn，保存时如果未改变就不用校验唯一性
				period: null, // 记录下编辑时请求到的采样周期，保存时如果未改变就不用校验唯一性
				siteInfoId: null, //站点id2020/10/10
				siteType: "",
				siteName: null, //站点名称
				deptInfoId: null, //企业id2020/10/10
				deptInfoName: null, //站点名称
			};
		},
		computed: {
			...mapGetters(["permission"]),
			system() {
				let systemType = localStorage.getItem('systemType');
				return systemType
			},
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.rdtuinfo_add, false),
					viewBtn: this.vaildData(this.permission.rdtuinfo_view, false),
					delBtn: this.vaildData(this.permission.rdtuinfo_delete, false),
					editBtn: this.vaildData(this.permission.rdtuinfo_edit, false)
				};
			},
			ids() {
				let ids = [];
				this.selectionList.forEach(ele => {
					ids.push(ele.id);
				});
				return ids.join(",");
			}
		},
		mounted() {
			this.siteType = this.$route.query.siteType
			// 表单类型。是新增还是编辑
			if(this.$route.query.formType == 'add') {
				this.formOption.label = '新增仪器'
				this.formOption.submitText = '提交'
			} else if(this.$route.query.formType == 'edit') {
				this.formOption.label = '编辑仪器'
				this.formOption.submitText = '修改'
				// 请求该仪器的详细数据
				// getInstDetail(this.$route.query.instInfoId).then(res => {
				// 	this.formData = res.data.data
				// 	this.mn = res.data.data.mn
				// 	this.period = res.data.data.period //采样周期
				// 	this.formData.state = this.formData.state.toString() //在用状态 转换成字符串
				// })
				this.formData=this.$route.query.row 
			}
			this.formData.deptInfoId = this.$route.query.deptInfoId
			this.formData.siteName = this.$route.query.siteName || this.formData.siteName //站点名称
			// 如果路由中有mn parentId，就是添加到数采仪下，非直连
			if(!this.$route.query.isDirect) {
				// 带入mn并禁止修改mn
				this.formData.mn = this.$route.query.mn
				const mnColumn = this.findObject(this.formOption.column, "mn");
				mnColumn.disabled = true
				// 带入点位名称并禁止修改mn
				// 带入period并禁止修改period 采样周期
				this.formData.period = this.$route.query.period
				const periodColumn = this.findObject(this.formOption.column, "period");
				periodColumn.disabled = true
				// 带入点位名称并禁止修改period
				this.formData.siteInfoId = this.$route.query.siteInfoId
				this.formData.siteName = this.$route.query.siteName || this.formData.siteName //站点名称
				this.formData.deptInfoId = this.$route.query.deptInfoId
				const siteColumn = this.findObject(this.formOption.column, "siteName"); //siteName
				siteColumn.disabled = true
				// parentId
				this.formData.parentId = this.$route.query.parentId
			}
			this.initData()
		},
		methods: {
			// 点击复制设备因子按钮事件
			handleCopyDevice() {
				this.copyData = []
				this.copyDevice = true
				getDeviceFactorList(this.siteType).then(res => {
					this.copyData = res.data.data
				})
			},
			// 提交复制设备因子
			submitCopy() {
				if(!this.copyDeviceInfoId) {
					this.$message({
						type: "warning",
						message: "请选择要复制的设备"
					});
					return false
				}
				this.copyDeviceLoading = true
				let params = {
					copyDeviceInfoId: this.copyDeviceInfoId,
					deviceInfoId: this.$route.query.instInfoId
				}
				copyDeviceFactor(params).then(res => {
					this.copyDeviceLoading = false
					this.copyDevice = false
					this.onLoad(this.page)
					this.$message({
						type: "success",
						message: "操作成功!"
					});
				}, error => {
					this.copyDeviceLoading = false
				})
			},
			// 保存批量添加因子
			submitBatchAdd() {
				if(!this.batchAddRadio) {
					this.$message({
						type: "warning",
						message: "请选择因子分组!"
					});
					return false
				}
				this.submitBatchAddLoading = true
				let params = {
					deptInfoId: this.$route.query.deptInfoId,
					deviceInfoId: this.$route.query.instInfoId,
					siteInfoId: this.$route.query.siteInfoId,
					factorGroup: this.batchAddRadio
				}
				saveBatchDeviceFactor(params).then(res => {
					this.submitBatchAddLoading = false
					this.batchAdd = false
					this.onLoad(this.page)
					this.$message({
						type: "success",
						message: "操作成功!"
					});
				}, error => {
					this.submitBatchAddLoading = false
				})
			},
			// 点击批量添加因子按钮
			handleAddBatchFactor() {
				this.batchAddRadio = ''
				this.batchAdd = true
				getVocs98Group().then(res => {
					this.batchAddList = res.data.data
				})
			},
			handleDel(row) {
				this.$confirm("确定将选择数据删除?", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					return remove(row.id)
				}).then(() => {
					this.onLoad(this.page)
					this.$message({
						type: "success",
						message: "操作成功!"
					});
				});
			},
			handleEdit(row) {
				this.$router.push({
					path: '/factorinfo',
					query: {
						deptInfoId: this.$route.query.deptInfoId,
						mn: this.$route.query.mn,
						parentId: this.formData.id,
						siteInfoId: this.formData.siteInfoId,
						siteName: this.formData.siteName,
						formType: 'edit',
						tenantFactorId: row.id,
						params:row.codeType
					}
				})
			},
			handleAddFactor(num) {
				if(this.$route.query.formType == 'add') {
					this.$message.warning('请先完成新增')
					return
				}
				this.$router.push({
					path: '/factorinfo',
					query: {
						deptInfoId: this.$route.query.deptInfoId,
						mn: this.$route.query.mn,
						parentId: this.formData.id,
						siteInfoId: this.formData.siteInfoId,
						siteName: this.formData.siteName,
						formType: 'add',
						params:num?num:0
					}
				})
			},
			initData() {
				this.siteInfoId = this.$route.query.siteInfoId //获取站点名称 2020/10/10
				// this.siteName=this.$route.query.siteName//站点名称
				this.siteName = this.$route.query.siteName || this.formData.siteName //站点名称
				this.deptInfoId = this.$route.query.deptInfoId //获取企业id 2020/10/10
				// 根据id请求所属点位下拉框内容
				// getSiteList(this.$route.query.deptInfoId).then(res => {//直接读取 注释掉
				//   const column = this.findObject(this.formOption.column, "siteInfoId");
				//   column.dicData = res.data.data;
				// })
				//根据站点获取机组名称
				getGroupList(this.siteInfoId).then(res => {
					const column1 = this.findObject(this.formOption.column, "groupId");
					column1.dicData = res.data.data;
					let arr = res.data.data.filter(item => item.id == this.formData.groupId)
					if(!arr || !arr.length) this.formData.groupId = ''
				})
			},
			async submitForm(form, done) {
//				if(!this.$route.query.ismncheck && this.formData.mn != this.mn) {
//					let flag = true
//					await checkMn(this.formData.mn).then(res => {
//						flag = res.data.data
//					})
//					if(!flag) {
//						this.$message.warning('MN已存在')
//						done()
//						return
//					}
//				}
				this.formData.type = 2
				this.formData.deptInfoId = this.$route.query.deptInfoId //企业id
				this.formData.siteName = this.$route.query.siteName //站点名称
				this.formData.siteInfoId = this.$route.query.siteInfoId //站点id
				formSubmit(this.formData).then(res => {
					if(res.data.success) {
						this.$message.success('操作成功')
						// 如果是新增操作，新增成功后重新获取仪器数据,将页面标题改为编辑
						if(this.$route.query.formType == 'add') {
							this.$refs.form.resetFields()
						}
					}
					done()
				}, error => {
					done()
				})
			},
			error(err) {
				this.$message.error(err);
			},
			rowSave(row, done, loading) {
				add(row).then(() => {
					this.onLoad();
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					loading();
					window.console.log(error);
				});
			},
			rowUpdate(row, index, done, loading) {

				update(row).then(() => {
					this.onLoad();
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					loading();
					console.log(error);
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
						this.onLoad();
						this.$message({
							type: "success",
							message: "操作成功!"
						});
					});
			},
			handleDelete() {
				if(this.selectionList.length === 0) {
					this.$message.warning("请选择至少一条数据");
					return;
				}
				this.$confirm("确定将选择数据删除?", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						return remove(this.ids);
					})
					.then(() => {
						this.onLoad();
						this.$message({
							type: "success",
							message: "操作成功!"
						});
						this.$refs.crud.toggleSelection();
					});
			},
			beforeOpen(done, type) {
				if(["edit", "view"].includes(type)) {
					getDetail(this.form.id).then(res => {
						this.form = res.data.data;
					});
				}
				done();
			},
			searchReset() {
				this.query = {};
				this.onLoad();
			},
			searchChange(params, done) {
				this.query = params;
				this.page.currentPage = 1;
				this.onLoad();
				done();
			},
			selectionChange(list) {
				this.selectionList = list;
			},
			selectionClear() {
				this.selectionList = [];
				this.$refs.crud.toggleSelection();
			},
			currentChange(currentPage) {
				this.page.currentPage = currentPage;
			},
			sizeChange(pageSize) {
				this.page.pageSize = pageSize;
			},
			refreshChange() {
				this.onLoad();
			},
			onLoad() {
				if(this.$route.query.instInfoId) {
					this.loading = true;
					getFactorList(this.$route.query.instInfoId).then(res => {
						this.data = res.data.data
						this.loading = false
						this.selectionClear()
					})
				}
			}
		}
	};
</script>

<style scoped="">
	.copyDevice>>>.el-collapse-item__header.is-active {
		color: #409EFF;
	}

	.copyDevice>>>.el-collapse-item__header.is-active {
		background: #f5f7fa;
	}
	/*.copyDevice>>>.el-collapse-item__wrap{background: #409EFF;}*/
</style>
