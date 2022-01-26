<template>
  <div class="wz-detail" ref="wz">
    <div class="close-wz" @click="closeWz"></div>
    <div class="layer-title">
        <i class="el-icon-arrow-right left-first"></i>
        <i class="el-icon-arrow-right"></i>
        <span>{{wzSite.siteName}}</span>
        <i class="el-icon-arrow-left"></i>
        <i class="el-icon-arrow-left right-second"></i>
        <el-tag size="mini" type="success" @click.native="vehicleHistoryClick()" style="position: absolute;right:0;cursor:pointer;">历史</el-tag>
      </div>
    <div class="wz-detail-top">
      <!-- <div class="time-mark"><span>时间类型: {{typeTrans(this.timeType)}}</span><span>时间: {{this.time}}</span></div> -->
      <el-form
        class="dark"
        size="mini"
        :show-message="false"
        inline
        label-width="75px"
      >
        <el-form-item label="时间类型:" style="margin-left:20px;">
          <el-select
            disabled
            class="wd-65"
            v-model="transType"
            :popper-append-to-body="false"
            placeholder="请选择"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <!-- 实时 -->
          <div v-if="timeType == 10" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="totalTime"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 小时 -->
          <div v-if="timeType == 1" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="time"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 日 -->
          <div v-if="timeType == 2">
            <el-date-picker
              disabled
              v-model="time"
              type="date"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="time"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 周 -->
          <div v-if="timeType == 3">
            <el-date-picker
              disabled
              v-model="time"
              type="week"
              class="wd-190"
              popper-class="dark"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择周"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 月 -->
          <div v-if="timeType == 4">
            <el-date-picker
              v-model="time"
              disabled
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择月份"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 旬 -->
          <div v-if="timeType == 11 || timeType == 12 || timeType == 13">
            <el-date-picker
              v-model="time"
              disabled
              time-arrow-control=""
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span class="bz-item-name" style="margin-left: 30px;">经度：{{wzSite.logitude}}</span>
      <span class="bz-item-name" style="margin-left: 55px;">纬度：{{wzSite.latitude}}</span> 
    </div>
    <div v-show="showLine" id="line-top"></div>
    <div class="no-line" v-if="!showLine">暂无折线图数据！</div>
    <div id="line-mid"></div>
    <div id="line-bottom"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";

import { getReport, getWind } from "@/api/microstation/wzDetail.js";

