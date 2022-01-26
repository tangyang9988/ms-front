<template>
  <div class="siteMonitor_wrapper psoa31_big_siteMonitor_wrapper">
    <div class="header">
      实时监测
      <el-button 
        class="refresh-count" 
        size="small" 
        type="primary" 
        icon="el-icon-refresh" 
        v-if="this.tableData.length !== 0 && this.tableData.length <= displayCount"
        @click="countNum=0">
        刷新倒计时 {{ countNum }}s
      </el-button>
    </div>
    <div id="realdataTable">
      <el-table
        class="bigdata-table"
        size="mini"
        :highlight-current-row="false"
        :height="tableHeight"
        :data="tableData"
        :header-cell-style="{ background: 'none', color: '#5F88F2' }"
        row-class-name="rowStyle"
        header-row-class-name="rowStyle"
      >
        <el-table-column
          v-for="(item, index) in tableHead"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getGISData } from "@/api/swaq/gis";
import $ from "jquery";

export default {
  data() {
    return {
      displayCount: 5,
      countNum: '-', // 刷新的倒计时·
      tableHeight: "calc(100% - 35px)",
      tableHead: [],
      tableData: [],
      timer: null,
      tableFactorList: [], // 因子数组
      tableFactorListObj: {} // 因子对象
    };
  },
  watch: {
    countNum(val) {
      if(this.tableData.length !== 0 && this.tableData.length <= this.displayCount) {
        if(val == 0) {
          clearInterval(this.timer)
          this.timer = null;
          $("#realdataTable").fadeOut();
          this.getTableData();
        }
      }
    },
  },
  mounted() {
    clearInterval(this.timer);
    this.timer = null;
    $("#realdataTable").fadeOut();
    this.getTableData();

    setInterval(() => {
      clearInterval(this.timer);
      this.timer = null;
      $("#realdataTable").fadeOut();
      this.getTableData();
    }, 1800000);
  },
  methods: {
    getTableData() {
      getGISData().then(res => {
        this.tableHead = [{
          label: "企业名称",
          prop: "deptName",
          width: 180
        }, {
          label: "站点",
          prop: "siteName",
          width: 240
        }];
        this.tableFactorList = [];
        this.tableFactorListObj = {};

        // 接口返回的表头因子部分
        res.data.data.forEach(item => {
          item.factorList.forEach(factor => {
            var tableFactor = {
              label: factor.unit !== "" && factor.unit !== undefined ? factor.alias + "\n(" + factor.unit + ")" : factor.alias,
              prop: factor.factorCode,
              align: "center"
            };

            // 去除重负因子
            if (this.tableFactorListObj[factor.factorCode] === undefined) {
              this.tableHead.push(tableFactor);
              this.tableFactorList.push(tableFactor);
              this.tableFactorListObj[factor.factorCode] = tableFactor;
            }
          });
        });

        this.tableHead.push({
          label: "监测时间",
          prop: "collectTime",
          align: "center",
          width: 150
        });

        res.data.data.forEach(item => {

          // 根据表头数据，赋默认值‘-’
          this.tableFactorList.forEach(el => {
            item[el.factorCode] = "-";
          });

          // 根据表体数据赋值
          item.factorList.forEach(el => {
            item[el.factorCode] = el.collectValue;
          });

        });

        this.tableData = res.data.data;
        $("#realdataTable").fadeIn();
      }).then(() => {
        if(this.tableData.length > this.displayCount) {
          this.timer = setInterval(() => {
            if (this.tableData.length > 0 && this.tableData[0] !== undefined) {
              let firstData = this.tableData[0];
              this.tableData = this.tableData.slice(1, this.tableData.length);
              this.tableData.push(firstData);
            }
          }, 2000);
        } else {
          this.countNum = 60;
          this.timer = setInterval(() => {
            this.countNum--
          }, 1000);
        }
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.siteMonitor_wrapper {
  * {
    border: none !important;
  }
  .rowStyle {
    border: 1px solid #ccc !important;
    background: rgba(211, 211, 211, 0.1);
  }
  table {
    border-collapse: separate;
    border-spacing: 0px 5px;
  }
  .el-table tbody tr:hover > td {
    background: none !important;
  }
  .gutter {
    background: none;
  }

  .bigdata-table .el-table__body-wrapper {
    overflow-y: hidden;
  }
}

.psoa31_big_siteMonitor_wrapper {
  .el-table th>.cell {
    white-space: pre-line;
  }
}
</style>
<style lang="scss" scoped>
.siteMonitor_wrapper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  .header {
    color: #5f88f2;
    // border-top-left-radius: 4px;
    // border-top-right-radius: 4px;
    line-height: 34px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    // background: -moz-linear-gradient(top, #4a63a8 0%, #1a2e74 100%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4a63a8), color-stop(100%,#1a2e74));
    // background: -webkit-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: -o-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: -ms-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: linear-gradient(to bottom, #4a63a8 0%,#1a2e74 100%);
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc !important;
  }
  .el-table {
    background: none;
    color: #f8f8f8;
  }
  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
  .refresh-count {
    float: right;
    margin-right: -10px;
  }
  #realdataTable {
    width: 100%;
    height: 100%;
  }
}
</style>
