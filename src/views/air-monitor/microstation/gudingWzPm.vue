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
              <el-select class="wd-75" v-model="wepmType" placeholder="请选择">
                <el-option
                  v-for="item in wepmList"
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
            <el-form-item label="周边范围:">
              <el-select
                class="wd-75"
                v-model="bzAroundArea"
                placeholder="请选择"
              >
                <el-option label="1.5km" :value="1500"></el-option>
                <el-option label="3km" :value="3000"></el-option>
                <el-option label="5km" :value="5000"></el-option>
                <el-option label="10km" :value="10000"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标站:">
              <el-select
                class="wd-100"
                v-model="compareBz"
                placeholder="请选择"
              >
                <el-option
                  :label="item.stationname"
                  :value="item.id"
                  v-for="item in bzSelectList"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                size="medium"
                type="primary"
                @click="buttonSearch()"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                @click="exportPm"
                >导 出
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="small" plain icon="el-icon-sort" @click="sort"
                >{{ desc == 0 ? "污染排名" : "清洁排名" }}
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
import {
  getFixedSiteFactors,
  getMobilesiteFactors,
  getAreaRank,
  getStatSite,
  getStatAroundSiteRankList,
} from "@/api/microstation/index.js";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
export default {
  data() {
    return {
      message:"标站周边排名：展示选定的标站周边一定范围内的微站数据作为排序展示，精确反应周边污染情况，便于溯源",
      bzSelectList: [],
      bzAroundArea: 1500,
      compareBz: "", //排名比较的标站
      desc: 1, //默认降序
      timeType: 2,
      dateTime: new Date(),
      wepmList: [],
      wepmType: "a34004",
      timeList: [
        { value: "日", id: 2 },
        { value: "周", id: 3 },
        { value: "月", id: 4 },
      ],
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
        addBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menu: false,
        column: [
          {
            align: "center",
            label: "名称",
            prop: "name",
          },
          {
            align: "center",
            label: "所属区域",
            prop: "belongDistrict",
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
  watch: {},
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
  created() {
    getFixedSiteFactors().then((res) => {
      this.wepmList = res.data.data;
    });
    this.getBzSelectList();
  },
  mounted(){
    setTimeout(this.onLoad,500);
  },
  methods: {
    //获取标站下拉框列表数据
    getBzSelectList() {
      getStatSite().then((res) => {
        this.bzSelectList = res.data.data;
        this.compareBz = this.bzSelectList[0].id;
      });
    },
    //根据类型转换时间格式
    timeTypeChange(time) {
      if (this.timeType == 2) {
        return this.formatSelectDate(time);
      } else if (this.timeType == 3) {
        return this.formatSelectDate(time);
      } else if (this.timeType == 4) {
        return this.formatMonthDate(time);
      }
    },
    //时间格式处理方法
    formatSelectDate(date) {
      var dateHour = new Date(date);
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}-${this.timeAdd(dateHour.getDate())}`;
    },
    formatMonthDate(date) {
      var dateHour = new Date(date);
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
    buttonSearch() {
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
      getStatAroundSiteRankList(
        time,
        this.timeType,
        this.wepmType,
        this.desc,
        this.bzAroundArea * 0.001,
        this.compareBz,
        this.areaPage.currentPage,
        this.areaPage.pageSize
      ).then((res) => {
        const data = res.data.data.records;
        data.forEach((item) => {
          item.val = item.val + item.unit;
        });
        this.areaData = data;
        this.areaPage.total = res.data.data.total;
        this.loading = false;
      });
    },
    //排序
    sort() {
      if (this.desc == 1) {
        this.desc = 0;
        this.onLoad();
      } else if (this.desc == 0) {
        this.desc = 1;
        this.onLoad();
      }
    },
    //导出表格
    exportPm() {
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/ms-airq/fixedsite/export?${
            this.website.tokenHeader
          }=${getToken()}&desc=${this.desc}&type=${
            this.timeType
          }&time=${this.timeTypeChange(this.dateTime)}&factorCode=${
            this.wepmType
          }&distance=${
            this.bzAroundArea * 0.001
          }&id=${
            this.compareBz
          }`
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
