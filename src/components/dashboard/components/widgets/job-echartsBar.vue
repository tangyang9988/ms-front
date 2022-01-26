<template>
  <div class="onLine_wrapper">
    <div class="header">工种统计</div>
    <div class="wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
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
      isEmpty: true,
      data1: [320, 302, 301, 334, 390, 330, 320],
      data2: [120, 132, 101, 134, 90, 40, 60],
    }
  },
  mounted() {
    this.getInfo();//初始化数据
  },
  methods: {
    getInfo() {//请求数据
      const data1 = [320, 302, 301, 334, 390, 330, 320]
      const data2 = [120, 132, 101, 134, 90, 40, 60]
      const data3 = []
      const dataType = []
      this.data1 = []//出勤
      this.data2 = []//未出勤
      this.total = []//总数
      getJob().then(res => {
        if (res.data.data.length > 0) {//是否有数据
          this.isEmpty = false//有数据 暂无数据隐藏
          const resData = res.data.data
          for (var i = 0; i < resData.length; i++) {
            dataType.push(resData[i].type);//类型
            this.data1.push(resData[i].totalNum)//出勤人数和未出勤人数没有值 写死数据 TODO
            if (resData[i].totalNum - 10 < 0) {
              this.data2.push(0)
            } else {
              this.data2.push(resData[i].totalNum - 10)
            }
          }
          for (var i = 0; i < this.data1.length; i++) {////出勤人数和未出勤人数没有值 写死数据 TODO
            var val = this.data1[i] + this.data2[i]
            this.total.push(val)
          }
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
              // data: ['其他', '电焊工', '建筑工', '防水工', '木工', '混凝土工', '钢筋工']
              data: dataType
            },
            series: [
              {
                barWidth: "40%",
                name: '总人数',
                type: 'bar',
                barGap: '-100%',
                label: {
                  normal: {
                    textStyle: {
                      color: '#682d19'
                    },
                    position: 'left',
                    show: false,
                    formatter: '{b}'
                  }
                },
                itemStyle: {
                  color: "rgba(53, 60, 89, 1)",//柱条的颜色
                },
                data: this.total
              },
              {
                barWidth: "40%",
                name: '出勤',
                type: 'bar',
                stack: true,//堆叠默认、叠加。没有是叠加
                label: {
                  normal: {
                    show: true,
                    formatter: function (params) {//如果值为0 则不显示 否则会样式错乱
                      if (params.value > 0) {
                        return params.value;
                      } else {
                        return '';
                      }
                    }
                  }
                },
                itemStyle: {
                  color: "rgba(96, 127, 239, 1)",//柱条的颜色
                },
                data: this.data1
              },
              {
                name: '未出勤',
                type: 'bar',
                stack: true,//堆叠默认、叠加。没有是叠加
                label: {
                  normal: {
                    show: true,
                    formatter: function (params) {//如果值为0 则不显示 否则会样式错乱
                      if (params.value > 0) {
                        return params.value;
                      } else {
                        return '';
                      }
                    }
                  }
                },
                itemStyle: {
                  color: "rgba(53, 60, 89, 1)",//柱条的颜色
                },
                data: this.data2
              }
            ]
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper-inner {
  background: #1e2539;
  flex: 1;
  overflow-y: hidden;
  position: relative;
  padding: 10px;
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
