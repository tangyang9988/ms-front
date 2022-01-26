<template>
  <div class="siteMonitor_wrapper psoa32_big_siteMonitor_wrapper">
    <div class="header">
      实时监测
      <el-button 
        class="refresh-count" 
        size="small" 
        type="primary" 
        icon="el-icon-refresh" 
        v-if="this.tableData.length !== 0 && this.tableData.length <= displayCount"
        @click="countNum=0">
        刷新倒计时 {{ countNum }}s
      </el-button>
    </div>
    <div id="realdataTable">
      <el-table
        class="bigdata-table"
        size="mini"
        :highlight-current-row="false"
        :height="tableHeight"
        :data="tableData"
        :header-cell-style="{ background: 'none', color: '#5F88F2' }"
        row-class-name="rowStyle"
        header-row-class-name="rowStyle"
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
						<div v-if="item.prop=='status'">
							<img src="/img/bg/normal.png" alt="" v-if="scope.row[item.prop]=='1'" style="width:25px;height:25px;"/>
							<img src="/img/bg/abnormal.png" alt="" v-else-if="scope.row[item.prop]=='2'" style="width:25px;height:25px;"/>
							<img src="/img/bg/offline.png" alt="" v-else-if="scope.row[item.prop]=='3'" style="width:25px;height:25px;"/>
						</div>			
						<!--自定义异常文案-->
						<div v-else-if="scope.row[item.prop+'isAbnormal']==1" style="color: red;">
							{{ scope.row[item.prop] }}
						</div>
						<!--其他文案-->
						<div v-else>{{ scope.row[item.prop] }}</div>                 
		      </template>         
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";
import $ from "jquery";
export default {
  data() {
    return {
      displayCount: 5,
      countNum: '-', // 刷新的倒计时·
      tableHeight: "calc(100% - 35px)",
      tableHead: [],
      tableData: [],
      timer: null,
      factorList: [] // 因子数组

    };
  },
  watch: {
    countNum(val) {
      if(this.tableData.length !== 0 && this.tableData.length <= this.displayCount) {
        if(val == 0) {
          clearInterval(this.timer)
          this.timer = null;
          $("#realdataTable").fadeOut();
          this.getTableData();
        }
      }
    },
  },
  mounted() {
    clearInterval(this.timer);
    this.timer = null;
    $("#realdataTable").fadeOut();
    this.getTableData();

    setInterval(() => {
      clearInterval(this.timer);
      this.timer = null;
      $("#realdataTable").fadeOut();
      this.getTableData();
    }, 1800000);
  },
  methods: {
    getTableData() {
      getChartData(5).then(res => {
        this.tableHead = [
	        {
	            label: '状态',
	            prop: 'status',
	            align: 'center',
	            width: 80
	        },          
          {
            label: "企业名称",
            prop: "deptName",
            width: 150,
            align: 'center',
          },
          {
            label: "站点",
            prop: "siteName",
            width: 150,
            overHidden:true,
            align: 'center'
          }
        ];


        // 接口返回的表头因子部分
        res.data.data.x.forEach(item => {
        	  this.factorList.push(item)
            this.tableHead.push({
                label: item.unit?`${item.alias}\n(${item.unit})`:`${item.alias}`,
                prop: item.factorCode,
                align: 'center'
            })
        })

        this.tableHead.push({
          label: "监测时间",
          prop: "collectTime",
          align: "center",
          width: 150
        });
        res.data.data.y.forEach(item => {
						let obj = {
							siteName: item.siteName || '-',
							collectTime: item.collectTime || '-',
							status:item.status,
							deptName:item.deptName
						}
						// 根据动态表头创建因子字段 并默认初始值
						this.factorList.forEach(el => {
							if(el.factorCode!='status'){
								obj[el.factorCode] = '-'
								obj[el.factorCode + 'isAbnormal'] = 0								
							}
						})
						// 接口因子值
						item.factorList.forEach(el => {
							for(var x in obj) {
								if(el.factorCode + 'isAbnormal' == x) {
									obj[el.factorCode + 'isAbnormal'] = el.isAbnormal
								}
							}
							obj[el.factorCode] = el.collectValue || '-'
						})                	
	          this.tableData.push(obj)
        })  
        $("#realdataTable").fadeIn();
      }).then(() => {
        if(this.tableData.length > this.displayCount) {
          this.timer = setInterval(() => {
            if (this.tableData.length > 0 && this.tableData[0] !== undefined) {
              let firstData = this.tableData[0];
              this.tableData = this.tableData.slice(1, this.tableData.length);
              this.tableData.push(firstData);
            }
          }, 2000);
        } else {
          this.countNum = 60;
          this.timer = setInterval(() => {
            this.countNum--
          }, 1000);
        }
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style lang="scss">
.siteMonitor_wrapper {
  * {
    border: none !important;
  }
  .rowStyle {
    border: 1px solid #ccc !important;
    background: rgba(211, 211, 211, 0.1);
  }
  table {
    border-collapse: separate;
    border-spacing: 0px 5px;
  }
  .el-table tbody tr:hover > td {
    background: none !important;
  }
  .gutter {
    background: none;
  }

  .bigdata-table .el-table__body-wrapper {
    overflow-y: hidden;
  }
}

.psoa32_big_siteMonitor_wrapper {
  .el-table th>.cell {
    white-space: pre-line;
  }
}
</style>

<style lang="scss" scoped>
.siteMonitor_wrapper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  .header {
    color: #5f88f2;
    // border-top-left-radius: 4px;
    // border-top-right-radius: 4px;
    line-height: 34px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    // background: -moz-linear-gradient(top, #4a63a8 0%, #1a2e74 100%);
    // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4a63a8), color-stop(100%,#1a2e74));
    // background: -webkit-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: -o-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: -ms-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
    // background: linear-gradient(to bottom, #4a63a8 0%,#1a2e74 100%);
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc !important;
  }
  .el-table {
    background: none;
    color: #f8f8f8;
  }
  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
  .refresh-count {
    float: right;
    margin-right: -10px;
  }
  #realdataTable {
    width: 100%;
    height: 100%;
  }
}
</style>
