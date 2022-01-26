<template>
	<div class="lc_wrap">
		<el-row class="deviceinfo">
			<el-col :span="24">
				<basic-container>
					<avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">

						<!--自定义搜索 系统类型-->
						<template slot-scope="{row}" slot="st">
							<el-tag style="border: 0;color: inherit;background: 0">{{ row.stName }}</el-tag>
						</template>
						<!--自定义搜索 组织类型-->
						<template slot-scope="{row}" slot="deptType">
							<el-tag style="border: 0;color: inherit;background: 0">{{ row.deptTypeName }}</el-tag>
						</template>
						<!--          <template slot="deptNameForm">-->
						<!--            <el-input v-model="deptInfoName" disabled></el-input>-->
						<!--          </template>-->
						<!--          <template slot="mapForm">-->
						<!--            <div v-if="showMap">-->
						<!--              <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">-->
						<!--                <el-input placeholder="关键词查询" v-model="searchWord"-->
						<!--                          style="position:absolute;top:10px;left:10px;width:180px;">-->
						<!--                  <template slot="append">-->
						<!--                    <el-button icon="el-icon-search" id="citySearch"></el-button>-->
						<!--                  </template>-->
						<!--                </el-input>-->

						<!--                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>-->
						<!--                <bm-marker :position="mapPosition" :dragging="true"></bm-marker>-->
						<!--              </baidu-map>-->
						<!--            </div>-->
						<!--          </template>-->
						<template slot="menuLeft">
							<el-button type="primary" size="small" icon="el-icon-plus" plain v-if="permission.templateconfig_add" @click="handleAddrdtu">新增
							</el-button>
							<el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.templateconfig_delete" @click="handleDelete">删 除
							</el-button>
						</template>
						<!-- 自定义表格行内编辑按钮 -->
						<template slot="menu" slot-scope="scope">
							<el-button type="text" icon="el-icon-edit" size="small" v-if="permission.templateconfig_edit" @click="handleEdit(scope.row)">编辑
							</el-button>
							<el-button type="text" icon="el-icon-delete" size="small" v-if="permission.templateconfig_delete" @click="handleDel(scope.row)">删除
							</el-button>
						</template>
					</avue-crud>
				</basic-container>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import { getList, getDetail, add, update, remove, getDeptTree, checkCountByParentId } from "@/api/ficm/templateconfig";
	import { mapGetters } from "vuex";
	import website from "@/config/website";

	export default {
		data() {
			return {
				leftWidth: 5,
				rightWidth: 19,
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
					editBtn: false,
					delBtn: false,
					viewBtn: false,
					// height: '100%',//高度自适应
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					index: true,
					selection: true,
					dialogClickModal: false,
					column: [{
							label: "系统类型",
							prop: "st",
							align: "center",
							type: "tree",
							dicUrl: "/api/blade-system/dict/dictionary?code=biz_type",
							props: {
								label: "dictValue",
								value: "dictKey"
							},
							slot: true,
							search: true,
							searchLabelWidth: 74, //第一个搜索条件边距
						},
						{
							label: "组织类型",
							prop: "deptType",
							type: "tree", //搜索下拉
							dicUrl: "/api/blade-system/dict/dictionary?code=org_category",
							props: {
								label: "dictValue",
								value: "dictKey"
							},
							slot: true,
							search: true,
						},
						{
							label: "所属模块",
							prop: "typeName",
							// search: true
						},
						{
							label: "模板名称",
							prop: "name"
						}
					]
				},
				data: [],
				name: '', //模板名称
				id: '',
				deptType: null, //关联字段表id，企业、运维、环保等
				opts: '', //配置信息
				st: null, //业务类型
				type: null, //配置类型，1：信息仓配置，2：个人首页配置
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
			this.initData()
		},
		methods: {
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

			//新增模板
			handleAddrdtu() {
				let obj={
					deptInfoId: this.deptInfoId,
					deptName:this.deptInfoName,
					siteInfoId:this.siteInfoId,
					siteName: this.siteName,
					formType: 'add'
				}
				this.$store.commit('SET_TPARAMS', {
                   value: JSON.stringify(obj)
				})
				this.$router.push({
					path: '/templateconfigAdd'
				})
			},
			//编辑
			handleEdit(row) {
				let obj={
					id: row.id, //id
					name: row.name, //模板名称
					opts: row.opts, //配置信息
					type: row.type, //信息舱配置类型
					typeName: row.typeName, //信息舱配置类型名称
					deptType: row.deptType, //关联字段表id，企业、运维、环保等
					formType: 'edit',
				}
				this.$store.commit('SET_TPARAMS', {
                   value: JSON.stringify(obj)//localStorage/sessionStorage默认只能存储字符串
				})
				this.$router.push({
					path: '/templateconfigAdd'
				})
			},
			/**
			 * 初始化表单
			 */
			initData() {
				// 树内容接口
				this.onLoad(this.page)
			},
			/**
			 * 弹框关闭处理
			 */
			beforeClose(done) {
				this.searchWord = ''
				this.$refs.crud.tableForm = {};
				done();
			},
			rowSave(row, done, loading) {
				add(row).then(() => {
					this.onLoad(this.page);
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
					this.onLoad(this.page);
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
						this.onLoad(this.page);
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
				}).then(() => {
					return remove(this.ids);
				}).then(() => {
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
						break
					case 'edit':
						break
					case 'view':
						this.showMap = false
						// 根据id，请求表单内容
						getDetail(this.form.id).then(res => {
							this.form = res.data.data
						})
						done()
						break

					default:
						break
				}
			},
			searchReset() {
				this.query = {};
				this.onLoad(this.page);
			},
			searchChange(params, done) {
				// console.log('params', params)
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
				this.onLoad(this.page);
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
						const resData = res.data.data
						// console.log('res', resData)
						this.data = resData.records
						this.page.total = resData.total;
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