export default {
  data() {
    return {
      showLine:true,
      totalTime:new Date()
    };
  },
  props:{
    siteId:String,
    wzSite:Object,
    timeType:{
      type:String,
    },
    time:String
  },
  watch:{
    siteId(newId,oldId){
      echarts.init(document.getElementById('line-top')).dispose();
      echarts.init(document.getElementById('line-mid')).dispose();
      echarts.init(document.getElementById('line-bottom')).dispose();
      this.getReport(newId);
      // this.getWind(newId);
    },
    timeType(newType,oldType){
      this.timeType = newType;
    },
    time(newTime,oldTime){
      this.time = newTime;
    },
  },
  computed:{
    transType:function(){
      return this.typeTrans(this.timeType);
    }
  },
  mounted() {

  },
  methods: {
  vehicleHistoryClick(){
    this.$router.push({
      path: '/vehicleHistoryDetail',
      query: {
        activeName:"weizhan",
        siteId:this.siteId
      }
    })
  },
  //关闭按钮点击事件
    closeWz(){
      this.$emit("closeWzDetail");
      this.$emit("resetSiteId");
    },
    getReport(siteId) {
      let timeType = this.timeType;
      getReport(siteId, timeType, this.time).then((res) => {
        this.showLine = true;
        let option = res.data.data;
        let top = option.filter((item) => {
          let mark = "温度,湿度,气压,风速,风向";
          return !mark.includes(item.factorName);
        });
        let mid = option.filter((item) => {
          let mark = "温度,湿度,气压";
          return mark.includes(item.factorName);
        });

        if(top.length==0){
          top = mid;
        }
        //顶部折线图
        if(top.length>0) {
          let legendTop = [];
        let topX = top[0].xarray;
        let topSeries = [];
        top.forEach((item) => {
          topSeries.push({
            name: item.factorName + '-' + item.unit,
            type: "line",
            data: item.yarray,
          });
          let legend =!item.factorName==''? `${item.factorName + '-' + item.unit}`:'';
          legendTop.push(legend);
        });
        let chartDomTop = document.getElementById("line-top");
        let myChartTop = echarts.init(chartDomTop);
        let optiontop = {
          title: {
            text: "",
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + param.seriesName.split('-')[1]; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
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
            data: legendTop,
            formatter: function(params) {
									let arr = params.split('-')
									return arr[0]
								},
            textStyle: {
              color: "#FFFFFF",
            },
            selected: {
              "二氧化氮": false,
              "一氧化碳": false,
              "二氧化硫": false,
              "PM10": false,
              "PM2.5": false,
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: topX,
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#fff",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#fff",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: "0.5",
              },
            },
          },
          series: topSeries,
        };
        option && myChartTop.setOption(optiontop);
        }
        // 中间折线图
        if (mid.length>0) {
          let legendMid = [];
          let midX = mid[0].xarray;
          let midSeries = [];
          mid.forEach((item) => {
            midSeries.push({
              name: item.factorName + '-' + item.unit,
              type: "line",
              areaStyle: {},
              data: item.yarray,
            });
            let legend = !item.factorName==''? `${item.factorName + '-' + item.unit}`:'';
            legendMid.push(legend);
          });
          let chartDomMid = document.getElementById("line-mid");
          let myChartMid = echarts.init(chartDomMid);
          let optionmid = {
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis",
              formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + param.seriesName.split('-')[1]; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
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
              data: legendMid,
              formatter: function(params) {
									let arr = params.split('-')
									return arr[0]
								},
              textStyle: {
                color: "#FFFFFF",
              },
              selected: {
                "气压-pa": false,
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: midX,
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#fff",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
            yAxis: {
              type: "value",
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#fff",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  type: "dashed",
                  width: "0.5",
                },
              },
            },
            series: midSeries,
          };
          option && myChartMid.setOption(optionmid);
        }
        if(top.length>0 && mid.length == 0){
          let midX = top[0].xarray;
          let midSeries = [];
          let chartDomMid = document.getElementById("line-mid");
          let myChartMid = echarts.init(chartDomMid);
          let optionmid = {
            title: {
              text: "",
            },
            tooltip: {
              trigger: "axis"
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: midX,
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#fff",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
            yAxis: {
              type: "value",
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#fff",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  type: "dashed",
                  width: "0.5",
                },
              },
            },
            series: midSeries,
          };
          option && myChartMid.setOption(optionmid);
        }
      }).catch(err=>{
        console.log(err);
        this.showLine = false;
      });
    },
    //风向图
    getWind(siteId) {
      let timeType = this.timeType;
      if(timeType == '10' || timeType =='1'){
      getWind(siteId, timeType, this.time).then((res) => {
          let option = res.data.data;
          var directionMap = {};
          var arr = [
            "东风",
            "东北风",
            "北风",
            "西北风",
            "西风",
            "西南风",
            "南风",
            "东南风",
          ];
          echarts.util.each(arr, function (name, index) {
            directionMap[name] = (Math.PI / 4) * (index + 7); //方向箭头偏离了方向 所以用+7
          });
          let data = echarts.util.map(option, function (entry) {
            return [entry.time, entry.windSpeed, entry.windDirection];
          });
          var dims = {
            time: 0,
            windSpeed: 1,
            windDirection: 2,
          };
          var arrowSize = 18;
          function renderArrow(param, api) {
            var point = api.coord([
              api.value(dims.time),
              api.value(dims.windSpeed),
            ]);
            return {
              type: "path",
              shape: {
                pathData:
                  "M1023.90001 0.09999L0 513.049897 398.161117 624.938971l110.989161 399.061029z",
                x: -arrowSize / 2,
                y: -arrowSize / 2,
                width: arrowSize,
                height: arrowSize,
              },
              rotation: directionMap[api.value(dims.windDirection)],
              position: point,
              style: api.style({
                stroke: "#555",
                lineWidth: 1,
              }),
            };
          }
          // console.log(bottomX, bottomSeries, windDirection);
          //底部折线图
          let chartDomBottom = document.getElementById("line-bottom");
          let myChartBottom = echarts.init(chartDomBottom);
          let optionbottom = {
            tooltip: {
              trigger: "axis",
              formatter: function (params) {
                return [
                  params[0].value[dims.time] + "<br>" +
                  "风速：" + params[0].value[dims.windSpeed] + "m/s",
                  "风向：" + params[0].value[dims.windDirection],
                ].join("<br>");
              },
              // formatter: function (params) {
              //   return [
              //     echarts.format.formatTime(
              //       "yyyy-MM-dd",
              //       params[0].value[dims.time]
              //     ) +
              //       " " +
              //       echarts.format.formatTime(
              //         "hh:mm",
              //         params[0].value[dims.time]
              //       ),
              //     "风速：" + params[0].value[dims.windSpeed] + "m/s",
              //     "风向：" + params[0].value[dims.windDirection],
              //   ].join("<br>");
              // },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              axisLine: {
                lineStyle: {
                  type: "solid",
                  color: "#fff",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
            yAxis: [
              {
                axisLine: {
                  lineStyle: {
                    type: "solid",
                    color: "#fff",
                  },
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: "dashed",
                    width: "0.5",
                  },
                },
              },
              {
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },
                splitLine: {
                  show: false,
                },
              },
            ],
            series: [
              {
                type: "line",
                yAxisIndex: 1,
                showSymbol: false,
                hoverAnimation: false,
                symbolSize: 10,
                smooth: true,
                lineStyle: {
                  normal: {
                    color: "#96c533",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "rgba(88,160,253,1)"
                  },
                },
                encode: {
                	x: dims.time,
                	y: dims.windSpeed
                },
                data: data,
                z: 2,
              },
              {
                type: "custom",
                renderItem: renderArrow,
                color:"#ADC6FF",
                encode: {
                  x: dims.time,
                  y: dims.windSpeed,
                },
                data: data,
                z: 2,
              },
            ],
          };
          optionbottom && myChartBottom.setOption(optionbottom);
      });
      } else {
        echarts.init(document.getElementById('line-bottom')).dispose();
      }
    },
    typeTrans(timeType){
      if(timeType == '10'){
        return '实时';
      } else if(timeType == '1'){
        return '小时';
      } else if(timeType == '2'){
        return '日';
      } else if(timeType == '3'){
        return '周';
      } else if(timeType == '11'){
        return '上旬';
      } else if(timeType == '12'){
        return '中旬';
      } else if(timeType == '13'){
        return '下旬';
      } else if(timeType == '4'){
        return '月';
      }
    }
  },
};
</script>
<style scoped>
@import "~@/styles/element-ui-dark.scss";
</style>
<style lang="scss" scoped>
.wd-65 {
  width: 65px;
}
.wd-190 {
  width: 180px;
}
.wz-detail {
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  padding: 15px;
  width: 430px;
  height: 480px;
  .close-wz {
    width: 12px;
    height: 210px;
    background-image: url(/img/system/zhan.png);
    background-size: 100% 100%;
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    left: 2px;
    cursor: pointer;
  }
  .wz-detail-top {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #1ad1e3;
    /deep/.el-input__prefix {
      display: none;
    }
  }
  .no-line {
    margin: 5px auto;
    width: 430px;
    height: 190px;
    color: white;
    text-align: center;
    line-height: 360px;
  }
  #line-top {
    margin: 5px auto;
    width: 430px;
    height: 190px;
  }
  #line-mid {
    margin: 5px auto;
    width: 430px;
    height: 190px;
  }
  #line-bottom {
    margin: 5px auto;
    width: 430px;
    height: 190px;
  }
}
.dark.el-form {
  .el-form-item {
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  ::v-deep .el-form-item__label {
    color: white;
  }
  ::v-deep .el-input__inner {
    border: 1px solid #1ad1e3;
    background-color: #021f2d;
    color: white;
    padding: 0 8px;
    padding-right: 10px;
  }
  $changeColorList: input__suffix, el-range__icon, el-range-separator;
  @each $name in $changeColorList {
    ::v-deep .#{$name} {
      color: white;
      line-height: 28px;
    }
  }
  ::v-deep input {
    background-color: #021f2d;
    color: white;
    margin-top: -3px;
    width: 94%;
  }
}
.layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 10px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
</style>
