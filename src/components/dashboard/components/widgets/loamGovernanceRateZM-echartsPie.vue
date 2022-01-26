<template>
  <div class="chart_wrapper">
    <div class="header">治理评级</div>
    <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
  </div>
</template>

<script>
import { getGovernanceRating } from "@/api/loam/index";

export default {
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b}级企业：{c}个"
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
            fontSize: 12
          },
          data: ["A", "B", "C", "D"]
        },
        color: ["#23D2A7", "#5ab7fd", "#FEC107", "#EF5F5F"],
        series: [
          {
            name: "排污企业现状",
            type: "pie",
            radius: ["45%", "60%"],
            center: ["35%", "55%"],
            label: {
              normal: {
                show: true,
                position: "center",
                fontSize: 16,
                color: "#000",
                formatter: "企业总数\n\n0"
              }
            },
            data: [
              { name: "A", value: 0 },
              { name: "B", value: 0 },
              { name: "C", value: 0 },
              { name: "D", value: 0 }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    getGovernanceRating().then(res => {
      if (res.data.success !== true) {
        return;
      }
      // 优秀
      this.chartOptions.series[0].data[0].value = res.data.data.level1
        ? res.data.data.level1
        : 0;
      // 规范
      this.chartOptions.series[0].data[1].value = res.data.data.level2
        ? res.data.data.level2
        : 0;
      // 合格
      this.chartOptions.series[0].data[2].value = res.data.data.level3
        ? res.data.data.level3
        : 0;
      // 整改
      this.chartOptions.series[0].data[3].value = res.data.data.level4
        ? res.data.data.level4
        : 0;
      // 企业总数
      var totalNum = res.data.data.totalNumberOfCompanies
        ? res.data.data.totalNumberOfCompanies
        : 0;
      this.chartOptions.series[0].label.normal.formatter = "企业总数\n\n" + totalNum;
    });
  }
};
</script>
<style lang="scss" scoped></style>
