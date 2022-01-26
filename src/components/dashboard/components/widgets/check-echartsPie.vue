<template>
  <div class="wrapper">
    <div class="header">考勤分布</div>
    <div class="wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <e-chart autoresize :options="personOptions" style="height:95%;width:100%"></e-chart>
    </div>
  </div>
</template>
<script>
import {getStaffTrends} from "@/api/dust/supervise";
import {getCheck} from "@/api/dust/personnelIndex";

export default {
  data() {
    return {
      personOptions: {},
      isEmpty: true
    }
  },
  mounted() {
    this.personInfo()
  },
  methods: {
    personInfo: function () {
      getStaffTrends().then(res => {
        if (res.data.data.length > 0) {//是否有数据
          this.isEmpty = false//有数据 暂无数据隐藏
          // console.log('考勤分布', res.data.data)
          // let data = [
          //   {value: res.data.data.beCount, name: "出勤", itemStyle: {color: "#6b8ef4"}},
          //   {value: res.data.data.outCount, name: "缺勤", itemStyle: {color: "#b1c6fa"}},
          //   {value: res.data.data.beCount, name: "迟到", itemStyle: {color: "#f5db4d"}},
          //   {value: res.data.data.outCount, name: "早退", itemStyle: {color: "#f0891a"}}
          // ];
          let data = [
            {value: '265', name: "出勤", itemStyle: {color: "#6b8ef4"}},
            {value: '132', name: "缺勤", itemStyle: {color: "#b1c6fa"}},
            {value: '83', name: "迟到", itemStyle: {color: "#f5db4d"}},
            {value: '50', name: "早退", itemStyle: {color: "#f0891a"}}
          ];
          let total = 0
          for (var i = 0; i < data.length; i++) {//计算总人数
            total += Number(data[i].value)
          }
          this.personOptions = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // 中间显示的文案
            title: {
              show: true,
              text: '人员总数',
              subtext: total,
              x: 'center',
              y: '37.5%',
              textStyle: {
                fontSize: 16,
                color: '#FFF',
                fontWeight: '400'
              },
              subtextStyle: {
                fontSize: 26,
                color: '#FFF',
                fontWeight: '400'
              }
            },
            // 图例组件
            legend: {
              icon: 'circle',  // 图例前面的形状
              orient: "horizontal", // 图例的排列方向 水平/垂直
              left: "center",
              top: "bottom",
              textStyle: {
                color: "#fff"
              },
              data: data,
              formatter: function (val) {
                let e = data.find(e => val === e.name);
                return e.name + " " + e.value;
              }
            },
            series: [
              {
                name: "人员总数",
                type: "pie",
                radius: ["55%", "70%"], // 设置中心点
                bottom: "10%",//pie chart组件离容器下侧的距离。
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
  }
}
</script>
<style lang="scss" scoped>
.wrapper-inner {
  background: #1e2539;
  flex: 1;
  overflow-y: hidden;
  position: relative;
}
.emptybg{
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
