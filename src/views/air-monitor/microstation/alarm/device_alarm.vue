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
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @on-load="onLoad"
      >
        <template slot="menuLeft">
						<!--搜索按钮-->
              <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="exportCarAlarm"
              >导 出
            </el-button>
        </template>
      </avue-crud>
    </basic-container>

  </div>
</template>

<script>
import {
  getDeviceList
} from "@/api/microstation/alarm/alarm.js";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";

export default {
  data() {
    return {
      handleDisabled: true,
      dialogVisiable:false,//处理单弹框
      dialogForm: {
        conclusion: null,
      },
      dialogFormRules: {
        conclusion: [{
          required: true,
          message: '请输入处理意见',
          trigger: 'blur'
        }]
      },
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: this.$pageSize, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      dateFrom:"",
      dateTo:"",
      statusType:"",
      statusTypeOption: [],
      abnormalradio:'1',
      mn:"",
      selectionList: [],
      dialogType: "",
      scgyFileList: [],
      fjFileList: [],
      detailDialog:false,
      imgUrl:require("../../../../../public/img/detail.png"),
      option: {
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        viewBtn: true,
        editBtn: true,
        columnBtn: false,
        selection: true,
        dialogClickModal: false,
        menu:false,
        column: [
          {
            label: "点位名称",
            prop: "deviceName",
            align: "center",
          },
          {
            label: "MN号",
            prop: "mn",
            align: "center",
          },
          {
            label: "所属区域",
            prop: "area",
            align: "center",
          },
          {
            label: "报警类型",
            prop: "alertTypeName",
            align: "center",
            // search:true
          },
          {
            label: "位置偏移",
            prop: "afterLocation",
            align: "center",
          },
          {
            label: "最后上传数据时间",
            prop: "lastCollectTime",
            align: "center",
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
        addBtn: this.vaildData(this.permission.faultidentificationalarm_add, false),
        viewBtn: this.vaildData(this.permission.faultidentificationalarm_view, false),
        delBtn: this.vaildData(this.permission.faultidentificationalarm_delete, false),
        editBtn: this.vaildData(this.permission.faultidentificationalarm_edit, false),
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
  mounted(){
    this.initData();
  },
  watch:{
    abnormalradio(val){
      if(val=='1'){
        this.dateFrom='';
        this.dateTo='';
      }else if(val=='2'){
        this.dateFrom=new Date(new Date().getTime() - 86400000 * 30).format('yyyy-MM-dd');
        this.dateTo=new Date().format('yyyy-MM-dd');
      }
    },
  },
  methods: {
    initData() {
      this.statusTypeOption = [{
          id: '0',
          'dictKey': '',
          dictValue: '全部'
        },
        {
          id: '1',
          'dictKey': '0',
          dictValue: '未处理'
        },
        {
          id: '2',
          'dictKey': '1',
          dictValue: '已处理'
        },
      ]
    },
    searchReset() { //自定义搜索清空事件
      this.dateFrom = '' //当前日期-6
      this.dateTo = '' //当前日期
      this.mn = ''
      this.statusType = '' //状态置空
      this.query = {};
      this.abnormalradio='1'
      this.onLoad(this.page);
    },
    closeDialog(){
      this.detailDialog=false;
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
      // 工艺图纸
      this.scgyFileList = [];
      // 附件
      this.fjFileList = [];
      done();
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
      this.handleDisabled = this.selectionList.length ? false : true
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
      getDeviceList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    exportCarAlarm(){
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/ms-airq/abnormalinfo/exportDeviceList?${
            this.website.tokenHeader
          }=${getToken()}`
        );
      });
    }
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
