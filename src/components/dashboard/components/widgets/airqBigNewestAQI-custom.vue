<template>
  <div class="custom-wrapper systemhomebg">
    <div class="header">最新30日AQI</div>
    <div class="container">
      <div v-if="isEmpty" class="empty">暂无数据</div>
      <div class="serach-wrapper information_select_wrap">
        <el-select
          v-model="searchValue"
          size="mini"
          @change="onChange"
          :popper-append-to-body="false"
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
      <div class="inner-container" v-if="!isEmpty">
        <div class="item" v-for="(item,index) of list" :key="index" @mouseenter="changeActive($event)"
             @mouseleave="removeActive($event)">
          <div class="date">{{ item.time }}<span class="status">{{ item.word }}</span></div>
          <div class="text">{{ item.aqi }}</div>
          <!--根据level 判断颜色-->
          <div class="mark" :class="getLevel(item.aqiLevel)"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {getSites, getQualityData} from "@/api/airq/airqIndex";

export default {
  data() {
    return {
      styleObject: {
        // background: '#00e400',
      },
      list: [],
      levels: [],//等级
      level: false,
      systemId: 22,
      isEmpty: true,//判断是否有数据
      chartOptions: {},
      showData: {},//显示数据
      options: [],//下拉选择数据
      searchValue: '',//下拉选择 选中值
    }
  },
  computed: {
    /**计算level 根据等级显示不同颜色**/
    getLevel() {
      return function (aqiLevel) {
        // console.log('aqiLevel', aqiLevel)
        return 'mark_' + aqiLevel
      }
    }
  },
  mounted() {
    this.getSiteInfo()
  },
  methods: {
    /**获取站点**/
    getSiteInfo() {
      getSites().then(res => {
        const resData = res.data.data//请求数据
        if (resData.length > 0) {
          // console.log('ressite', resData)
          this.options = resData.map(item => {//遍历请求数据
            return {
              value: item.siteId,
              label: item.siteName
            }
          })
          this.searchValue = this.options[0]//默认选中第一个站点
          this.getQualityDataInfo(this.searchValue.value)
        }
      })
    },
    /**获取站点数据**/
    getQualityDataInfo(siteInfoId) {
      getQualityData(siteInfoId).then(res => {
        let resData = res.data.data
        // console.log('最新30日AQI', res.data.data)
        if (res.data.data.length > 0) {
          this.isEmpty = false//如果有数据 暂无数据隐藏
          this.list = resData
        } else {
          this.list = []
          this.isEmpty = true//如果没有数据 暂无数据显示
        }
      })
    },
    /**选择站点**/
    onChange(val) {
      this.searchValue = val
      this.getQualityDataInfo(this.searchValue.value)
    },
    /**鼠标 mouseenter**/
    changeActive($event) {
      $event.currentTarget.className = 'item active';//
    },
    /**鼠标 mouseleave**/
    removeActive($event) {
      $event.currentTarget.className = 'item';
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
    //box-shadow: 2px 2px 4px #ddd;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC
  }

  .serach-wrapper {
    //margin-top: 10px;
    //margin-left: 10px;
  }
}

.container {
  display: flex;
  flex-direction: column;
  background: #fff;
  color: $custom-index-color;
  padding: 10px;
  height: 100%;
  position: relative;

  .inner-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 5px;
  }
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60px;
  height: 60px;
  border: 1px solid #485c97;
  margin-right: 5px;
  margin-top: 5px;

}

.date {
  font-size: 12px;
  color: $custom-index-color;
  height: 20px;
  display: flex;
  justify-content: space-between;

  .status {
    margin-right: 10px;
    display: none;
  }
}

.text {
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.active {
  background: rgba(104, 111, 150, .4);

  .status {
    display: block;
  }
}

.mark {
  height: 15px;
  width: 100%;
}

.mark_1 {
  background: $colorGreen;
}

.mark_2 {
  background: $colorYellow;
}

.mark_3 {
  background: $colorOrange;
}

.mark_4 {
  background: $colorRed;
}

.mark_5 {
  background: $colorPurple;
}

.mark_6 {
  background: $colorBrown;
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
/**信息舱背景**/
.systemhomebg {
  background: 0;

  .container {
    background: rgba(211, 211, 211, 0.1);
    color: #fff !important;
    .date {
      color: #ddd;
    }
  }
}
</style>
