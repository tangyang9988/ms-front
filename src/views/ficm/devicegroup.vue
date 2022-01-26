<template>	
	<div class="reaizewrap">
		<div class="reaize_box" ref="box" id="reaize_box">
			<div class="left" ref="left" id="left">
				<div class="leftTreeWrap box treeBox">
					<lcTree deviceType="2" @ready="ready"></lcTree>
				</div>
			</div>
			<div class="resize" ref="resize" id="resize">
				<img src="/img/show.png" alt="" class="resize_img"/>
			</div>

			<div class="right table-wrapper" ref="right" id="right">				
				<avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" :before-open="beforeOpen" 
					:before-close="beforeClose" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
					 @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
					<template slot="menuLeft">
						<el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.siteinfo_delete" @click="handleDelete">删 除
						</el-button>
					</template>
				</avue-crud>
			</div>
		</div>
	</div>	
	
</template>

<script>
	import { getList, getDetail, add, update, remove, getDeptTree, getSiteList } from "@/api/ficm/devicegroup";
	import { mapGetters } from "vuex";
	import { getDeviceList } from "@/api/ficm/abnormalconfig";
	import lcTree from "@/components/common/tree.vue";
    import mixmin from '@/config/mixmin'
	export default {
		components: {
			lcTree
		},
		data() {
			return {
				leftWidth: this.$leftWidth,
				rightWidth: this.$rightWidth,
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
					// height: '100%',//20201103表格撑满
					addTitle: '新增',
					editTitle: '编辑',
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
							label: '所属点位',
							prop: 'siteName',
							// formslot: true,
							// slot: true
							// type: 'select',
							// dicData: [],
							// props: {
							//   label: "name",
							//   value: "id"
							// },
							// rules: [{
							//   required: true,
							//   message: "请选择所属点位",
							//   trigger: "change"
							// }]
						},
						{
							label: '组号名称',
							prop: 'groupName',
							rules: [{
								required: true,
								message: "请填写组号名称",
								trigger: "blur"
							}]
						},
					]
				},
				data: [],
				// 左侧树配置属性
				treeOption: {
					nodeKey: 'id',
					addBtn: false,
					menu: false,
					size: 'small',
					defaultExpandAll: true,
					props: {
						label: 'title',
						value: 'value',
						children: 'children'
					}
				},
				treeData: [],
				nodeId: null,
				deptInfoName: '', //企业名称
				deptInfoId: '', //企业id
				siteInfoId: '', ////2020.10.9 获取站点id
				siteName: '', //2020.10.9 获取站点name
				isSiteInfo: false, //2020/10/10 修改组织树到站点 是否点击了站点
			};
		},
		computed: {
			...mapGetters(["permission"]),
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.devicegroup_add, false),
					viewBtn: this.vaildData(this.permission.devicegroup_view, false),
					delBtn: this.vaildData(this.permission.devicegroup_delete, false),
					editBtn: this.vaildData(this.permission.devicegroup_edit, false)
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
		watch: {},
		mixins: [mixmin],
		mounted() {
			
			this.dragControllerDiv();
		},
		methods: {
			ready(data, treeData) { //20201103使用封装目录树 修改组织树到站点 需要取到父级
				// 后台接口变化 增加判断treeType是2 则是站点
				this.isSiteInfo = data.nodeType == '2' ? true : false
				if(this.isSiteInfo) {
					this.nodeId = data.key
					this.siteInfoId = data.key //获取站点key
					this.siteName = data.title //获取站点名称
					this.deptInfoId = data.parentKey //获取企业key
					this.deptName = data.parentTitle //获取企业名称
					this.page.currentPage = 1
					this.onLoad(this.page)
				}
			},
			changeTreeBox() {
				this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth
				this.rightWidth = this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth
			},

			// 根据子节点id查询所有父节点id
			getParent(array, key) {
				let result = [];
				let toToo = true;
				const catchData = (array, key) => {
					array.forEach(item => {
						if(!toToo) return;
						// result.push(String(item['id']));
						result.push({
							// 'id': item['id'],
							'key': item['key'],
							'title': item['title']
						});
						// result.push(item)
						if(item['id'] === key) {
							toToo = false;
						} else if(item['children']) {
							catchData(item['children'], key);
						} else {
							result.pop();
						}
					});
					toToo && result.pop();
				};
				catchData(array, key);
				// console.log('结果', result)
				return result;
			},
			/**
			 * 获取第一个最下层节点
			 */
			// getFirstNode(tree, node = null) {
			//   tree.forEach(item => {
			//     if (!node) {
			//       if (item.children && item.children.length) {
			//         node = this.getFirstNode(item.children, node)
			//       } else {
			//         node = item
			//       }
			//     }
			//   })
			//   return node
			// },
			/**
			 * 初始化表单
			 */
			// initData() {
			//   // 树内容接口
			//   getDeptTree().then(res => {
			//     this.treeData = res.data.data
			//     this.$nextTick(function () {
			//       // 获取el-tree对象
			//       let elTreeDom = this.$refs.tree.$children[1]
			//       // 获取要设置的节点-第一个最下层节点,并设置默认选中
			//       let node = this.getFirstNode(res.data.data)
			//       elTreeDom.setCurrentNode(node)
			//       this.nodeClick(node)
			//     })
			//   })
			// },
			/**
			 * 弹框关闭处理
			 */
			beforeClose(done) {
				this.searchWord = ''
				this.$refs.crud.tableForm = {};
				done();
			},
			rowSave(row, done, loading) {
				// 所属组织的值
				row.deptInfoId = this.deptInfoId //企业id
				row.siteInfoId = this.siteInfoId //2020/10/12修改树到站点 站点id
				// row.deptName = this.deptInfoName
				// row.siteName = this.siteName //2020/10/12修改树到站点 站点名称
				// console.log('提交', row)
				// return false
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
				row.deptInfoId = this.deptInfoId //企业id
				row.siteInfoId = this.siteInfoId //2020/10/12修改树到站点站点id
				// row.deptName = this.deptInfoName
				// row.siteName = this.siteName //2020/10/12修改树到站点站点名称
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
				const column = this.findObject(this.option.column, "siteName"); //获取所属点位
				switch(type) {
					case 'add':
						if(this.isSiteInfo) { //2020/10/12 修改组织树到站点 nodeId修改成isSiteInfo 判断是否选择了站点
							column.disabled = true //所属点位 不可点击
							column.value = this.siteName //所属点位重新赋值
							// this.$set(column, 'disabled', true)//所属点位 不可点击
							// this.$set(column, 'value', this.siteName)//所属点位重新赋值
							done()
						} else {
							this.$message.warning('请选择站点')
						}
						break
					case 'edit':
						column.disabled = true
						// 根据id，请求表单内容
						getDetail(this.form.id).then(res => {
							this.form = res.data.data
							done()
						})
						break
					case 'view':
						column.disabled = true
						// 根据id，请求表单内容
						getDetail(this.form.id).then(res => {
							this.form = res.data.data
							done()
						})
						break

					default:
						column.disabled = true
						break
				}
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
				if(this.nodeId) {
					this.loading = true;
					getList(page.currentPage, page.pageSize, this.nodeId, Object.assign(params, this.query)).then(res => {
						const data = res.data.data;
						this.page.total = data.total;
						this.data = data.records;
						this.loading = false;
						this.selectionClear();
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.map {
		width: 100%;
		height: 500px;
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