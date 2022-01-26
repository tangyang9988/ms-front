<template>
  <div class="chart_wrapper">
    <div class="header">预警情况</div>
    <div class="template_content">
      <!-- 异常详情 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="abnormal_title">当前预警</div>
            <div class="abnormal_value">{{ theCurrentException }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="abnormal_title">昨日预警</div>
            <div class="abnormal_value">{{ yesterdaySException }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="abnormal_title">本月预警</div>
            <div class="abnormal_value">{{ exceptionOfTheMonth }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="abnormal_title" style="margin-top:7px;">本月未处理预警</div>
            <div class="abnormal_value" style="margin-bottom:12px;">{{ exceptionUnhandledThisMonth }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- 图表（处理情况） -->
      <e-chart
        autoresize
        :options="dealChartOptions"
        style="height:calc((100% - 125px) / 2);"
      ></e-chart>
      <!-- 图表（及时率） -->
      <e-chart
        autoresize
        :options="prompChartOptions"
        style="height:calc((100% - 125px) / 2);"
      ></e-chart>
    </div>
  </div>
</template>

<script>
import { getExceptions } from "@/api/loam/big-data";

export default {
  data() {
    return {
      theCurrentException: 0, // 当前异常
      yesterdaySException: 0, // 昨日异常
      exceptionOfTheMonth: 0, // 本月异常
      exceptionUnhandledThisMonth: 0, // 本月异常未处理
      // 处理情况图表
      dealChartOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b}：{c}%"
        },
        legend: {
          orient: "vertical",
          right: "10%",
          y: "center",
          icon: "square",
          itemWidth: 10,
          itemHeight: 10,
          align: "left",
          textStyle: {
            fontSize: 12,
            color: "#f8f8f8"
          },
          data: ["已处理", "未处理"]
        },
        color: ["#5ab7fd", "#FEC107"],
        series: [
          {
            name: "排污企业现状",
            type: "pie",
            radius: ["60%", "75%"],
            center: ["30%", "45%"],
            label: {
              normal: {
                show: true,
                position: "center",
                fontSize: 14,
                color: "#f8f8f8",
                formatter: "100%"
              }
            },
            data: [
              { name: "已处理", value: 0 },
              { name: "未处理", value: 0 }
            ]
          }
        ]
      },
      // 及时率图表
      prompChartOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b}：{c}%"
        },
        legend: {
          orient: "vertical",
          right: "10%",
          y: "center",
          icon: "square",
          itemWidth: 10,
          itemHeight: 10,
          align: "left",
          textStyle: {
            fontSize: 14,
            color: "#f8f8f8"
          },
          data: ["及时率", "延误率"]
        },
        color: ["#009e00", "rgb(187, 186, 186)"],
        series: [
          {
            name: "排污企业现状",
            type: "pie",
            radius: ["60%", "75%"],
            center: ["30%", "45%"],
            label: {
              normal: {
                show: true,
                position: "center",
                fontSize:12,
                color: "#f8f8f8",
                formatter: "100%"
              }
            },
            data: [
              { name: "及时率", value: 100 },
              { name: "延误率", value: 0 }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.handler();
  },
  methods: {
    handler() {
      getExceptions().then(res => {
        if (res.data.success !== true) {
          return;
        }
        console.log(res.data.data)
        // 异常情况
        this.theCurrentException = res.data.data.theCurrentException
          ? res.data.data.theCurrentException
          : 0;
        this.yesterdaySException = res.data.data.yesterdaySException
          ? res.data.data.yesterdaySException
          : 0;
        this.exceptionOfTheMonth = res.data.data.exceptionOfTheMonth
          ? res.data.data.exceptionOfTheMonth
          : 0;
        this.exceptionUnhandledThisMonth = res.data.data.exceptionUnhandledThisMonth
          ? res.data.data.exceptionUnhandledThisMonth
          : 0;
        // 处理率
        this.dealChartOptions.series[0].data[0].value = res.data.data.disposalRate
          ? Math.floor(res.data.data.disposalRate * 100 * 100) / 100
          : 0;
        this.dealChartOptions.series[0].data[1].value =
          100 - this.dealChartOptions.series[0].data[0].value;
        this.dealChartOptions.series[0].label.normal.formatter = '处理率'+'\n\n'+this.dealChartOptions.series[0].data[0].value + "%";
        // 及时率
        this.prompChartOptions.series[0].data[0].value = res.data.data.onTimeRate
          ? Math.floor(res.data.data.onTimeRate * 100 * 100) / 100
          : 0;
        this.prompChartOptions.series[0].data[1].value =
          100 - this.prompChartOptions.series[0].data[0].value;
        this.prompChartOptions.series[0].label.normal.formatter ='及时率'+'\n\n'+
          this.prompChartOptions.series[0].data[0].value + "%";
      });
    }
  }
};
</script>

<style lang="scss" scoped>
%container_styles {
  position: absolute;
  width: 100%;
}
.template_content {
  @extend %container_styles;
  top: 34px;
  bottom: 0px;
}
.el-row {
  width: 100% !important;
  margin: 10px 15px 10px 0px !important;
  .el-col {
    margin-bottom: 0px !important;
    .bg-purple {
      height: 90px;
      padding: 5px 0px 0px 0px ;
      background: #04183b;
      border: 2px transparent solid;
      border-image: linear-gradient(to top, #28304a, #628dfc) 1 10;
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      .abnormal_title {
        color: #5f88f2;
        font-size: small !important;
        width: 100%;
      }
      .abnormal_value {
        color: #f8f8f8;
        font-size: 24px !important;
        font-weight: 500;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
