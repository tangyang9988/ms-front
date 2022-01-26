<template>
  <div class="monitor_equipment_overview">
    <div id="header">监测设备总览</div>

    <el-row :gutter="20" class="overview_row">
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{deptCount}}</label>
          <label class="title_content">企业总数</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{deviceCount}}</label>
          <label class="title_content">设备总数</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{onLineCount}}</label>
          <label class="title_content">在线设备</label>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="overview_row">
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{offLineCount}}</label>
          <label class="title_content">离线设备</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{filterOffCount}}</label>
          <label class="title_content">净化器未开</label>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <label class="value_content">{{fanOffCount}}</label>
          <label class="title_content">风机未开</label>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getDeviceOverview } from "@/api/loam/big-data";

export default {
  data() {
    return { 
      deptCount: 0,
      deviceCount: 0,
      onLineCount: 0,
      offLineCount: 0,
      filterOffCount: 0,
      fanOffCount: 0    
    };
  },
  mounted() {
    getDeviceOverview().then(res => {
      if(!res.data.success) {
        return;
      }
      let resData = res.data.data;
      this.deptCount = resData.deptCount;
      this.deviceCount = resData.deviceCount;
      this.onLineCount = resData.onLineCount;
      this.offLineCount = resData.offLineCount;
      this.filterOffCount = resData.filterOffCount;
      this.fanOffCount = resData.fanOffCount;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.monitor_equipment_overview {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(211, 211, 211, 0.1);
  border-radius: 3px;

  #header {
    color: #5f88f2;
    line-height: 34px;
    padding: 0 5px;
    text-align: left;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc;
  }

  .overview_row {
    color: #fff;
    height: calc( 50% - 52px);
    margin: 20px 15px !important;

    .el-col {
      height: 100%;
    }

    .grid-content {
      text-align: center;
      padding-top: 5px;
      padding-bottom: 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 1px solid #628dfc;
      // border: 2px transparent solid;
      // border-image: linear-gradient(to top, #28304a, #628dfc) 1 10;
      border-radius: 10px;
      height: calc( 100% - 12px );

      .value_content {
        color: #fff;
        font-size: 20px !important;
        font-weight: 600;
      }

      .title_content {
        color: #5f88f2;
        font-weight: 500;
      }
    }
  }
}
</style>