
<template>
  <div class="reaizewrap">
    <div class="reaize_box" ref="box" id="reaize_box">
      <div class="left" ref="left" id="left">
        <div class="leftTreeWrap box treeBox">
          <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="固定微站" name="weizhan" style="">
              <el-tabs type="card" v-model="treeTab" @tab-click="treeTabClick">
                <el-tab-pane label="组织树" name="zuzhi" style="">
                  <siteTree :showNode="$route.query.siteId"  @ready="ready" isAll="0" v-if="treeTab=='zuzhi'"></siteTree>
                </el-tab-pane>
                <el-tab-pane label="区域树" name="quyu" style="">
                  <regionTree @region="region" isAll="0" v-if="treeTab=='quyu'"></regionTree>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="移动微站" name="zouhang">
              <vehicleTree :showNode="$route.query.carId" @ready="ready2" isAll="0"></vehicleTree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="resize" ref="resize" id="resize">
        <img src="/img/show.png" alt="" class="resize_img" />
      </div>
      <div class="right table-wrapper" ref="right" id="right">
        <basic-container>
          <div class="search-tools">
            <div class="search-left">
              <el-date-picker
                v-model="dateFrom"
                type="date"
                size="small"
                placeholder="开始日期"
                :picker-options="pickerOption"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
              <div>&nbsp;至&nbsp;</div>
              <el-date-picker
                v-model="dateTo"
                type="date"
                size="small"
                placeholder="结束日期"
                :picker-options="pickerOption"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="search-right">
              <div class="searcg-btns">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-search"
                  @click="search"
                  >搜 索</el-button
                >
                 <el-button
                  type="warning"
                  size="small"
                  plain
                  icon="el-icon-download"
                  @click="exportHis"
                  >导 出</el-button
                >
              </div>
            </div>
          </div>
          <div style="margin:10px 0 0 10px;">
            <el-checkbox-group  v-model="selectFactorList" @change="checkboxChange" v-if="activeName=='weizhan'">
              <el-checkbox v-for="(alias) in checkList" :label="alias" :key="alias" :value="alias"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="vehiclecheckList" @change="checkboxChange" v-else>
              <el-checkbox label="经度" ></el-checkbox>
              <el-checkbox label="纬度" ></el-checkbox>
              <el-checkbox label="时速" ></el-checkbox>
              <el-checkbox label="PM2.5" ></el-checkbox>
              <el-checkbox label="PM10" ></el-checkbox>
              <el-checkbox label="TVOC" ></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="thCellWrap">
            <avue-crud
              :option="option"
              :table-loading="loading"
              :data="data"
              :page.sync="page"
              :permission="permissionList"
              ref="crud"
              @search-reset="searchReset"
              @current-change="currentChange"
              @size-change="sizeChange"
              @refresh-change="refreshChange"
            >
             <!-- <template
                :slot="item.code"
                slot-scope="scope"
                v-for="item in factorList"
              >
                {{ scope.row[item.value] }}
              </template> -->
            </avue-crud>
          </div>
        </basic-container>
        <columnShow
          :data="tabelHeader"
          ref="columnShow"
          @success="searchReset"
        ></columnShow>
      </div>
    </div>
  </div>

