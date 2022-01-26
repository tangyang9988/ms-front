<template>
	<el-row class="RealdataTabel">

		<!-- 左侧树 -->
		<el-col :span="leftWidth" v-show="false">
			<div class="box treeBox">
				<basic-container>
					<lcCheckBoxTree @ready="ready" :deviceType="2"></lcCheckBoxTree>
				</basic-container>
			</div>
		</el-col>

		<!-- 内容 -->
		<el-col :span="24" class="table-wrapper merge_table_wrapper">
			<!-- <overlay @changeTreeBox="changeTreeBox"></overlay> -->
			<basic-container>

				<!-- 表格内容 -->
				<avue-crud ref="crud" v-model="form" :option="option" 
					:table-loading="loading" :data="data.filter((item) => item.deptName.includes(searchName))" 
					:page="page" :permission="permissionList" :cell-style="cellStyle" v-if="showTabel" :span-method="objectSpanMethod">

					<!-- 左上方菜单 -->
					<template slot="menuLeft">
						<el-input placeholder="请输入 企业名称" size="small" 
							prefix-icon="el-icon-search" style="width: 400px;" v-model="searchName">
						</el-input>
					</template>

					<template slot="menu" slot-scope="scope">
						<el-button icon="el-icon-video-play" type="text" style="padding: 0;" @click="showVideo(scope.row)">
						</el-button>
					</template>

					<template slot="menuRight">

						<div class="table-tools" v-if="showTabel" style="padding: 0;display: inline">
							<el-button type="warning" size="small" plain icon="el-icon-download" @click="handleExport">
								导出
							</el-button>
							<el-button class="refresh-count" size="small" type="primary" icon="el-icon-refresh" @click="countNum = 0">
								刷新倒计时 {{ countNum }}s
							</el-button>
						</div>

						<el-tooltip class="item" effect="dark" content="显隐" placement="top-start" v-if="userInfo.role_name.includes('admin')">
							<el-button type="default" icon="el-icon-s-operation" circle size="small" @click="showColumn">
							</el-button>
						</el-tooltip>
					</template>

					<template :slot="item.factorCode" slot-scope="scope" v-for="(item, index) in factorList">
						<div :key="index" v-if="scope.row[item.factorCode + 'isAbnormal'] == 1" style="color: red;">
							{{ scope.row[item.factorCode] }}
						</div>
						<div :key="index" v-else>
							{{ scope.row[item.factorCode] }}
						</div>
					</template>

				</avue-crud>
			</basic-container>
		</el-col>

		<columnShow :data="tabelHeader" ref="columnShow" @success="columnSuccess">
		</columnShow>
	</el-row>
</template>

