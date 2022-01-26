<template>
  <div class="siteMonitor_wrapper psoa32_index_siteMonitor_wrapper">
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
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";
export default {
  data() {
    return {
      tableHeight: "calc(100% - 50px)",
      tableHead: [],
      tableData: [],
      factorList: [] // 因子数组
    };
  },
  mounted() {
    this.getTableData();
    setInterval(() => {
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

        // 插入监测时间
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
.psoa32_index_siteMonitor_wrapper {
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
