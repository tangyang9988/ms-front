<template>
  <div class="wrapper">
    <div class="header">人员统计</div>
    <div class="statistics">
      <div class="statistics-item">
        <div class="title">人员总数</div>
        <div class="txt-container">
          <div class="txt" v-for="item in personTotal"><span class="txt-span">{{ item }}</span></div>
        </div>
      </div>
      <div class="statistics-item">
        <div class="title">实时在场数</div>
        <div class="txt-container">
          <div class="txt" v-for="item in sceneTotal"><span class="txt-span">{{ item }}</span></div>
        </div>
      </div>
      <div class="statistics-item">
        <div class="title">实时进场数</div>
        <div class="txt-container">
          <div class="txt" v-for="item in sceneIn"><span class="txt-span">{{ item }}</span></div>
        </div>
      </div>
      <div class="statistics-item">
        <div class="title">实时出场数</div>
        <div class="txt-container">
          <div class="txt" v-for="item in sceneOut"><span class="txt-span">{{ item }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {devicetowerdata} from "@/api/dust/supervise";
import {dateFormat} from "@/util/date";

export default {
  data() {
    return {
      personTotal: [5, 3, 0],//人员总数
      sceneTotal: [4, 7, 0],//实时在场数
      sceneIn: [0, 1, 8],//实时进场数
      sceneOut: [0, 4, 2],//实时出场数
      tableData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      devicetowerdata().then(res => {
        this.tableData = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'reset/reset.css';

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

  .el-table {
    background: none;
    color: #f8f8f8;
  }

  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
}

.statistics {
  display: flex;
  flex-direction: row;
  color: #fff;
  justify-content: space-around;
  align-items: center;
  margin-top: 30px;
}

.statistics-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

}

.title {
  font-size: 14px;
}

.txt-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.txt {
  //background: linear-gradient(top, #fff, #3a67ee);
  background: #3a67ee;
  color: #fff;
  border-radius: 5px;
  //padding: 10px 5px;
  margin: 0 3px;
  font-size: 30px;
  width: 36px;
  height: 66px;
  line-height: 66px;
  text-align: center;
  position: relative;
}

.txt:after {
  content: '';
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, .2);
  position: absolute;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  left: 0;
  top: 0;
}

.txt-span {
  position: relative;
  z-index: 1;
}
</style>
