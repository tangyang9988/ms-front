<template>
	<div class="lc_wrap">
		<el-row class="deptinfo">
			<el-col :span="24">
				<basic-container>
					<avue-crud ref="crud" v-model="form" :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad" @tree-load="treeLoad">
						<template slot="mapForm">
							<div v-if="showMap">
								<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">
									<el-input placeholder="关键词查询" v-model="searchWord" style="position:absolute;top:10px;left:10px;width:180px;">
										<template slot="append">
											<el-button icon="el-icon-search" id="citySearch"></el-button>
										</template>
									</el-input>

									<bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
									<bm-marker :position="mapPosition" :dragging="true"></bm-marker>
								</baidu-map>
							</div>
						</template>

						<template slot="menuLeft">
							<el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.deptinfo_delete" @click="handleDelete">删 除
							</el-button>
							<el-button type="success" size="small" plain icon="el-icon-upload2" @click="handleImport">导入
							</el-button>
						</template>
						<template slot-scope="scope" slot="menu">
							<el-button type="text" icon="el-icon-circle-plus-outline" size="small" @click.stop="handleAdd(scope.row,scope.index)" v-if="userInfo.role_name.includes('admin')">新增子项
							</el-button>
						</template>
						<template slot-scope="{row}" slot="deptCategory">
							<el-tag>{{ row.deptCategoryName }}</el-tag>
						</template>
					</avue-crud>

					<el-dialog title="组织信息导入" append-to-body :visible.sync="excelBox" width="555px">
						<avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter" :upload-before="beforeUpload">
							<template slot="excelTemplate">
								<el-button type="primary" @click="handleTemplate">
									点击下载<i class="el-icon-download el-icon--right"></i>
								</el-button>
							</template>
						</avue-form>
					</el-dialog>

				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		getList,
		getDetail,
		add,
		update,
		remove,
		getDeptTree,
		getLazyList,
		getLazyTree,
		getDeptCode
	} from "@/api/ficm/deptinfo";
	import {
	  getExtraOption
	} from "@/api/ficm/deptinfo";

	import { mapGetters } from "vuex";
	import website from '@/config/website';
	export default {
		data() {
			return {
				excelBox: false, // 导入控件是否显示
				excelForm: {},
				excelOption: {
					submitBtn: false,
					emptyBtn: false,
					column: [{
							label: '模板上传',
							prop: 'excelFile',
							type: 'upload',
							drag: true,
							loadText: '模板上传中，请稍等',
							showFileList: false,
							span: 24,
							propsHttp: {
								fileName: 'multipartFile',
								res: 'data'
							},
							tip: '请上传 .xls,.xlsx 标准格式文件',
							action: "/api/ms-ficm/deptinfo/import"
						},
						{
							label: '模板下载',
							prop: 'excelTemplate',
							formslot: true,
							span: 24,
						}
					]
				},
				form: {},
				query: {},
				loading: true,
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				extraParamList:[], // 扩展字段
				selectionList: [],
				option: {
					lazy: true,
					tip: false,
					simplePage: true,
					searchShow: true,
					searchMenuSpan: 6,
					tree: true,
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					menuWidth: 300,
					labelWidth: 110,
					dialogClickModal: false,
					column: [{
							label: "机构名称",
							prop: "deptName",
							search: true,
							searchLabelWidth: 74, //第一个搜索条件边距
							rules: [{
								required: true,
								message: "请输入机构名称",
								trigger: "blur"
							}]
						},
						{
							label: "所属租户",
							prop: "tenantId",
							align: "center",
							type: "tree",
							dicUrl: "/api/blade-system/tenant/select",
							addDisplay: false,
							editDisplay: false,
							viewDisplay: website.tenantMode,
							span: 24,
							props: {
								label: "tenantName",
								value: "tenantId"
							},
							hide: !website.tenantMode,
							search: website.tenantMode,
							rules: [{
								required: true,
								message: "请输入所属租户",
								trigger: "click"
							}]
						},
						{
							label: "机构全称",
							prop: "fullName",
							search: true,
							align: "center"
						},
						{
							label: "上级机构",
							prop: "parentId",
							align: "center",
							type: "tree",
							hide: true,
							dicData: [],
							props: {
								label: "title"
							},
							rules: [{
								required: false,
								message: "请选择上级机构",
								trigger: "change"
							}]
						},
						{
							label: "机构类型",
							type: "select",
							dicUrl: "/api/blade-system/dict/dictionary?code=org_category",
							align: "center",
							props: {
								label: "dictValue",
								value: "dictKey"
							},
							dataType: "number",
							width: 120,
							prop: "deptCategory",
							change: ({
								value,
								column
							}) => {
								if(value==1||value==3){
									let deptCode = this.findObject(this.option.column, 'deptCode')
									let deptLevel = this.findObject(this.option.column, 'deptLevel')
									this.$set(deptCode, 'display', false)
									this.$set(deptLevel, 'display', false)
								}else{
									let deptCode = this.findObject(this.option.column, 'deptCode')
									let deptLevel = this.findObject(this.option.column, 'deptLevel')
									this.$set(deptCode, 'display', true)
									this.$set(deptLevel, 'display', true)
								}

								if(value === 1) {
									let deptInfoType = this.findObject(this.option.column, 'deptInfoType')
									this.$set(deptInfoType, 'display', true)
								} else {
									let deptInfoType = this.findObject(this.option.column, 'deptInfoType')
									this.$set(deptInfoType, 'display', false)
								}
							},
							rules: [{
								required: true,
								message: "请输入机构类型",
								trigger: "blur"
							}]
						},
						{
							label: "行政区域",
							prop: "regionCode",
							align: "center",
							type: "tree",
							hide: true,
							dicData: [1],
							props: {
								label: "title"
							},
							rules: [{
								required: true,
								message: "请选择行政区域",
								trigger: "change"
							}]
						},
						{
							label: "组织类型",
							prop: "deptInfoType",
							align: "center",
							type: 'select',
							hide: true,
							dicUrl: "/api/blade-system/dict/dictionary?code=dept_info_type",
							props: {
								label: "dictValue",
								value: "dictKey",
							}
						},
						{
							label: "排序",
							prop: "sort",
							type: "number",
							align: "center",
							width: 80,
							rules: [{
								required: true,
								message: "请输入排序",
								trigger: "blur"
							}, {
								pattern: /^[1-9]\d*$/,
								message: '请输入正整数',
								trigger: 'blur'
							}]
						},
						{
							label: "备注",
							prop: "remark",
							// span: 24,
							rules: [{
								required: false,
								message: "请输入备注",
								trigger: "blur"
							}],
							hide: true
						},
						{
							label: "组织代码",
							prop: "deptCode",
							hide: true,
							align: "center"
						},
						{
							label: "组织业务类型",
							prop: 'deptType',
							align: "center",
							type: "select",
							hide: true,
							dataType: "number",
							dicUrl: "/api/blade-system/dict/dictionary?code=biz_type",
							props: {
								label: "dictValue",
								value: "dictKey",
							},
							rules: [{
								required: true,
								message: "请选择组织类型",
								trigger: "change"
							}]
						},
						{
							label: "组织等级",
							prop: "deptLevel",
							align: "center",
							type: 'select',
							hide: true,
							dataType: "number",
							dicUrl: "/api/blade-system/dict/dictionary?code=dept_level",
							props: {
								label: "dictValue",
								value: "dictKey",
							}
						},
						{
							label: "组织显示序列",
							prop: "sortNum",
							align: "center",
							hide: true,
							rules: [{
								required: false,
								message: "请输入组织显示序列",
								trigger: "blur"
							}]
						},
						{
							label: "组织地址",
							prop: "address",
							hide: true,
							align: "center",
              rules:[{
							  required:true,
                message:'请输入组织地址',
                trigger: "blur"
              }]
						},
						{
							label: "营业执照",
							hide: true,
							prop: "bizLics",
							align: "center",
						},
						{
							label: "税务登记号",
							prop: "taxNum",
							hide: true,
							align: "center",
              rules:[{
							  required: true,
                message:'请输入税务登记号',
                trigger:"blur"
              }]
						},
						{
							label: "联系人",
							prop: "contacts",
							hide: true,
							align: "center",
						},
						{
							label: "联系方式",
							hide: true,
							prop: "contactWay",
							align: "center",
						},
						{
							label: '',
							prop: 'map',
							span: 24,
							hide: true,
							formslot: true,
						},
						{
							label: "经度",
							prop: "logitude",
							hide: true,
							align: "center",
							rules: [{
								required: true,
								message: "请输入经度",
								trigger: "blur"
							}]
						},
						{
							label: "纬度",
							prop: "latitude",
							hide: true,
							align: "center",
							rules: [{
								required: true,
								message: "请输入纬度",
								trigger: "blur"
							}]
						},
						// {
						//   label: "添加照片",
						//   prop: "pic",
						// },
						{
							label: "简介",
							prop: "intro",
							hide: true,
							type: 'textarea',
							span: 24,
							maxlength: 150
						},
					]
				},
				data: [],
				mapPosition: {
					lng: 121.4472540000,
					lat: 31.3236200000
				},
				center: {
					lng: 121.4472540000,
					lat: 31.3236200000
				},
				zoom: 10,
				dragging: false,
				showMap: true,
				searchWord: '',
				keyword: '',
				extraColumn: [],
				deptCodeCurr: '', //
			};
		},
		computed: {
			...mapGetters(["userInfo", "permission"]),
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.deptinfo_add, false),
					viewBtn: this.vaildData(this.permission.deptinfo_view, false),
					delBtn: this.vaildData(this.permission.deptinfo_delete, false),
					editBtn: this.vaildData(this.permission.deptinfo_edit, false)
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
		watch: {
			'form.logitude' (val) {
				if(val) {
					this.mapPosition.lng = val / 1
				}
			},
			'form.latitude' (val) {
				if(val) {
					this.mapPosition.lat = val / 1
				}
			},
		},
		mounted() {
			this.initData()
		},
		methods: {
			/**
			 * 表格树加载
			 */
			treeLoad(tree, treeNode, resolve) {
				const parentId = tree.id;
				getLazyList(parentId).then(res => {
					resolve(res.data.data);
				});
			},

			// 模板导入框出现
			handleImport() {
				this.excelBox = true;
			},

			// 导入前
			beforeUpload(file, done, loading) {
				var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
				const extension = testmsg === 'xls'
				const extension2 = testmsg === 'xlsx'
				if(!extension && !extension2) {
					this.$message({
						message: '请上传 .xls,.xlsx 标准格式文件!',
						type: 'warning'
					});
					loading()
				} else {
					done()
				}
			},

			// 模板下载
			handleTemplate() {
				let str = this.$UploadUrl + '/squirrel/file/template/批量导入企业模板.xlsx'
				window.open(str);
			},

			// 导入成功后
			uploadAfter(res, done, loading) {
				done()
				this.excelBox = false;
				this.cancle();
			},

			cancle() {
				this.page.currentPage = 1;
				this.query = {
					deptName: '',
					tenantId: '',
					fullName: ''
				}
				this.onLoad(this.page);
			},

			/**
			 * 地图事件处理
			 */
			handler({
				BMap,
				map
			}) {
				let _this = this;

				// 鼠标缩放
				// map.enableScrollWheelZoom(true);

				// 点击事件获取经纬度
				map.addEventListener('click', function(e) {
					// 把点击的坐标赋值给输入框
					_this.form.logitude = e.point.lng
					_this.form.latitude = e.point.lat
				})

				_this.$nextTick(() => {
					// 给坐标搜索按钮绑定点击事件
					document.getElementById('citySearch').addEventListener('click', function() {
						let localSearch = new BMap.LocalSearch(map)
						localSearch.setSearchCompleteCallback(searchResult => {
							let poi = searchResult.getPoi(0)
							if(!poi) {
								return _this.$message.warning('该地址不存在')
							} else {
								_this.center = {
									lng: poi.point.lng,
									lat: poi.point.lat
								}
								_this.form.logitude = poi.point.lng
								_this.form.latitude = poi.point.lat
							}
						});
						localSearch.search(_this.searchWord);
					});
				})
			},
			/**
			 * 弹框关闭处理
			 */
			beforeClose(done) {
				this.searchWord = ''
				this.$refs.crud.tableForm = {};
				this.$refs.crud.value.parentId = "";
				this.$refs.crud.value.addDisabled = false;
				this.$refs.crud.option.column.filter(item => {
					if(item.prop === "parentId") {
						item.value = "";
						item.addDisabled = false;
					}
				});
				done();
			},
			/**
			 * 初始化表单
			 */
			initData() {
				// 上级机构
				getDeptTree().then(res => {
					let column = this.findObject(this.option.column, "parentId");
					column.dicData = res.data.data;
				});
				// 行政区域
				getLazyTree().then(res => {
					let column = this.findObject(this.option.column, "regionCode");
					column.dicData = res.data.data;
				});
		        getExtraOption().then(res=>{
		          let extraColumn = []
		          let arr=[]
		          arr=res.data.data
		          arr.forEach(item=>{	
		          	this.extraParamList.push(item.opt)
		            extraColumn.push({
		              label: item.opt,
		              prop: item.opt,
		              hide: true
		            })
		          })
			      if (extraColumn.length) {
			        let arr1 = this.option.column
			        arr1.push.apply(arr1, extraColumn)
			      }		          
			    })
			},
			/**
			 * 新增子项
			 */
			handleAdd(row) {
				this.$refs.crud.value.parentId = row.id;
				this.$refs.crud.option.column.filter(item => {
					if(item.prop === "parentId") {
						item.value = row.id;
						item.addDisabled = true;
					}
				});
				this.$refs.crud.rowAdd();
			},
			rowSave(row, done, loading) {
		        row.extraInfo = {}
		        this.extraParamList.forEach(item => {
		          row.extraInfo[item] = row[item]
		        })
		        row.extraInfo = JSON.stringify(row.extraInfo) // JSON转string传给后台
				add(row).then(() => {
					this.onLoad(this.page);
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					// 新增成功后重新请求上级机构
					getDeptTree().then(res => {
						const column = this.findObject(this.option.column, "parentId");
						column.dicData = res.data.data;
					});
					done();
				}, error => {
					loading();
					window.console.log(error);
				});
				// 组织代码 唯一性
//				getDeptCode(row.deptCode).then(res => {
//					if(res.data.data) {
//						add(row).then(() => {
//							this.onLoad(this.page);
//							this.$message({
//								type: "success",
//								message: "操作成功!"
//							});
//							getDeptTree().then(res => {
//								const column = this.findObject(this.option.column, "parentId");
//								column.dicData = res.data.data;
//							});
//							done();
//						}, error => {
//							loading();
//							window.console.log(error);
//						});
//					} else {
//						this.$message({
//							type: "error",
//							message: "组织代码已存在!"
//						});
//						loading();
//					}
//				})
			},
			rowUpdate(row, index, done, loading) {
		        row.extraInfo = {}
		        this.extraParamList.forEach(item => {
		           row.extraInfo[item] = row[item]
		        })
		        row.extraInfo = JSON.stringify(row.extraInfo) // JSON转string传给后台
				update(row).then(() => {
					this.onLoad(this.page);
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					loading();
				});
//				if(this.deptCodeCurr != row.deptCode) {
//					getDeptCode(row.deptCode).then(res => {
//						if(res.data.data) {
//							update(row).then(() => {
//								this.onLoad(this.page);
//								this.$message({
//									type: "success",
//									message: "操作成功!"
//								});
//								done();
//							}, error => {
//								loading();
//								console.log(error);
//							});
//						} else {
//							this.$message({
//								type: "error",
//								message: "组织代码已存在!"
//							});
//							loading();
//						}
//					})
//				} else {
//					update(row).then(() => {
//						this.onLoad(this.page);
//						this.$message({
//							type: "success",
//							message: "操作成功!"
//						});
//						done();
//					}, error => {
//						loading();
//						console.log(error);
//					});
//				}
			},
			rowDel(row, index, done) {
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
						// 数据回调进行刷新
						done(row);
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
						this.onLoad(this.page);
						this.$message({
							type: "success",
							message: "操作成功!"
						});
						this.$refs.crud.toggleSelection();
					});
			},
			beforeOpen(done, type) {
				switch(type) {
					case 'add':
						this.showMap = true
						this.mapPosition = {
							lng: 121.4472540000,
							lat: 31.3236200000
						}
						this.center = {
							lng: 121.4472540000,
							lat: 31.3236200000
						}
						break
					case 'edit':
						this.showMap = true
						// 根据id，请求表单内容
						getDetail(this.form.id).then(res => {
							this.form = res.data.data;
				            let obj = JSON.parse(this.form.extraInfo)
				            for (const key in obj) {
				              this.form[key] = obj[key]
				            }
							// 打开编辑页面，将地图中心定位到当前点位
							this.center = {
								lng: res.data.data.logitude,
								lat: res.data.data.latitude
							}
							this.zoom = 8
							this.deptCodeCurr = this.form.deptCode //获取当前请求的组织代码
						});
						break
					case 'view':
						this.showMap = false
						// 根据id，请求表单内容
						getDetail(this.form.id).then(res => {
							this.form = res.data.data;
				            let obj = JSON.parse(this.form.extraInfo)
				            for (const key in obj) {
				              this.form[key] = obj[key]
				            }
						});
						break

					default:
						break
				}
				done();
			},
			searchReset() {
				this.query = {};
				this.onLoad(this.page);
			},
			searchChange(params, done) {
				this.query = params;
				this.page.currentPage = 1;
				this.onLoad(this.page, params);
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
				this.onLoad(this.page, this.query);
			},
			onLoad(page, params = {}) {
				this.loading = true;
				getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
					if(res.data.success) {
						this.data = res.data.data
						this.selectionClear();
						this.loading = false;
					}
				}).catch(() => {
					this.loading = false;
				})
			}
		}
	};
</script>
<style lang="scss">
	.deptinfo {
		.el-card__body {
			height: calc(100% - 35px);
			.avue-crud {
				height: calc(100% - 120px);
			}
		}
	}
</style>
<style scoped>
	.map {
		width: 100%;
		height: 500px;
	}

	.el-row {
		height: calc(100% - 20px);
		/*20201103表格最下方留白距离*/
	}

	.el-col {
		height: 100%;
	}
</style>