</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import siteTree from "@/components/common/siteTree_checkBox.vue";
import regionTree from "@/components/common/regionTree_checkBox.vue";
import vehicleTree from "@/components/common/vehicle_checkBox.vue";
import {
  getHead,
  getFactorHeadByVehicle,
  getList,
  getVehicleList,
} from "@/api/microstation/historydata.js";
import { dateFormat } from "@/util/date";
export default {
  components: {
    siteTree,
    regionTree,
    vehicleTree,
  },
  data() {
    return {
      treeTab:'zuzhi',
      t2: null,
      selectFactorList:[],
      checkList:[],
      vehiclecheckList:[],
      changeList:[],
      exportList:"",
      activeName: "weizhan",
      tableHeight: "100%",
      tabelHeader: [], // 表头参数
      dateFrom: dateFormat(new Date(), "yyyy-MM-dd"),
      dateTo: dateFormat(new Date(), "yyyy-MM-dd"),
      page: {
        pageSize: 10, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      loading: true,
      option: {
        columnBtn: true, // 显隐按钮
        refreshBtn: true, // 刷新按钮
        stripe: true, // 斑马纹
        menu: false, // 把操作列藏起来
        addBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        dialogClickModal: false,
        columnBtn:false,
        column: [],
      },
      data: [], // 储存表格数据
      deptInfoName: "", // 储存站点名称
      weideptInfoId: "", // 微站ID
      zoudeptInfoId: "", // 走航ID
      nodeList: "",
      vehicleList:"",
      regionList:"",
      pickerOption: {
        // 时间控件参数
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dataList: [], // 未处理的数据
      factorList: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission.faultidentificationalarm_add,
          false
        ),
        viewBtn: this.vaildData(
          this.permission.faultidentificationalarm_view,
          false
        ),
        delBtn: this.vaildData(
          this.permission.faultidentificationalarm_delete,
          false
        ),
        editBtn: this.vaildData(
          this.permission.faultidentificationalarm_edit,
          false
        ),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mounted(){
    if(this.$route.query.siteId){
      this.weideptInfoId = this.$route.query.siteId;
    }
    if(this.$route.query.carId){
      this.zoudeptInfoId = this.$route.query.carId;
    }
    if(this.$route.query.activeName){
      this.activeName = this.$route.query.activeName;
    }
  },
  methods: {
    checkboxChange(){
      this.exportList="";
      var titlelist;
      this.changeList=[];
      titlelist= this.option.column.slice(0,2)
      this.changeList= this.option.column.splice(2);
      if(this.activeName=="weizhan"){
        this.changeList.forEach(item=>{
          var isSelect =false;
          for(var i=0;i<this.selectFactorList.length;i++){
            if(item.label.indexOf(this.selectFactorList[i])!= -
            1){
              isSelect =true;
              break;
            }else{
              isSelect =false;
          }
          }
          if(isSelect){
            item["hide"]=false;
          }else{
            item["hide"]=true;
          }
        })
        this.option.column =titlelist.concat(this.changeList);
      }else{
        this.changeList.forEach(item=>{
          var isSelect =false;
          for(var i=0;i<this.vehiclecheckList.length;i++){
            if(item.label.indexOf(this.vehiclecheckList[i])!= -1){
              isSelect =true;
              break;
            }else{
              isSelect =false;
          }
          }
          if(isSelect){
            item["hide"]=false;
          }else{
            item["hide"]=true;
          }
        })
        this.option.column =titlelist.concat(this.changeList);
      }
      this.getExportList();
      this.exportList =this.exportList.substr(1)
    },
    getExportList(){
      if(this.activeName=="weizhan"){
        this.selectFactorList.forEach(e=>{
          if(e=="温度"){
            e="a01001"
          }else if(e=="湿度"){
            e="a01002"
          }else if(e=="气压"){
            e="a01006"
          }else if(e=="风速"){
            e="a01007"
          }else if(e=="风向"){
            e="a01008"
          }else if(e=="O₃"){
            e="a05024"
          }else if(e=="NO₂"){
            e="a21004"
          }else if(e=="CO"){
            e="a21005"
          }else if(e=="SO₂"){
            e="a21026"
          }else if(e=="TSP"){
            e="a34001"
          }else if(e=="PM2.5"){
            e="a34004"
          }else if(e=="PM10"){
            e="a34002"
          }else if(e=="TVOC"){
            e="a80219"
          }
        this.exportList=this.exportList+','+e
        })
      }else{
        this.vehiclecheckList.forEach(e=>{
          if(e=="经度"){
            e="a01576"
          }else if(e=="纬度"){
            e="a01577"
          }else if(e=="时速"){
            e="s01184"
          }else if(e=="PM2.5"){
            e="a34004"
          }else if(e=="PM10"){
            e="a34002"
          }else if(e=="TVOC"){
            e="a80219"
          }
          this.exportList=this.exportList+','+e
        })
      }

    },
    //导出
    exportHis(){
      this.$confirm("是否导出表格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let from, end,exportList;
        from = this.dateFrom + " 00:00:00";
        end = this.dateTo + " 23:59:59";
        exportList =this.exportList;
        console.log(this.nodeList)
        if (this.activeName == "weizhan"){
          window.open(`/api/ms-airq/history/export?${this.website.tokenHeader}=${getToken()}&treeId=${this.nodeList}&start=${from}&end=${end}&factorCodes=${exportList}`);
        } else {
          window.open(`/api/ms-airq/vehicletrajectory/export?${this.website.tokenHeader}=${getToken()}&treeId=${this.vehicleList}&start=${from}&end=${end}&factorCodes=${exportList}`);
        }
      });
    },
    search() {
      this.onLoad();
    },
    /**
     * 树点击事件
     */
    ready(val) {
      this.nodeList = val
      let that = this
      clearTimeout(this.t2)
      this.t2 = null
      clearTimeout(this.timer)
      this.timer = null
      // 设置定时器，100ms后再请求数据（100ms内没有被再次勾选的话）
      this.t2 = setTimeout(() => {
        that.onLoad()
      }, 100)
    },
    ready2(val) {
      this.vehicleList = val
      clearTimeout(this.t2)
      this.t2 = null
      clearTimeout(this.timer)
      this.timer = null;
      var that =this;
      // 设置定时器，100ms后再请求数据（100ms内没有被再次勾选的话）
      this.t2 = setTimeout(() => {
        that.onLoad()
      }, 100)
    },
    region(val) {
      this.nodeList = val
      clearTimeout(this.t2)
      this.t2 = null
      clearTimeout(this.timer)
      this.timer = null;
      var that =this;
      // 设置定时器，100ms后再请求数据（100ms内没有被再次勾选的话）
      this.t2 = setTimeout(() => {
        that.onLoad()
      }, 100)
    },
    onLoad() {
      this.loading = true;
      this.selectFactorList=[]
      this.checkList=[]
      let from, end ,nodeList,vehicleList;
      from = this.dateFrom + " 00:00:00";
      end = this.dateTo + " 23:59:59";
      if (this.activeName == "weizhan") {
      if(this.nodeList!=''){
        nodeList = this.nodeList.join(',');
        this.getWeiTableHead(nodeList).then((resHead) => {
          getList(
            nodeList,
            from,
            end,
            this.page.currentPage,
            this.page.pageSize
          ).then((res) => {
              this.dataList = [];
              this.factorList=[];
              // 添加分页数据 后数据结构变化
              res.data.data.records.forEach((item) => {
                let obj = {
                  siteName: item.siteName || "-",
                  collTime: item.collTime || "-",
                };
                resHead.forEach((el) => {
                  // 表示表头项是因子
                  if (!el.discriminatingFactor) {
                    obj[el.factorCode] = "-";
                    obj[el.factorCode + "isAbnormal"] = 0;
                  }
                });
                item.factorList.forEach((el) => {
                if(el.isAbnormal == 1) {
                  obj[el.code] = "<span style='color:red;'>" +  el.value + "</span>";
                } else {
                  obj[el.code] = el.value;
                }
                });
                this.dataList.push(obj);
              });
              // 有数据则允许导出
              this.page.total = res.data.data.total;
              this.data = this.dataList;
              this.loading = false;
          });
        })
      }else{
        this.data=[]
        this.loading = false;
      }
      } else if(this.activeName=="zouhang"){
      if(this.vehicleList!=''){
        vehicleList = this.vehicleList.join(',');
        this.getVehicleTableHead(vehicleList).then(
          (resHead) => {
            getVehicleList(
              vehicleList,
              from,
              end,
              this.page.currentPage,
              this.page.pageSize
            ).then((res) => {
              this.loading = false;
              this.dataList = [];
              this.factorList=[];
              // 添加分页数据 后数据结构变化
              res.data.data.records.forEach((item) => {
                let obj = {
                  siteName: item.siteName || "-",
                  collTime: item.collTime || "-",
                };
                resHead.forEach((el) => {
                  // 表示表头项是因子
                  if (!el.discriminatingFactor) {
                    obj[el.factorCode] = "-";
                    obj[el.factorCode + "isAbnormal"] = 0;
                  }
                });
                item.factorList.forEach((el) => {
                if(el.isAbnormal == 1) {
                  obj[el.code] = "<span style='color:red;'>" +  el.value + "</span>";
                } else {
                  obj[el.code] = el.value;
                }
                });
                this.dataList.push(obj);
              });
              // 有数据则允许导出
              this.page.total = res.data.data.total;
              this.data = this.dataList;
            });
          },
          (error) => {
            this.loading = false;
          }
        );
      }else{
        this.data=[]
        this.loading = false;
      }

      }
      this.getExportList();
    },
    /*** 获取微站表头数据+*/
    getWeiTableHead(nodeId) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getHead(nodeId).then((res) => {
          let tableHead = [{
            label: "点位名称",
            prop: "siteName",
            width:120,
            align: "center",
            fixed: "left",
            sortable:true,
            overHidden: true
          }, {
            label: "时间",
            sortable:true,
            prop: "collTime",
            align: "center",
            fixed: "left",
            width: 160
          }];
          if (res.data.success) {
            _this.tabelHeader = res.data.data;
            res.data.data.forEach((item) => {
              _this.checkList.push(item.alias);
              _this.factorList.push(item);
              tableHead.push({
                label: item.unit
                  ? item.alias + "\n(" + item.unit + ")"
                  : item.alias,
                prop: item.factorCode,
                align: "center",
                minWidth: item.tableWidth,
                // slot: !item.discriminatingFactor ? true : false,
              });
            });
            // 将表头放入option
            _this.option.column = tableHead;
            _this.selectFactorList = _this.checkList;
            console.log(_this.checkList)
            resolve(res.data.data);
          } else {
            reject("网络拥堵，请退出重试");
          }
        });
      });
    },
    /*** 获取微站表头数据+*/
    getVehicleTableHead(nodeId) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        getFactorHeadByVehicle(nodeId).then((res) => {
          let tableHead = [{
            label: "车牌号",
            prop: "siteName",
            width:120,
            align: "center",
            fixed: "left",
            sortable:true,
            overHidden: true
          }, {
            label: "时间",
            prop: "collTime",
            align: "center",
            fixed: "left",
            sortable:true,
            width: 160
          }];
          if (res.data.success) {
            _this.tabelHeader = res.data.data;
            res.data.data.forEach((item) => {
              _this.factorList.push(item);
              tableHead.push({
                label: item.unit
                  ? item.alias + "\n(" + item.unit + ")"
                  : item.alias,
                prop: item.factorCode,
                align: "center",
                minWidth: item.tableWidth,
                // slot: !item.discriminatingFactor ? true : false,
              });
            });
            // 将表头放入option
            _this.option.column = tableHead;
            resolve(res.data.data);
          } else {
            reject("网络拥堵，请退出重试");
          }
        });
      });
    },
    handleClick(data) {
      this.vehiclecheckList=["经度","纬度","时速","PM2.5","PM10","TVOC"]
      this.page.currentPage=1;
      this.onLoad();
    },
    beforeOpen(done, type) {
      this.dialogType = type;
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad();
    },
    refreshChange() {
      this.page={
        pageSize: 10, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      this.onLoad(this.page, this.query);
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
}
.search-tools {
  height: 49px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}
.search-tools {
  height: 49px;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.search-left {
  display: flex;
  height: 33px;
  line-height: 33px;
}

.search-right {
  display: flex;
}

.search-tabs {
  height: 33px;
  display: flex;
  align-items: center;
  margin-right: 40px;
}
.reaizewrap {
  height: calc(100% - 60px);
  background: #f0f0f0;
  .reaize_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
  }
  .leftTreeWrap {
    height: 100%;
    margin-bottom: 0;
    padding: 15px;
    overflow: scroll;
  }
  .left {
    width: 16%;
    height: 100%;
    background: #fff;
    border-radius: 4px;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .resize {
    width: 5px;
    height: 100%;
    cursor: w-resize;
    position: relative;
    .resize_img {
      position: absolute;
      top: 50%;
      width: 19px;
      left: -10px;
      margin-top: -61px;
      z-index: 100;
    }
  }
  .right {
    padding: 15px 15px 0;
    flex: 1;
    height: 100%;
    background: #fff;
    overflow: scroll;
    border-radius: 4px;
  }
}
.checkbox{
  position: fixed;
  top:190px;
  right:100px;
}
</style>
