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
					<el-form :inline="true" class="demo-form-inline" size="small">
						<el-form-item label="">
							<el-date-picker v-model="dateFrom" type="date" size="small" placeholder="开始日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>
						</el-form-item>
						<el-form-item label="">
							至
						</el-form-item>
            <el-form-item label="">
						<el-date-picker v-model="dateTo" type="date" size="small" placeholder="结束日期" :picker-options="pickerOption" value-format="yyyy-MM-dd"></el-date-picker>&nbsp;&nbsp;
            </el-form-item>
						<!--状态选择-->
						<el-form-item label="状态">
							<el-select size="small" v-model="statusType" style="width: 150px;">
								<el-option v-for="(item, index) in statusTypeOption" :key="index" :label="item.dictValue" :value="item.dictKey"></el-option>
							</el-select>
						</el-form-item>
						<!--MN-->
						<el-form-item label="设备号">
							<el-input size="small" v-model="mn" style="width: 200px;"/>
						</el-form-item>
						<!--当前异常-->
						<el-form-item>
							<el-radio-group v-model="abnormalradio">
							    <el-radio  label="1">当前预警</el-radio>
							    <el-radio  label="2">全部预警</el-radio>
							</el-radio-group>
						</el-form-item>
						<!--搜索按钮-->
						<el-form-item label="" style="margin-left: 10px;">
							<el-button type="primary" size="small" icon="el-icon-search" @click="onLoad(page)">搜 索</el-button>
							<el-button type="" size="small" icon="el-icon-delete" @click="searchReset">清 空</el-button>
              <el-button
                size="small"
                type="danger"
                icon="el-icon-edit"
                :disabled="handleDisabled"
                @click="toDetails"
              >
                批量处理
              </el-button>
              <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="exportCarAlarm"
              >导 出
            </el-button>
						</el-form-item>

					</el-form>
        </template>
        <!-- 查看详情 -->
        <template slot="ckxq" slot-scope="scope">
            <el-tag
            type="primary"
            size="mini"
            @click="detail(scope.row)"
          >查看详情
          </el-tag>
        </template>
        <template slot="gytzForm">
          <div>
            <el-button
              v-if="dialogType != 'view'"
              size="small"
              type="primary"
              @click="uploadSCGY"
            >
              上传照片
            </el-button>
            <el-button
              v-else
              size="small"
              type="primary"
              disabled
              @click="uploadSCGY"
            >
              上传照片
            </el-button>
            <span style="margin-left: 10px; color: #606266; font-size: 12px"
              >只能上传图片，最多选择1张</span
            >
            <input
              accept="image/*"
              ref="xczpUpload"
              id="xczpUpload"
              style="display: none"
              type="file"
              @change="xczpUpload"
              multiple
            />
          </div>
        </template>
        <template slot="gytzContentForm">
          <div class="gytz_content">
            <el-tag
              v-for="(item, index) in scgyFileList"
              :key="index"
              type="info"
              :closable="dialogType !== 'view'"
              @close="handleRemoveSCGY(index)"
            >
              <img
                :src="item.response.data.fileUrl"
                @click="previewXCZP(item)"
                alt
              />
            </el-tag>
          </div>
        </template>
        <template slot="fjForm">
          <div>
            <el-upload
              v-if="dialogType !== 'view'"
              action="/api/fileManager/upload/file"
              :headers="SetHeaders"
              :file-list="fjFileList"
              :before-upload="beforeUploadFJ"
              :on-remove="handleRemoveFJ"
              :on-success="uploadFJSuccess"
            >
              <el-button size="small" type="primary">选择附件</el-button>
            </el-upload>
            <a
              v-else
              v-for="(item, index) in fjFileList"
              :key="index"
              :href="downloadHead + item.response.data.id"
              style="color: #409eff"
            >
              <i class="el-icon-download" style="margin-right: 5px"></i
              >下载文件（{{ item.name }}）
            </a>
          </div>
        </template>
        <!-- 操作按钮 -->
            <template slot-scope="scope" slot="menu">
              <el-button 
                v-if="scope.row.status == 0"
                type="text" 
                icon="el-icon-edit" 
                size="small" 
                @click.stop="handleAbnormal(scope.row)"
               >
                处理
              </el-button>
              <el-button
                v-else 
                type="text" 
                icon="el-icon-view" 
                size="small" 
                @click.stop="viewAbnormal(scope.row)"
               >
                查看
              </el-button>
            </template>
            <template slot-scope="score" slot="curVal">{{score.row.curVal}}{{score.row.unit}}</template>
      </avue-crud>
      <!-- 处理单 -->
          <el-dialog
            title="处理单"
            :visible.sync="dialogVisiable"
            :modal="false"
            @close="beforeDialogClose"
          >
            <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules">
              <el-form-item label="处理意见" prop="conclusion">
                <el-input
                  type="textarea"
                  placeholder="请输入处理意见"
                  show-word-limit
                  v-model="dialogForm.conclusion"
                  :rows="4"
                  :resize="false"
                  :disabled="dialogType=='view'">
                </el-input>
              </el-form-item>
            </el-form>
            <div style="display:flex;justify-content:center;" v-if="dialogType=='edit'">
              <el-button
                size="small"
                type="primary"
                @click="onsubmit"
              >
                提 交
              </el-button>
              <el-button
                size="small"
                @click="closeDialog">
                取 消
              </el-button>
            </div>
          </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      title="报警图片"
      append-to-body
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      :before-close="closeAddRelationDialog"
      width="35%"
      class="add_relation_dialog"
    >
     <img :src="imgUrl">
      <!-- 按钮 -->
      <div class="add_relation_footer">
        <el-button
          type="primary"
          size="small"
          @click="closeDialog()"
        >
          关 闭
        </el-button>
      </div>
    </el-dialog>
    </basic-container>

  </div>
