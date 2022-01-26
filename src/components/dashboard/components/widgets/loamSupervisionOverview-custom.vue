<template>
  <div class="supervision_overview">
    <div id="header">督办工单</div>
    <div class="supervision_content">
      <!-- <span><label class="title">工单总数: </label><label>{{total}}</label></span>
      <span><label class="title">待办工单: </label><label>{{todo}}</label></span>
      <span><label class="title">已办工单: </label><label>{{done}}</label></span> -->
      <label class="title">工单总数: {{total}}</label>
      <label class="title">待办工单: {{todo}}</label>
      <label class="title">已办工单: {{done}}</label>
    </div>
    <e-chart 
      autoresize 
      :options="chartOptions" 
      style="height: 100%; width: 60%; float: left;">
    </e-chart>
  </div>
</template>

<script>
import { getSuperviseReport } from "@/api/loam/big-data";

export default {
  data() {
    return { 
      total: 0,
      todo: 0,
      done: 0,
      chartOptions: {
        tooltip: {
          trigger: 'item'
        },
        color: ["#5ab7fd", "#EF5F5F"],
        series: [{
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '45%'],
          label: {
            normal: {
              show: true,
              position: "center",
              fontSize: 14,
              color: "#fff",
              formatter: "工单总数\n\n0"
            }
          },
          labelLine: {
            show: false
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
      this.done = resData.done;
      this.todo = resData.todo;
      this.total = resData.total;
      this.chartOptions.series[0].data[0].value = this.done;
      this.chartOptions.series[0].data[1].value = this.todo;
      this.chartOptions.series[0].label.normal.formatter = "工单总数\n\n" + this.total;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.supervision_overview {
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

  .supervision_content {
    cursor: pointer;
    width: calc( 40% - 15px );
    float: left;
    height: calc( 100% - 44px);
    padding-left: 15px;
    color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      line-height: 30px;
      color: #5f88f2;
      letter-spacing: 3px;
      font-size: 16px !important;
      font-weight: bold;
    }

    // span {
    //   line-height: 30px;

    //   .title {
    //     color: #5f88f2;
    //     letter-spacing: 3px;
    //   }
      
    //   label {
    //     font-size: 16px !important;
    //     font-weight: bold;
    //   }
    // }
  }
}
</style>