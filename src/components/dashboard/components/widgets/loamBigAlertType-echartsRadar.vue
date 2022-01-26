<template>
  <div class="chart_wrapper">
    <div class="header">报警类型</div>
    <e-chart 
      autoresize 
      :options="chartOptions" 
      style="height: 100%; width: 60%; float: left;">
    </e-chart>
    <div class="alert_type_content">
      <span>正常：{{normalCount}}</span>
      <span>故障：{{faultCount}}</span>
      <span>超标：{{overLimitCount}}</span>
      <span>离线：{{offLineCount}}</span>
    </div>
  </div>
</template>

<script>
import { getAlertType } from "@/api/loam/big-data";

export default {
  data() {
    return {
      normalCount: 0,
      faultCount: 0,
      overLimitCount: 0,
      offLineCount: 0,
      chartOptions: {
        itemStyle: {
          color: "#5ab7fd"
        },
        textStyle: {
          color: ["#fff"],
          fontSize: 11
        },
        radar: {
          indicator: [
            { name: '正常', max: 0},
            { name: '故障', max: 0},
            { name: '超标', max: 0},
            { name: '离线', max: 0}
          ],
          nameGap: 5,
          center: ['45%', '60%'],
          radius: 60
        },
        series: [{
          name: '数量',
          type: 'radar',
          areaStyle: {},
          data: [{
            value: [],
            name: '报警类型'
          }]
        }]
      }
    };
  },
  mounted() {
    getAlertType().then(res => {
      if(!res.data.success) {
        return;
      }
      let resData = res.data.data;
      this.chartOptions.radar.indicator.forEach(item => {
        item.max = resData.totalCount;
      });
      this.chartOptions.series[0].data[0].value.push(resData.normalCount, resData.faultCount, resData.overLimitCount, resData.offLineCount);
      this.normalCount = resData.normalCount;
      this.faultCount = resData.faultCount;
      this.overLimitCount = resData.overLimitCount;
      this.offLineCount = resData.offLineCount;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.alert_type_content {
  width: calc( 40% - 15px );
  float: left;
  height: calc( 100% - 44px);
  margin-top: 30px;
  padding-left: 15px;
  color: #fff;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: 14px !important;
    letter-spacing: 2px;
    line-height: 22px;
  }
}
</style>