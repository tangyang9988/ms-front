<template>
  <div class="reaizewrap">
    <div class="reaize_box" ref="box" id="reaize_box">
      <div class="left" ref="left" id="left">
        <div class="leftTreeWrap box treeBox">
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="微站选择" name="weizhan">
              <lcTree deviceType="2" @ready="ready"></lcTree>
            </el-tab-pane>
            <el-tab-pane label="走航选择" name="zouhang">
              <vehicleTree deviceType="2" @ready="zouready" v-if="activeName=='zouhang'"></vehicleTree>
            </el-tab-pane>
          </el-tabs>
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
            <el-input
              v-model="deptName"
              placeholder="请填写企业名称"
              disabled
            ></el-input>
          </template>
          <template slot="siteNameForm">
            <el-input
              v-model="siteName"
              placeholder="请填写站点名称"
              disabled
            ></el-input>
          </template>

          <template slot="superviseForm">
            <div>
              <el-radio-group v-model="form.radio">
                <el-radio :label="1">加强监管</el-radio>
                <el-radio :label="2">放松监管</el-radio>
              </el-radio-group>
              <el-button
                icon="el-icon-mobile"
                size="mini"
                type="primary"
                plain
                style="margin-left: 10px"
                @click="autoComputer"
                >自 动 计 算</el-button
              >
            </div>
          </template>

          <template slot="menuLeft">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              plain
              @click="addBatchMonitorConfig"
              >批量添加预警配置
            </el-button>
          </template>
          <template slot="menuLeft">
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              plain
              v-if="permission.abnormalconfig_delete"
              @click="handleDelete"
              >删 除
            </el-button>
          </template>
          <!-- 表格"启用"列 -->
          <template slot="status" slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus(scope)"
            ></el-switch>
          </template>
          <!-- 连续预警 -->
          <template
            slot="isAlarmContinuouslyForm"
            slot-scope="scope"
            id="isAlarmContinuouslyForm"
          >
            <el-switch
              v-model="scope.row.isAlarmContinuously"
              :active-value="1"
              active-text="是"
              :inactive-value="0"
              inactive-text="否"
            ></el-switch>
          </template>
        </avue-crud>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getListByVehicle,
  getDetail,
  add,
  update,
  remove,
  getDeptTree,
  getDeviceList,
  getFactorList,
  getSiteList,
  updateStatus,
  getAlertType,
  calMonitorConfig,
  addBatchMonitorConfig,
} from "@/api/ficm/abnormalconfig";
import { mapGetters } from "vuex";
import lcTree from "@/components/common/tree.vue";
import vehicleTree from "@/components/common/vehicletree.vue";
import { system } from "@/components/common/option/system.js";
import overlay from "@/components/common/overlay.vue";
import mixmin from "@/config/mixmin";
export default {
  components: {
    lcTree,
    vehicleTree,
    overlay,
  },
  data() {
    // 阈值验证
    let checkThreshold = (rule, value, callback) => {
      if (value < 0 || value > 100) {
        callback(new Error("请填写0~100的数值"));
      } else {
        callback();
      }
    };
    return {
      activeName: "weizhan",
      deviceType: null,
      leftWidth: this.$leftWidth,
      rightWidth: this.$rightWidth,
      form: {
        radio: 1,
      },
      query: {},
      loading: false,
      page: {
        pageSize: this.$pageSize,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        // height: '100%',//20201103高度自适应
        addTitle: "新增",
        editTitle: "编辑",
        stripe: true, // 斑马纹
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        labelWidth: 120,
        column: [
          {
            label: "启用",
            prop: "status",
            slot: true,
            align: "center",
            display: false,
            hide: true, //列表默认不显示
            width: 80,
          },
          {
            label: "企业名称",
            prop: "deptName",
            align: "center",
            display: false,
            overHidden: true,
            width: 140,
          },
          {
            label: "站点名称",
            prop: "siteName",
            align: "center",
            display: false,
          },
          // {
          //   label: "机组名称",
          //   prop: "groupName",
          //   align: "center",
          //   display: false,
          // },
          {
            label: "设备名称",
            prop: "deviceName",
            align: "center",
            display: false,
          },
          {
            label: "预警因子",
            prop: "factorName",
            align: "center",
            display: false,
          },
          {
            label: "预警类型",
            prop: "alertTypeName",
            align: "center",
            display: false,
          },
          {
            label: "预警等级",
            prop: "alertLevelName",
            align: "center",
            display: false,
          },
        ],
        group: [
          {
            label: "基础信息",
            prop: "baseData",
            column: [
              {
                label: "企业名称",
                prop: "deptName",
                formslot: true,
              },
              {
                label: "站点名称",
                prop: "siteName",
                formslot: true,
              },
              {
                label: "设备名称",
                prop: "deviceInfoId",
                type: "select",
                props: {
                  label: "deviceGroupName",
                  value: "id",
                },
                dicData: [],
                rules: [
                  {
                    required: true,
                    message: "请选择设备名称",
                    trigger: "change",
                  },
                ],
                change: () => {
                  this.form.deviceFactorId = "";
                },
              },
              {
                label: "预警因子",
                prop: "deviceFactorId",
                type: "select",
                props: {
                  label: "alias",
                  value: "id",
                },
                dicData: [],
                change: (res) => {
                  let value = res.value;
                  let arr = res.column.dicData;
                  arr.forEach((item) => {
                    if (item.id == value) {
                      this.factorCode = item.code;
                    }
                  });
                },
                rules: [
                  {
                    required: true,
                    message: "请选择预警因子",
                    trigger: "change",
                  },
                ],
              },
            ],
          },
          {
            label: "预警基础配置",
            prop: "alertConfig",
            column: [
              {
                label: "预警类型",
                prop: "alertType",
                type: "select",
                dataType: "number",
                dicUrl: "/api/blade-system/dict/dictionary?code=alert_type",
                disabled: false,
                props: {
                  label: "dictValue",
                  value: "dictKey", //2020/10/09 传参id改为dictKey
                },
                rules: [
                  {
                    required: true,
                    message: "请选择预警类型",
                    trigger: "change",
                  },
                ],
                // change: () => {
                //   this.form.dictKey = ''
                // },
              },
              {
                label: "预警触发延迟",
                prop: "delayTime",
                append: "秒",
                rules: [
                  {
                    required: false,
                    message: "请输入预警触发延迟",
                    trigger: "blur",
                  },
                  {
                    pattern: /^[0-9]*$/,
                    message: "请输入正整数",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "预警等级",
                prop: "alertLevel",
                type: "select",
                dicUrl: "/api/blade-system/dict/dictionary?code=alert_level",
                props: {
                  label: "dictValue",
                  value: "dictKey", //2020/10/09 传参id改为dictKey
                },
                rules: [
                  {
                    required: true,
                    message: "请选择预警等级",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "连续次数",
                prop: "consecutiveNum",
                rules: [
                  {
                    required: true,
                    message: "请输入连续次数",
                    trigger: "blur",
                  },
                  {
                    pattern: /^[0-9]*$/,
                    message: "请输入正整数",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
          {
            label: "连续预警基础配置",
            prop: "seriesAlertConfig",
            column: [
              {
                label: "连续预警",
                prop: "isAlarmContinuously",
                align: "center",
                formslot: true,
              },
              {
                label: "判定比例阈值",
                prop: "threshold",
                append: "%",
                rules: [
                  {
                    pattern: /^([0-9]*)(.?)([0-9]*)$/,
                    message: "请输入数字类型",
                    trigger: "blur",
                  },
                  {
                    validator: checkThreshold,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "发送次数",
                prop: "sendMsgNum",
                rules: [
                  {
                    pattern: /^[0-9]*$/,
                    message: "请输入正整数",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "预警通知间隔",
                prop: "notifyInterval",
                append: "分",
                rules: [
                  {
                    pattern: /^[0-9]*$/,
                    message: "请输入正整数",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
          {
            label: "预警条件",
            prop: "alertCondition",
            column: [
              {
                label: "监管",
                prop: "supervise",
                span: 24,
                formslot: true,
              },
              {
                label: "预警描述",
                prop: "description",
                rules: [
                  {
                    required: true,
                    message: "请输入预警描述",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "超标表达式",
                prop: "expr",
                type: "select",
                dicUrl: "/api/blade-system/dict/dictionary?code=expression",
                props: {
                  label: "dictValue",
                  value: "id",
                },
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请选择超标表达式",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "超标值",
                prop: "standardVal",
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请输入超标值",
                    trigger: "blur",
                  },
                  {
                    pattern: /^([0-9]*)(.?)([0-9]*)$/,
                    message: "请输入数字类型",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
        ],
      },
      data: [],
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
      deptInfoId: null,
      deptName: null,
      siteName: null, //获取站点name
      deptInfoName: "", //企业名称
      deptInfoId: "", //企业id
      siteInfoId: "", //2020.10.9 获取站点 传值不需另外获取getSiteList
      isSiteInfo: false, //2020/10/10 修改组织树到站点 是否点击了站点
      factorCode: "", // 当前计算因子
      weiSiteId:"",
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.abnormalconfig_add, false),
        viewBtn: this.vaildData(this.permission.abnormalconfig_view, false),
        delBtn: this.vaildData(this.permission.abnormalconfig_delete, false),
        editBtn: this.vaildData(this.permission.abnormalconfig_edit, false),
      };
    },
    systemInfo() {
      let obj = null;
      for (var i = 0; i < system.length; i++) {
        if (system[i].systemId == localStorage.systemType) {
          return system[i];
          break;
        }
      }
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
    // 判断是否是污染源系统 是就显示低成本预警条件
    const supervise = this.findObject(this.option.group, "supervise");
    if (this.systemInfo.systemId == 32) {
      this.$set(supervise, "display", true);
    } else {
      this.$set(supervise, "display", false);
    }
    this.dragControllerDiv();
  },
  watch: {
    "form.deviceInfoId"(val) {
      if (val && val != "") {
        // 根据设备id获取因子列表
        getFactorList(val).then((res) => {
          const column = this.findObject(this.option.group, "deviceFactorId");
          column.dicData = res.data.data;
        });
      }
    },
    "form.alertType"(val) {
      const consecutiveNumColumn = this.findObject(
        this.option.group,
        "consecutiveNum"
      ); // 连续次数
      const delayTimeColumn = this.findObject(this.option.group, "delayTime"); // 预警触发延迟
      switch (val) {
        case "1": //超标  2020/10/12 修改组织树到点位  id :1278237962697506818 改成dictKey：1
          this.$set(consecutiveNumColumn, "display", false);
          this.$set(delayTimeColumn, "display", false);
          this.$set(this.option.group[2], "display", true); // 连续预警
          this.$set(this.option.group[3], "display", true); // 预警条件
          break;
        case "2": // 断线 2020/10/12 修改组织树到点位 id :1278238007035494401 改成dictKey：1
          this.$set(consecutiveNumColumn, "display", false);
          this.$set(delayTimeColumn, "display", true);
          this.$set(this.option.group[2], "display", false); // 连续预警
          this.$set(this.option.group[3], "display", false); // 预警条件

          break;
        case "3": // 重复值 2020/10/12 修改组织树到点位 id :1278238042951319554 改成dictKey：1
          this.$set(consecutiveNumColumn, "display", true);
          this.$set(delayTimeColumn, "display", false);
          this.$set(this.option.group[2], "display", false); // 连续预警
          this.$set(this.option.group[3], "display", false); // 预警条件
          break;
        default:
          this.$set(consecutiveNumColumn, "display", false);
          this.$set(delayTimeColumn, "display", false);
          this.$set(this.option.group[2], "display", false); // 连续预警
          this.$set(this.option.group[3], "display", false); // 预警条件
          break;
      }
    },
  },
  methods: {
    handleClick() {
      if(this.activeName == 'weizhan'){
        this.siteInfoId =this.weiSiteId
      }
      this.onLoad(this.page);
    },
    // 自动计算
    autoComputer() {
      if (!this.form.radio) {
        this.$message({
          type: "warning",
          message: "请选择监管方式!",
        });
        return false;
      }
      if (!this.factorCode) {
        this.$message({
          type: "warning",
          message: "请选择预警因子!",
        });
        return false;
      }
      // 请求接口
      let params = {
        calType: this.form.radio,
        deptInfoId: this.form.deptInfoId,
        factorCode: this.factorCode,
      };
      calMonitorConfig(params).then((res) => {
        let data = res.data.data;
        if (typeof data == "object") {
          this.$message({
            type: "warning",
            message: "没有对应的计算值!",
          });
          return false;
        } else {
          this.form.standardVal = data;
        }
      });
    },
    ready(data, treeData) {
      //20201103使用封装目录树 修改组织树到站点 需要取到父级
      this.isSiteInfo = data.nodeType == "2" ? true : false;
      if (this.isSiteInfo) {
        //修改组织树到站点 判断是否选择了最后一级树 站点
        this.siteInfoId = data.key; //获取站点key
        this.weiSiteId = data.key;
        this.siteName = data.title; //获取站点名称
        this.deptInfoId = data.parentKey; //获取企业key
        this.deptName = data.parentTitle; //获取企业名称
        //
        getDeviceList(this.siteInfoId).then((res) => {
          //2020/10/12修改组织树到站点 获取设备
          const column = this.findObject(this.option.group, "deviceInfoId");
          column.dicData = res.data.data;
          const column2 = this.findObject(this.option.group, "deviceFactorId");
          column2.dicData = [];
        });
        //获取预警类型
        getAlertType().then((res) => {
          const column = this.findObject(this.option.group, "alertType");
          column.dicData = res.data.data;
        });
        this.page.currentPage = 1;
        this.onLoad(this.page);
      }
    },
    zouready(data, treeData) {
      //20201103使用封装目录树 修改组织树到站点 需要取到父级
      this.isSiteInfo = data.nodeType == "2" ? true : false;
      if (this.isSiteInfo) {
        //修改组织树到站点 判断是否选择了最后一级树 站点
        this.siteInfoId = data.key; //获取站点key
        this.siteName = data.title; //获取站点名称
        this.deptInfoId = data.parentKey; //获取企业key
        this.deptName = data.parentTitle; //获取企业名称
        //
        getDeviceList(this.siteInfoId).then((res) => {
          //2020/10/12修改组织树到站点 获取设备
          const column = this.findObject(this.option.group, "deviceInfoId");
          column.dicData = res.data.data;
          const column2 = this.findObject(this.option.group, "deviceFactorId");
          column2.dicData = [];
        });
        //获取预警类型
        getAlertType().then((res) => {
          const column = this.findObject(this.option.group, "alertType");
          column.dicData = res.data.data;
        });
        this.page.currentPage = 1;
        this.onLoad(this.page);
      }
    },
    changeTreeBox() {
      this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth;
      this.rightWidth =
        this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth;
    },
    // 改变启用状态
    changeStatus(scope) {
      updateStatus(scope.row.id, scope.row.status).then((res) => {
        if (res.data.success) {
          this.$message.success(`已${scope.row.status ? "启用" : "关闭"}`);
        } else {
          this.$message.warning("操作失败");
        }
      });
    },
    beforeClose(done) {
      this.$refs.crud.tableForm = {};
      done();
    },
    rowSave(row, done, loading) {
      row.deptInfoId = this.deptInfoId; // 企业（组织）id
      row.siteInfoId = this.siteInfoId; // 站点（组织）id
      row.isAlarmContinuously = row.isAlarmContinuously ? 1 : 0;
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
      row.deptInfoId = this.deptInfoId; // 企业（组织）id
      row.siteInfoId = this.siteInfoId; // 企业（组织）id
      row.isAlarmContinuously = row.isAlarmContinuously ? 1 : 0;
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
    addBatchMonitorConfig() {
      addBatchMonitorConfig().then((res) => {
        this.$message({
          type: "success",
          message: "批量添加预警配置成功!",
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
      this.factorCode = this.form.factorCode;
      switch (type) {
        case "add":
          if (this.isSiteInfo) {
            //deptInfoId修改成isSiteInfo 判断是否选择了站点
            done();
            const alertTypeNameColumn = this.findObject(
              this.option.group,
              "alertType"
            ); // 预警类型
            this.$set(alertTypeNameColumn, "disabled", false); //预警类型 不可编辑
            // 初次加载页面 不选择预警类型 对应输入框隐藏 start
            const showGroup = this.option.group[2]; ////连续预警基础配置
            const showGroup1 = this.option.group[3]; ////预警条件 配置
            const showColumn1 = this.findObject(this.option.group, "delayTime"); //"预警触发延迟"
            const showColumn2 = this.findObject(
              this.option.group,
              "consecutiveNum"
            ); //联系次数
            const supervise = this.findObject(this.option.group, "supervise"); // 预警类型
            this.$set(supervise, "display", true);
            this.$set(showGroup, "display", false);
            this.$set(showGroup1, "display", false);
            this.$set(showColumn1, "display", false);
            this.$set(showColumn2, "display", false);
          } else {
            this.$message.warning("请选择站点");
          }
          break;
        case "edit":
          done();
          this.form.alertType = this.form.alertType.toString(); //获取预警类型 转换成字符串
          const alertTypeNameColumn = this.findObject(
            this.option.group,
            "alertType"
          ); // 预警类型
          this.$set(alertTypeNameColumn, "disabled", true); //预警类型 不可编辑
          this.form.alertLevel = this.form.alertLevel.toString(); //获取预警类型 转换成字符串
          const alertLevelNameColumn = this.findObject(
            this.option.group,
            "Level"
          ); // 预警类型
          const supervise = this.findObject(this.option.group, "supervise"); // 预警类型
          this.$set(supervise, "display", true);
          // console.log('Level', alertLevelNameColumn)
          break;
        case "view":
          // 根据id，请求表单内容
          getDetail(this.form.id).then((res) => {
            this.form = res.data.data;
            done();
            this.form.alertType = this.form.alertType.toString(); //获取预警类型 转换成字符串
            const alertTypeNameColumn = this.findObject(
              this.option.group,
              "alertType"
            ); // 预警类型
            const supervise = this.findObject(this.option.group, "supervise"); // 预警类型
            this.$set(supervise, "display", false);
            this.$set(alertTypeNameColumn, "disabled", true); //预警类型 不可编辑
            this.form.alertLevel = this.form.alertLevel.toString(); //获取预警类型 转换成字符串
            const alertLevelNameColumn = this.findObject(
              this.option.group,
              "Level"
            ); // 预警类型
          });
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
      this.onLoad(this.page);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      if (this.deptInfoId) {
        //deptInfoId修改成isSiteInfo
        this.loading = true;
        if (this.activeName == "weizhan") {
          getList(
            page.currentPage,
            page.pageSize,
            this.siteInfoId,
            Object.assign(params, this.query)
          ).then((res) => {
            //deptInfoId修改成siteInfoId
            const data = res.data.data;
            this.page.total = data.total;
            this.data = data.records;
            this.loading = false;
            this.selectionClear();
          });
        } else {
          getListByVehicle(
            page.currentPage,
            page.pageSize,
            this.siteInfoId,
            Object.assign(params, this.query)
          ).then((res) => {
            //deptInfoId修改成siteInfoId
            const data = res.data.data;
            this.page.total = data.total;
            this.data = data.records;
            this.loading = false;
            this.selectionClear();
          });
        }
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

