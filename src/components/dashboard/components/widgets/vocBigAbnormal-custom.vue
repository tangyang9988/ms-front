<template>
  <div class="chart_wrapper">
    <div class="header">异常状况</div>
    <table class="abnormal_details">
      <tr>
        <td>
          <el-row :gutter="20">

            <!-- 当前异常 -->
            <el-col :span="12">
              <div class="module_container">
                <table class="module_table">
                  <tr>
                    <td width=70>
                      <div class="img_container" :class="{'img_container_red':countCurrent !== 0,'img_container_blue':countCurrent === 0}">
                        <img v-if="countCurrent === 0" alt="" src="/img/bg/current_blue.png"/>
                        <img v-else alt="" src="/img/bg/current_red.png"/>
                      </div>
                    </td>
                    <td>
                      <div class="abnormal_title">当前异常</div>
                      <span class="abnormal_count">{{ countCurrent }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </el-col>

            <!-- 前24h异常 -->
            <el-col :span="12">
              <div class="module_container">
                <table class="module_table">
                  <tr>
                    <td width=70>
                      <div class="img_container" :class="{'img_container_red':countBefore24h !== 0,'img_container_blue':countBefore24h === 0}">
                        <img v-if="countBefore24h === 0" alt="" src="/img/bg/before24_blue.png"/>
                        <img v-else alt="" src="/img/bg/before24_red.png"/>
                      </div>
                    </td>
                    <td>
                      <div class="abnormal_title">前24h异常</div>
                      <span class="abnormal_count">{{ countBefore24h }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </el-col>
          </el-row>
        </td>
      </tr>
      <tr>
        <td>
          <el-row :gutter="20">

            <!-- 本月异常 -->
            <el-col :span="12">
              <div class="module_container">
                <table class="module_table">
                  <tr>
                    <td width=70>
                      <div class="img_container" :class="{'img_container_red':countMonth !== 0,'img_container_blue':countMonth === 0}">
                        <img v-if="countMonth === 0" alt="" src="/img/bg/month_blue.png"/>
                        <img v-else alt="" src="/img/bg/month_red.png"/>
                      </div>
                    </td>
                    <td>
                      <div class="abnormal_title">本月异常</div>
                      <span class="abnormal_count">{{ countMonth }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </el-col>

            <!-- 前24h未处理异常 -->
            <el-col :span="12">
              <div class="module_container">
                <table class="module_table">
                  <tr>
                    <td width=70>
                      <div class="img_container" :class="{'img_container_red':countBefore24hUnDeal !== 0,'img_container_blue':countBefore24hUnDeal === 0}">
                        <img v-if="countBefore24hUnDeal === 0" alt="" src="/img/bg/undeal_blue.png"/>
                        <img v-else alt="" src="/img/bg/undeal_red.png"/>
                      </div>
                    </td>
                    <td>
                      <div class="abnormal_title">前24h未处理异常</div>
                      <span class="abnormal_count">{{ countBefore24hUnDeal }}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </el-col>
          </el-row>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getAbnormalCount } from "@/api/psoa/abnormal";
export default {
  data() {
    return {
      countCurrent: 0, // 当前异常
      countBefore24h: 0, // 前24h异常
      countMonth: 0, // 本月异常
      countBefore24hUnDeal: 0 // 前24h未处理异常
    };
  },
  mounted() {
    this.getVOCAbnormal();
  },
  methods: {
    getVOCAbnormal: function() {
      getAbnormalCount().then(res => {
        if (res.data.success !== true) {
          return;
        }
        this.countCurrent = res.data.data.countCurrent
          ? res.data.data.countCurrent
          : 0;
        this.countBefore24h = res.data.data.countBefore24h
          ? res.data.data.countBefore24h
          : 0;
        this.countMonth = res.data.data.countMonth
          ? res.data.data.countMonth
          : 0;
        this.countBefore24hUnDeal = res.data.data.countBefore24hUnDeal
          ? res.data.data.countBefore24hUnDeal
          : 0;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.abnormal_details {
  height: calc(100% - 54px);
  position: absolute;
  top: 54px;
  left: 15px;
  width: calc(100% - 30px);
  table-layout: fixed;
}

.abnormal_details tr > td {
  text-align: -webkit-center;
}

.el-row{
  margin-left: 0px !important;
  margin-right: 0px !important;
  height: 100%;
}

.el-col-12 {
  height: calc(100% - 20px);
  margin-bottom: 0px !important;
}

.module_container{
  background: rgba(2, 15, 40, 0.1);
  height: 100%;
  border-radius: 8px;
}

.module_table{
  height: 100%;
  width: 100%;
  padding: 0px !important;
  margin: 0px !important;
}

.img_container{
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 25px;
    height: 25px;
  }
}

.img_container_red{
  background: rgba(255, 85, 85, 0.1);
}

.img_container_blue{
  background: rgba(43, 106, 255, 0.1);
}

.abnormal_title{
  font-size: 13px;
  font-weight: 500;
  padding-right: 5px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.abnormal_count{
  font-size: 22px;
  font-weight: 500;
  color: #fff;
}
</style>
