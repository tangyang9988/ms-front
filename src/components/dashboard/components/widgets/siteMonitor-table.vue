<template>
    <div class="siteMonitor_wrapper thCellWrap noScroll">
        <div class="header">站点时报</div>
        <el-table
            class="bigdata-table"
            size="mini"
            :highlight-current-row="false"
            :height="tableHeight"
            :data="tableData"
            :header-cell-style="{background:'none',color:'#5F88F2'}"
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
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";
import $ from "jquery"

export default {
    data() {
        return {
            tableHeight: 'calc(100% - 35px)',
            tableHead: [],
            tableData: [],
            timer: null,
            factorList:[]
        }
    },
    mounted() {
        this.getTableData()
    },
    methods: {
		infoControllTimer(){			
			let obj=this.tableData[0]
			this.tableData.shift();
			this.tableData.push(obj)
		},        	
        getTableData() {
            getChartData(5).then(res => {
                this.tableHead = [
                    {
                        label: '状态',
                        prop: 'status',
                        align: 'center',
                    },                
                    {
                        label: '站点',
                        prop: 'siteName',
                        align: 'center',
                    }
                ]
                // 接口返回的表头因子部分
                res.data.data.x.forEach(item => {
                	this.factorList.push(item)
                    this.tableHead.push({
                        label: `${item.alias}\n(${item.unit})`,
                        prop: item.factorCode,
                        align: 'center'
                    })
                })
                this.tableHead.push(
                    {
                        label: '监测时间',
                        prop: 'collectTime',
                        align: 'center',
                        width: 150
                    }
                )
                res.data.data.y.forEach(item => {
					let obj = {
						siteName: item.siteName || '-',
						// deviceName: item.siteName || '-',
						// state: item.state || '-',
						collectTime: item.collectTime || '-',
						// deptName: item.deptName || '-',
						status:item.status
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
//                  // 根据表头数据，赋默认值‘-’
//                  res.data.data.x.forEach(el => {
//                      item[el.factorCode] = '-'
//                  })
//                  // 根据表体数据赋值
//                  item.factorList.forEach(el => {
//                      item[el.factorCode] = el.collectValue
//                  })
                    this.tableData.push(obj)
                })
               //  this.tableData = res.data.data.y
                this.len=this.tableData.length
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
            })
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }
}
</script>

<style lang="scss">
.siteMonitor_wrapper {
    * {
        border: none !important;
    }
    .el-table__body{width: 100%!important;}
    .rowStyle {
        border: 1px solid #ccc !important;
        background: rgba(211, 211, 211, 0.1);
    }
    table {
    	
        border-collapse: separate;
        border-spacing: 0px 5px;
    }
    .el-table tbody tr:hover>td {
        background: none !important
    }
    .gutter {
        background: none;
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
        color: #5F88F2;
        // border-top-left-radius: 4px;
        // border-top-right-radius: 4px;
        line-height: 34px;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        background:(url('/img/bg/tit_bg.png')) no-repeat;background-size:100% 100%;
		border-left:2px solid #628DFC !important;
    }
    .el-table {
        background: none;
        color: #f8f8f8;
    }
    .el-table::before {
        background: none;
        color: #f8f8f8;
    }
}
</style>
