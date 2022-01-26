<template>
  <div class="chart_wrapper">
    <div class="header">企业排名</div>

    <!-- 最优排名 -->
    <div class="top_container">
      <el-container>
        <el-aside width="50px">最优排名</el-aside>
        <el-main>
          <div v-for="(company, index) in bestCompanies" :key="index">
            <el-image :src="bestSrc"></el-image>
            <span>{{ company.rank }}. {{ company.deptName }}</span>
          </div>
        </el-main>
      </el-container>
    </div>

    <!-- 分隔线 -->
    <div class="cut_line"></div>
    
    <!-- 最差排名 -->
    <div class="bottom_container">
      <el-container>
        <el-aside width="50px">最差排名</el-aside>
        <el-main>
          <div v-for="(company, index) in worstCompanies" :key="index">
            <el-image :src="worstSrc"></el-image>
            <span>{{ company.rank }}. {{ company.deptName }}</span>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getEnterpriseRanking } from "@/api/loam/big-data";

export default {
  data() {
    return {
      bestSrc: "/img/bg/smile.png",
      worstSrc: "/img/bg/sad.png",
      bestCompanies: [], // 最优排名
      worstCompanies: [] // 最差排名
    };
  },
  mounted() {
    this.handler();
  },
  methods: {
    handler() {
      getEnterpriseRanking().then(res => {
        if (res.data.success !== true) {
          return;
        }
        // 显示5个最优和最差企业
        this.bestCompanies = res.data.data.bestCompany ? res.data.data.bestCompany.slice(0, 5) : [];
        this.worstCompanies = res.data.data.worstCompany ? res.data.data.worstCompany.slice(0, 5) : [];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
%container_styles {
  position: absolute;
  width: 100%;
}
.top_container {
  @extend %container_styles;
  top: 34px;
  height: calc(50% - 17px);
}
.bottom_container {
  @extend %container_styles;
  top: calc(50% + 17px);
  height: calc(50% - 17px);
}
.cut_line {
  @extend %container_styles;
  width: calc(100% - 20px);
  left: 10px;
  top: calc(50% + 17px);
  background: linear-gradient(to right, #5f88f2, #262d45);
  height: 1px;
}
.el-container {
  height: 100%;
}
.el-aside {
  color: #5f88f2;
  writing-mode: tb-rl;
  text-align: center;
  font-size: larger;
  font-weight: 600;
  letter-spacing: 10px;
  padding: 0px 10px;
}
.el-main {
  color: #f1f1f1;
  padding: 20px 20px 20px 10px !important;
  div {
    height: 20%;
    display: flex;
    align-items: center;
  }
  .el-image {
    margin-right: 10px;
    width: 25px;
    height: 25px;
  }
}
</style>