<script>
	import { getListHead, getListData, getDeptTree } from "@/api/swaq/realdata";
	import { getDynamicHeader } from "@/api/common/common";
	import { system } from "./option/system.js";
	import { mapGetters } from "vuex";
	import lcCheckBoxTree from "@/components/common/tree_checkBox.vue";
	import overlay from "@/components/common/overlay.vue";
	import { mergeTableRow } from "@/util/merge";
	export default {
		components: {
			lcCheckBoxTree,
			overlay
		},

		data() {
			return {
				searchName: '',
				tabelHeader: [],
				showTabel: true,
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
				option: {
					columnBtn: false,
					excelBtn: false,
					menu: false,
					menuWidth: 80,
					editBtn: false,
					delBtn: false,
					addBtn: false,
					calcHeight: 30,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					dialogClickModal: false,
					refreshBtn: false,
					index: false,
					selection: false,
					header: true,
					column: []
				},
				data: [],
				timer: null,
				countNum: "-", // 刷新的倒计时·
				nodeList: [], // 存放已勾选节点value的数组（底层节点)
				factorList: [],
				t2: null
			};
		},
		computed: {
			...mapGetters(["userInfo", "permission"])
		},
		watch: {

			// 倒计时结束时刷新表格
			countNum(val) {
				if(val == 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.loading = true;
					this.getRealData();
				}
			}
		},
		methods: {

			// 动态合并单元格
			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				const span = column["property"] + "-span";
				if(row[span]) {
					return row[span];
				}
			},

			// 按照企业名称排序
			vocSort(ob1, ob2) {
				if(ob1.deptName < ob2.deptName) {
					return 1;
				} else if(ob1.deptName > ob2.deptName) {
					return -1;
				} else {
					return 0;
				}
			},

			// 导出
			handleExport() {
				this.$refs.crud.rowExcel();
			},

			// 打开显隐弹窗
			showColumn() {
				this.$refs.columnShow.showWin();
			},

			// 显隐
			columnSuccess() {
				clearTimeout(this.t2);
				this.t2 = null;
				clearTimeout(this.timer);
				this.timer = null;
				this.t2 = setTimeout(() => {
					this.getRealData();
				}, 100);
			},

			// 左侧树加载事件
			ready(val) {
				this.nodeList = val;
				clearTimeout(this.t2);
				this.t2 = null;
				clearTimeout(this.timer);
				this.timer = null;
				this.t2 = setTimeout(() => {
					this.getRealData();
				}, 100);
			},

			// 获取表头
			getRealData() {
				let hash = window.location.hash.split("?")[0].replace(/#/g, "");
				let treeId = this.nodeList.join(",");
				if(treeId.length <= 0) {
					this.showTabel = false;
					return false;
				} else {
					this.showTabel = true;
				}
				this.loading = true;

				getDynamicHeader(hash, treeId)
					.then(res => {
						if(res.data.success) {
							this.tabelHeader = res.data.data;
							let tableHead = [];
							res.data.data.forEach(item => {
								if(item.isShow > 0) {
									if(!item.discriminatingFactor) {
										this.factorList.push(item);
									}
									if(!item.unit) {
										if(item.istFixed) {
											tableHead.push({
												label: item.alias,
												prop: item.factorCode,
												align: "center",
												minWidth: item.tableWidth,
												fixed: item.istFixed
											});
										} else {
											tableHead.push({
												label: item.alias,
												prop: item.factorCode,
												align: "center",
												minWidth: item.tableWidth
											});
										}
									} else {
										if(item.istFixed) {
											tableHead.push({
												label: item.alias + "\n(" + item.unit + ")",
												prop: item.factorCode,
												align: this.$tabelAlgin,
												minWidth: item.tableWidth,
												slot: true,
												fixed: item.istFixed
											});
										} else {
											tableHead.push({
												label: item.alias + "\n(" + item.unit + ")",
												prop: item.factorCode,
												align: this.$tabelAlgin,
												minWidth: item.tableWidth,
												slot: true
											});
										}
									}
								}
							});

							this.option.column = tableHead;
						}
					})
					.then(() => {
						// TODO: 表头请求失败时的处理
						this.getTableData();
					});
			},

			// 左侧树收缩、展开
			changeTreeBox() {
				this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth;
				this.rightWidth = this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth;
			},

			// 单元格样式
			cellStyle({
				row
			}) {
				return row.isAbnormal ? {
					color: "red"
				} : {};
			},

			// 获取表格内容
			getTableData() {
				let _this = this;
				let treeId = this.nodeList.join(",");
				getListData(treeId).then(res => {
					if(res.data.success) {
						_this.data = [];
						var currentData = [];

						// 遍历表格体接口返回数据
						res.data.data.forEach(item => {
							let obj = {
								siteName: item.siteName || "-",
								deviceName: item.siteName || "-",
								state: item.state || "-",
								collectTime: item.collectTime || "-",
								deptName: item.deptName || "-"
							};

							// 根据动态表头创建因子字段 并默认初始值
							_this.factorList.forEach(el => {
								obj[el.factorCode] = "-";
								obj[el.factorCode + "isAbnormal"] = 0;
							});

							// 接口因子值
							item.factorList.forEach(el => {
								for(var x in obj) {
									if(el.factorCode + "isAbnormal" == x) {
										obj[el.factorCode + "isAbnormal"] = el.isAbnormal;
									}
								}
								obj[el.factorCode] = el.collectValue || "-";
							});

							// 表格数据赋值
							currentData.push(obj);
						});

						_this.data = mergeTableRow(currentData.sort(this.vocSort), ["deptName"]);
						_this.countNum = 60;
						_this.timer = setInterval(() => {
							_this.countNum--;
						}, 1000);
						_this.loading = false;
					} else {
						_this.loading = false;
					}
				});
			}

		},

		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		}
	};
</script>

<style lang="scss">
	.RealdataTabel {
		.el-table__empty-block {
			width: 100% !important;
		}
		.el-table th>.cell {
			white-space: pre-line;
		}
		.avue-crud__pagination {
			display: none;
		}
		.table-wrapper {
			.el-card {
				overflow: scroll;
				.el-card__body {
					height: calc(100% - 35px);
					.avue-crud {
						height: calc(100% - 65px);
					}
				}
			}
			.el-table__fixed {
				height: calc(100% - 12px) !important;
			}
			.el-table__fixed-right {
				height: calc(100% - 12px) !important;
			}
			.el-table__fixed-right::before,
			.el-table__fixed::before {
				height: 0px;
			}
		}
		.el-tree {
			width: 100%;
			overflow: scroll;
		}
	}
</style>

<style lang="scss" scoped>
	.el-row {
		height: calc(100% - 20px);
	}
	
	.el-col {
		height: 100%;
	}
	
	.box {
		height: 100%;
		margin-bottom: 0;
		margin-right: $common_margin_right;
	}
	
	.table-tools {
		display: flex;
		flex-direction: row-reverse;
		padding: 0 10px;
		margin-bottom: $common_margin_input_bottom;
	}
	
	.dialog-top {
		display: flex;
		justify-content: space-between;
	}
	
	.dialog-content {
		display: flex;
		justify-content: center;
		padding: 20px 100px 0px;
		.dialog-video {
			width: 1400px;
			height: 780px;
		}
	}
</style>