<template>
  <div>
    <div class="sort-pm">
      <!-- <span class="pm-title">{{
        pollutionRankDesc ? "污染排名" : "清洁排名"
      }}</span> -->
      <el-form class="dark" size="mini" :show-message="false" inline>
        <el-form-item label="">
          <el-select
            class="wd-100"
            v-model="pollutionRankDesc"
            :popper-append-to-body="false"
            placeholder="请选择"
            @change="getPollutionRank"
          >
            <el-option
              v-for="item in sortPm"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select
            class="wd-120"
            v-model="pmType"
            :popper-append-to-body="false"
            placeholder="请选择"
            @change="pmChange"
          >
            <el-option
              v-for="item in pmTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <!-- <span style="font-size:10px">注释：{{message}}</span> -->
          <el-tooltip :content='message' placement="right-end">
             <i class="el-icon-question"/>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrpm">
      <div class="close-wrpm" @click="closeWrpm"></div>
      <div class="wrpm-content">
        <basic-container>
          <avue-crud
            :data="rankdata"
            :option="bzoption"
            :page.sync="bzPage"
            @on-load="getPollutionRank"
            @current-change="currentChange"
            @row-click="bzRowClick"
          >
            <!-- 重定义因子名称 -->
            <!-- <template slot="alias" slot-scope="scope">
              <span v-if="scope.row.alias == 'a34004'">PM2.5</span>
              <span v-if="scope.row.alias == 'a34002'">PM10</span>
              <span v-if="scope.row.alias == 'a21026'">SO2</span>
              <span v-if="scope.row.alias == 'a21004'">NO2</span>
              <span v-if="scope.row.alias == 'a21005'">CO</span>
              <span v-if="scope.row.alias == 'a05024'">O3</span>
              <span v-if="scope.row.alias == 'AQI'">AQI</span>
            </template> -->
          </avue-crud>
          <div class="diypage">
            <el-pagination
              background
              small
              :hide-on-single-page="false"
              :pager-count="5"
              layout="total, prev, pager, next"
              :current-page="bzPage.currentPage"
              :page-size="bzPage.pageSize"
              :total="bzPage.total"
              @current-change="currentChange"
            >
            </el-pagination>
          </div>
        </basic-container>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPollutionRank,
  getMobileSiteRank,
  getAllStatAroundSiteRankList,
} from "@/api/microstation/index.js";

