<!--今日工地面板页面-->
<template>
	<div>
		<grid-layout :layout.sync="layout" :col-num="12" :row-height="rowHeight" :max-rows="maxRows" :is-draggable="false" :is-resizable="false">
			<grid-item class="panel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i">
				<component :is="item.widget"></component>
			</grid-item>
		</grid-layout>
	</div>
</template>

<script>
	import gridLayout from "vue-grid-layout";
	import { getDetail, getDeptCategory } from "@/api/ficm/dashboard";
	import { mapGetters } from "vuex";
	import $ from "jquery"
	export default {
		components: {
			GridLayout: gridLayout.GridLayout,
			GridItem: gridLayout.GridItem
		},
		props: {
			designMode: Boolean, //是否设计模式
			readDefaultOption: Boolean, //是否读取默认配置
			type: String,
		},
		data() {
			return {
				tenantsLoading: false, // 查询租户列表的时候是否显示正在查询中      	
				tenants: [], // 储存租户列表的数据
				tenant: null, // 储存当前选中的租户数据  
				limitList: [], // 储存限制类型数据
				limit: null, // 储存当前的限制类型   
				type: null, // 暂时未知 之后补
				bizTypes: [], // 储存业务类型数据列表 
				bizType: null, // 储存当前业务类型
				layout: [], // 储存当前布局方案       
				entTypes: [], // 储存监管单位
				entType: null, // 储存当前的监管单位
				templateList: [], // 储存默认模板列表
				template: null, // 储存当前选中的模板
				widgets: {}, // 储存当前模板列表下要显示的图表列表
				currentId: null, // 储存当前的配置ID 保存的时候要用到
				hoverPanel: -1, // 当前mouse下的widget的id
				allWidgets: [],
				entType: null,
				maxRows: 12,
				rowHeight: 50,
				deptType: '',
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		watch: {
			layout: function(layout) {
				if(layout.length > 0) {
					this.setRowHeight(layout);
				}
			}
		},
		methods: {
			setRowHeight(layout) {
				let yset = new Set();
				layout.forEach((val) => {
					yset.add(val.y);
				})
				if(yset.size > 0) {
					let height = document.getElementById("avue-view").offsetHeight - yset.size * 60;
					this.rowHeight = height / this.maxRows;
				}
			},			
			// 重组 layout
			parseLayout(json) {
				// :解析失败默认配置
				let layout = JSON.parse(json).layout;
				// 添加模板属性 不添加是没有的
				for(const p of layout) {
					p.widget = this.widgets[p.c].c;
				}
				this.layout = layout;
			},
			parseDefaultLayout(json) {
				if(json.length > 0) {
					let status = true
					let layout = json;
					for(const p of layout) {
						try {
							p.widget = this.widgets[p.c].c;
						} catch(e) {
							status = false
						}
					}
					if(status) {
						this.layout = layout;
					} else {
						this.layout = []
					}
				}
			},
			init() {
				getDeptCategory().then(res => {
					this.deptType = res.data.data.id
					let opts = () =>
						import('./widgets/bigdata')
					if(!opts) return
					this.widgets = {}
					const that = this
					let defaultLayout = null
					opts().then(res => {
						for(const key in res.default.widgets) {
							let el = res.default.widgets[key]
							that.widgets[key] = el
						}
						defaultLayout = res.default.defaultLayout
						getDetail(that.userInfo.tenant_id, localStorage.getItem('systemType'), that.deptType, '3').then(res => {
							if(res.data.code != 200) {
								that.$message.error("读取配置错误")
								that.parseDefaultLayout(defaultLayout)
							} else if(res.data.msg == '暂无承载数据') {
								that.parseDefaultLayout(defaultLayout)
							} else {
								let opts = res.data.data.opts
								if(opts) {
									that.parseLayout(opts)
								} else {
									that.parseDefaultLayout(defaultLayout)
								}
							}
						})
					})
				})
			}
		},
		mounted() {
			let that = this;
			that.height = document.getElementById("avue-view").offsetHeight
			window.onresize = function() {
                that.rowHeight = ($(window).height() / that.height) * 50
                // that.setRowHeight(that.layout); 
			}
			this.init()
		}
	}
</script>

<style scoped="">
	.panel {
		/* background-color: silver; */
	}
	
	.panel_button {
		position: relative;
		z-index: 99;
		float: right;
	}
</style>