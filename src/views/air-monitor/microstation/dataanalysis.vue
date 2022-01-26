<template>
  <div class="devicetechnology">
    <div>
      <basic-container>
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          :page.sync="page"
          :permission="permissionList"
          v-model="form"
          ref="crud"
          @search-change="search"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="loadList(page, searchForm)"
        >
          <template slot="menuLeft">
            <div>
              <basic-container>
                <el-tabs
                  type="card"
                  @tab-click="codeChange($event)"
                  :value="factorCode"
                >
                  <el-tab-pane label="PM₂.₅" name="a34004">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="pm25"></div>
                  </el-tab-pane>
                  <el-tab-pane label="PM₁₀" name="a34002">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="pm10"></div>
                  </el-tab-pane>
                  <el-tab-pane label="SO2" name="a21026">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="so2"></div>
                  </el-tab-pane>
                  <el-tab-pane label="NO2" name="a21004">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="no2"></div>
                  </el-tab-pane>
                  <el-tab-pane label="CO" name="a21005">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="co"></div>
                  </el-tab-pane>
                  <el-tab-pane label="O3" name="a05024">
                    <el-button
                      @click="openBzAve"
                      v-text="isshow ? '显示标站平均值' : '关闭标站平均值'"
                    ></el-button>
                    <div id="o3"></div>
                  </el-tab-pane>
                  <el-tab-pane label="温度" name="a01001">
                    <div id="wendu"></div>
                  </el-tab-pane>
                  <el-tab-pane label="湿度" name="a01002">
                    <div id="shidu"></div>
                  </el-tab-pane>
                </el-tabs>
              </basic-container>
            </div>
            <div class="bottom-title"><el-button
              type="warning"
              plain
              size="medium"
              style="margin-bottom: 10px"
              icon="el-icon-download"
              @click="exportList()"
              >导 出</el-button
            ><span>空气质量月平均值</span></div>
          </template>
          <template slot="search">
            <el-form
              :inline="true"
              :model="searchForm"
              class="demo-form-inline"
            >
              <el-form-item label="区域选择：">
                <el-cascader
                  v-model="searchForm.qyxz"
                  :show-all-levels="false"
                  :options="areaList"
                  :props="{ checkStrictly: true, value: 'code', label: 'name' }"
                  placeholder="选择区域"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="月份选择: ">
                <el-date-picker
                  v-model="searchForm.yfxz"
                  type="month"
                  format="yyyy-MM"
                  valueFormat="yyyy-MM"
                  placeholder="选择月份"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="medium"
                  style="margin-left: 20px"
                  icon="el-icon-search"
                  @click="search()"
                  >搜 索</el-button
                >
                <el-button
                  size="medium"
                  style="margin-bottom: 10px"
                  icon="el-icon-download"
                  plain
                  @click="exportLine()"
                  >报表下载</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </avue-crud>
      </basic-container>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import {
  getListByRegionCode,
  getLine,
  getList,
} from "@/api/microstation/dataanalysis.js";
import { dateFormat } from "@/util/date";
import { getToken } from "@/util/auth";
import sidebarItemVue from '../../../page/index/sidebar/sidebarItem.vue';

