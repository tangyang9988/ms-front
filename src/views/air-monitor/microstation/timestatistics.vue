<template>
  <div>
    <basic-container>
      <div class="button">
        <el-radio-group v-model="tab" size="medium " @change="typeChange">
          <el-radio-button
            label="空气质量变化折线图"
            style="width: 100"
          ></el-radio-button>
          <el-radio-button label="区域污染对比图"></el-radio-button>
          <el-radio-button label="时段数据统计图"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="setting">
        <span style="margin: 20px">区域选择</span>
        <el-select v-model="areaId" size="small" placeholder="请选择">
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <span style="margin: 20px">时间选择</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          size="small"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 20px"
          @click="onLoad()"

          >查询</el-button
        >
        <el-button
          type="warning"
          size="small"
          plain
          icon="el-icon-download"
          @click="handleExport"
          >导出</el-button
        >
      </div>

      <el-empty :image-size="200"></el-empty>
      <!-- 时段数据统计图 -->
      <TimeDataChart></TimeDataChart>
    </basic-container>
  </div>
</template>
<script>
import { getStatistics, getWuDistList } from "@/api/archives/roadinfo";
import { dateFormat } from "@/util/date";
import TimeDataChart from "@/components/microstation/timeDataChart.vue";
export default {
  components: {
    TimeDataChart,
  },
  data() {
    return {
      tab: "空气质量变化折线图",
      areaId: "3202",
      areaList: "",
      time: dateFormat(new Date(), "yyyy-MM-dd"),
    };
  },
  methods: {
    onLoad() {
      var that = this;
      getStatistics(that.areaId, that.time, 1).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-1");
          console.log(chartDom);
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "固定微站设备数统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "个",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 2).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name:
              item.name == "预警频率"
                ? "预警频率(预警数量/设备数量)"
                : item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-2");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "预警信息统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "个",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 3).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-3");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "颗粒物浓度统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "μg/m³",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 4).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-4");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "O3、TVOCs浓度统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "μg/m³",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 5).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name + "-" + item.unit,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-5");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "NO2 、SO2浓度统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  //为了保证和原来的效果一样，这里自己实现了一个点的效果
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                  //htmlStr += '<span style="color:'+color+'">';
                  //圆点后面显示的文本
                  htmlStr += seriesName + "：" + value;
                  // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                  //htmlStr += '</span>';
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
              formatter: function (params) {
                let arr = params.split("-");
                return arr[0];
              },
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "μg/m³",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 6).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-6");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "CO浓度统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "mg/m³",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 7).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-7");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "颗粒物时段统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "μg/m³",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
      getStatistics(that.areaId, that.time, 8).then((res) => {
        const data = res.data.data;
        let xarray = data[0].xarray;
        let series = [];
        data.forEach((item) =>
          series.push({
            name: item.name,
            data: item.yarray,
            type: "bar",
          })
        );
        if (data.length > 0) {
          var chartDom = document.getElementById("bar-8");
          var myChart = echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: "移动微站时段统计",
            },
            tooltip: {
              trigger: "axis",
              formatter: function (params, ticket, callback) {
                var htmlStr = "";
                for (var i = 0; i < params.length; i++) {
                  var param = params[i];
                  var xName = param.name + "点"; //x轴的名称
                  var seriesName = param.seriesName.split("-")[0]; //图例名称
                  var value = param.value; //y轴值
                  var color = param.color; //图例颜色
                  if (i === 0) {
                    htmlStr += xName + "<br/>"; //x轴的名称
                  }
                  htmlStr += "<div>";
                  htmlStr +=
                    '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                    color +
                    ';"></span>';
                  htmlStr += seriesName + "：" + value;
                  htmlStr += "</div>";
                }
                return htmlStr;
              },
            },
            legend: {
              orient: "vertical",
              left: "center",
              bottom: "bottom",
            },
            calculable: true,
            xAxis: [
              {
                type: "category",
                data: xarray,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "辆",
                nameLocation: "middle",
                nameGap: 50,
              },
            ],
            series: series,
          };
          option && myChart.setOption(option);
        }
      });
    },
    getAreaList() {
      getWuDistList().then((res) => {
        const data = res.data.data;
        this.areaList = data;
      });
    },
    typeChange(e) {
      // debugger;
      if (e == "空气质量变化折线图") {
        // localStorage.setItem("platform", "22");
        // this.reload();
        alert("空气质量变化折线图");
      } else if (e == "区域污染对比图") {
        // localStorage.setItem("platform", "96");
        // this.reload();
        alert("区域污染对比图");
      } else if (e == "时段数据统计图") {
        // localStorage.setItem("platform", "95");
        // this.reload();
        alert("时段数据统计图");
      }
    },
  },
  mounted() {
    this.getAreaList();
    this.onLoad();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-radio-button__inner {
  width: 200px;
}
.button {
  text-align: center;
  padding-bottom: 50px;
}
.button_style {
  width: 300px;
  background: #154d89;
  color: #fff;
  font-size: 14px;
}
.setting {
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;
  align-items: center;
}
</style>

