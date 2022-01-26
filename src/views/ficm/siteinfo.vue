<template>
  <div class="reaizewrap">
    <div class="reaize_box" ref="box" id="reaize_box">
      <div class="left" ref="left" id="left">
        <div class="leftTreeWrap box treeBox">
          <lcTree deviceType="1" @ready="ready"></lcTree>
        </div>
      </div>
      <div class="resize" ref="resize" id="resize">
        <img src="/img/show.png" alt="" class="resize_img" />
      </div>

      <div class="right table-wrapper" ref="right" id="right">
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
              v-if="permission.siteinfo_importpoint"
              type="success"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleImport"
              >导入点位
            </el-button>
            <el-button
              v-if="permission.siteinfo_importmore"
              type="success"
              size="small"
              plain
              icon="el-icon-upload2"
              @click="handleImport2"
              >导入点位、设备、因子
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              plain
              v-if="permission.siteinfo_delete"
              @click="handleDelete"
              >删 除
            </el-button>
          </template>
        </avue-crud>

        <el-dialog
          title="站点信息导入"
          append-to-body
          :visible.sync="excelBox"
          width="555px"
        >
          <avue-form
            :option="excelOption"
            v-model="excelForm"
            :upload-after="uploadAfter"
            :upload-before="beforeUpload"
          >
            <template slot="excelTemplate">
              <el-button type="primary" @click="handleTemplate">
                点击下载<i class="el-icon-download el-icon--right"></i>
              </el-button>
            </template>
          </avue-form>
        </el-dialog>

        <el-dialog
          title="点位、设备、因子导入"
          append-to-body
          :visible.sync="excelBox2"
          width="555px"
        >
          <avue-form
            :option="excelOption2"
            v-model="excelForm2"
            :upload-after="uploadAfter"
            :upload-before="beforeUpload"
          >
            <template slot="excelTemplate2">
              <el-button type="primary" @click="handleTemplate2">
                点击下载<i class="el-icon-download el-icon--right"></i>
              </el-button>
            </template>
          </avue-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  dictionary,
  getOperationsOrRegulators,
  getList,
  getDetail,
  add,
  update,
  remove,
  getDeptTree,
  getExtraOption,
  getLazyTree,
  getOperations,
} from "@/api/ficm/siteinfo";
import { mapGetters } from "vuex";
import lcTree from "@/components/common/tree.vue";
import mixmin from "@/config/mixmin";
export default {
  components: {
    lcTree,
  },
  data() {
    return {
      excelBox: false, // 导入控件是否显示
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "模板上传",
            prop: "excelFile",
            type: "upload",
            drag: true,
            loadText: "模板上传中，请稍等",
            showFileList: false,
            span: 24,
            propsHttp: {
              fileName: "multipartFile",
              res: "data",
            },
            tip: "请上传 .xls,.xlsx 标准格式文件",
            action: "/api/ms-ficm/siteinfo/import",
            headers: { deptInfoId: null, type: 1 },
          },
          {
            label: "模板下载",
            prop: "excelTemplate",
            formslot: true,
            span: 24,
          },
        ],
      },

      excelBox2: false, // 导入控件是否显示
      excelForm2: {},
      excelOption2: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "模板上传",
            prop: "excelFile",
            type: "upload",
            drag: true,
            loadText: "模板上传中，请稍等",
            showFileList: false,
            span: 24,
            propsHttp: {
              fileName: "multipartFile",
              res: "data",
            },
            tip: "请上传 .xls,.xlsx 标准格式文件",
            action: "/api/ms-ficm/siteinfo/import",
            headers: { deptInfoId: null, type: 2 },
          },
          {
            label: "模板下载",
            prop: "excelTemplate2",
            formslot: true,
            span: 24,
          },
        ],
      },

      leftWidth: this.$leftWidth,
      rightWidth: this.$rightWidth,
      form: {},
      query: {},
      loading: false,
      page: {
        pageSize: this.$pageSize,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        // height: '100%',//20201103表格撑满
        addTitle: "新增",
        editTitle: "编辑",
        tip: false,
        labelWidth: 120,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "站点名称",
            prop: "name",
            align: "center",
            display: false,
            width: 140,
            overHidden: true,
          },
          {
            label: "所属组织",
            prop: "deptName",
            align: "center",
            display: false,
            width: 140,
            overHidden: true,
          },
          {
            label: "站点编码",
            prop: "code",
            align: "center",
            display: false,
          },
          {
            label: "负责人",
            prop: "respUserId",
            align: "center",
            display: false,
          },
          {
            label: "投运时间",
            prop: "operaDate",
            align: "center",
            display: false,
          },
          {
            label: "运维单位",
            prop: "operationDeptName",
            align: "center",
            display: false,
          },
          {
            label: "运维人员",
            prop: "operationUserName",
            align: "center",
            display: false,
          },
        ],
        group: [
          {
            label: "主要内容",
            prop: "group1",
            column: [
              {
                label: "站点名称",
                prop: "name",
                rules: [
                  {
                    required: true,
                    message: "请输入站点名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "所属组织",
                prop: "deptName",
                span: 12,
                hide: true,
                formslot: true,
              },
              {
                label: "站点地址",
                prop: "address",
                rules: [
                  {
                    required: true,
                    message: "请输入点位地址",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "站点编码",
                prop: "code",
                rules: [
                  {
                    required: false,
                    message: "请输入站点编码",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "点位类型",
                prop: "siteType",
                align: "center",
                type: "select",
                dicData: [
                  {
                    label: "标站",
                    value: 1,
                  },
                  {
                    label: "微站",
                    value: 2,
                  },
                  {
                    label: "走航站",
                    value: 3,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择点位类型",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "标站类型",
                prop: "standardSiteType",
                align: "center",
                type: "select",
                display: false,
                dicData: [],
                rules: [
                  {
                    required: false,
                    message: "请选择标站类型",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "负责人",
                prop: "respUserId",
                rules: [
                  {
                    required: false,
                    message: "请输入负责人",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "投运时间",
                prop: "operaDate",
                type: "date",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() > Date.now();
                  },
                },
              },
              {
                label: "站房面积",
                prop: "area",
                rules: [
                  {
                    required: false,
                    message: "请输入站房面积",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "行政区域",
                prop: "regionCode",
                align: "center",
                type: "tree",
                hide: true,
                dicData: [],
                props: {
                  label: "title",
                },
                rules: [
                  {
                    required: true,
                    message: "请选择行政区域",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "运维单位",
                prop: "operaDeptId",
                type: "select",
                props: {
                  label: "deptName",
                  value: "deptInfoId",
                },
              },
              {
                label: "运维人员",
                prop: "operaUserId",
                type: "select",
                props: {
                  label: "userName",
                  value: "userId",
                },
                dicData: [],
              },
              {
                label: "",
                prop: "map",
                span: 24,
                hide: true,
                formslot: true,
              },
              {
                label: "经度",
                prop: "logitude",
                hide: true,
                rules: [
                  {
                    required: true,
                    message: "请输入经度",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "纬度",
                prop: "latitude",
                hide: true,
                rules: [
                  {
                    required: true,
                    message: "请输入纬度",
                    trigger: "blur",
                  },
                ],
              },
              // {
              //   label: "图片",
              //   prop: "pictUrl"
              // },
            ],
          },
        ],
      },
      data: [],
      mapPosition: {
        lng: 121.447254,
        lat: 31.32362,
      },
      center: {
        lng: 121.447254,
        lat: 31.32362,
      },
      zoom: 10,
      dragging: false,
      showMap: true,
      searchWord: "",
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
      deptInfoName: "",
      deptInfoId: "",
      extraParamList: [],
      unitList: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.siteinfo_add, false),
        viewBtn: this.vaildData(this.permission.siteinfo_view, false),
        delBtn: this.vaildData(this.permission.siteinfo_delete, false),
        editBtn: this.vaildData(this.permission.siteinfo_edit, false),
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
  watch: {
    "form.siteType": {
      handler(val) {
        let lxz = this.findObject(this.option.group, "standardSiteType");
        if (val === 1) {
          lxz.dicData = [
            {
              value: 1,
              label: "国",
            },
            {
              value: 2,
              label: "省",
            },
            {
              value: 3,
              label: "市",
            },
            {
              value: 4,
              label: "街道",
            },
          ];
          lxz.display = true;
        } else {
          lxz.dicData = [];
          lxz.display = false;
        }
      },
    },
    deptId(val) {
      if (val) {
        // 请求所属组织下拉框内容，并匹配所选组织，给坐标赋值
      }
    },
    "form.logitude"(val) {
      if (val) {
        this.mapPosition.lng = val / 1;
      }
    },
    "form.latitude"(val) {
      if (val) {
        this.mapPosition.lat = val / 1;
      }
    },
    "form.operaDeptId"(val) {
      if (val) {
        this.form.operaUserId = "";
        const column1 = this.findObject(this.option.group, "operaDeptId");
        let userArray = column1.dicData.filter(
          (item) => item.deptInfoId == val
        );
        const column2 = this.findObject(this.option.group, "operaUserId");
        if (userArray && userArray.length)
          column2.dicData = userArray[0].userList;
      }
    },
    "form.regulatoryUnit"(val) {
      if (val) {
        this.unitList.dicData.forEach((item) => {
          if (item.deptInfoId == val) {
            const column = this.findObject(this.option.group, "supervisor");
            column.dicData = item.userList;
          }
        });
      }
    },
  },
  mixins: [mixmin],
  mounted() {
    this.initData();
    this.dragControllerDiv();
  },
  methods: {
    ready(data) {
      this.nodeId = data.key;
      this.deptInfoName = data.title;
      this.deptInfoId = data.key;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    changeTreeBox() {
      this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth;
      this.rightWidth =
        this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth;
    },

    // 模板导入框出现
    handleImport() {
      this.excelBox = true;
      this.excelOption.column[0].headers.deptInfoId = this.deptInfoId;
    },

    handleImport2() {
      this.excelBox2 = true;
      this.excelOption2.column[0].headers.deptInfoId = this.deptInfoId;
    },

    beforeUpload(file, done, loading) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      if (!extension && !extension2) {
        this.$message({
          message: "请上传 .xls,.xlsx 标准格式文件!",
          type: "warning",
        });
        loading();
      } else {
        done();
      }
    },

    // 模板下载
    handleTemplate() {
      let str = this.$UploadUrl + "/squirrel/file/template/导入点位模板.xlsx";
      window.open(str);
    },

    handleTemplate2() {
      let str =
        this.$UploadUrl +
        "/squirrel/file/template/批量导入点位、设备、因子模板.xlsx";
      window.open(str);
    },

    uploadAfter(res, done, loading) {
      done();
      this.excelBox = false;
      this.excelBox2 = false;
      this.cancle();
    },

    cancle() {
      this.page.currentPage = 1;
      this.query = {
        deptId: "",
        workNum: "",
      };
      this.onLoad(this.page);
    },

    /**
     * 树点击事件
     */
    // nodeClick(data) { //20201103左侧目录树已封装 注释掉
    //   this.nodeId = data.key
    //   this.option.addTitle = `新增站点-${data.title}`
    //   this.option.editTitle = `编辑站点-${data.title}`
    //   this.deptInfoName = data.title
    //   this.deptInfoId = data.key
    //   this.onLoad(this.page)
    // },
    /**
     * 获取第一个最下层节点
     */
    // getFirstNode(tree, node = null) {//20201103左侧目录树已封装 注释掉
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
    initData() {
      // 行政区域
      getLazyTree().then((res) => {
        const column = this.findObject(this.option.group, "regionCode");
        column.dicData = res.data.data;
      });
      // 树内容接口
      // getDeptTree().then(res => {//20201103左侧目录树已封装注释掉
      //   this.treeData = res.data.data
      //   this.$nextTick(function () {
      //     // 获取el-tree对象
      //     let elTreeDom = this.$refs.tree.$children[1]
      //     // 获取要设置的节点-第一个最下层节点,并设置默认选中
      //     let node = this.getFirstNode(res.data.data)
      //     elTreeDom.setCurrentNode(node)
      //     // 触发点击事件
      //     this.nodeClick(node)
      //   })
      // })
      // 获取表单扩展信息
      getExtraOption().then((res) => {
        let extraColumn = [];
        res.data.data.forEach((item) => {
          // 提交表单时用于封装value时遍历的数组
          this.extraParamList.push(item.opt);
          // 封装扩展表单的JSON
          extraColumn.push({
            label: item.opt,
            prop: item.opt,
          });
        });
        // 获取系统ID
        var systemType = localStorage.getItem("systemType");
        var allTypes = ["31", "32", "99"];
        // 将JSON添加到表单配置中
        if (extraColumn.length && allTypes.indexOf(systemType) < 0) {
          this.option.group.push({
            label: "其他内容",
            labelWidth: 150,
            prop: "extraGroup",
            column: extraColumn,
          });
        }
      });
      // 获取运维单位人员下拉信息
      getOperations().then((res) => {
        const column = this.findObject(this.option.group, "operaDeptId");
        column.dicData = res.data.data;
      });
      // 获取第四方监管
      getOperationsOrRegulators().then((res) => {
        this.unitList = this.findObject(this.option.group, "regulatoryUnit");
        this.unitList.dicData = res.data.data;
      });
      // 获取业务类型
      dictionary().then((res) => {
        const column = this.findObject(this.option.group, "businessType");
        column.dicData = res.data.data;
      });
    },
    /**
     * 弹框关闭处理
     */
    beforeClose(done) {
      this.searchWord = "";
      this.$refs.crud.tableForm = {};
      done();
    },
    /**
     * 地图事件处理
     */
    handler({ BMap, map }) {
      let _this = this;

      // 鼠标缩放
      // map.enableScrollWheelZoom(true);

      // 点击事件获取经纬度
      map.addEventListener("click", function (e) {
        // 把点击的坐标赋值给输入框
        _this.form.logitude = e.point.lng;
        _this.form.latitude = e.point.lat;
      });

      _this.$nextTick(() => {
        // 给坐标搜索按钮绑定点击事件
        document
          .getElementById("citySearch")
          .addEventListener("click", function () {
            let localSearch = new BMap.LocalSearch(map);
            localSearch.setSearchCompleteCallback((searchResult) => {
              let poi = searchResult.getPoi(0);
              if (!poi) {
                return _this.$message.warning("该地址不存在");
              } else {
                _this.center = {
                  lng: poi.point.lng,
                  lat: poi.point.lat,
                };
                _this.form.logitude = poi.point.lng;
                _this.form.latitude = poi.point.lat;
              }
            });
            localSearch.search(_this.searchWord);
          });
      });
    },
    rowSave(row, done, loading) {
      // 所属组织的值
      row.deptInfoId = this.deptInfoId;
      row.deptName = this.deptInfoName;
      // 表单扩展内容
      row.extraInfo = {};
      this.extraParamList.forEach((item) => {
        row.extraInfo[item] = row[item];
      });
      row.extraInfo = JSON.stringify(row.extraInfo); // JSON转string传给后台
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
      row.deptInfoId = this.deptInfoId;
      row.deptName = this.deptInfoName;
      row.extraInfo = {};
      this.extraParamList.forEach((item) => {
        row.extraInfo[item] = row[item];
      });
      row.extraInfo = JSON.stringify(row.extraInfo); // JSON转string传给后台
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
    },
    beforeOpen(done, type) {
      switch (type) {
        case "add":
          if (this.nodeId) {
            this.showMap = true;
            this.mapPosition = {
              lng: 121.447254,
              lat: 31.32362,
            };
            this.center = {
              lng: 121.447254,
              lat: 31.32362,
            };
            done();
          } else {
            this.$message.warning("请选择节点");
          }
          break;
        case "edit":
          this.showMap = true;
          // 根据id，请求表单内容
          getDetail(this.form.id).then((res) => {
            this.form = res.data.data;
            // 扩展表单内容
            let obj = JSON.parse(this.form.extraInfo);
            for (const key in obj) {
              this.form[key] = obj[key];
            }
            // 打开编辑页面，将地图中心定位到当前点位
            this.center = {
              lng: res.data.data.logitude,
              lat: res.data.data.latitude,
            };
            this.zoom = 8;
          });
          done();
          break;
        case "view":
          this.showMap = false;
          // 根据id，请求表单内容
          getDetail(this.form.id).then((res) => {
            this.form = res.data.data;
            // 扩展表单内容
            let obj = JSON.parse(this.form.extraInfo);
            for (const key in obj) {
              this.form[key] = obj[key];
            }
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
</style>
