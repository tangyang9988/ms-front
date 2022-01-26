<template>
  <div class="devicetechnology">
    <basic-container>
      <avue-crud
        :option="option"
        :table-loading="loading"
        :data="data"
        :page.sync="page"
        :permission="permissionList"
        :before-open="beforeOpen"
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
        <template slot="menuLeft">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            plain
            v-if="permission.faultidentificationalarm_delete"
            @click="handleDelete"
            >删 除
          </el-button>
        </template>
        <!-- 查看详情 -->
        <template slot="xz" slot-scope="scope">
          <el-tag type="primary" size="mini" @click="detail(scope.row)"
            >下载
          </el-tag>
        </template>
      </avue-crud>
      <!-- 弹窗 -->
      <el-dialog
        title="下载日志"
        append-to-body
        :visible.sync="detailDialog"
        :close-on-click-modal="false"
        :before-close="closeAddRelationDialog"
        width="67%"
        class="add_relation_dialog"
      >
        <span style="text-align:center">No Data</span>
        <!-- 按钮 -->
        <div class="add_relation_footer">
          <el-button type="primary" size="small" @click="closeDialog()">
            关 闭
          </el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
// import {
//   getList,
//   getFjList,
//   uploadFiles,
//   add,
//   update,
//   remove,
// } from "@/api/equipmentmanage/devicetechnology";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: this.$pageSize, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      dialogType: "",
      scgyFileList: [],
      fjFileList: [],
      detailDialog: false,
      option: {
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        viewBtn: true,
        editBtn: true,
        addBtn: false,
        columnBtn: false,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "区域选择",
            prop: "lxren",
            align: "center",
            search: true,
            hide: true,
            type: "select",
            dicData: [
              {
                label: "无锡城区",
                value: 1,
              },
              {
                label: "无锡",
                value: 2,
              },
              {
                label: "无锡双核VOCS组",
                value: 2,
              },
            ],
            rules: [
              {
                required: false,
                message: "请选择区域选择",
                trigger: "blur",
              },
            ],
          },
          {
            label: "文件名",
            prop: "wjm",
            align: "center",
            disabled: true,
          },
          {
            label: "文件大小",
            prop: "wjdx",
            align: "center",
            type: "textarea",
            span: 24,
            minRows: 4,
          },
          {
            label: "创建时间",
            prop: "cjsj",
            align: "center",
          },
          {
            label: "下载次数",
            prop: "xzcs",
            align: "center",
          },
          {
            label: "下载",
            prop: "xz",
            align: "center",
            slot:true
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission.faultidentificationalarm_add,
          false
        ),
        viewBtn: this.vaildData(
          this.permission.faultidentificationalarm_view,
          false
        ),
        delBtn: this.vaildData(
          this.permission.faultidentificationalarm_delete,
          false
        ),
        editBtn: this.vaildData(
          this.permission.faultidentificationalarm_edit,
          false
        ),
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
  methods: {
    detail(row) {
      this.detailDialog = true;
    },
    closeDialog() {
      this.detailDialog = false;
    },
    // 删除现场照片
    handleRemoveSCGY(index) {
      this.scgyFileList.splice(index, 1);
    },
    // 点击上传图片按钮
    uploadSCGY() {
      document.getElementById("xczpUpload").click();
    },
    // 上传现场照片
    xczpUpload(element) {
      if (this.$refs.xczpUpload.files.length + this.scgyFileList.length > 1) {
        this.$message.warning("最多上传1张现场图片!");
        this.$refs.xczpUpload.value = null;
        return;
      }
      let formData = {};
      let files = this.$refs.xczpUpload.files;
      formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      uploadFiles(formData).then((res) => {
        if (!res.data.success) {
          return;
        }
        var resData = res.data.data;
        resData.forEach((item) => {
          this.scgyFileList.push({
            name: item.fileName,
            response: {
              code: 200,
              msg: "操作成功",
              success: true,
              data: item,
            },
          });
        });
        this.$refs.xczpUpload.value = null;
      });
    },
    // 上传附件前
    beforeUploadFJ(file) {
      var isLimit = this.fjFileList.length + 1 <= 1;
      if (!isLimit) {
        this.$message.warning("只能选择一个附件!");
      }
      return isLimit;
    },
    // 上传附件成功
    uploadFJSuccess(response, file, fileList) {
      if (response.code !== 200 || response.success !== true) {
        return;
      }
      this.fjFileList = fileList;
      this.form.fj = response.data.id;
    },
    // 删除附件
    handleRemoveFJ(file, fileList) {
      this.fjFileList = fileList;
      this.form.aqfj = "";
    },
    getTreeValue(value) {
      let dicData = this.$refs.crud.DIC.lxren;
      //获取所有设备信息
      for (const dict of dicData) {
        if (dict.id == value) {
          this.form.lxfs = dict.phone;
          break;
        }
      }
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
      for (let key in row) {
        if (key.indexOf("$") >= 0) {
          delete row[key];
        }
      }
      row.gytz =
        this.scgyFileList.length === 0
          ? ""
          : this.formatPictureIds(this.scgyFileList);
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
    // 获取现场照片ids
    formatPictureIds(filelist) {
      var id = filelist[0].response.data.id;
      return id;
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
      this.dialogType = type;
      done();
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
      this.loading = true;
      // getList(
      //   page.currentPage,
      //   page.pageSize,
      //   Object.assign(params, this.query)
      // ).then((res) => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
      const data = {
        records: [
          {
            id: "1396663426637377537",
            bladeDeptId: "1123598813738675201",
            tenantId: "000000",
            createUser: "1123598821738675201",
            createDept: -1,
            createTime: "2021-05-24 11:04:44",
            updateUser: "1123598821738675201",
            updateTime: "2021-05-24 14:34:43",
            wjm: "2021-01-26_00-00-00.csv",
            wjdx: "69.0MB",
            cjsj: "2021-01-27 16:11:16",
            xzcs: "2",
          },
          {
            id: "1395308509536460802",
            bladeDeptId: "1123598813738675201",
            tenantId: "000000",
            createUser: "1123598821738675201",
            createDept: -1,
            createTime: "2021-05-20 17:20:47",
            updateUser: "1123598821738675201",
            updateTime: "2021-05-24 11:01:21",
            wjm: "2021-01-26_00-00-00.csv",
            wjdx: "69.0MB",
            cjsj: "2021-01-27 16:11:16",
            xzcs: "2",
          },
          {
            id: "1393096222736150529",
            bladeDeptId: "1123598813738675201",
            tenantId: "000000",
            createUser: "1123598821738675201",
            createDept: -1,
            createTime: "2021-05-14 14:49:57",
            updateUser: "1123598821738675201",
            updateTime: "2021-05-14 16:50:00",
            wjm: "2021-01-26_00-00-00.csv",
            wjdx: "69.0MB",
            cjsj: "2021-01-27 16:11:16",
            xzcs: "5",
          },
          {
            id: "1393096296933388290",
            bladeDeptId: "1123598813738675201",
            tenantId: "000000",
            createUser: "1123598821738675201",
            createDept: -1,
            createTime: "2021-05-14 14:50:14",
            updateUser: "1123598821738675201",
            updateTime: "2021-05-14 16:47:38",
            wjm: "2021-01-26_00-00-00.csv",
            wjdx: "69.0MB",
            cjsj: "2021-01-27 16:11:16",
            xzcs: "3",
          },
        ],
        total: 4,
        size: 30,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: "",
        maxLimit: -1,
        searchCount: true,
        pages: 1,
      };
      this.page.total = data.total;
      this.data = data.records;
      this.loading = false;
      this.selectionClear();
    },
  },
};
</script>

<style lang="scss" scoped>
.add_relation_footer {
  text-align: right;
  margin-top: 15px;
}
.zp_content,
.gytz_content {
  .el-upload-list__item {
    display: none !important;
  }

  .el-tag {
    height: 100px;
    line-height: 100px;
    padding: 0px 10px 0px 0px;
    margin-left: 0px;
    margin-top: 10px;
  }

  img {
    width: 98px;
    height: 98px;
    cursor: pointer;
  }
}
.devicetechnology {
  height: calc(100% - 40px);
}
</style>
