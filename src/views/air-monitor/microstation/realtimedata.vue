<template>
  <div class="devicetechnology">
    <basic-container>
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="固定微站" name="weizhan">
          <el-checkbox-group v-model="factorList" class="checkbox" @change="checkboxChange">
            <el-checkbox v-for="(alias) in checkList" :label="alias" :key="alias" :value="alias"></el-checkbox>
          </el-checkbox-group>
            <span style="margin:5px;">点位名称：</span>
            <el-input style="width:220px;margin-right:10px" size="mini" v-model="siteName" @input="siteChange"></el-input>
            <el-cascader
              v-model="areaId"
              :show-all-levels="false"
              :options="areaList"
              :props="{ checkStrictly: true, value: 'value', label: 'title' }"
              placeholder="选择区域"
              size="mini"
              clearable
              @change="getMsSiteLatestData"
            ></el-cascader>
            <el-checkbox v-model="selfSearch" style="margin-left:10px" @change="selfSearchChange">自建查询</el-checkbox>
          <avue-crud ref="weitable" :option="msSiteOption" :data="siteLatestData" :table-loading="loading1" prop="taskName"
            @on-load="getMsSiteLatestData">
            <template slot="menuRight">
            <el-button
              type="warning"
              size="small"
              plain
              icon="el-icon-download"
              @click="handleExportWz">
              导 出
            </el-button>
            <el-button
              class="refresh-count"
              style="margin:0px 10px 15px 5px;"
              size="small"
              type="primary"
              icon="el-icon-refresh"
              @click="countNum = 0">
              刷新倒计时 {{ countNum }}s
            </el-button>
          </template>
          </avue-crud>
        </el-tab-pane>
        <el-tab-pane label="移动微站" name="cheliang">
          <avue-crud ref="crud" :option="vehicleOption" :data="vehicleLatestData" :table-loading="loading">
            <template slot="menuLeft">
              <span style="margin:5px;">车牌号：</span>
              <el-input style="width:200px;" size="small" v-model="vehicle" @input="vehicleChange"></el-input>
            </template>
            <template slot="menuRight">
              <el-button
                type="warning"
                size="small"
                plain
                icon="el-icon-download"
                @click="handleExportVehicle">
                导 出
              </el-button>
              <el-button
                class="refresh-count"
                style="margin:0px 10px 15px 5px;"
                size="small"
                type="primary"
                icon="el-icon-refresh"
                @click="countNum = 0">
                刷新倒计时 {{ countNum }}s
              </el-button>
            </template>
            <template slot="pm2_5" slot-scope="scope">
							<span v-if="scope.row.pm25Alerm == 0">{{scope.row.pm2_5}}</span>
              <span v-if="scope.row.pm25Alerm == 1" style="color:red;">{{scope.row.pm2_5}}</span>
					</template>
          <template slot="pm10" slot-scope="scope">
							<span v-if="scope.row.pm10Alerm == 0">{{scope.row.pm10}}</span>
              <span v-if="scope.row.pm10Alerm == 1" style="color:red;">{{scope.row.pm10}}</span>
					</template>
          </avue-crud>
          <el-checkbox-group v-model="vehiclecheckList" class="checkbox" @change="checkboxChange">
            <el-checkbox label="PM2.5"></el-checkbox>
            <el-checkbox label="PM10" ></el-checkbox>
            <el-checkbox label="TVOC" ></el-checkbox>
            <el-checkbox label="经度" ></el-checkbox>
            <el-checkbox label="纬度" ></el-checkbox>
            <el-checkbox label="速度" ></el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";
  import { getToken } from "@/util/auth";
  import {searchVehicleLatestData, getTableHead, searchMsSiteLatestData} from "@/api/microstation/realtimedata";
  import {getRegionTree} from "@/api/microstation/dataanalysis.js";
  export default {
    data() {
      return {
        selfSearch:false,
        areaId: "3202",
        areaList: [],
        siteName:"",
        vehicle:"",
        loading:true,
        loading1:true,
        exportList:"",
        factorList:[],
        checkList: [],
        vehiclecheckList:[],
        changeList:[],
        countNum: "-", // 刷新的倒计时
        timer:null, //定时器
        query: {},
        activeName: "weizhan",
        // latestDataInterval: null,
        msSiteOption: {
          columnBtn: true, // 显隐按钮
          refreshBtn: false, // 刷新按钮
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
        vehicleOption: {
          refreshBtn: false, // 刷新按钮
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 4,
          border: true,
          index: true,
          viewBtn: true,
          addBtn: false,
          dialogClickModal: false,
          menu: false,
          columnBtn:false,
          column: [
            {
              label: "上传时间",
              prop: "collectTime",
              align: "center",
              width:160,
            },
            {
              label: "车牌号",
              prop: "plateNumber",
              align: "center",
              width:200,
            },
            {
              label: "设备号",
              prop: "mn",
              align: "center"
            },
            {
              label: "PM2.5(ug/m3)",
              prop: "pm2_5",
              align: "center",
              sortable: true,
              slot:true,
            },
            {
              label: "PM10(ug/m3)",
              prop: "pm10",
              align: "center",
              slot:true,
              sortable: true,
            },
            {
              label: "TVOC(mg/m3)",
              prop: "tvoc",
              align: "center",
              sortable: true,
            },
            {
              label: "经度",
              prop: "lng",
              align: "center",
            },
            {
              label: "纬度",
              prop: "lat",
              align: "center",
            },
            {
              label: "速度(km/h)",
              prop: "speed",
              align: "center",
              sortable: true,
            }
          ],
        },
        siteLatestData: [],
        noStyleData:[],//没有样式的表格数据
        vehicleLatestData: [],
      };
    },
    watch: {

    // 倒计时结束时刷新表格
    countNum(val) {
      if (val == 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.loading = true;
        if(this.activeName=="weizhan"){
          this.getMsSiteLatestData();
        }else if(this.activeName=="cheliang"){
          this.getVehicleLatestData();
        }
        this.setLatesData();
      }
    },
    activeName(val) {
      this.countNum = 60;
    }
    },
    computed: {
      ...mapGetters(["permission"]),
    },
    mounted() {
      // this.getLatestDataInterval();
      this.setLatesData();
      this.getAeraList();
    },
    methods: {
      selfSearchChange(){
        if(this.activeName=="weizhan"){
          this.getMsSiteLatestData();
        }else if(this.activeName=="cheliang"){
          this.getVehicleLatestData();
        }
        this.setLatesData();
      },
    getAeraList() {
      let treeType ='0'
      getRegionTree(treeType).then((res) => {
        this.areaList= res.data.data
      });
    }, 
    siteChange(){
      let arr = []
      if(this.siteName!=""){
        this.siteLatestData.filter((item) => {　　　　　　　　　　　　　　// 过滤每一条数据对象
        if (item.siteName.indexOf(this.siteName) >= 0) {　　　　// 每条数据对象的第一个值进行模糊搜索，多个可采用 ||
          return arr.push(item)
        }
        })
        this.siteLatestData= arr;
      }else{
        this.getMsSiteLatestData();
      }
    },
    vehicleChange(){
      let arr = []
      if(this.vehicle!=""){
        this.vehicleLatestData.filter((item) => {　　　　　　　　　　　　　　// 过滤每一条数据对象
        if (item.plateNumber.indexOf(this.vehicle) >= 0) {　　　　// 每条数据对象的第一个值进行模糊搜索，多个可采用 ||
          return arr.push(item)
        }
        })
        this.vehicleLatestData= arr;
      }else{
        this.getVehicleLatestData();
      }
    },
      checkboxChange(){
        this.exportList=""
        var titlelist;
        this.changeList=[];
        if(this.activeName=="weizhan"){
          titlelist= this.msSiteOption.column.slice(0,3)
          this.changeList= this.msSiteOption.column.splice(3);
          this.changeList.forEach(item=>{
            var isSelect =false;
            for(var i=0;i<this.factorList.length;i++){
              if(item.label.indexOf(this.factorList[i])!= -1){
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
          this.msSiteOption.column =titlelist.concat(this.changeList);
        }else{
          titlelist= this.vehicleOption.column.slice(0,2)
          this.changeList= this.vehicleOption.column.splice(2);
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
          this.vehicleOption.column =titlelist.concat(this.changeList);
        }
        this.getFactorList();
        this.exportList =this.exportList.substr(1)
      },
      getFactorList(){
        if(this.activeName=="weizhan"){
          this.factorList.forEach(e=>{
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
            }else if(e=="速度"){
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
      getMsSiteLatestData() {
        this.checkList=[]
        let that = this;
        getTableHead().then((res) => {
          if (res.data.success) {
            let headDatas = res.data.data,
              _head = [
                {
                  label: "上传时间",
                  prop: "collectTime",
                  align: "center",
                  sortable:true,
                  width: 140,
                },
                {
                  label: "点位名称",
                  prop: "siteName",
                  align: "center",
                  width: 120,
                },
                {
                  label: "在线状态",
                  prop: "onlineStatus",
                  align: "center",
                }
              ];
            let headFactorCode = '';
            for (let headData of headDatas) {
              this.checkList.push(headData.alias);
              this.factorList = this.checkList;
              _head.push({
                label: headData.unit ? headData.alias + "\n(" + headData.unit + ")" : headData.alias,
                prop: headData.factorCode,
                align: "center",
                sortable: true,
              })
              headFactorCode = headFactorCode + " " + headData.factorCode;
            }
            that.msSiteOption.column = _head;
            this.getFactorList();
            that.doGetMsSiteLatestData(headFactorCode);
          }
        });
      },
      doGetMsSiteLatestData(headFactorCode) {
        this.loading1 = true;
        let that = this, _siteLatestData = [],_noStyleData = [];
        let regionCode=this.areaId
        if(this.areaId.length>1){
          regionCode=this.areaId[1]
        }
        searchMsSiteLatestData(regionCode,this.selfSearch?1:0).then((gisRes) => {
          var resData = gisRes.data.data;
          for (let codeData of resData) {
            let factorDataJson = {collectTime: codeData.collectTime?codeData.collectTime:'-',siteName: codeData.siteName,onlineStatus: codeData.onlineStatus}, nullHeadFactorStr = headFactorCode;
            for (let factorData of codeData.factorList) {
              if(factorData.isAbnormal == 1){
                factorDataJson[factorData.factorCode] = factorData.collectValue ? "<span style='color:red;'>" + factorData.collectValue + "</span>" : "-";
                nullHeadFactorStr = nullHeadFactorStr.replace(factorData.factorCode, "");
              } else {
                factorDataJson[factorData.factorCode] = factorData.collectValue ? factorData.collectValue : "-";
                nullHeadFactorStr = nullHeadFactorStr.replace(factorData.factorCode, "");
              }
            }
            let nullHeadFactorCodes = nullHeadFactorStr.split(" ");
            //处理设备上传的因子没有表头的因子多，默认表头多出来的因子的值为"-"
            for (let factorCode of nullHeadFactorCodes) {
              if(factorCode){
                factorDataJson[factorCode] = "-";
              }
            }
            _siteLatestData.push(factorDataJson)
          }
          that.siteLatestData = _siteLatestData;
          //解决表头不对齐为题
          /*that.$nextTick(() => {
            that.$refs.weitable.doLayout();
          });*/
          //因为导出时带有标红样式，所以重新获取一组没有样式的数据
          //  for (let codeData of resData) {
          //   let factorDataJson1 = {collectTime: codeData.collectTime?codeData.collectTime:'-',siteName: codeData.siteName}, nullHeadFactorStr = headFactorCode;
          //   for (let factorData of codeData.factorList) {
          //       factorDataJson1[factorData.factorCode] = factorData.collectValue ? factorData.collectValue : "-";
          //       nullHeadFactorStr = nullHeadFactorStr.replace(factorData.factorCode, "");
          //   }
          //   let nullHeadFactorCodes = nullHeadFactorStr.split(" ");
          //   //处理设备上传的因子没有表头的因子多，默认表头多出来的因子的值为"-"
          //   for (let factorCode of nullHeadFactorCodes) {
          //     if(factorCode){
          //       factorDataJson1[factorCode] = "-";
          //     }
          //   }
          //   _noStyleData.push(factorDataJson1)
          // }
          // that.noStyleData = _noStyleData;
          this.loading1 = false;
        });
      },
      handleClick() {
        this.vehiclecheckList=["PM2.5","PM10","TVOC","经度","纬度","速度"]
        let that = this;
        this.$nextTick(() => {
          that.$refs.crud.doLayout();
          that.$refs.weitable.doLayout();
        });
        if(this.activeName=="weizhan"){
          this.getMsSiteLatestData();
        }else if(this.activeName=="cheliang"){
          var list='a34004,a34002,a80219,a01576,a01577,s01184'
          this.exportList=list;
          this.getVehicleLatestData();
        }
      },
      //获取车辆实时数据
      getVehicleLatestData() {
        this.loading = true;
        searchVehicleLatestData().then((res) => {
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            if(data[i].pm10Alerm == 1){
              data[i].pm10 = data[i].pm10
            }
            if(data[i].pm25Alerm == 1){
              data[i].pm2_5 = data[i].pm2_5
            }
          };
          this.vehicleLatestData = data;
          this.loading = false;
        });
      },
      //每60秒获取实时数据的定时器
      setLatesData(){
        let that = this;
        that.countNum = 60;
            that.timer = setInterval(() => {
            that.countNum--;
          }, 1000);
      },
      //导出
      handleExportWz(){
        this.$confirm("是否导出表格?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let exportList;
          exportList =this.exportList;
          let regionCode=this.areaId
          if(this.areaId.length>1){
            regionCode=this.areaId[1]
          }
            window.open(`/api/ms-airq/latestData/exportSiteLatestData?${this.website.tokenHeader}=${getToken()}&factorCodes=${exportList}&regionCode=${regionCode}&filter=${this.selfSearch?1:0}`);
        });
      },
      handleExportVehicle(){
        this.$confirm("是否导出表格?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          console.log(this.exportList)
          let exportList;
          exportList =this.exportList;
            window.open(`/api/ms-airq/latestData/exportVehicleLatestData?${this.website.tokenHeader}=${getToken()}&factorCodes=${exportList}`);
        });
      }
      //定时获取实时数据
      // getLatestDataInterval() {
      //   let that = this;
      //   if (this.latestDataInterval == null) {
      //     this.latestDataInterval = setInterval(function () {
      //       if (that.activeName == "weizhan") {
      //         that.doGetMsSiteLatestData();
      //       } else {
      //         that.getVehicleLatestData();
      //       }
      //     }, 10000);
      //   }
      // }
    },
    // destroyed() {
    //   let that = this;
    //   if (this.latestDataInterval != null) {
    //     clearInterval(that.latestDataInterval);
    //     this.latestDataInterval = null;
    //   }
    // }
    destroyed() {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
</script>

<style lang="scss" scoped>
  .devicetechnology {
    div {
      height: 92%;

      div {
        height: 100%;
      }
    }
  }
  .checkbox_wz{
    position: absolute;
    top:150px;
    left:20px;
  }
  .checkbox{
    position: absolute;
    top:40px;
    left:5px;
  }
  .region{
    position: absolute;
    left:20%;
  }
  /deep/.avue-crud__menu{
    min-height: 70px;
  }
</style>
