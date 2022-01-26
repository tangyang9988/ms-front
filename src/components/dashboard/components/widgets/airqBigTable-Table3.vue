<template>
  <div class="custom-wrapper systemhomebg thCellWrap">
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
      :height="tableHeight"
      :data="tableData.filter((item) => item.siteName.includes(searchContent))"
      :header-cell-style="{ background: '#23283b', color: '#6189f2',border:'1px solid #273051' }"
      :cell-style="{ background: '#23283b', color: '#6189f2',border:'1px solid #273051' }"
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
          <div v-if="item.prop=='aqiLevel'" class="level_env_bg" :class="getEnvBgColor(scope.row[item.prop])"></div>
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
      tableHeight: "calc(100% - 40px)",
      searchContent: '',//表格搜索框
      tableHead: [],//表头内容
      tableData: [],//表格数据
      timer:null
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
    getRowLevelColor() {
      return function (level) {
        // console.log('level', level.aqiLevel);
        return 'level_row_color_' + level.aqiLevel
      }
    },
    /** 环境等级**/
    getEnvBgColor() {
      return function (level) {
        // console.log('level', level);
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
    this.timer=setInterval(() => {
      _this.getInfo();
    }, this.$TIMERS.airqBigTable);//每隔10分钟刷新一次
  },
  methods: {
    getInfo() {
      getLatestData().then(res => {
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
          // console.log('this.tableData', this.tableHead)
          /** 接口返回的表内容**/
          resData.forEach(item => {
            let obj = {
              aqiLevel: item.aqiLevel,
              siteName: item.siteName,
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
  background: #00e400;
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

  .el-table {
    background: 0;
    border: 0
  }

  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
}
</style>

<style lang="scss">
.systemhomebg {
  .gutter {
    background: #11182e !important;
  }

  .el-input--small .el-input__inner {
    background: 0;
    border: 2px solid #2e3d70;
  }

}
</style>
