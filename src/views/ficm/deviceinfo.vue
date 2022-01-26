<template>
  <div class="reaizewrap">
    <div class="reaize_box" ref="box" id="reaize_box">
      <div class="left" ref="left" id="left">
        <div class="leftTreeWrap box treeBox">
          <lcTree deviceType="2" @ready="ready"></lcTree>
        </div>
      </div>
      <div class="resize" ref="resize" id="resize">
        <img src="/img/show.png" alt="" class="resize_img" />
      </div>

      <div class="right table-wrapper" ref="right" id="right">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="MN号查询">
            <el-input
              placeholder="请输入内容"
              v-model="formquery.mnNum"
            ></el-input>
          </el-form-item>
          <el-form-item label="" style="margin-left: 10px">
            <el-button
              @click="searchBtn()"
              icon="el-icon-search"
              size="small"
              type="primary"
              >搜 索</el-button
            >
            <el-button
              @click="searchReset"
              icon="el-icon-delete"
              size="small"
              type=""
              >清 空</el-button
            >
          </el-form-item>
        </el-form>
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          :page="page"
          :permission="permissionList"
          :before-open="beforeOpen"
          :before-close="beforeClose"
          v-model="form"
          ref="crud"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @row-del="rowDel"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot="deptNameForm">
            <el-input v-model="deptInfoName" disabled></el-input>
          </template>
          <template slot="mapForm">
            <div v-if="showMap">
              <baidu-map
                class="map"
                :center="center"
                :zoom="zoom"
                @ready="handler"
              >
                <el-input
                  placeholder="关键词查询"
                  v-model="searchWord"
                  style="
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 180px;
                  "
                >
                  <template slot="append">
                    <el-button
                      icon="el-icon-search"
                      id="citySearch"
                    ></el-button>
                  </template>
                </el-input>

                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-marker :position="mapPosition" :dragging="true"></bm-marker>
              </baidu-map>
            </div>
          </template>
          <template slot="menuLeft">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              plain
              v-if="permission.deviceinfo_addrdtu"
              @click="handleAddrdtu"
              >新增数采仪
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              plain
              v-if="permission.deviceinfo_addinst"
              @click="handleAddinst"
              >新增设备仪器
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              plain
              v-if="permission.deviceinfo_addinst"
              @click="addFactors()"
              >批量添加因子
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              plain
              v-if="permission.deviceinfo_delete"
              @click="handleDelete"
              >删 除
            </el-button>
          </template>
          <!-- 自定义表格行内编辑按钮 -->
          <template slot="menu" slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              v-if="permission.deviceinfo_edit"
              @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              v-if="permission.deviceinfo_delete"
              @click="handleDel(scope.row)"
              >删除
            </el-button>
          </template>
        </avue-crud>
      </div>
    <chooseFactor
    @closeDialog="closeDialog"
    :addFactorVisable="addFactorVisable"
    :siteType="1">
    </chooseFactor>
    </div>
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
  checkCountByParentId,
  getListByMn,
} from "@/api/ficm/deviceinfo";
import { mapGetters } from "vuex";
import lcTree from "@/components/common/tree.vue";
import chooseFactor from "./chooseFactors.vue";
import mixmin from "@/config/mixmin";
export default {
  components: {
    lcTree,
	chooseFactor
  },
  data() {
    return {
      leftWidth: this.$leftWidth,
      rightWidth: this.$rightWidth,
      form: {},
      query: {},
      formquery: {},
      loading: false,
      page: {
        pageSize: this.$pageSize,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        // height: '100%',//20201103表格撑满
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "站点名称",
            prop: "siteName",
          },
          {
            label: "设备名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入设备名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "设备类型",
            prop: "typeName",
            rules: [
              {
                required: true,
                message: "请输入设备类型",
                trigger: "blur",
              },
            ],
          },
          {
            label: "MN号",
            prop: "mn",
          },
          {
            label: "在用状态",
            prop: "stateName",
            rules: [
              {
                required: true,
                message: "请输入在用状态",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      data: [],
      addFactorVisable: false,
      // 左侧树配置属性
      treeOption: {
        nodeKey: "id",
        addBtn: false,
        menu: false,
        size: "small",
        defaultExpandAll: true,
        props: {
          label: "title",
          value: "value",
          children: "children",
        },
      },
      treeData: [],
      nodeId: null,
      deptInfoName: "", //企业名称
      deptInfoId: "", //企业id
      siteInfoId: "", //2020.10.9 获取站点 传值不需另外获取getSiteList
      siteName: "", //2020.10.9 获取站点name
      isSiteInfo: false, //2020/10/10 修改组织树到站点 是否点击了站点
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.deviceinfo_add, false),
        viewBtn: this.vaildData(this.permission.deviceinfo_view, false),
        delBtn: this.vaildData(this.permission.deviceinfo_delete, false),
        editBtn: this.vaildData(this.permission.deviceinfo_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mixins: [mixmin],
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    ready(data, treeData) {
      //20201103使用封装目录树 修改组织树到站点 需要取到父级
      // 后台接口变化 增加判断treeType是2 则是站点
      this.isSiteInfo = data.nodeType == "2" ? true : false;
      if (this.isSiteInfo) {
        this.nodeId = data.key;
        this.siteInfoId = data.key; //获取站点key
        this.siteName = data.title; //获取站点名称
        this.deptInfoId = data.parentKey; //获取企业key
        this.deptName = data.parentTitle; //获取企业名称
        this.page.currentPage = 1;
        this.onLoad(this.page);
      }
    },
    recursion(arr, newArr = []) {
      arr.forEach((item) => {
        let obj = {};
        obj.id = item.id;
        obj.key = item.key;
        obj.parentId = item.parentId;
        newArr.push(obj);
        if (item.hasChildren) {
          newArr = newArr.concat(this.recursion(item.children));
        }
      });
      return newArr;
    },
    queryDeptInfoId(arr, value) {
      let key;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == value) {
          key = arr[i].key;
          break;
        }
      }
      return key;
    },
    changeTreeBox() {
      this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth;
      this.rightWidth =
        this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth;
    },
    handleDel(row) {
      checkCountByParentId(row.id).then((res) => {
        if (res.data.success) {
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              return remove(row.id);
            })
            .then(() => {
              this.onLoad(this.page);
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            });
        } else {
          this.$message.warning("请先删除子项");
        }
      });
    },
    //编辑
    handleEdit(row) {
      // console.log('设备编辑总页面',this.siteName)
      if (row.type == 1) {
        // 非直连（数采仪）
        this.$router.push({
          path: "/rdtuinfo",
          query: {
            deptInfoId: this.deptInfoId, ////2020/10/12修改树到站点 企业id
            deptName: this.deptInfoName, //2020/10/12修改树到站点 企业名称
            siteInfoId: this.siteInfoId, //2020/10/12修改树到站点 站点id
            siteName: this.siteName, //2020/10/12修改树到站点 站点名称
            formType: "edit",
            mn:row.mn,
            rdtuInfoId: row.id,
            row: row,
            siteType: 1,
          },
        });
      } else if (row.type == 2) {
        // 直连（仪器）
        this.$router.push({
          path: "/instinfo",
          query: {
            // deptInfoId: this.nodeId,
            deptInfoId: this.deptInfoId, ////2020/10/12修改树到站点 企业id
            mn: row.mn,
            parentId: null,
            siteInfoId: row.siteInfoId,
            instInfoId: row.id,
            deptName: this.deptInfoName, //2020/10/12修改树到站点 企业名称
            // siteInfoId: this.siteInfoId,//2020/10/12修改树到站点 站点id
            siteName: this.siteName, //2020/10/12修改树到站点 站点名称
            formType: "edit",
            isDirect: 1,
            siteType: 1,
          },
        });
      }
    },
    //新增数采仪
    handleAddrdtu() {
      if (this.isSiteInfo) {
        //nodeId修改成isSiteInfo 判断是否选择了站点
        this.$router.push({
          path: "/rdtuinfo",
          query: {
            deptInfoId: this.deptInfoId, ////2020/10/12修改树到站点 企业id
            deptName: this.deptInfoName, //2020/10/12修改树到站点 企业名称
            siteInfoId: this.siteInfoId, //2020/10/12修改树到站点 站点id
            siteName: this.siteName, //2020/10/12修改树到站点 站点名称
            formType: "add",
          },
        });
      } else {
        this.$message.warning("请选择站点");
      }
    },
    //新增设备仪器
    handleAddinst() {
      if (this.isSiteInfo) {
        //nodeId修改成isSiteInfo 判断是否选择了站点
        this.$router.push({
          path: "/instinfo",
          query: {
            deptInfoId: this.deptInfoId,
            deptName: this.deptInfoName, //2020/10/12修改树到站点 企业名称
            siteInfoId: this.siteInfoId, //2020/10/12修改树到站点 站点id
            siteName: this.siteName, //2020/10/12修改树到站点 站点名称
            formType: "add",
            isDirect: 1,
          },
        });
      } else {
        this.$message.warning("请选择站点");
      }
    },
    // 批量添加因子
    addFactors() {
      this.addFactorVisable = true;
    },
    closeDialog(){
      this.addFactorVisable = false;
    },
    /**
     * 树点击事件
     */
    // nodeClick(data) {
    //   this.nodeId = data.key
    //   const len = this.getParent(this.treeData, data.key).length - 1 //父节点长度
    //   this.isSiteInfo = this.getParent(this.treeData, data.key).length > 0 //修改组织树到站点 是否判断是否选择了最后一级树
    //   this.deptInfoId = this.getParent(this.treeData, data.key)[len - 1].key //获取企业id
    //   this.deptInfoName = this.getParent(this.treeData, data.key)[len - 1].title //获取企业名称
    //   this.siteInfoId = this.getParent(this.treeData, data.key)[len].key //获取站点名称
    //   this.siteName = this.getParent(this.treeData, data.key)[len].title //获取站点名称
    //   // console.log('shu1', this.deptInfoId + this.deptInfoName)
    //   // console.log('shu2', this.siteInfoId + this.siteName)
    //   this.onLoad(this.page)
    // },
    /**根据子节点id查询所有父节点id */
    // getParent(array, key) {
    //   let result = [];
    //   let toToo = true;
    //   const catchData = (array, key) => {
    //     array.forEach(item => {
    //       if (!toToo) return;
    //       // result.push(String(item['id']));
    //       result.push({
    //         'id': item['id'],
    //         'key': item['key'],
    //         'title': item['title']
    //       });
    //       // result.push(item)
    //       if (item['id'] === key) {
    //         toToo = false;
    //       } else if (item['children']) {
    //         catchData(item['children'], key);
    //       } else {
    //         result.pop();
    //       }
    //     });
    //     toToo && result.pop();
    //   };
    //   catchData(array, key);
    //   // console.log('结果', result)
    //   return result;
    // },
    // nodeClick(data) {
    //   console.log('树值',this.getParent(this.treeData, data.key)[1].key)
    //   console.log(data)
    //   this.nodeId = data.key
    //   this.deptInfoName = data.title
    //   this.siteInfoId = data.title//2020.10.9 获取站点 传值不需另外获取getSiteList
    //   this.deptInfoId = data.key
    //   this.onLoad(this.page)
    // },
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
    //       console.log('node', node)
    //       this.nodeClick(node)
    //     })
    //   })
    // },
    /**
     * 弹框关闭处理
     */
    beforeClose(done) {
      this.searchWord = "";
      this.$refs.crud.tableForm = {};
      done();
    },
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      checkCountByParentId(this.ids).then((res) => {
        if (res.data.success) {
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              return remove(this.ids);
            })
            .then(() => {
              this.onLoad(this.page);
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              this.$refs.crud.toggleSelection();
            });
        } else {
          this.$message.warning("请先删除选择数据的子项");
        }
      });
    },
    beforeOpen(done, type) {
      switch (type) {
        case "add":
          break;
        case "edit":
          break;
        case "view":
          this.showMap = false;
          // 根据id，请求表单内容
          getDetail(this.form.id).then((res) => {
            this.form = res.data.data;
          });
          done();
          break;

        default:
          break;
      }
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchBtn() {
      if (!this.formquery.mnNum) {
        this.refreshChange();
      } else {
        this.loading = true;
        getListByMn(
          this.page.currentPage,
          this.page.pageSize,
          this.formquery.mnNum
        ).then((res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
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
      this.formquery = {};
      if (this.nodeId) {
        this.loading = true;
        getList(
          page.currentPage,
          page.pageSize,
          this.nodeId,
          Object.assign(params, this.query)
        ).then((res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    },
  },
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

.reaizewrap {
  height: calc(100% - 60px);
  background: #f0f0f0;
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
    .resize_img {
      position: absolute;
      top: 50%;
      width: 19px;
      left: -10px;
      margin-top: -61px;
      z-index: 100;
    }
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
.add_relation_footer {
  text-align: right;
}
</style>
