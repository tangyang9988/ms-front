<template>
  <div class="chart_wrapper">
    <div class="header">排污企业分布</div>
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
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        color: "#6196fd",
        xAxis: {
          data: [],
          axisLabel: {
            interval: 0,
            color: "#f8f8f8"
          },
          axisLine: {
            lineStyle: { color: "#f8f8f8" }
          },
          axisTick: false
        },
        yAxis: {
          minInterval: 1,
          axisLine: {
            lineStyle: { color: "#f8f8f8" }
          }
        },
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
      // test only
      // res.data.data = [{"deptNum": 8,"regionName": "北京市","regionCode": "11"},
      //   {"deptNum": 4,"regionName": "天津市","regionCode": "12"},
      //   {"deptNum": 2,"regionName": "上海市","regionCode": "3101"},
      //   {"deptNum": 3,"regionName": "宝山区","regionCode": "310113"},
      //   {"deptNum": 33,"regionName": "无锡市","regionCode": "3202"},
      //   {"deptNum": 1,"regionName": "锡山区","regionCode": "320205"},
      //   {"deptNum": 1,"regionName": "苏州市","regionCode": "3205"}
      // ]
      if (res.data.success !== true) {
        return;
      }
      for (var i = 0; i < res.data.data.length; i++) {
        this.chartOptions.xAxis.data.push(res.data.data[i].regionName);
        this.chartOptions.series[0].data.push(res.data.data[i].deptNum);
      }
    });
  },
  methods: {
    /**
     * 取随机数
     */
    getRandom() {
      return Math.round(Math.random() * 100);
    }
  }
};
</script>
<style lang="scss" scoped></style>
