<template>
  <div class="wrapper">
    <div class="header">环境预警
      <div class="tips">
        <div class="xf">
          <span class="cal"></span>
          <span>总悬浮颗粒物</span>
        </div>
        <div class="zy">
          <img src="/img/bg/lingxing1.png" alt=""/>
          <span>噪音</span>
        </div>
      </div>
    </div>


    <!--    <div class="warn_wrap" style="background: #1e2539;flex: 1;overflow-y:hidden ;">-->
    <div class="warn_wrap wrapper-inner" :class="{emptybg:isEmpty}">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <div class="section" v-for="item in alertDatas">
        <div>{{ item.day }}</div>
        <div class="img">
          <div class="cal" :class="{'active': item.tspStatus>0}"></div>
          <div class="link">
            <img src="/img/bg/lingxing2.png" alt="" v-if="item.noiseStatus>0"/>
            <img src="/img/bg/lingxing1.png" alt="" v-else/>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {getEnvironWarning} from "@/api/dust/supervise";

export default {
  data() {
    return {
      alertDatas: [],
      isEmpty: true
    }
  },
  mounted() {
    this.getAlertDatas();
  },
  methods: {
    getAlertDatas: function () {
      getEnvironWarning().then(res => {
        if (res.data.data.length > 0) {//是否有数据
          this.isEmpty = false//有数据 暂无数据隐藏
          let month = new Date().getMonth() + 1
          res.data.data.forEach(item => {
            item.day = month + '/' + item.date
            this.alertDatas.push(item)
          })
        }
      });
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
    position: relative;
    color: #fff;
    line-height: 34px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC !important;

    .tips {
      position: absolute;
      top: 0;
      right: 10%;
      display: flex;

      .xf {
        margin-right: 10px;

        .cal {
          width: 8px;
          height: 8px;
          background: #597ef7;
          border-radius: 50%;
          margin-right: 10px;
          display: inline-block;
        }
      }

      .zy {
        display: flex;
        align-items: center;

        img {
          width: 8px;
          height: 8px;
          display: block;
          margin-right: 10px;
        }
      }
    }
  }

}

.warn_wrap {
  padding: 10px;
  font-size: 14px;

  .section {
    float: left;
    color: #f8f8f8;
    width: 12%;
    margin-right: 2%;
    padding: 0 4px;
    margin-bottom: 10px;
    border: 1px solid #1f3a5e;
    border-radius: 4px;

    .img {
      display: flex;
      justify-content: flex-end;
      padding: 3px 0;
      align-items: center;

      .cal {
        width: 8px;
        height: 8px;
        background: #597ef7;
        border-radius: 50%;
        margin-right: 5px;
      }

      .cal.active {
        background: #f5222d;
      }

      .link img {
        width: 8px;
        height: 8px;
        display: block;
      }
    }
  }
}
</style>

