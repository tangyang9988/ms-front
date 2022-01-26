<template>
  <div class="chart_wrapper">
    <div class="header">排污企业类型</div>
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
          data: ["国控", "省控", "市控"]
        },
        color: ["#6196fd", "#64c676", "#ff9a00"],
        series: [
          {
            name: "排污企业类型",
            type: "pie",
            center: ["35%", "55%"],
            emphasis: {
              label: {
                show: true,
                fontSize: "14"
              }
            },
            data: [
              {
                name: "国控",
                value: 0
              },
              {
                name: "省控",
                value: 0
              },
              {
                name: "市控",
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
      res.data.data = { country: 31, province: 44, city: 20 };
      if (res.data.success !== true) {
        return;
      }
      this.chartOptions.series[0].data[0].value = res.data.data.country
        ? res.data.data.country
        : 0;
      this.chartOptions.series[0].data[1].value = res.data.data.province
        ? res.data.data.province
        : 0;
      this.chartOptions.series[0].data[2].value = res.data.data.city
        ? res.data.data.city
        : 0;
    });
  }
};
</script>
<style lang="scss" scoped></style>
