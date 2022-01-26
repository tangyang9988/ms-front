<template>	
	<div>
		<grid-layout :layout.sync="layout" :col-num="12" :row-height="rowHeight" :use-css-transforms="true" :is-draggable="designMode" :is-resizable="designMode">
			<grid-item class="panel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i" >
				<component :is="item.widget"></component>
			</grid-item>
		</grid-layout>
	</div>
</template>

<script>
	import gridLayout from "vue-grid-layout";
	import { getList } from "@/api/system/tenant";
	import { getDetail, add, update, getChartSelectOption, getDeptCategory } from "@/api/ficm/dashboard";
	import { mapGetters } from "vuex";
	import { fullscreenEnable} from "@/util/util";
	import {launchFullscreen} from "@/util/util";
	
	import $ from "jquery"
	export default {
		components: {
			GridLayout: gridLayout.GridLayout,
			GridItem: gridLayout.GridItem
		},
		props: {
			designMode: Boolean, //是否设计模式
			readDefaultOption: Boolean, //是否读取默认配置
			id:{
				type:Number,
				default:0
			}
		},
		data() {
			return {
				tenant: null, //当前租户
				tenants: [], //租户列表，仅设计时使用
				bizType: null, //当前业务类型
				bizTypes: [], //业务类型列表
				tenantsLoading: false, //是否加载租户列表中
				hoverPanel: -1, //当前mouse下的widget的id
				layout: [], //默认布局
				widgets: {}, //当前业务类型可用的widgets
				allWidgets: [],
				currentId: null, //当前配置标识
				deptType: '', // 储存组织类型
				rowHeight: 50,
				maxRows: 12,
				height:null
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
		mounted() {		
//			let that = this;
//			that.height=document.getElementById("avue-view").offsetHeight 
//			window.onresize = function(){
//				that.rowHeight=($(window).height()/that.height)*50
//			}           
			this.init()
		    let that = this;
		    window.onresize = () => {
		        return (() => {		          
	              that.setRowHeight(that.layout);
		        })()
		    }
		},
		
		methods: {			
		    // 找出对应的配置文件
		    formatConfig(arr,system,type){
		    	let obj=null
		    	arr.forEach(item=>{
		    		if(item.system==system&&item.type==type){
		    			obj=item
		    		}
		    	})
		    	return obj
		    },	
		    // 深复制对象
			cloneLayout(defaultLayout) {
				let res = []
				for(const p of defaultLayout) {
					res.push(Object.assign({}, p))
				}
				return res
			},		    
			init() {
				// 获取系统ID
				let systemType = localStorage.getItem('systemType')
				// 获取租户ID
				let tenant_id= this.userInfo.tenant_id
				let that = this
				// 通过 id systemType 获取对应的配置
				let opts = () => import('./components/index')
				if(!opts) return
				this.widgets = {}
				let defaultLayout = null
				opts().then(res => {
					// 读取文件配置
					let config=that.formatConfig(res.default,systemType,this.id)
					if(!config){
						return false
					}					
					for(const key in config.widgets) {
						let el = config.widgets[key]
						that.widgets[key] = el
					}
					defaultLayout = this.cloneLayout(config.defaultLayout)
					getDetail(that.userInfo.tenant_id, systemType, '', that.id).then(res => {
						if(res.data.code != 200) {
							that.$message.error("读取配置错误")
						} else if(res.data.msg == '暂无承载数据') {
							//  现在都不要显示
							return false;
							//  如果是各个系统的首页 那么就不要读默认配置 否则读默认配置
							//  if(that.id==2){ return false;}else{that.parseDefaultLayout(defaultLayout)} 
						} else {
							let opts = res.data.data.opts
							if(opts) {
								that.parseLayout(opts)
							} else {
								that.parseDefaultLayout(defaultLayout)
							}
						}
						// launchFullscreen(document.getElementById("avue-view"))
						// this.setRowHeight(this.layout)
					})
				})	
			},
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
			parseDefaultLayout(json) {
				if(json.length > 0) {
					// :解析失败默认配置
					let layout = json;
					for(const p of layout) {
						p.widget = this.widgets[p.c].c;
					}
					this.layout = layout;
				}
			},
			parseLayout(json) {
				//TODO:解析失败默认配置
				let layout = JSON.parse(json).layout;
				for(const p of layout) {
					p.widget = this.widgets[p.c].c;
				}
				this.layout = layout;
			}
		}
	}
</script>

<style scoped>
	.panel {
		/* background-color: silver; */
	}
	
	.panel_button {
		position: relative;
		z-index: 99;
		float: right;
	}
</style>