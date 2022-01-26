<template>
  <div>
    <div class="sort-pm">
      <el-form class="dark" size="mini" :show-message="false" inline>
        <el-form-item label="">
          <el-input v-model="nSize" placeholder="输入n值" style="width:150px;" @input="rankLoad()"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrpm">
      <div
        class="close-qxpm"
        @click="closeFixedRank"
      ></div>
      <div class="wrpm-content">
        <basic-container>
          <avue-crud
            :data="areaData"
            :option="areaOption"
            :page.sync="areaPage"
            @current-change="areaCurrentChange"
            @row-click="rowClick"
          ></avue-crud>
          <div class="diypage">
            <el-pagination
              background
              small
              :hide-on-single-page="false"
              :pager-count="5"
              layout="total, prev, pager, next"
              :current-page="areaPage.currentPage"
              :page-size="areaPage.pageSize"
              :total="areaPage.total"
              @current-change="areaCurrentChange"
            >
            </el-pagination>
          </div>
        </basic-container>
      </div>
    </div>
  </div>
</template>

<script>

import { getAllFixedSiteRankList } from "@/api/microstation/index.js";

export default {
  data() {
    return {
      nSize:"",
      areaRankDesc: 1,
      areaPage: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      areaData: [],
      areaOption: {
        title: "区域排名",
        titleSize: "h6",
        titleStyle: {
          color: "red",
        },
        align: "center",
        menu: false,
        border: true,
        index: true,
        size: "mini",
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "名称",
            prop: "name",
            width:220,
          },
          {
            label: "因子",
            prop: "alias",
          },
          {
            label: "浓度",
            prop: "val",
          },
        ],
      },
    };
  },
  props:{
      timeType:String,
      searchData:Object,
      wepmType:String,
      distance:Number,
      id:String
  },
  watch: {
    wepmType:function(nv,ov) {
      setTimeout(this.rankLoad,1000);
    },
    id:function(nv,ov) {
      setTimeout(this.rankLoad,1000);
    }
  },
  methods: {
    rowClick(row, column, event){
      this.$emit("rowClick",[row.latitude,row.logitude]);
    },
    //区县排名
    rankLoad() {
      getAllFixedSiteRankList( 
      1,
      this.nSize,
      this.timeType,
      this.searchData.dateTime,
      this.wepmType,
      this.areaPage.currentPage,
      this.areaPage.pageSize
      ).then((res) => {
        const data = res.data.data.records;
        data.forEach((item) => {
          item.val = item.val + item.unit;
        });
        this.areaData = data;
        this.areaPage.total = res.data.data.total;
      });
    },
    areaCurrentChange(currentPage) {
      this.areaPage.currentPage = currentPage;
      this.rankLoad();
    },
    closeFixedRank(){
        this.$emit("closeFixedRank");
    }
  },
};
</script>

<style lang="scss" scoped>
.wd-100 {
  width: 100px;
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