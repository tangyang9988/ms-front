<template>
  <div class="onLine_wrapper">
    <div class="header">工作岗位</div>

    <!--    <div style="padding:10px;background: #1e2539;flex: 1;overflow-y: hidden;">-->
    <!--      <div v-if="isEmpty" style="font-size:12px;text-align: center;color: #fff;">暂无数据</div>-->
    <div class="wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
  </div>
</template>
<script>


import {getStation} from "@/api/dust/personnelIndex";

export default {
  data() {
    return {
      chartOptions: {},
      isEmpty: true
    }
  },
  mounted() {
    this.getInfo();//初始化数据
  },
  methods: {
    getInfo() {//请求数据
      getStation().then(res => {
        let data = []
        // data = [
        //   {value: 15, name: '监理单位'},
        //   {value: 20, name: '设计单位'},
        //   {value: 15, name: '建设单位'},
        //   {value: 25, name: '管理人员'},
        //   {value: 20, name: '建筑工人'},
        //   {value: 35, name: '特种作业人员'},
        //   {value: 30, name: '其他'},
        // ]

        if (res.data.data.length > 0) {//是否有数据
          this.isEmpty = false//有数据 暂无数据隐藏
          const resData = res.data.data
          // console.log('resdta',resData)
          for (var i = 0; i < resData.length; i++) {
            data.push({
              value: resData[i].totalNum,
              name: resData[i].type,
            });
          }
          this.chartOptions = {
            color: ['#b1c6fa', '#607fef', '#5da8f8', '#7ae0c3', '#f5db4d', '#ec913a', '#e23c39'],//自定义颜色
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              left: 'center',
              top: 'bottom',
              itemWidth: 5, // 图形宽度。
              itemHeight: 5,// 图形高度。
              data: data,
              textStyle: {
                color: "#fff"
              }
            },
            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                  show: true,
                  type: ['pie', 'funnel']
                },
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            series: [
              {
                name: '工作岗位',
                type: 'pie',
                radius: '50%',
                center: ['50%', '40%'],
                // roseType: 'radius',//玫瑰
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: true
                  }
                },
                data: data
              },
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
