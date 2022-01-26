<template>
  <div class="siteMonitor_wrapper psoa31_index_siteMonitor_wrapper noScroll">
    <div id="header">实时监测</div>
    <el-table
      size="mini"
      :height="tableHeight"
      :data="tableData"
      :header-cell-style="{ background: '#f4f4f4', color: '#666' }"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getGISData } from "@/api/swaq/gis";

export default {
  data() {
    return {
      tableHeight: "calc(100% - 50px)",
      tableHead: [],
      tableData: [],
      tableFactorList: [], // 因子数组
      tableFactorListObj: {}, // 因子对象
      timer:null
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
		infoControllTimer(){			
			let obj=this.tableData[0]
			this.tableData.shift();
			this.tableData.push(obj)
		},    	
    getTableData() {
      getGISData().then(res => {
        this.tableHead = [
          {
            label: "企业名称",
            prop: "deptName",
            width: 180
          },
          {
            label: "站点",
            prop: "siteName",
            width: 240
          }
        ];
        // 接口返回的表头因子部分
        res.data.data.forEach(item => {
          item.factorList.forEach(factor => {
            var tableFactor = {
              label: factor.unit !== "" && factor.unit !== undefined ? factor.alias + "\n(" + factor.unit + ")" : factor.alias,
              prop: factor.factorCode,
              align: "center"
            };
            // 去除重负因子
            if (this.tableFactorListObj[factor.factorCode] === undefined) {
              this.tableHead.push(tableFactor);
              this.tableFactorList.push(tableFactor);
              this.tableFactorListObj[factor.factorCode] = tableFactor;
            }
          });
        });

        // 插入监测时间
        this.tableHead.push({
          label: "监测时间",
          prop: "collectTime",
          align: "center",
          width: 150
        });

        res.data.data.forEach(item => {
          // 根据表头数据，赋默认值‘-’
          this.tableFactorList.forEach(el => {
            item[el.factorCode] = "-";
          });
          // 根据表体数据赋值
          item.factorList.forEach(el => {
            item[el.factorCode] = el.collectValue;
          });
        });
        this.tableData = res.data.data;
        this.len=res.data.data.length
		    if(this.len>this.$len){
			    let that=this		
			    this.timer=setInterval(() => {
			      that.infoControllTimer();
			    }, 2000);  					    
		    }else{
		    	let that=this	
		    	clearInterval(this.timer)
			    this.timer=setInterval(() => {
			      that.getTableData()
			    }, 60000);  						    	
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
.psoa31_index_siteMonitor_wrapper {
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
}
</style>