</template>

<script>
import {
  getVehicleAlertList,
  handleSubmit
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
        menu:true,
        column: [
          // {
          //   label: "区域",
          //   prop: "deptName",
          //   align: "center",
          //   span: 24,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入微站名称",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            label: "设备号",
            prop: "mn",
            align: "center",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入微站名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "车牌号",
            prop: "siteName",
            align: "center",
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入微站名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "日期",
            prop: "time",
            align: "center",
            hide:true,
            type: "date",
            rules: [
              {
                required: true,
                message: "请选择报警日期",
                trigger: "blur",
              },
            ],
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
          {
            label: "因子",
            prop: "alias",
            align: "center",
          },
          // {
          //   label: "报警类型",
          //   prop: "alertTypeName",
          //   align: "center",
          // },
          {
            label: "浓度",
            prop: "curVal",
            align: "center",
            type: "textarea",
            span: 24,
            minRows: 4,
            slot:true
          },
          {
            label: "开始时间",
            prop: "startTime",
            type:"date",
            width:150,
            align: "center",
            rules: [
              {
                required: true,
                message: "请选择报警日期",
                trigger: "blur",
              },
            ],
            format: "yyyy-MM-dd HH:MM:DD",
            valueFormat: "yyyy-MM-dd HH:MM:DD",
          },
          {
            label: "结束时间",
            prop: "endTime",
            align: "center",
            width:150,
            type:"date",
            rules: [
              {
                required: true,
                message: "请选择报警日期",
                trigger: "blur",
              },
            ],
            format: "yyyy-MM-dd HH:MM:DD",
            valueFormat: "yyyy-MM-dd HH:MM:DD",
          },
          {
            label: "持续时间",
            prop: "duration",
            align: "center",
          },
          {
            label: "",
            prop: "gytzContent",
            hide: true,
            span: 24,
            formslot: true,
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
      getVehicleAlertList(
        page.currentPage,
        page.pageSize,
        this.mn,this.dateFrom,this.dateTo,this.statusType,this.abnormalradio
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
        // 预警批量处理
    toDetails() {
      this.dialogType = 'edit'
      // 筛选数组中的已处理预警
      let handleList = this.selectionList.filter(item => item.status == 1)
      let endTimeNullList = this.selectionList.filter(item => item.endTime == '')
      // 如果存在已处理的预警，提醒用户修改
      if (handleList.length) {
        this.$message.warning('存在已处理预警')
      // } else if(endTimeNullList.length>0){
			// 		this.$message.warning('有预警没有结束，不能批量处理')
      } else{
        this.dialogVisiable = true
      }
    },
    // 预警单个处理
    handleAbnormal(row) {
      // if(!row.endTime){
    	// 	this.$message.warning('预警没有结束，不能处理')
    	// 	return false
    	// }
      this.selectionList = [row]
      this.dialogType = 'edit'
      this.dialogForm.conclusion = null;
      this.dialogVisiable = true
    },

    // 预警单个查看
    viewAbnormal(row) {
      this.selectionList = [row]
      this.dialogType = 'view'
      this.dialogForm.conclusion = row.conclusion;
      this.dialogVisiable = true
    },
    //处理单提交
    onsubmit(){
      let abnormalConclusionVO = {
        conclusion:this.dialogForm.conclusion,
        ids:this.ids
      };
      handleSubmit(abnormalConclusionVO).then(
        this.onLoad(this.page, this.query)
      ).then(
        this.dialogVisiable = false
      );
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisiable = false
    },
    // 弹框关闭的回调
    beforeDialogClose() {
      this.$refs.dialogForm.resetFields()
    },
    exportCarAlarm(){
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/ms-airq/abnormalinfo/exportVehicleAlert?${
            this.website.tokenHeader
          }=${getToken()}&endTime=${this.dateTo}&isHandled=${this.statusType}&mn=${this.mn}&startTime=${this.dateFrom}`
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
