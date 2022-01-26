<template>
  <div class="custom-wrapper">
    <div class="header">实时空气站点数量汇总</div>
    <div class="container">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <div class="container-inner" v-else>
        <div class="title">{{ time }}发布</div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
      </div>
    </div>
  </div>
</template>

<script>
import {getDeptAqi} from "@/api/airq/airqIndex";

export default {
  data() {
    return {
      isEmpty: true,//判断是否有数据
      chartOptions: {},
      time: ''//显示发布时间
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getDeptAqi().then(res => {
          const resData = res.data.data
          this.time = resData.time
          let obj = {
            serious: resData.serious,//严重污染
            severe: resData.severe,//重度污染
            medium: resData.medium,//中度污染
            mild: resData.mild,//中度污染
            good: resData.good,//良
            excellent: resData.excellent,//优
          }
          let values = Object.values(obj);//获取对象值
          // values = [1, 2, 3, 4, 5, 6]
          //如果数据为空 则显示无数据
          if (!this._ifFlag(values)) {
            this.isEmpty = this._ifFlag(values)
            this.chartOptions = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                top: '10%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                minInterval: 1,
                axisLine: {
                  show: true,//是否显示坐标轴轴线。
                  lineStyle: {color: '#999'}    // x轴坐标轴颜色
                },
                axisTick: false,
                splitLine: {//是否显示分隔线。默认数值轴显示，类目轴不显示。
                  show: false,
                  lineStyle: {
                    color: '#dedede',
                    type: 'dashed'//设置背景为虚线
                  }
                }
              },
              yAxis: {
                type: 'category',
                data: ['严重', '重', '中', '轻', '良', '优'],
                axisLabel: {
                  interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                  color: '#888'
                },
                axisLine: {
                  show: true,//是否显示坐标轴轴线。
                  lineStyle: {color: '#999'}    // x轴坐标轴颜色
                },
                axisTick: false,
              },
              series: [
                {
                  name: '站点数量',
                  type: 'bar',
                  barWidth: '55%',
                  // label: {
                  //   normal: {
                  //     show: true,
                  //     formatter: function (v) {
                  //       var val = v.data;
                  //       return val;
                  //     },
                  //     color: '#fff'
                  //   }
                  // },
                  itemStyle: {
                    normal: {
                      color: (params) => {
                        let color = '#00e400'
                        switch (params.name) {
                          case '优':
                            color = '#00e400'
                            break;
                          case '良':
                            color = '#ffff00'
                            break;
                          case '轻':
                            color = '#ff7e00'
                            break;
                          case '中':
                            color = '#ff0000'
                            break;
                          case '重':
                            color = '#99004c'
                            break;
                          case '严重':
                            color = '#7e0023'
                            break;
                          default:
                            break;
                        }
                        return color
                      },
                    }
                  },
                  data: values
                },
              ]
            }
          }
        }
      )
    },
    _ifFlag(arr) {
      return arr.every(i => i === 0) //判断数组里面的值都为0
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-wrapper {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: #fff;

  .header {
    color: #5F88F2;
    background: #fff;
    line-height: 34px;
    width: 100%;
    box-shadow: 2px 2px 4px #ddd;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC
  }
}

.container {
  display: flex;
  flex-direction: column;
  background: #fff;
  color: $custom-index-color;
  padding: 10px;
  height: 100%;
  position: relative;

  .container-inner {
    display: flex;
    flex-direction: column;
    color: $custom-index-color;
    height: 100%;
  }

  .title {
    font-size: 12px;
  }
}

.emptybg {
  background: 0;
}

.empty {
  position: absolute;
  left: 0;
  top: 0;
  color: #ccc;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}
</style>
