<template>
	<div class="tabelContainer">
		<basic-container>
			<avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList" v-model="form" ref="crud" @row-update="rowUpdate" @row-del="rowDel" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
			</avue-crud>
		</basic-container>
	</div>
</template>

<script>
	import { getList, remove, submit } from "@/api/ficm/factorAllocation";
	import { mapGetters } from "vuex";
	import website from "@/config/website";

	export default {
		data() {
			return {
				form: {},
				query: {},
				loading: true,
				page: {
					pageSize: this.$pageSize,
					currentPage: 1,
					total: 0
				},
				selectionList: [],
				option: {
					height: 'auto',
					calcHeight: 30,
					tip: false,
					searchShow: true,
					searchMenuSpan: 6,
					border: true,
					// index: true,
					viewBtn: true,
					addBtn: false,
					// selection: true,
					dialogClickModal: false,
					column: [{
							label: "系统名称",
							prop: "bizTypeName",
							span: 24,
							minRows: 6,
							search: true,
							type: "select",
							editDisabled: true,
							dicUrl: "/api/ms-ficm/tenantfactor/getStByTenantId",
							props: {
								label: "value",
								value: "id"
							},
						},
						{
							label: "因子编号",
							editDisabled: true,
							prop: "factorCodeId",
							span: 24,
							minRows: 6,
							search: true,
						},
						{
							label: "因子名称",
							editDisabled: true,
							prop: "name",
							span: 24,
							minRows: 6,
						},
						{
							label: "因子别名",
							prop: "alias",
							span: 24,
							minRows: 6,
						},
						{
							label: "单位",
							prop: "unit",
							editDisabled: false,
							span: 12,
							minRows: 6,
						},
						{
							label: "排序",
							prop: "orderNum",
							span: 12,
							minRows: 6,
						},
						{
							label: "是否统计",
							prop: "isStatistics",
							span: 6,
							minRows: 6,
							hide: true,
							type: "select",
							dicData: [{
								label: '否',
								value: 0
							}, {
								label: '是',
								value: 1
							}]
						},
						{
							label: "是否留样",
							prop: "isSample",
							span: 6,
							minRows: 6,
							hide: true,
							type: "select",
							dicData: [{
								label: '否',
								value: 0
							}, {
								label: '是',
								value: 1
							}]
						},
						{
							label: "是否评价",
							prop: "isEvaluation",
							span: 6,
							minRows: 6,
							hide: true,
							type: "select",
							dicData: [{
								label: '否',
								value: 0
							}, {
								label: '是',
								value: 1
							}]
						},
						{
							label: "是否显示",
							prop: "isShow",
							span: 6,
							minRows: 6,
							hide: true,
							type: "select",
							dicData: [{
								label: '否',
								value: 0
							}, {
								label: '是',
								value: 1
							}]
						},{
              label: "显示位数",
              prop: "showDigit",
              span: 6,
              minRows: 6,
              type:'orderNum'
            },
			{
              label: "预警值",
              prop: "alarmVal",
              span: 6,
              minRows: 6,
              type:'orderNum'
            },
					]
				},
				data: [],
				st: '',
				factorCodeId: ''
			};
		},
		computed: {
			...mapGetters(["permission"]),
			permissionList() {
				return {
					viewBtn: this.vaildData(this.permission.factorConfig_view, false),
					delBtn: this.vaildData(this.permission.factorConfig_delete, false),
					editBtn: this.vaildData(this.permission.factorConfig_edit, false)
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
		methods: {
			rowUpdate(row, index, done, loading) {
				submit(row).then(() => {
					this.onLoad(this.page);
					this.$message({
						type: "success",
						message: "操作成功!"
					});
					done();
				}, error => {
					window.console.log(error);
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
			searchReset() {
				this.query = {};
				this.onLoad(this.page);
			},
			// searchChange(params, done) {
			//   console.log(params)
			//   this.factorCodeId = params.factorCodeId
			//   this.st = params.bizTypeName
			//   this.query = params;
			//   this.page.currentPage = 1;
			//   this.onLoad(this.page, params);
			//   done();
			// },
			searchChange(params, done) {
				params.st = params.bizTypeName
				this.query = params;
				this.page.currentPage = 1;
				this.onLoad(this.page, params);
				done();
			},
			selectionChange(list) {
				this.selectionList = list;
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
				console.log('params', params)
				console.log('this.query', this.query)
				this.loading = true;
				getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
					// getList(page.currentPage, page.pageSize, this.st, this.factorCodeId).then(res => {
					const data = res.data.data;
					this.page.total = data.total;
					this.data = data.records;
					this.loading = false;
				});
			},
		}
	};
</script>

<style>

</style>
