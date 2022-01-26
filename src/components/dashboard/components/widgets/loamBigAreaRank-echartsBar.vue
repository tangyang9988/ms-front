<template>
  <div class="chart_wrapper">
    <!-- 信息舱 -->
    <div class="header">达标率区域排名</div>
    <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
  </div>
</template>

<script>
import { getRegionalRanking } from "@/api/loam/big-data";

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
        grid: {
          top: "70px",
          right: '45px'
        },
        xAxis: {
          type: "category",
          name: "区域",
          data: [],
          axisLabel: {
            interval: 0,
            color: "#fff",
            rotate: 70,
            fontSize: 10
          },
          axisLine: {
            lineStyle: { color: "#fff" }
          },
          axisTick: false
        },
        yAxis: {
          type: "value",
          name: "达标率(%)",
          // interval: 20,
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: { color: "#fff" }
          },
          axisTick: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: "#999",
              type: "dashed"
            }
          }
        },
        dataZoom: {
          type: "inside",
          orient: "vertical"
        },
        series: [{
          data: [],
          name: "达标率(%)",
          type: "bar",
          barMaxWidth: 30,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 10
                }
              }
            }
          }
        }]
      }
    };
  },
  mounted() {
    getRegionalRanking().then(res => {
      if (res.data.success !== true) {
        return;
      }
      var resData = res.data.data.sort(this.sortRate);
      for (var i = 0; i < resData.length; i++) {
        this.chartOptions.xAxis.data.push(resData[i].district_name);
        this.chartOptions.series[0].data.push(resData[i].regionalCompliance);
      }
      this.chartOptions.yAxis.min = resData[0].minRegionalCompliance - 0;
    });
  },
  methods: {
    sortRate(ob1, ob2) {
      if (parseFloat(ob1.regionalCompliance) < parseFloat(ob2.regionalCompliance)) {
        return -1;
      } else if (parseFloat(ob1.regionalCompliance) > parseFloat(ob2.regionalCompliance)) {
        return 1;
      } else {
        return 0;
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
