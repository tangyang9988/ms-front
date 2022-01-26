<template>
  <div class="chart_wrapper">
    <div class="header">排污企业现状</div>
    <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
  </div>
</template>

<script>
import { getDeptNum } from "@/api/psoa/company";

export default {
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b}：{c}个"
        },
        legend: {
          orient: "vertical",
          right: "10%",
          y: "center",
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          align: "left",
          textStyle: {
            fontSize: 12,
            color: "#f8f8f8"
          },
          data: ["停产企业", "在排企业"]
        },
        color: ["#caddfe", "#6196fd"],
        series: [
          {
            name: "排污企业现状",
            type: "pie",
            radius: ["60%", "75%"],
            center: ["35%", "55%"],
            label: {
              normal: {
                show: false,
                position: "center",
                fontSize: 12,
                color: "#f8f8f8",
                formatter: "{b}：{c}个"
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14"
              }
            },
            data: [
              {
                name: "停产企业",
                value: 0
              },
              {
                name: "在排企业",
                value: 0
              }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    getDeptNum().then(res => {
      // test only
      res.data.data = { stopCompany: 13, stillCompany: 26 };
      if (res.data.success !== true) {
        return;
      }
      this.chartOptions.series[0].data[0].value = res.data.data.stopCompany
        ? res.data.data.stopCompany
        : 0;
      this.chartOptions.series[0].data[1].value = res.data.data.stillCompany
        ? res.data.data.stillCompany
        : 0;
    });
  }
};
</script>
<style lang="scss" scoped></style>
