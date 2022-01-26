<template>
  <div class="supervision_overview_pie">
    <div id="header">督办工单</div>
    <e-chart 
      autoresize 
      :options="chartOptions" 
      style="height: 100%;">
    </e-chart>
  </div>
</template>

<script>
import { getSuperviseReport } from "@/api/loam/big-data";

export default {
  data() {
    return { 
      chartOptions: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: "vertical",
          right: "10%",
          y: "center",
          icon: "square",
          padding: [5, 10],
          itemWidth: 15,
          itemHeight: 15,
          align: "left",
          textStyle: {
            fontSize: 15,
            color: "#fff"
          },
          data: ["已办工单", "待办工单"]
        },
        color: ["#5ab7fd", "#EF5F5F"],
        series: [{
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['35%', '43%'],
          label: {
            normal: {
              show: true,
              position: "center",
              fontSize: 14,
              color: "#fff",
              formatter: "工单总数\n\n0"
            }
          },
          data: [
            {name: '已办工单', value: 0},
            {name: '待办工单', value: 0}
          ]
        }]
      }
    };
  },
  mounted() {
    getSuperviseReport().then(res => {
      if(!res.data.success) {
        return;
      }
      let resData = res.data.data;
      this.chartOptions.series[0].data[0].value = resData.done;
      this.chartOptions.series[0].data[1].value = resData.todo;
      this.chartOptions.series[0].label.normal.formatter = "工单总数\n\n" + resData.total;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.supervision_overview_pie {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(211, 211, 211, 0.1);
  border-radius: 3px;

  #header {
    color: #5f88f2;
    line-height: 34px;
    padding: 0 5px;
    text-align: left;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc;
  }
}
</style>