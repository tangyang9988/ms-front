<template>
  <div class="wrapper">
    <div class="header">PM2.5监测<span class="subTitle" @click="linkTab">历史数据</span></div>
    <div class="wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
  </div>
</template>

<script>
import {getPM25Data} from "@/api/dust/eveindex";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      chartOptions: {},
      isEmpty: true
    }
  },
  mounted() {
       this.getLineInfo()
  },
  methods: {
    getLineInfo() {
      // this.factorCodeId
      getPM25Data(this.factorCodeId).then(res => {
      	
        if (res.data.data.length > 0) {//是否有数据
          this.isEmpty = false//有数据 暂无数据隐藏
          let dataX = []
          let dataLenged = []
          let series = []//定义一个数组变量用于存放配置
          const resData = res.data.data
          // console.log('折线2.5 data', resData)
          for (var i = 0; i < resData.length; i++) {
            dataX = resData[0].x
            dataLenged.push(resData[i].siteName)
            series.push({
              name: resData[i].siteName,
              type: 'line',
              itemStyle: {//折线颜色
                colors: ['#c23531', '#2f4554', '#61a0a8', '#d48265']
              },
              data: resData[i].y
            })
          }
          this.chartOptions = {
            tooltip: {
              trigger: 'axis',
              formatter: function (params, ticket, callback) {
                var htmlStr = '';
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + ':00';//x轴的名称
                  var seriesName = param.seriesName;//图例名称
                  var value = param.value;//y轴值
                  var color = param.color;//图例颜色
                  if (i === 0) {
                    htmlStr += xName + '<br/>';//x轴的名称
                  }
                  htmlStr += '<div>';
                  //为了保证和原来的效果一样，这里自己实现了一个点的效果
                  htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
                  // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                  //htmlStr += '<span style="color:'+color+'">';
                  //圆点后面显示的文本
                  htmlStr += seriesName + '：' + value;
                  // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                  //htmlStr += '</span>';
                  htmlStr += '</div>';
                }
                return htmlStr;
              }
            },
            legend: {
              data: dataLenged,
              textStyle: {
                color: "#fff"
              },
              padding: [10, 0]
            },
            grid: {
              left: '3%',
              right: '10%',
              bottom: '3%',
              top: '26%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              name: '时',//坐标轴名称
              nameTextStyle: {//坐标轴名称的文字样式。
                color: "#fff"
              },
              boundaryGap: false,
              axisLabel: {
                interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                color: '#888'
              },
              axisLine: {
                lineStyle: {color: '#999'}    // x轴坐标轴颜色
              },
              data: dataX
            },
            yAxis: {
              type: 'value',
              name: 'μg/m³',//坐标轴名称
              nameTextStyle: {//坐标轴名称的文字样式。
                color: "#fff"
              },
              axisLine: {
                lineStyle: {color: '#999'}    // x轴坐标轴颜色
              },
              axisTick: false,//是否显示坐标轴刻度。
              splitLine: {//坐标轴在 grid 区域中的分隔线。
                show: true,
                lineStyle: {
                  color: '#dedede',
                  type: 'dashed'//设置背景为虚线
                }
              }
            },
            series: series
          };
        }
      })
    },
    // 跳转
    linkTab() {
      this.$store.commit('SET_UNLOADING')
      this.$router.push({
        path: '/dust/environmental/history/historydata'
      })
    }
    ,
  },
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

.wrapper {
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
}

.subTitle {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}

</style>
