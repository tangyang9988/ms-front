<template>
  <div class="checkTree">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      size="small"
      class="serach_input"
    ></el-input>
    <el-tree
      ref="tree"
      node-key="value"
      :data="treeData"
      :props="defaultProps"
      show-checkbox
      :default-expand-all="expandAll"
      @check-change="checkedNodeChange"
      :filter-node-method="filterNode"
	  :render-content="renderContent"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span class="show-ellipsis" :title="data.title">{{ data.title }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getDeptTree } from "@/api/archives/vehicleinfo";
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
      nodeList: [], // 存放已勾选节点value的数组（底层节点	)
	  expandAll: true,
	  nodeTypeIcon: {
        "1": "/img/left_tree/enterprise.png",
        "2": "/img/left_tree/point.png",
        "3": "/img/left_tree/group.png"
      },
    };
  },
  props: {
    isAll: {
      type: String,
      default: "1"
    },
    deviceType: {
      type: String,
      default: "2"
    }
  },
  mounted() {
    this.initData();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // 节点变化的时候执行
    nodeList(val) {
      this.$emit("ready", val);
    }
  },
  methods: {
    /**
	 * 关键字过滤
	*/
    filterNode(value, data, node) {
      if (!value) {
        node.expanded = false;
        return true;
      }
      return this.checkBelongToChooseNode(value, data, node);
	},
	/**
	 * 过滤时不过滤子节点
	*/
    checkBelongToChooseNode(value, data, node) {
      if (data.title.indexOf(value) !== -1) {
        return true;
      }
      const level = node.level;
      if (level === 1) {
        return false;
      }
      let parentData = node.parent;
      let index = 0;
      while (index < level - 1) {
        if (parentData.data.title.indexOf(value) != -1) {
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
	renderContent(h, { node, data, store }) {
	  return (
		<span class="custom-tree-node">
		  <img style="margin-right:5px;width:18px;height:18px;" src={this.nodeTypeIcon[data.nodeType]} />
		  {node.label}
		</span>
	  );
	},
    /**
     * 树选择事件
     */
    checkedNodeChange(data, checked) {
      if (!data.hasChildren || data.hasChildren == "false") {
        // 如果不是底层节点就不做处理
        if (checked) {
          // 如果是勾选就放入节点数组
          this.nodeList.push(data.value);
        } else {
          // 如果不是勾选就拿出节点数组
          this.nodeList = this.nodeList.filter(item => item != data.value);
        }
      }
    },
    /*** 获取第一个最下层节点*/
    getFirstNode(tree, node = null) {
      tree.forEach(item => {
        if (!node) {
          if (item.children && item.children.length) {
            node = this.getFirstNode(item.children, node);
          } else {
            node = item;
          }
        }
      });
      return node;
    },
    initData() {
      // 树内容接口
      getDeptTree(this.deviceType).then(res => {
        if (res.data.data.length > 0) {
          this.treeData = res.data.data;
          let elTreeDom = this.$refs.tree;
          this.$nextTick(function() {
            if (this.isAll == "1") {
              elTreeDom.setCheckedNodes(res.data.data);
            } else {
              let node = this.getFirstNode(res.data.data);
              let arr = [];
              arr.push(node);
              elTreeDom.setCheckedNodes(arr);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
