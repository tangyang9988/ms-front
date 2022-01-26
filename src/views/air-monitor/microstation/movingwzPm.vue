<template>
  <div>
      <basic-container>
         <avue-crud
          :option="option"
          :table-loading="loading"
          :data="areaData"
          ref="crud"
          v-model="form"
          :permission="permissionList"
          :page.sync="areaPage"
          @search-change="searchChange"
          @search-reset="searchReset"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot="menuLeft">
            <!-- 查询 -->
            <el-form
        size="medium"
        :show-message="false"
        inline
        label-width="75px"
      >
        <el-form-item label="因子名称:">
            <el-select
              class="wd-80"
              v-model="moveFacType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in moveFacList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        <el-form-item label="时间类型:">
          <el-select
            class="wd-80"
            v-model="timeType"
            placeholder="请选择"
            @change="timeTypeChange"
          >
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <!-- 日 -->
          <div v-if="timeType == 2">
            <el-date-picker
              v-model="dateTime"
              type="date"
              class="wd-330"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 周 -->
          <div v-if="timeType == 3">
            <el-date-picker
              v-model="dateTime"
              type="week"
              class="wd-330"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择周"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 月 -->
          <div v-if="timeType == 4">
            <el-date-picker
              v-model="dateTime"
              type="month"
              class="wd-330"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择月份"
              :clearable="false"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="medium" type="primary" @click="buttonSearch()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="exportRoad"
              >导 出
            </el-button>
        </el-form-item>
        <el-tooltip :content='message' placement="right-end"  style="margin:10px 0px;">
            <i class="el-icon-question"/>
        </el-tooltip>
      </el-form>
            <!-- 查询结束 -->
          </template>
        </avue-crud>
      </basic-container>
    </div>
</template>

<script>
import {getMobilesiteFactors,getAllMobileSiteRank } from "@/api/microstation/index.js";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
export default {
  data() {
    return {
      message:"移动微站自排名：采用平台内的移动微站数据作为排序依据取污染程度较高的展示；",
      bzAroundArea:1500,
      desc:1, //默认降序
      timeType:2,
      dateTime:new Date(),
      moveFacType:"a34004",
      moveFacList:[],
      timeList:[{value:"日",id:2},{value:"周",id:3},{value:"月",id:4}],
      loading: true,
      areaPage: {
        pageSize: this.$pageSize, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      option: {
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        dialogClickModal: false,
        labelWidth: 100,
        addBtn:false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menu:false,
        column: [
          // {
          //   align: "center",
          //   label: "标站名称",
          //   prop: "name",
          // },
          {
            label: "经度",
            prop: "logitude",
            align: "center",
          },
          {
            label: "纬度",
            prop: "latitude",
            align: "center",
          },
          {
            align: "center",
            label: "因子",
            prop: "alias",
          },
          {
            align: "center",
            label: "浓度",
            prop: "val",
          },
        ],
      },
      areaData: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.vehiclemanage_add, false),
        viewBtn: this.vaildData(this.permission.vehiclemanage_view, false),
        delBtn: this.vaildData(this.permission.vehiclemanage_delete, false),
        editBtn: this.vaildData(this.permission.vehiclemanage_edit, false),
      };
    },
  },
  created(){
     getMobilesiteFactors().then(res=>{
        this.moveFacList = res.data.data;
    });
  },
  mounted(){

  },
  methods: {
    //根据类型转换时间格式
    timeTypeChange(time){
      if(this.timeType==2){
        return this.formatSelectDate(time)
      }else if(this.timeType==3){
        return this.formatSelectDate(time)
      }else if(this.timeType==4){
        return this.formatMonthDate(time)
      }
    },
    //时间格式处理方法
    formatSelectDate(date) {
      var dateHour = new Date(date)
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}-${this.timeAdd(dateHour.getDate())}`;
    },
    formatMonthDate(date) {
      var dateHour = new Date(date)
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}`;
    },
    timeAdd(str) {
      if (str <= 9) {
        str = "0" + str;
      }
      return str;
    },
    buttonSearch(){
      this.onLoad();
    },
    currentChange(currentPage) {
      this.areaPage.currentPage = currentPage;
      this.onLoad();
    },
    sizeChange(pageSize) {
      this.areaPage.pageSize = pageSize;
      this.onLoad();
    },
    refreshChange() {
      this.onLoad();
    },
    //表格初始化数据
    onLoad() {
      let time = this.timeTypeChange(this.dateTime);
      this.loading = true;
        getAllMobileSiteRank(
          this.desc,  
          this.timeType,
          time, 
          this.moveFacType,
          this.areaPage.currentPage,
          this.areaPage.pageSize
        ).then((res) => {
          this.loading = false;
          const data = res.data.data.records;
          data.forEach(item=>{
          item.val = item.val+item.unit;
        });
          this.areaData = data;
          this.areaPage.total = res.data.data.total;
        });
    },
    //根据desc字段请求升序或降序接口
    sort(){
      if(this.desc == 1){
        this.desc = 0;
        this.onLoad();
      } else if(this.desc == 0){
        this.desc = 1;
        this.onLoad();
      }
    },
    //导出表格
    exportRoad() {
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(`/api/ms-airq/mobilesite/exportAllMobileSiteRank?${this.website.tokenHeader}=${getToken()}&desc=${this.desc}&type=${this.timeType}&time=${this.timeTypeChange(this.dateTime)}&factorCode=${this.moveFacType}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
