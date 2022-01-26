<template>
  <div class="siteMonitor_wrapper">
    <div class="header">预警记录</div>
    <el-table
      class="bigdata-table"
      size="mini"
      :highlight-current-row="false"
      :height="tableHeight"
      :data="tableData"
      :header-cell-style="{background:'none',color:'#5F88F2'}"
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
</template>

<script>
import {getChartData} from "@/api/ficm/dashboard";
import {getAbnormalData} from "@/api/dust/eveindex";
import $ from "jquery"

export default {
  data() {
    return {
      tableHeight: 'calc(100% - 35px)',
      tableHead: [],
      tableData: [],
      timer: null,
    }
  },
  mounted() {
    clearInterval(this.timer)
    this.timer = null
    this.getTableData()
    setInterval(() => {
      clearInterval(this.timer)
      this.timer = null
      this.getTableData()
    }, 1800000)
    let _this = this
    $(".bigdata-table").hover(function () {
      clearInterval(_this.timer)
      _this.timer = null
    }, function () {
      _this.timer = setInterval(() => {
        let firstData = _this.tableData[0]
        _this.tableData = _this.tableData.slice(1, _this.tableData.length)
        _this.tableData.push(firstData)
      }, 2000)
    })
  },
  methods: {
    getTableData() {
      getAbnormalData().then(res => {
        this.tableHead = [
          {
            label: '点位',
            prop: 'siteName',
            align: 'center',
          },
          {
            label: '因子',
            prop: 'factorName',
            align: 'center',
          },
          {
            label: '实时值',
            prop: 'curVal',
            align: 'center',
          },
          {
            label: '预值',
            prop: 'alertVal',
            align: 'center',
          },
          {
            label: '时间',
            prop: 'startTime',
            align: 'center',
          },
        ]
        // 遍历数组 显示前6条数据
        const resData = []
        if (res.data.data.length > 0) {
          if (res.data.data.length > 15) {//如果数据大于15
            for (var i = 0; i < 15; i++) {
              resData.push(res.data.data[i])
            }
          } else {//小于15 有多少添加多少
            for (var i = 0; i < res.data.data.length; i++) {
              resData.push(res.data.data[i])
            }
          }
        }
        resData.forEach(item => {
          this.tableData.push({
            siteName: item.siteName,
            factorName: item.factorName,
            curVal: item.curVal + item.unit,
            alertVal: `${this.standardValTransform(item.alertVal)}${item.unit}`,
            startTime: item.startTime
          })
        })
        // console.log('预警记录',this.tableData)
      }).then(() => {
        this.timer = setInterval(() => {
          let firstData = this.tableData[0]
          this.tableData = this.tableData.slice(1, this.tableData.length)
          this.tableData.push(firstData)
        }, 2000)
      })
    },
    standardValTransform(val) {
      if (val == null || val == '') {
        return val = ''
      } else {
        return val
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
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
    background: none !important
  }

  .gutter {
    background: none;
  }

  .bigdata-table .el-table__body-wrapper {
    overflow-y: hidden;
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
    color: #5F88F2;
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
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC !important;
  }

  .el-table {
    background: none;
    color: #f8f8f8;
  }

  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
}
</style>
