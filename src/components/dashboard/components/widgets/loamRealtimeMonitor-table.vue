<template>
  <div class="realMonitor_wrapper loam_wel_realMonitor_wrapper">
    <div id="header">实时监测</div>
    <el-row :gutter="20">     
      <el-col :span="6">
        <div class="grid-content filter-content">
          <el-input
            placeholder="请输入企业名称"
            prefix-icon="el-icon-search"
            v-model="loamCompanyName"
          >
          </el-input>
        </div>
      </el-col>      
      <el-col :span="9" :offset="9">
        <div class="grid-content">
          <el-row :gutter="20">
            <el-col :span="5"><div class="grid-content" :class="{active:active==0}" @click="filterData(0)">全部({{ totalCom }})</div></el-col>
            <el-col :span="5"><div class="grid-content" :class="{active:active==1}" @click="filterData(1)">正常({{ normalCom }})</div></el-col>
            <el-col :span="5"><div class="grid-content" :class="{active:active==2}" @click="filterData(2)">异常({{ abnormalCom }})</div></el-col>
            <el-col :span="5"><div class="grid-content" :class="{active:active==3}" @click="filterData(3)">在线({{ onlineCom }})</div></el-col>
            <el-col :span="4"><div class="grid-content" :class="{active:active==4}" @click="filterData(4)">离线({{ offlineCom }})</div></el-col>
          </el-row>
        </div>
      </el-col>

    </el-row>

    <!-- 表格内容 -->
    <el-table
      size="mini"
      :height="tableHeight"
      :data="tableData.filter((data) => data.deptName.includes(loamCompanyName))"
      :header-cell-style="{ background: '#f4f4f4', color: '#666' }"
      :span-method="objectSpanMethod"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :label="item.label"
        :prop="item.children && item.children.length > 0 ? '' : item.name"
        :align="item.align"
        :width="item.width"
      >
        <template slot-scope="scope">
          <div style="color:red;" v-if="scope.row[item.name + '_isAbnormal'] === 1" v-html="scope.row[item.name] || '-'"></div>
          <div v-else v-html="scope.row[item.name] || '-'"></div>
        </template>
        <el-table-column
          :v-if="item.children && item.children.length > 0"
          v-for="(motion, mIndex) in item.children"
          :key="mIndex"
          :label="motion.label"
          :prop="motion.name"
          :align="motion.align"
          :width="motion.width"
        >
          <template slot-scope="scope">
            <div style="color:red;" v-if="scope.row[item.name + '_isAbnormal'] === 1" v-html="scope.row[motion.name] || '-'"></div>
            <div v-else v-html="scope.row[motion.name] || '-'"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getHead, getData } from "@/api/loam/index";
