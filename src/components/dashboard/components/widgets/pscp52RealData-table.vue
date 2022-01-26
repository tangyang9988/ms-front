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
						<div v-else-if="item.prop=='collectValue'">
							<div v-if="scope.row.alias=='运行状态'">
								<img src="/img/bg/offline.png" alt="" v-if="scope.row[item.prop]=='0'" style="width:25px;height:25px;"/>
								<img src="/img/bg/abnormal.png" alt="" v-if="scope.row[item.prop]=='1'" style="width:25px;height:25px;"/>

							</div>
							<div v-else-if="scope.row.alias=='故障状态'">
								<div v-if="scope.row[item.prop]=='0'">正常</div>
								<div v-if="scope.row[item.prop]=='1'" style="color: red;">故障</div>
							</div>
							<div v-else>
								 {{ scope.row[item.prop] }}
							</div>
						</div>
						<!--其他文案-->
						<div v-else>{{ scope.row[item.prop] }}</div>                 
		      </template>  
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLatestData } from "@/api/pscp52/api";	

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
      getLatestData().then(res => {
      	console.log(res.data.data)
        this.tableHead = [
	        {
	            label: '',
	            prop: 'status',
	            align: 'center',
	            width: 80
	        },          
          {
            label: "企业名称",
            prop: "deptName",
 
            align: 'center',
          },
          {
            label: "站点",
            prop: "siteName",
          
            overHidden:true,
            align: 'center'
          },
          {
            label: "设备",
            prop: "deviceName",          
            overHidden:true,
            align: 'center'
          },
          {
            label: "因子",
            prop: "alias",          
            overHidden:true,
            align: 'center'
          },  
          {
            label: "值",
            prop: "collectValue",          
            overHidden:true,
            align: 'center'
          },          
          {
            label: "数据采集时间",
            prop: "collectTime",          
            overHidden:true,
            align: 'center'
          }           
        ]; 
        this.tableData=res.data.data              
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>



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
