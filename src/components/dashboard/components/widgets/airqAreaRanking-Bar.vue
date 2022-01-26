<template>
  <div class="custom-wrapper">
    <div class="header">实时站点因子浓度排名</div>
    <div class="container">      
      <div class="container-inner">
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
        <div v-if="isEmpty" class="empty" style="height:100%;">暂无数据</div>
        <e-chart autoresize :options="chartOptions" style="height:100%;" v-else></e-chart>
        
      </div>
    </div>
  </div>
</template>

<script>
import {getDatesOfLevels, getSeqencing} from "@/api/airq/airqIndex";

export default {
  data() {
    return {
      isEmpty: true,//判断是否有数据
      chartOptions: {},
      showData: {},//显示数据
      options: [
	      {
	        value: 'a21026',
	        label: 'SO₂'//二氧化硫
	      },
	      {
	        value: 'a21004',
	        label: 'NO₂'//二氧化氮
	      },
	      {
	        value: 'a21005',
	        label: 'CO'//一氧化碳
	      },
	      {
	        value: 'a05024',
	        label: 'O₃'//臭氧
	      },
	      {
	        value: 'a34004',
	        label: 'PM2.5'//PM2.5
	      },
	      {
	        value: 'a34002',
	        label: 'PM10'//PM10
	      }      
      ],//下拉选择数据
      searchValue: '',//下拉选择 选中值
    }
  },
  mounted() {
    this.searchValue = this.options[1]//默认选中第一个
    this.getSeqencingInfo(this.searchValue.value)
  },
  methods: {
    /**加载数据**/
    getSeqencingInfo(code) {
      getSeqencing(code).then(res => {
        if (res.data.data.length > 0) {
          this.isEmpty = false
          const resData = res.data.data
          let dataY = []//存放 y轴 站点
          let seriesData = []// 数据
          resData.map(item => {
            dataY.push(item.siteName)
            seriesData.push(item.aqiVal)
          })
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
                lineStyle: {color: '#999'}    // x轴坐标轴颜色
              },
              axisTick: false,
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#dedede',
                  type: 'dashed'//设置背景为虚线
                }
              }
            },
            yAxis: {
              type: 'category',
              data: dataY,
              axisLabel: {
                interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                color: '#888',
	              formatter: function (v) {
	              	let str=''
	              	if(v.length>6){
	              		str=v.substring(0,6)+'...'
	              	}else{
	              		str=v
	              	}
	              	return str
	              },             
              },
              axisLine: {
                lineStyle: {color: '#999'}    // x轴坐标轴颜色
              },
              axisTick: false
            },
            series: [
              {
                name: 'IAQI',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                  color: '#587bee'
                },
                label: {
                  normal: {
                    show: true,
                    formatter: function (v) {
                      if (v.value > 0) {
                        var val = v.data;
                        return val;
                      } else {
                        return ''
                      }
                    },
                    color: '#fff'
                  }

                },
                data: seriesData
              }
            ]
          }
        }else{
        	 this.isEmpty = true
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
}

.container {
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

  .title {
    font-size: 12px;
  }

  .level-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex: 1;

    .level-num {
      font-weight: bold;
      font-size: 50px;
    }

    .level-txt {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .level-txt-info {
        background: #f67b0b;
        padding: 2px 10px;
        border-radius: 4px;
        margin-top: 5px;
        color: #fff;
      }
    }
  }

  .bottom-container {
    background: rgba(193, 185, 185, 0.1);
    padding: 20px;
  }
}

.emptybg {
  background: 0;
}

.empty {
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #909399;
}

/**信息舱背景**/
.systemhomebg {
  background: 0;

  .container {
    background: rgba(211, 211, 211, 0.1);
    color: #fff !important;
  }
}
</style>
