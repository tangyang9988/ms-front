<template>
  <div>
      <basic-container>
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="区县排名" name="quxian">
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
              class="wd-75"
              v-model="wepmType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in wepmList"
                :key="item.id"
                :label="item.value"
                :value="item.id" />
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
              @click="exportQuxian"
              >导 出
            </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              size="small"
              plain
              icon="el-icon-sort"
              @click="sort"
              >{{desc == 0?'污染排名':'清洁排名'}}
            </el-button>
        </el-form-item>
      </el-form>
            <!-- 查询结束 -->
          </template>
        </avue-crud>
          </el-tab-pane>
          <el-tab-pane label="街道排名" name="jiedao">
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
              class="wd-75"
              v-model="wepmType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in wepmList"
                :key="item.id"
                :label="item.value"
                :value="item.id" />
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
              @click="exportJiedao"
              >导 出
            </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              size="small"
              plain
              icon="el-icon-sort"
              @click="sort"
              >{{desc == 0?'污染排名':'清洁排名'}}
            </el-button>
        </el-form-item>
      </el-form>
            <!-- 查询结束 -->
          </template>
        </avue-crud>
          </el-tab-pane>
      </el-tabs>
      </basic-container>
    </div>
</template>

<script>
import { getFixedSiteFactors,getMobilesiteFactors,getAreaRank } from "@/api/microstation/index.js";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
export default {
  data() {
    return {
      desc:1, //默认降序
      timeType:2,
      dateTime:new Date(),
      activeName:"quxian",
      wepmList:[],
      wepmType:"a34004",
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
          {
            align: "center",
            label: "名称",
            prop: "name",
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
  watch:{
    activeName(val){
      this.timeType = 2;
      this.dateTime = new Date();
      this.wepmType = "a34004";
      this.desc = 1;
      this.onLoad();
    }
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
     getFixedSiteFactors().then(res=>{
        this.wepmList = res.data.data;
    });
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
    //表格数据加载
    onLoad() {
      this.loading = true;
      let time = this.timeTypeChange(this.dateTime);
      if(this.activeName == "quxian"){
        getAreaRank(
          this.desc,
          this.timeType,
          '1',
          time,
          this.wepmType,
          this.areaPage.currentPage,
          this.areaPage.pageSize
        ).then((res) => {
          this.loading = false;
          const data = res.data.data.records;
          data.forEach(item=>{
          item.val = item.val+item.unit;
        });
          this.areaData = data;
          this.areaPage.total =res.data.data.total;
        });
      } else {
        getAreaRank(
          this.desc,
          this.timeType,
          '2',
          time,
          this.wepmType,
          this.areaPage.currentPage,
          this.areaPage.pageSize
        ).then((res) => {
          this.loading = false;
          const data = res.data.data.records;
          data.forEach(item=>{
          item.val = item.val+item.unit;
        });
          this.areaData = data;
          this.areaPage.total =res.data.data.total;
        });
      }
    },
    //排序
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
    exportQuxian() {
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(`/api/ms-airq/statreport22/exportAreaRank?${this.website.tokenHeader}=${getToken()}&desc=1&timeType=${this.timeType}&rankType=1&time=${this.timeTypeChange(this.dateTime)}&factorCode=${this.wepmType}`);
      });
    },
        //导出表格
    exportJiedao() {
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(`/api/ms-airq/statreport22/exportAreaRank?${this.website.tokenHeader}=${getToken()}&desc=1&timeType=${this.timeType}&rankType=2&time=${this.timeTypeChange(this.dateTime)}&factorCode=${this.wepmType}`);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
