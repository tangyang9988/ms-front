<template>
  <div class="chart_wrapper">
    <div class="header">区域分布</div>
    <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
  </div>
</template>

<script>
import { getDeptNum } from "@/api/loam/index";

export default {
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          }
        },
        color: "#5ab7fd",
        xAxis: {
          data: [],
          axisLabel: {
            interval: 0,
            color: "#888",
            rotate: 60
          },
          axisLine: {
            lineStyle: { color: "#999" }
          },
          axisTick: false
        },
        yAxis: { minInterval: 1 },
        series: [
          {
            data: [],
            name: "数量",
            type: "bar",
            barWidth: 20
          }
        ]
      }
    };
  },
  mounted() {
    getDeptNum().then(res => {
      if (res.data.success !== true) {
        return;
      }
      for (var i = 0; i < res.data.data.length; i++) {
        this.chartOptions.xAxis.data.push(res.data.data[i].regionName);
        this.chartOptions.series[0].data.push(res.data.data[i].deptNum);
      }
    });
  }
};
</script>
<style lang="scss" scoped></style>
