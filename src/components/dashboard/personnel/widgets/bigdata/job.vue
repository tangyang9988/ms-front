<template>
  <div class="onLine_wrapper">
    <div class="header">工种统计</div>
    <div style="padding:10px;background: #1e2539;flex: 1;overflow-y: hidden;">
      <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
  </div>
</template>
<script>
import {getJob} from "@/api/dust/personnelIndex";

export default {
  data() {
    return {
      // chartOptions: {
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      //     },
      //   },
      //   legend: {
      //     textStyle: {
      //       color: "#fff"
      //     },
      //     data: ['出勤', '未出勤']
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: {
      //     type: 'value',
      //     // color:'#fff',
      //     lineStyle: {
      //       color: '#fff'
      //     },
      //     // splitLine:{show: false},//去除网格线
      //     splitLine: {
      //       lineStyle: {
      //         // 使用深浅的间隔色
      //         color: '#666',
      //         type: 'dashed',//分隔线线的类型。
      //       }
      //     },
      //     axisLabel: {
      //       textStyle: {
      //         color: '#fff', //坐标值得具体的颜色
      //       }
      //     }
      //   },
      //   yAxis: {
      //     type: 'category',
      //     lineStyle: {
      //       color: '#fff'
      //     },
      //     axisLabel: {
      //       textStyle: {
      //         color: '#fff', //坐标值得具体的颜色
      //       }
      //     },
      //     data: ['其他', '电焊工', '建筑工', '防水工', '木工', '混凝土工', '钢筋工']
      //   },
      //   series: [
      //     {
      //       barWidth: "40%",
      //       name: '出勤',
      //       type: 'bar',
      //       stack: '总量',
      //       label: {
      //         show: true,
      //         position: 'insideRight'
      //       },
      //       itemStyle: {
      //         color: "rgba(96, 127, 239, 1)",//柱条的颜色
      //       },
      //       data: [320, 302, 301, 334, 390, 330, 320]
      //     },
      //     {
      //       name: '未出勤',
      //       type: 'bar',
      //       stack: '总量',
      //       label: {
      //         show: true,
      //         position: 'insideRight'
      //       },
      //       itemStyle: {
      //         color: "rgba(53, 60, 89, 1)",//柱条的颜色
      //       },
      //       data: [120, 132, 101, 134, 90, 40, 60]
      //     }
      //   ]
      // },
      chartOptions: {},
    }
  },
  mounted() {
    this.getInfo();//初始化数据
  },
  methods: {
    getInfo() {//请求数据
      const data1 = [320, 302, 301, 334, 390, 330, 320]
      const data2 = [120, 132, 101, 134, 90, 40, 60]
      getJob().then(res => {
        const resData = res.data.data
        // let series = []
        // for (var i = 0; i < resData.length; i++) {
        //   series.push(resData[i].totalNum);
        // }
        this.chartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            textStyle: {
              color: "#fff"
            },
            data: ['出勤', '未出勤']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            // color:'#fff',
            lineStyle: {
              color: '#fff'
            },
            // splitLine:{show: false},//去除网格线
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: '#666',
                type: 'dashed',//分隔线线的类型。
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff', //坐标值得具体的颜色
              }
            }
          },
          yAxis: {
            type: 'category',
            lineStyle: {
              color: '#fff'
            },
            axisLabel: {
              textStyle: {
                color: '#fff', //坐标值得具体的颜色
              }
            },
            data: ['其他', '电焊工', '建筑工', '防水工', '木工', '混凝土工', '钢筋工']
          },
          series: [
            {
              barWidth: "40%",
              name: '出勤',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              itemStyle: {
                color: "rgba(96, 127, 239, 1)",//柱条的颜色
              },
              data: data1
            },
            {
              name: '未出勤',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              itemStyle: {
                color: "rgba(53, 60, 89, 1)",//柱条的颜色
              },
              data: data2
            }
          ]
        }

      })
    },
  }
}
</script>

<style lang="scss" scoped>
.onLine_wrapper {

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;

  .header {
    color: #fff;
    line-height: 34px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC !important;
  }


  .lentit {
    text-align: center;
    position: absolute;
    top: 75%;
    left: 0;
    width: 100%;
    padding: 0 3%;
    display: flex;

    div {
      width: 33%;
      color: #fff;
      font-size: 14px;

      span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }

}
</style>
