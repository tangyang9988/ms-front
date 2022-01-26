<template>
  <div class="custom-wrapper thCellWrap">
    <div class="header">实时环境监测</div>
    <div style="margin-top: 10px;margin-left: 10px">
      <el-row>
        <el-col :span="4">
          <el-input
            size="small"
            placeholder="请输入站点"
            prefix-icon="el-icon-search"
            v-model="searchContent">
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table
      size="mini"
      border
      :height="tableHeight"
      :data="tableData.filter((item) => item.siteName.includes(searchContent))"
      :header-cell-style="{ background: '#f4f4f4', color: '#666' }"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
      >
        <template slot-scope="scope">
          <div v-if="item.prop=='aqiLevel'" class="level_env_bg"
               :class="getEnvBgColor(scope.row[item.prop])"></div>
          <!--站点-->
          <div v-else-if="item.prop=='siteName'">{{ scope.row.siteName }}</div>
          <!--站点-->
          <div v-else-if="item.prop=='time'">{{ scope.row.time }}</div>
          <!--因子显示内容-->
          <div v-else>
            <!--文字提示-->
	          <div>
	            <p>{{ scope.row[item.prop].aqiVal }}</p>
	          </div>
	          <div> {{ scope.row[item.prop].avgVal || '-' }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getLatestData} from "@/api/airq/airqIndex";

export default {
  data() {
    return {
      tableHeight: "calc(100% - 0px)",
      searchContent: '',//表格搜索框
      tableHead: [],//表头内容
      tableData: [],//表格数据
    };
  },
  computed: {
    /**表头 是否是因子**/
    isFactor() {
      return function (keys) {
        switch (keys) {
          case 'aqiLevel':
            return false;
            break;
          case 'siteName':
            return false;
            break;
          case 'time':
            return false;
            break;
          default:
            return true;
            break;
        }
      }

    },
    /** 因子等级**/
    getRowLevelColor(a) {
      return function (level) {
        return 'level_row_color_' + level.aqiLevel || 'level_row_color_' + level
      }
    },
    /** 环境等级**/
    getEnvBgColor() {
      return function (level) {        
        return 'level_env_bg_' + level
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },  
  mounted() {
    var _this = this
    _this.getInfo();
    this.timer =setInterval(() => {
      _this.getInfo();
    }, this.$TIMERS.airqTable);//每隔10分钟刷新一次
  },
  methods: {
    getInfo() {
      getLatestData().then(res => {      	
      	this.tableData=[]
      	this.tableHead=[]
        const resData = res.data.data
        if (resData.length > 0) {
          this.tableHead = [
            {
              label: "站点",
              prop: "siteName",
              align: "center"
            }
          ];
          /** 接口返回的表头因子部分**/
          const newArr = []
          resData[0].facotrs.forEach(item => {
            if (newArr.indexOf(item.factorCode) === -1) {
              let tableFactor = {
                label: `${item.factorName}\n(${item.unit})`,
                prop: item.factorCode,
                align: "center"
              };
              this.tableHead.push(tableFactor);//重新定义表头
            }
          })
          //日期追加到最后
          this.tableHead.push({
            label: "日期",
            prop: "time",
            align: "center"
          })
          /** 接口返回的表内容**/
          resData.forEach(item => {
            let obj = {
              aqiLevel: item.aqiLevel,
              siteName: item.siteName,
              // aqiValAll: item.aqiVal,
              time: item.time
            }
            //AQI 需要level和val
            obj['aqiValAll'] = {
              aqiLevel: item.aqiLevel,
              avgVal: item.aqiVal
            }
            item.facotrs.forEach(el => {
              obj[el.factorCode] = el
            })
            this.tableData.push(obj)
          })
        }
      })
    },
  }
};
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
}

.icon-right:before {
  content: "";
  position: absolute;
  right: 0;
  top: 0px;
  display: block;
  width: 0;
  height: 0;
  border-width: 8px;
  border-style: solid;
  border-color: #00e400 #00e400 transparent transparent;
}

.level_row_color_1:before {
  border-color: #00e400 #00e400 transparent transparent;
}

.level_row_color_2:before {
  border-color: #ffff00 #ffff00 transparent transparent;
}

.level_row_color_3:before {
  border-color: #ff7e00 #ff7e00 transparent transparent;
}

.level_row_color_4:before {
  border-color: #ff0000 #ff0000 transparent transparent;
}

.level_row_color_5:before {
  border-color: #99004c #99004c transparent transparent;
}

.level_row_color_6:before {
  border-color: #7e0023 #7e0023 transparent transparent;
}

.level_env_bg {
  content: '';
  //background: #00e400;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}

.level_env_bg_1 {
  background: #00e400;
}

.level_env_bg_2 {
  background: #ffff00;
}

.level_env_bg_3 {
  background: #ff7e00;
}

.level_env_bg_4 {
  background: #ff0000;
}

.level_env_bg_5 {
  background: #99004c;
}

.level_env_bg_6 {
  background: #7e0023;
}
</style>