export default {
  data() {
    return {
      factorCode: "a34004",
      areaList: "",
      searchForm: {
        qyxz: "3202",
        yfxz: dateFormat(new Date(), "yyyy-MM"),
      },
      month: dateFormat(new Date(), "yyyy-MM"),
      //是否显示标站平均值
      showAve: 0,
      isshow: true,
      type: "0",
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: this.$pageSize, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      option: {
        menu: false,
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 2,
        border: true,
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        columnBtn: false,
        selection: false,
        dialogClickModal: false,
        column: [
          {
            // label: "区域选择",
            prop: "qyxz",
            align: "center",
            search: true,
            searchslot: true,
            hide: true,
            type: "tree",
            dicUrl: "/api/ms-ficm/region/getListByRegionCode?regionCode=3202",
            props: {
              label: "name",
              value: "code",
            },
            rules: [
              {
                required: false,
                message: "请选择区域选择",
                trigger: "blur",
              },
            ],
          },
          {
            // label: "月份选择",
            prop: "yfxz",
            align: "center",
            hide: true,
            search: true,
            searchslot: true,
            type: "month",
            format: "yyyy-MM",
            valueFormat: "yyyy-MM",
          },
          {
            label: "微站名称",
            prop: "siteName",
            align: "center",
            span: 24,
          },
          {
            label: "区县",
            prop: "districtName",
            align: "center",
            disabled: true,
          },
          // {
          //   label: "街道",
          //   prop: "townName",
          //   align: "center",
          //   type: "textarea",
          //   span: 24,
          //   minRows: 4,
          // },
          {
            label: "PM₂.₅(ug/m3)",
            prop: "pm2_5",
            align: "center",
          },
          {
            label: "PM₁₀(ug/m3)",
            prop: "pm10",
            align: "center",
          },
        ],
      },
      data: [],
    };
  },
  computed: {},
  created() {
    this.getAeraList();
  },
  mounted() {},
  methods: {
    //获取区域选择器列表数据
    getAeraList() {
      getListByRegionCode("3202").then((res) => {
        this.areaList= res.data.data
      });
    },
    //初始化表格数据
    initData(regionCode, time) {
      getList(regionCode, time, this.page.currentPage, this.page.pageSize).then(
        (res) => {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.loading = false;
        }
      );
    },
    //画折线图
    initLine(regionCode, time, showAve) {
      this.getLine(regionCode, time, "a34004", "pm25", showAve);
      this.getLine(regionCode, time, "a34002", "pm10", showAve);
      this.getLine(regionCode, time, "a21026", "so2", showAve);
      this.getLine(regionCode, time, "a21004", "no2", showAve);
      this.getLine(regionCode, time, "a21005", "co", showAve);
      this.getLine(regionCode, time, "a05024", "o3", showAve);
      this.getLine(regionCode, time, "a01001", "wendu", showAve);
      this.getLine(regionCode, time, "a01002", "shidu", showAve);
    },
    //折线图方法
    getLine(regionCode, time, factorCode, type, showAve) {
      getLine(regionCode, time, factorCode, showAve).then((res) => {
        echarts.init(document.getElementById(`${type}`)).dispose();
        let data = res.data.data;
        if (data.length != 0) {
          let legend = data.map((item) => {
            return item.name;
          });
          let xarray = data[0].xarray;
          let series = [];
          for (let i = 0; i < data.length; i++) {
            series.push({
              name: data[i].name,
              data: data[i].yarray,
              type: "line",
            });
          }
          let unit;
          if (type == "pm25") {
            unit = "PM值(ug/m3)";
          } else if (type == "pm10") {
            unit = "PM值(ug/m3)";
          }else if (type == "so2") {
            unit = "SO2值(ug/m3)";
          }else if (type == "no2") {
            unit = "NO2值(ug/m3)";
          }else if (type == "co") {
            unit = "CO值(ug/m3)";
          }else if (type == "o3") {
            unit = "O3值(ug/m3)";
          } else if (type == "wendu") {
            unit = "温度(℃)";
          } else if (type == "shidu") {
            unit = "湿度(%)";
          }
          var chartDom = document.getElementById(`${type}`);
          var myChart = echarts.init(chartDom);
          var line_option;
          line_option = {
            title: {
              text: "空气质量曲线图\n",
              x: "center"
            },
            color: ["skyblue", "yellowgreen"],
            legend: {
              data: legend,
              y:'30px'
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: xarray,
            },
            yAxis: {
              name: unit,
              type: "value",
            },
            series: series,
          };
          line_option && myChart.setOption(line_option);
        }
      });
    },
    //自定义搜索
    search() {
      this.page.currentPage = 1;
      console.log(this.searchForm.qyxz, this.searchForm.yfxz);
      if (this.searchForm.qyxz.length != 0 && this.searchForm.yfxz != null) {
        this.loadList(this.page, this.searchForm);
      } else if (
        this.searchForm.qyxz.length == 0 &&
        this.searchForm.yfxz == null
      ) {
        this.initData("3202", this.month);
        this.initLine("3202", this.month, this.showAve);
      } else if (
        this.searchForm.qyxz.length == 0 ||
        this.searchForm.yfxz == null
      ) {
        this.$message({
          message: "请输入正确的搜索项！",
          type: "warning",
        });
      }
    },
    loadList(page, params) {
      this.loading = true;
      if (this.searchForm.qyxz != "" && this.searchForm.qyxz != "") {
        this.initData(params.qyxz[params.qyxz.length - 1], params.yfxz);
        this.initLine(
          params.qyxz[params.qyxz.length - 1],
          params.yfxz,
          this.showAve
        );
      } else {
        this.initData("3202", this.month);
        this.initLine("3202", this.month, this.showAve);
      }
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.loadList(this.page, this.searchForm);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.loadList(this.page, this.searchForm);
    },
    refreshChange() {
      this.loadList(this.page, this.searchForm);
    },
    //pm2.5 pm10 平均值按钮
    openBzAve() {
      if (this.showAve == 0) {
        this.initLine(
          this.searchForm.qyxz[this.searchForm.qyxz.length - 1],
          this.searchForm.yfxz,
          "1"
        );
        this.showAve = 1;
        this.isshow = false;
      } else if (this.showAve == 1) {
        this.initLine(
          this.searchForm.qyxz[this.searchForm.qyxz.length - 1],
          this.searchForm.yfxz,
          "0"
        );
        this.showAve = 0;
        this.isshow = true;
      }
    },
    codeChange(e) {
      this.factorCode = e.name;
    },
    //导出表格
    exportList() {
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/ms-airq/statreport22/export?${
            this.website.tokenHeader
          }=${getToken()}&regionCode=${this.searchForm.qyxz}&time=${
            this.searchForm.yfxz
          }`
        );
      });
    },
    //导出报表
    exportLine() {
      this.$confirm("是否导出折线图?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.open(
          `/api/ms-airq/statreport22/exportLine?${
            this.website.tokenHeader
          }=${getToken()}&regionCode=${this.searchForm.qyxz}&time=${
            this.searchForm.yfxz
          }&factorCode=${this.factorCode}&type=${this.showAve}`
        );
      });
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
.el-tab-pane #pm25 {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #pm10 {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #wendu {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #shidu {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #so2 {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #no2 {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #co {
  width: 1600px;
  height: 350px;
}
.el-tab-pane #o3 {
  width: 1600px;
  height: 350px;
}
.gap {
  width: 100%;
  height: 20px;
  background-color: gray;
}
/deep/.el-form-item__content {
  .el-button--small {
    display: none;
  }
}
/deep/.avue-form__row {
  display: none;
}
/deep/.avue-crud__left {
  .el-button--primary {
    position: relative;
  }
}
.el-card__body {
    padding: 10px !important;
}
.bottom-title {
  height: 50px;
  line-height: 50px;
  margin-bottom: 20px;
  span {
    margin-left: 950px;
    display: inline-block;
    font-size: 16px !important;
    text-align: center;
    font-weight: 700;
  }
}
</style>
