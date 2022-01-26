<template>
	<div>
		<el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small" class="serach_input">
		</el-input>
		<!--:default-expand-all="expandAll"--> 
		<!--:render-content="renderContent"-->
		<el-tree ref="tree" node-key="value" :data="treeData" :props="defaultProps"  :default-expanded-keys="expandedList"
			@node-click="nodeClick" @check-change="checkedNodeChange" 
			:filter-node-method="filterNode" 
			>
			<span slot-scope="{ node, data }" class="custom-tree-node">
                 <span class="show-ellipsis" :title="data.title">
                 	<img style="margin-right:5px;width:18px;height:18px;vertical-align: -2px;" :src="nodeTypeIcon[data.nodeType]" />
                 	{{ data.title }}
                 </span>
			</span>
		</el-tree>
	</div>
</template>

<script>
	import { getDeptTree } from "@/api/swaq/realdata";
	// import { getDeptTree } from "@/api/swaq/realdata";
	import { getStore, removeStore } from "@/util/store";
	export default {
		data() {
			return {
				filterText: "",
				treeData: [],
				defaultProps: {
					label: "title",
					value: "value",
					children: "children"
				},
				nodeList: [], // 存放已勾选节点value的数组（底层节点	),
				expandedList: [], // 展开的节点
				expandAll: false,
				nodeTypeIcon: {
					"1": "/img/left_tree/enterprise.png",
					"2": "/img/left_tree/point.png",
					"3": "/img/left_tree/group.png"
				},
			};
		},
		props: {
			deviceType: {
				type: String,
				default: "2"
			}
		},
		mounted() {						
			this.initData();
		},
		watch: {
			deviceType(curVal, oldVal) {
				if(curVal) {
					this.deviceType = curVal;
					this.initData();
				}
			},
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		// 离开页面后清除缓存,否则会一直记录当前站点
		beforeDestroy() {
			removeStore({
				name: "swaqHistorydataSiteId"
			});
		},
		methods: {
			/**
			 * 关键字过滤
			 */
			filterNode(value, data, node) {
				if(!value) {
					node.expanded = false;
					return true;
				}
				return this.checkBelongToChooseNode(value, data, node);
			},
			/**
			 * 过滤时不过滤子节点
			 */
			checkBelongToChooseNode(value, data, node) {
				if(data.title.indexOf(value) !== -1) {
					return true;
				}
				const level = node.level;
				if(level === 1) {
					return false;
				}
				let parentData = node.parent;
				let index = 0;
				while(index < level - 1) {
					if(parentData.data.title.indexOf(value) != -1) {
						return true;
					}
					parentData = parentData.parent;
					index++;
				}
				return false;
			},
			/**
			 * 自定义节点内容
			 */
			renderContent(h, {node,data,store}) {
				return(<span class="custom-tree-node"><img style="margin-right:5px;width:18px;height:18px;" src={this.nodeTypeIcon[data.nodeType]} />{node.label}</span>);
			},
			/**
			 * 获取第一个最下层节点
			 */
			getFirstNode(tree, node = null) {
				tree.forEach(item => {
					if(!node) {
						if(item.children && item.children.length) {
							node = this.getFirstNode(item.children, node);
						} else {
							node = item;
						}
					}
				});
				return node;
			},
			getNode(tree, nodeId, node = null) {
				tree.forEach(item => {
					if(!node) {
						if(item.value == nodeId) {
							node = item;
						} else if(item.children && item.children.length) {
							node = this.getNode(item.children, nodeId, node);
						}
					}
				});
				return node;
			},
			/**
			 * 树选择事件
			 */
			checkedNodeChange(data, checked) {
				if(!data.hasChildren || data.hasChildren == "false") {
					// 如果不是底层节点就不做处理
					if(checked) {
						// 如果是勾选就放入节点数组
						this.nodeList.push(data.value);
					} else {
						// 如果不是勾选就拿出节点数组
						this.nodeList = this.nodeList.filter(item => item != data.value);
					}
				}
			},
			/*** 树点击事件*/
			nodeClick(data) {
				this.$emit("ready", data, this.treeData);
			},
			initData() {
				let that = this;
				if(!this.deviceType) {
					return false;
				}
				// 树内容接口
				getDeptTree(this.deviceType).then(res => {
					if(res.data.data.length > 0) {
						this.treeData = res.data.data;
						this.$nextTick(function() {
							// 获取el-tree对象
							let elTreeDom = this.$refs.tree;
							let queryId = getStore({
								name: "swaqHistorydataSiteId"
							});							
							let firstNode = null;
							// 查看是否有跳转节点
							if(queryId) firstNode = this.getNode(res.data.data, queryId);
							
							if(firstNode) {
								elTreeDom.setCheckedNodes([firstNode]);
							} else {
								firstNode = this.getFirstNode(res.data.data);								
								elTreeDom.setCheckedNodes(res.data.data);
							}
							// 设置展开的节点
							this.expandedList.push(firstNode.value)
							// 设置当前选中的节点
							elTreeDom.setCurrentNode(firstNode);
							this.nodeClick(firstNode);
						});
					} else {
						return false;
					}
				})
			}
		}
	};
</script>