import { mergeTableRow } from "@/util/merge";
export default {
  data() {
    return {
    	active:0,
    	alltableData:null,
      comSpan: "deptName-span",
      loamCompanyName: "",
      totalCom: 0,
      normalCom: 0,
      abnormalCom: 0,
      onlineCom: 0,
      offlineCom: 0,
      tableHeight: "100%",
      tableHead: [],
      tableFactorList: [],
      tableData: [],
      MOTION_STATE: '运行状态'
    };
  },
  mounted() {
    this.getTableData();
    setInterval(() => {
      this.getTableData();
    }, 1800000);
  },
  computed:{
        loamAreaName(){
            return this.$store.getters.loamAreaName
        }
  }, 
  watch:{        
        loamAreaName(value1,value2){}
  },  
  methods: {
  	filterData(active){
  		this.loamCompanyName=''
  		this.active=active
  		if(active==0){
  			this.tableData=this.alltableData
  		}else if(active==1){
  			this.tableData=this.alltableData.filter((data) => data.filterStatus==1||data.filterStatus==3)
  		}else if(active==2){  			
  			this.tableData=this.alltableData.filter((data) => data.filterStatus==2)
  		}else if(active==3){  			
  			this.tableData=this.alltableData.filter((data) => data.filterStatus==1||data.filterStatus==2)
  		}else if(active==4){  			
  			this.tableData=this.alltableData.filter((data) => data.filterStatus==3)
  		}  		
  	},
    // 获取实时监测数据
    getTableData() {
      getHead().then(res => {
        if(res.data.success) {
          this.tableHead = [];
          this.tableFactorList = [];
          var this_head = [{
            label: "序号",
            name: "Lindex",
            prop: "Lindex",
            align: "center",
            width: 60
          }, {
            label: "状态",
            name: "status",
            prop: "status",
            align: "center",
            width: 60
          }, {
            label: "区域",
            name: "regionName",
            prop: "regionName",
            // align: "center",
            width: 80
          }, {
            label: "企业",
            name: "deptName",
            prop: "deptName",
            // align: "left",
            width: 240
          }, {
            label: "排口",
            name: "siteName",
            prop: "siteName",
            // align: "center",
            width: 150
          }, {
            label: "机组",
            name: "groupName",
            prop: "groupName",
            // align: "center",
            width: 150
          }];

          // 插入除运行状态外的因子
          res.data.data.forEach((item) => {
            if (item.alias !== this.MOTION_STATE) {
              var tableFactor = {
                label: item.alias + "\n(" + item.unit + ")",
                prop: item.factorCode,
                name: item.alias,
                align: "center",
              };
              this_head.push(tableFactor);
              this.tableFactorList.push(tableFactor);
            }
          });

          // 插入风机运行状态中的因子
          res.data.data.forEach((item) => {
            if (item.alias === this.MOTION_STATE) {
              this_head.push({
                label: this.MOTION_STATE,
                name: this.MOTION_STATE,
                prop: "motionState",
                align: "center",
                children: [],
              });

              item.children.forEach((childItem) => {
                this_head.forEach((head) => {
                  if (head.label === this.MOTION_STATE) {
                    var tableFactor = {
                      label: `${childItem.alias}`,
                      prop: childItem.factorCode,
                      name: childItem.alias,
                      align: "center",
                      width: 70
                    };
                    head.children.push(tableFactor);
                    this.tableFactorList.push(tableFactor);
                  }
                });
              });
            }
          });

          // 插入时间
          this_head.push({
            label: "时间",
            name: "collectTime",
            prop: "collectTime",
            align: "center",
            width: 160,
          });

          this.tableHead = this_head;

          // 数据
          getData().then(gisRes => {
            if(!gisRes.data.success)return;
            var resData = gisRes.data.data;            
            // 数量总结
            this.totalCom = resData.deptStatusCount.total
              ? resData.deptStatusCount.total
              : 0;
            this.abnormalCom = resData.deptStatusCount.abnormal
              ? resData.deptStatusCount.abnormal
              : 0;
            this.offlineCom = resData.deptStatusCount.offLine
              ? resData.deptStatusCount.offLine
              : 0;
            this.normalCom = this.totalCom - this.abnormalCom;
            this.onlineCom = this.totalCom - this.offlineCom;

            // 表数据 因子赋值
            resData.gisVOList.forEach((item) => {              
              this.tableFactorList.forEach((el) => {
                item[el.name] = "-";
                item[el.name + "_isAbnormal"] = "-";
              });              
              item.factorList.forEach((el) => {
                if (el.collectValue !== "" && el.collectValue !== undefined) {
                  item[el.alias] = el.collectValue;
                  item[el.alias + "_isAbnormal"] = el.isAbnormal;
                }
              })
            });

            // 该企业下所有排口、机组的状态
            var statusListObj = {};
            resData.gisVOList.forEach((item) => {
              if (statusListObj[item.deptName + "-" + item.regionName] === undefined) {
                statusListObj[item.deptName + "-" + item.regionName] = [item.status];
              } else {
                if (statusListObj[item.deptName + "-" + item.regionName].indexOf(item.status) < 0) {
                  statusListObj[item.deptName + "-" + item.regionName].push(item.status);
                }
              }
            });

            // 只要有一个超标 就算超标 全部离线才算离线
            var statusList = [];
            for (var deptRegion in statusListObj) {
              var this_status = "";
              if (statusListObj[deptRegion].length === 1) {
                this_status = statusListObj[deptRegion][0];
              } else {
                if (statusListObj[deptRegion].indexOf("2") >= 0) this_status = "2";
                else this_status = "1";
              }
              statusList.push({
                deptName: deptRegion.split("-")[0],
                regionName: deptRegion.split("-")[1],
                status: this.formatStatusHtml(this_status),
                filterStatus:this_status
              });
            }
            
            // 企业状态图标
            resData.gisVOList.forEach((item) => {
            	
              for (var i = 0; i < statusList.length; i++) {
                if (statusList[i].deptName === item.deptName &&statusList[i].regionName === item.regionName) {
                  item.status = statusList[i].status;
                  item.Lindex = i + 1;
                  item.filterStatus=statusList[i].filterStatus
                }
                
              }
              item["风机"] = this.formatMotionHtml(item["风机"]);
              item["净化器"] = this.formatMotionHtml(item["净化器"]);
              
            });

            this.alltableData = mergeTableRow(
              resData.gisVOList.sort(this.loamSort),
              ["Lindex", "status", "regionName", "deptName", "siteName"]
            );
            
            this.tableData=this.alltableData
            
            // this.tableHeight = parseInt(document.getElementsByClassName("realMonitor_wrapper")[0].clientHeight - 84);
          })
        }
      })
    },

    // 动态合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const span = column["property"] + "-span";
      var columns = ["Lindex-span", "regionName-span", "status-span"];
      if (row[span]) {
        if (columns.indexOf(span) >= 0) {
          return row[this.comSpan];
        }
        if (span === "siteName-span") {
          if (row[span].colspan === 1 && row[this.comSpan].colspan === 1 && row[span].rowspan > row[this.comSpan].rowspan) {
            return row[this.comSpan];
          }
          if (row[span].colspan === 0 && row[span].rowspan === 0 && (row[this.comSpan].colspan !== 0 || row[this.comSpan].rowspan !== 0) ) {
            return row[this.comSpan];
          }
        }
        return row[span];
      }
    },

    // 按照序号、企业、排口排序
    loamSort(ob1, ob2) {
      if (ob1.Lindex < ob2.Lindex) {
        return -1;
      } else if (ob1.Lindex > ob2.Lindex) {
        return 1;
      }
      if (ob1.deptName < ob2.deptName) {
        return -1;
      } else if (ob1.deptName > ob2.deptName) {
        return 1;
      }
      if (ob1.siteName < ob2.siteName) {
        return -1;
      } else if (ob1.siteName > ob2.siteName) {
        return 1;
      } else {
        return 0;
      }
    },
    // 状态图标
    formatStatusHtml(status) {
      var imgSrc = "";
      if (status === "1") imgSrc = "/img/bg/normal.png";
      else if (status === "2") imgSrc = "/img/bg/abnormal.png";
      else if (status === "3") imgSrc = "/img/bg/offline.png";
      return (
        '<image style="width:25px;height:25px;" src="' + imgSrc + '"></image>'
      );
    },
    // 运行状态（风机、净化器）图标
    formatMotionHtml(value) {
      var imgSrc = "";
      if (value === "1") imgSrc = "/img/bg/normal.png";
      else if (value === "0") imgSrc = "/img/bg/offline.png";
      if (imgSrc !== "")
        return (
          '<image style="width:25px;height:25px;" src="' + imgSrc + '"></image>'
        );
      else return "-";
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss">
.realMonitor_wrapper {
  .el-table td{
    border-right: 1px solid #EBEEF5;
  }
}

.loam_wel_realMonitor_wrapper {
  .el-table th>.cell {
    white-space: pre-line;
  }
}
</style>
<style lang="scss" scoped>
.realMonitor_wrapper {
	overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: 2px 2px 4px #ddd;
  #header {
    color: #5f88f2;
    line-height: 34px;
    padding: 0 5px;
    text-align: left;
    width: 100%;
    padding: 0 10px;
    box-shadow: 2px 2px 4px #ddd;
    box-sizing: border-box;
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc;
  }
  .el-table {
    height: calc(100% - 84px) !important;
    border: none !important;
  }  
}
.el-row {
  margin: 0px !important;
  .el-col {
    padding: 0px !important;
    margin-bottom: 0px !important;
  }
  .grid-content {
  	cursor: pointer;
    height: 50px;
    line-height: 50px;
  }
  .grid-content.active{font-weight: bold;font-size: 16px!important;}
  .filter-content {
    padding: 0px 10px;
  }
}
.el-table{
    overflow: auto;
}
.el-table::before{
  height: 0px !important;
}
</style>