<template>
  <div class="tower_wrapper tower-monitoring-widget">
    <div class="header">塔吊机</div>
    <div style="background: #1e2539;flex: 1;overflow-y: hidden;position: relative;">
      <div class="empty" v-if="tableData.length==0">暂无数据</div>
      <el-carousel :interval="5000" arrow="never" style="height: calc(100% - 20px);">
        <el-carousel-item v-for="(item,index) in tableData" :key="index" :initial-index="initial">
          <div class="deviceName">{{ item.deviceName }}</div>
          <div class="tower_img">
            <div class="wrap" style="text-align: center;">
              <img src="/img/bg/tow2.png" alt="" style="height: 100%;"/>
              <div class='tips'>
                <div>起重量:{{ item.weight }}</div>
                <div>起重力矩:{{ item.torque }}</div>
                <div>起升高度:{{ item.height }}</div>
                <div>幅度:{{ item.magnitude }}</div>
                <div>回转角度:{{ item.rotation }}</div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import {devicetowerdata} from "@/api/dust/supervise";

export default {
  data() {
    return {
      initial: 0,
      tableData: [],
      timer: null
    }
  },
  mounted() {
    this.init()
    setInterval(() => {
      this.init()
    }, 1800000)
  },
  methods: {
    init() {
      devicetowerdata().then(res => {
        this.tableData = res.data.data
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style type="text/css">
.tower_wrapper .el-carousel__container {
  height: 100%;
}

.tower_wrapper .el-carousel__button {
  width: 6px;
  height: 6px;
}

.tower-monitoring-widget * {
  box-sizing: border-box;
}
</style>
<style lang="scss" scoped>
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

.deviceName {
  color: #fff;
  padding: 10px 20px;
}

.tower_wrapper {
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

  .tower_img {
    width: 100%;
    height: calc(100% - 35px);
    position: relative;

    .wrap {
      width: 90%;
      height: 95%;
      padding: 30px 0;
      margin-left: 5%;
      position: relative;

      .tips {
        position: absolute;
        background: rgba(98, 141, 252, .25);
        top: 50%;
        font-size: 14px;
        left: 60%;
        padding: 15px;
        color: #f8f8f8;
        border-radius: 4px;

        div {
          line-height: 1.8;
        }
      }
    }
  }
}
</style>
