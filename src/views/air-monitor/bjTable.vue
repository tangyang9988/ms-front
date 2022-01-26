<template>
  <div>
    <div class="wrpm">
      <div class="close-wrpm" @click="closeWzbj"></div>
      <div class="wrpm-content">
        <basic-container>
          <avue-crud
            :data="data"
            :option="option"
            :page.sync="page"
            @on-load="onLoad"
            @search-change="searchChange"
            @current-change="wzbjcurrentChange"
            @row-click="rowClick"
            
          >
            <template slot="menuLeft">
              <div style="margin: 20px 0px 40px 10px">
                <sapn style="color: #fff; font-size: 13px !important"
                  >设备号：</sapn
                >
                <el-input
                  size="mini"
                  v-model="mn"
                  placeholder="请输入设备号"
                  style="width: 150px; margin-right: 10px"
                >
                </el-input>
                <sapn style="color: #fff; font-size: 13px !important"
                  >时间：</sapn
                >
                <div class="baojing-time">
                  <el-date-picker
                    size="mini"
                    :append-to-body="isFullscreen"
                    v-model="alertTime"
                    type="date"
                    popper-class="dark"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :clearable="false"
                  ></el-date-picker>
                </div>
                <el-button
                  size="mini"
                  type="primary"
                  style="width: 60px; box-sizing: border-box"
                  @click="onLoad()"
                  >查询
                </el-button>
                <el-tag
                  size="mini"
                  type="success"
                  @click.native="weiAlertClick()"
                  style="cursor: pointer"
                  >详情
                </el-tag>
              </div>
            </template>
            <template slot="curVal" slot-scope="scope">{{scope.row.curVal + scope.row.unit}}</template>
          </avue-crud>
          <div class="diypage">
            <el-pagination
              background
              small
              :hide-on-single-page="false"
              :pager-count="5"
              layout="total, prev, pager, next"
              :current-page="page.currentPage"
              :page-size="page.pageSize"
              :total="page.total"
              @current-change="wzbjcurrentChange"
            >
            </el-pagination>
          </div>
        </basic-container>

      </div>
    </div>
  </div>
</template>

<script>
import { getAlertList, getMobileAlertList } from "@/api/microstation/index.js";

export default {
  data() {
    return {
      isFullscreen:false,
      mn: "",
      alertTime: "",
      query: {},
      data: [],
      page: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      option: {
        title: "微站报警",
        titleSize: "h6",
        titleStyle: {
          color: "red",
        },
        align: "center",
        menu: false,
        border: true,
        size: "mini",
        index: true,
        indexWidth: 60,
        searchShow: true,
        searchMenuSpan: 8,
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "站点名称",
            prop: "siteName",
            width: 120,
            overHidden: true,
          },

          {
            label: "设备号",
            prop: "mn",
            width: 100,
            overHidden: true,
          },
          {
            label: "日期",
            prop: "startTime",
            // search: true,
            type: "date",
            align: "center",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            searchSpan: 8,
          },
          {
            label: "因子",
            prop: "alias",
            overHidden: true,
          },
          {
            label: "浓度",
            prop: "curVal",
            slot:true
          },
        ],
      },
    };
  },
  props: {
    type: String,
    factorCode:String
  },
  watch: {
    type: function (nv, ov) {
      this.page.currentPage = 1;
      setTimeout(this.onLoad, 1000);
    },
    factorCode: function (nv, ov) {
      this.page.currentPage = 1;
      setTimeout(this.onLoad, 1000);
    },
  },
  methods: {
    rowClick(row, column, event){
      this.$emit("rowClick",[row.latitude,row.logitude]);
    },
    vehicleRowClick(row, column, event){
      this.$emit("vehicleRowClick",[row.latitude,row.logitude],row);
    },
    //微站报警表格数据初始化
    onLoad(page, params = {}) {
      this.data = [];
      if (this.type == "wzbj") {
        getAlertList(
          this.page.currentPage,
          this.page.pageSize,
          Object.assign(params, this.query),
          this.mn,
          this.alertTime,
          this.factorCode
        ).then((res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.page.currentPage = data.current;
          this.data = data.records;
        });
      } else if (this.type == "wrbj") {
        getMobileAlertList(
          this.page.currentPage,
          this.page.pageSize,
          Object.assign(params, this.query),
          this.mn,
          this.alertTime,
          this.factorCode
        ).then((res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.page.currentPage = data.current;
          this.data = data.records;
        });
      }
    },
    //微站报警分页
    wzbjcurrentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad();
    },
    // 搜索条件改变
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    //微站报警-详情跳转
    weiAlertClick() {
      if (this.type == "wzbj") {
        this.$router.push({
          path: "/weiAlertDetail",
          query: {},
        });
      } else if (this.type == "wrbj") {
        this.$router.push({
          path: "/vehicleAlertDetail",
          query: {},
        });
      }
    },
    closeWzbj() {
      if (this.type == "wzbj") {
        this.$emit("closeWzbj");
      } else if (this.type == "wrbj") {
        this.$emit("closeWrbj");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  /deep/.avue-crud th{
    background-color: rgba(2, 28, 41, 0.999) !important;
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
      z-index:1000;
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