export default {
  data() {
    return {
      message:"标站数据排名",
      pollutionRankDesc: 1,
      sortPm: [
        {
          label: "污染排名",
          id: 1,
        },
        {
          label: "清洁排名",
          id: 0,
        },
      ],
      pmTypeList: [
        {
          label: "标站",
          value: 0,
        },
        {
          label: "固定微站均值",
          value: 1,
        },
        {
          label: "移动微站均值",
          value: 2,
        },
      ],
      pmType: 0,
      rankdata: [],
      bzoption: {
        align: "center",
        menu: false,
        size: "mini",
        border: true,
        index: true,
        searchShow: true,
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "站点名称",
            width: 200,
            prop: "name",
          },
          {
            label: "因子",
            prop: "alias",
            // slot: true,
          },
          {
            label: "浓度",
            prop: "val",
          },
        ],
      },
      bzPage: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
    };
  },
  props: {
    timeType: String,
    searchData: Object,
    stationFacType: String,
    distance:Number,
    checkedList:Array
  },
  watch: {
    stationFacType: function (nv, ov) {
      setTimeout(this.getPollutionRank, 1000);
    },
    distance: function (nv, ov) {
      setTimeout(this.getPollutionRank, 1000);
    },
  },
  methods: {
    bzRowClick(row, column, event){
      this.$emit("bzRowClick",[row.latitude,row.logitude]);
    },
    //污染排名
    getPollutionRank() {
      //0是标站排名
      if (this.pmType == 0) {
        getPollutionRank(
          this.pollutionRankDesc,
          this.timeType,
          this.searchData.dateTime,
          this.stationFacType,
          this.bzPage.currentPage,
          this.bzPage.pageSize,
          this.checkedList.toString()
        ).then((res) => {
          const data = res.data.data.records;
          data.forEach((item) => {
            item.val = item.val + item.unit;
          });
          this.rankdata = data;
          this.bzPage.total = res.data.data.total;
          this.bzPage.currentPage = res.data.data.current;
        });
        //1是标站周围固定微站排名
      } else if (this.pmType == 1) {
        console.log(this.distance,'11111');
        getAllStatAroundSiteRankList(
          this.searchData.dateTime,
          this.timeType,
          this.stationFacType,
          this.pollutionRankDesc,
          this.distance * 0.001,
          this.bzPage.currentPage,
          this.bzPage.pageSize
        ).then((res) => {
          const data = res.data.data.records;
          data.forEach((item) => {
            item.val = item.val + item.unit;
          });
          this.rankdata = data;
          this.bzPage.total = res.data.data.total;
          this.bzPage.currentPage = res.data.data.current;
        });
        //2是标站周围移动微站排名
      } else if (this.pmType == 2) {
        getMobileSiteRank(
          this.searchData.dateTime,
          this.timeType,
          this.stationFacType,
          this.pollutionRankDesc,
          this.distance * 0.001,
          this.bzPage.currentPage,
          this.bzPage.pageSize
        ).then((res) => {
          const data = res.data.data.records;
          data.forEach((item) => {
            item.val = item.val + item.unit;
          });
          this.rankdata = data;
          this.bzPage.total = res.data.data.total;
          this.bzPage.currentPage = res.data.data.current;
        });
      }
    },
    // 分页
    currentChange(currentPage) {
      this.bzPage.currentPage = currentPage;
      this.getPollutionRank();
    },
    closeWrpm() {
      this.$emit("closeWrpm");
    },
    pmChange() {
      if(this.pmType== 0){
        this.message=" 展示标站数据的污染排名情况"
      }else if(this.pmType== 1){
        this.message="将已选范围内的固定微站因子值均值作为标站参考值计算并展示污染排名"
      }else if(this.pmType== 2){
        this.message="将已选范围内的移动微站因子值均值作为标站参考值计算并展示污染排名"
      }
      this.getPollutionRank();
    },
  },
};
</script>
<style lang="scss" scoped>
.wd-100 {
  width: 100px;
}
.wd-120 {
  width: 120px;
}
.sort-pm {
  margin: 12px 15px 0px 15px;
  color: white;
  position: relative;
  .pm-title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.wrpm {
  display: flex;
  // background-image: url(/img/background-image.png);
  // background-size: 100% 100%;
  z-index: 9;
  // padding: 5px 10px 0px 10px;
  .close-wrpm {
    width: 12px;
    height: 75%;
    background-image: url(/img/system/zhan.png);
    background-size: 100% 100%;
    position: absolute;
    transform: rotate(180deg);
    top: 0;
    bottom: 0;
    right: 1px;
    margin: auto;
    cursor: pointer;
    z-index: 9;
  }
  .close-qxpm {
    width: 12px;
    // height: 150px;
    height: 75%;
    background-image: url(/img/system/zhan.png);
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 2px;
    cursor: pointer;
    z-index: 9;
  }
  // /deep/.is-always-shadow {
  //   // height: 240px !important;
  // }
  ::-webkit-scrollbar-thumb {
    display: none;
  }
  /deep/.el-table {
    background-color: rgba(2, 28, 41, 1) !important;
    // border: 1px solid white;
    border: none;
  }
  /deep/.el-table::before {
    display: none !important;
  }
  /deep/.el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    display: none !important;
  }
  /deep/.el-table__expanded-cell {
    background-color: rgba(2, 28, 41, 1) !important;
    // border: 1px solid white;
    border-bottom: none;
  }
  /deep/.avue-crud .el-table th {
    color: white;
    font-size: 12px !important;
    font-weight: 500;
    background-color: rgba(2, 28, 41, 0.999) !important;
    border: none;
  }
  /deep/.el-table__body td {
    background-color: rgba(2, 28, 41, 0.999) !important;
    color: white;
    font-size: 12px !important;
    font-weight: 500;
    border: none;
  }
  /deep/.el-pagination {
    padding: 2px 12px 5px 5px;
  }
  /deep/.el-card__body {
    padding: 0 0 !important;
    border: none;
  }
  /deep/.el-table--small td {
    padding: 1px 0 !important;
  }
  /deep/.el-table--small th {
    padding: 2px 0 !important;
  }
  /deep/.el-pagination__total {
    display: none;
  }
  /deep/.el-pagination__sizes {
    display: none;
  }
  /deep/.el-pagination__jump {
    display: none;
  }
  /deep/.btn-prev {
    color: white;
    background-color: rgba(2, 28, 41, 0);
  }
  /deep/.el-pager {
    color: white;
    .number {
      background-color: rgba(2, 28, 41, 0);
    }
    .active {
      background-color: rgba(2, 28, 41, 0) !important;
    }
    .more {
      background-color: rgba(2, 28, 41, 0) !important;
    }
  }
  /deep/.btn-next {
    color: white;
    background-color: rgba(2, 28, 41, 0);
  }
  &-content {
    // height: 195px;
    padding: 0px 10px 0px 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    /deep/.el-card {
      background-color: rgba(2, 28, 41, 0);
      overflow: hidden;
    }
    .baojing-time {
      display: inline-block;
      width: 30%;
      margin-right: 2%;
    }
    .diypage {
      text-align: right;
    }
  }
  .arrow-btn {
    color: white;
    border: none;
    background-color: rgba(2, 28, 41, 0.1);
  }
  .refresh-btn {
    width: 80px;
    color: white;
    background-color: #409eff;
    border: none;
    margin-left: 273px !important;
  }
  .export-btn {
    width: 80px;
    color: white;
    background-color: #409eff;
    border: none;
  }
  /deep/ .avue-crud__menu {
    margin-bottom: -30px !important;
  }
  /deep/ .avue-crud__pagination {
    margin-bottom: 0;
    margin-top: -10px;
    display: none;
  }
  /deep/.el-table__empty-block {
    overflow: hidden;
    height: 112px !important;
    // background-color: rgb(38, 60, 70)!important;
    .avue-empty {
      margin-top: 30px;
      .avue-empty__desc {
        color: white;
      }
    }
  }
}
</style>
