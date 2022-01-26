<template>
  <div class="wrapper">
    <div class="header">高危预警</div>
    <!--        <div style="padding:10px;background: #1e2539;flex: 1;overflow-y:hidden ;">-->
    <div class="wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <e-chart autoresize :options="highAlertOptions" style="height:100%;width:100%"></e-chart>
    </div>
  </div>
</template>
<script>
import {getHighWarning} from "@/api/dust/supervise";

export default {
  data() {
    return {
      highAlertOptions: {},
      isEmpty: true,
    }
  },
  mounted() {
    this.getHighAlert()
  },
  methods: {
    getHighAlert: function () {
      getHighWarning().then(res => {
        if (res.data.success) {//是否有数据
          // this.isEmpty = false//有数据 暂无数据隐藏
          let data = []
          let arr1 = []//卸料机
          let arr2 = []//升降机
          let arr3 = []//塔吊机
          res.data.data.x.forEach((item, index) => {
            let obj = {
              "product": item,
              "卸料机": res.data.data.materialList[index],
              "升降机": res.data.data.elevatorList[index],
              "塔吊机": res.data.data.towerList[index]
            }
            let val1 = res.data.data.materialList[index];
            let val2 = res.data.data.elevatorList[index];
            let val3 = res.data.data.towerList[index];
            arr1.push(val1)
            arr2.push(val2)
            arr3.push(val3)
            data.push(obj)
          })
          if (this._ifFlag(arr1) || this._ifFlag(arr2) || this._ifFlag(arr3)) {//判断数组是否都是0
            this.isEmpty = false//暂无数据隐藏
            this.highAlertOptions = {
              color: ['#ADC6FF', '#50E3C2', '#628DFC'],
              legend: {
                x: "center",
                y: "bottom",
                icon: 'circle',
                textStyle: {
                  color: "#fff",
                }
              },
              tooltip: {},
              dataset: {
                dimensions: ["product", "卸料机", "升降机", "塔吊机"],
                source: data
              },
              textStyle: {
                color: '#fff',
              },
              xAxis: {
                name: "月",
                type: "category",
                axisLine: {
                  lineStyle: {
                    color: '#3D4461',
                    width: 2,
                  }
                }

              },
              yAxis: {
                name: "个",
                splitNumber: 4,
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                    color: '#414968'
                  },
                },
                axisLine: {
                  lineStyle: {
                    color: '#3D4461',
                    width: 2, //这里是为了突出显示加上的
                  }
                }
              },
              series: [{type: "bar"}, {type: "bar"}, {type: "bar"}]
            }
          }
        }
      });
    },
    _ifFlag(arr) {
      return !arr.every(i => i === 0)//判断数组里面的值都为0
    }
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
</style>
