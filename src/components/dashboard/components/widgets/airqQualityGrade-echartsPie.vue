<template>
  <div class="custom-wrapper">
    <div class="header">空气质量等级分布</div>
    <div class="container">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <div class="container-inner" v-else>
        <div class="serach-wrapper">
          <el-select
            v-model="searchValue"
            size="mini"
            @change="onChange"
            filterable
            placeholder="请选择">
            <el-option
              size="mini"
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
        <div class="major">
          <div class="major-title">首要/超标污染物</div>
          <div class="major-inner">
            <div class="major-item" v-for="(item,index) in factorsList" :key="index">
              <span class="label">{{ item.factorName == 'PM25' ? 'PM2.5' : item.factorName }}：</span>
              <span class="time">{{ item.num || 0 }}天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getSites, getDatesOfLevels} from "@/api/airq/airqIndex";

export default {
  data() {
    return {
      isEmpty: true,//判断是否有数据
      chartOptions: {},
      factorsList: [],//显示数据
      options: [],//下拉选择数据
      searchValue: '',//下拉选择 选中值
    }
  },
  mounted() {
    this.getSiteInfo()
  },
  methods: {
    /**获取站点**/
    getSiteInfo() {
      getSites().then(res => {
        const resData = res.data.data//请求数据
        if (resData.length > 0) {
          this.isEmpty = false
          // console.log('ressite', resData)
          this.options = resData.map(item => {//遍历请求数据
            return {
              value: item.siteId,
              label: item.siteName
            }
          })
          this.searchValue = this.options[0]//默认选中第一个站点
          this.getSeqencingInfo(this.searchValue.value)
        }
      })
    },
    /**获取站点数据**/
    getSeqencingInfo(siteInfoId) {
      getDatesOfLevels(siteInfoId).then(res => {
        const resData = res.data.data//请求数据
        // console.log('空气质量等级分布', res.data.data)
        if (resData) {
          this.factorsList = res.data.data.facotrs//首要污染物
          resData.totalDays = resData.totalDays == -1 ? 0 : resData.totalDays//如果是-1 空数据 则默认给成0
          //赋值
          let data = [
            {value: resData.excellent || 0, name: '优'},
            {value: resData.good || 0, name: '良'},
            {value: resData.mild || 0, name: '轻度污染'},
            {value: resData.medium || 0, name: '中度污染'},
            {value: resData.severe || 0, name: '重度污染'},
            {value: resData.serious || 0, name: '严重污染'},
          ]
          if(!resData.totalDays){
          	resData.totalDays=0
          }
          this.chartOptions = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // 中间显示的文案
            title: {
              zlevel: 0,
              text: [
                '{name|总天数}',
                '{value|' + resData.totalDays + '}',
              ].join('\n'),
              top: '30%',
              left: '28%',
              textAlign: 'center',
              textStyle: {
                rich: {//总天数
                  value: {
                    color: '#303133',
                    fontSize: 26,
                    fontWeight: 'bold',
                    lineHeight: 30,
                  },
                  name: {
                    color: '#909399',
                    lineHeight: 20
                  },
                },
              },
            },
            // 图例组件
            legend: {
              icon: 'roundRect',  // 图例前面的形状
              orient: 'vertical',// 图例的排列方向 水平/垂直
              right: 0,
              top: '15%',
              bottom: 10,
              itemWidth: 8,//图例标记的图形宽度
              itemHeight: 8,//图例标记的图形宽度
              textStyle: {
                color: "#666666",
                lineHeight: 8
              },
              // data: data,
              formatter: function (val) {
                let e = data.find(e => val === e.name);
                return e.name + " " + e.value;
              }
            },
            color: ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#99004c", "#7e0023"],
            series: [
              {
                name: "空气质量占比",
                type: "pie",
                radius: ["45%", "50%"],//设置中心点
                center: ["30%", "45%"],
                avoidLabelOverlap: false, // 防重叠策略
                // 图例显示 设置了title 所以不需要了
                label: {
                  show: false
                },
                // 高亮区设置
                emphasis: {
                  label: {
                    show: false,
                    fontSize: "30",
                    fontWeight: "bold"
                  }
                },
                labelLine: {
                  show: true
                },
                data: data
              }
            ]
          };
        }
      })
    },
    /**选择站点**/
    onChange(val) {
      this.searchValue = val
      this.getSeqencingInfo(this.searchValue.value)
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

  //.serach-wrapper {
  //  margin-top: 10px;
  //  margin-left: 10px;
  //}

  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    color: $custom-index-color;
    padding: 10px;
    height: 100%;

    .container-inner {
      display: flex;
      flex-direction: column;
      color: $custom-index-color;
      height: 100%;
    }
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

.major {
  display: flex;
  flex-direction: column;
  padding: 0 10px 10px;
  color: #666;
  position: absolute;
  bottom: 0;
}

.major-title {
  font-weight: 600;
  font-size: 13px;
}

.major-inner {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;

  .major-item {
    width: 33.3%;
  }
}

</style>
