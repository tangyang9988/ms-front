<template>
  <div class="chart_wrapper">
    <!-- 首页 -->
    <div class="header">达标率区域排名</div>
    <e-chart autoresize :options="chartOptions" style="height:100%;" @click="handelClick"></e-chart>
  </div>
</template>

<script>
import { getRegionalRanking } from "@/api/loam/index";

export default {
  data() {
    return {
      chartOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line"
          },
          formatter: function(params) {
            return params[0].name + "<br><label style='display: inline-block; width: 10px;height: 10px; border-radius: 5px; background-color: #5ab7fd; margin-right: 5px;'></label>" + params[0].seriesName + ": " + params[0].data + "%"
          }
        },
        color: "#5ab7fd",
        grid: {
          left: "4%",
          right: 65,
          bottom: "4%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          name: "达标率(%)",
          nameTextStyle: {
            align: "center",
            padding: [0, 0, 0, 35]
          },
          interval: 20,
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: { color: "#000" }
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
        yAxis: {
          type: "category",
          name: "区域",
          nameGap: 8,
          nameTextStyle: {
            align: "center",
            padding: [0, 0, -5, 0]
          },
          data: [],
          axisLabel: {
            interval: 0,
            color: "#000"
          },
          axisLine: {
            lineStyle: { color: "#000" }
          },
          axisTick: false
        },
        series: [
          {
            name: "达标率",
            type: "bar",
            barWidth: 20,
            data: []
          }
        ]
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
        this.chartOptions.yAxis.data.push(resData[i].district_name);
        this.chartOptions.series[0].data.push(resData[i].regionalCompliance);
      }
      if(resData.length > 0 && resData.length < 7) {
        this.chartOptions.series[0].barWidth = 20;
      } else if(resData.length >= 7 && resData.length < 10) {
        this.chartOptions.series[0].barWidth = 15;
      } else if (resData.length >= 10) {
        this.chartOptions.series[0].barWidth = 10;
      }
    });
  },
  methods: {
  	handelClick(param){
  		this.$store.dispatch('setLoamAreaName',param.name)
  	},
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
