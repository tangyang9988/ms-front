<template>
    <div class="siteMonitor_wrapper thCellWrap noScroll">
        <div id="header">站点时报</div>
        <el-table
            size="mini"
            :height="tableHeight"
            :data="tableData"
            :header-cell-style="{background:'#f4f4f4',color:'#666'}"
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
import { getChartData } from "@/api/ficm/dashboard";
export default {
    data() {
        return {
            tableHeight: 'calc(100% - 50px)',
            tableHead: [],
            tableData: [],
            timer:null
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
                        label: '站点',
                        prop: 'siteName',
                        align: 'center',
                    }
                ]
                // 接口返回的表头因子部分
                res.data.data.x.forEach(item => {
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
                    // 根据表头数据，赋默认值‘-’
                    res.data.data.x.forEach(el => {
                        item[el.factorCode] = '-'
                    })
                    // 根据表体数据赋值
                    item.factorList.forEach(el => {
                        item[el.factorCode] = el.collectValue
                    })
                }) 
                this.tableData = res.data.data.y
                this.len=res.data.data.y.length
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
        color: #5F88F2;
        line-height: 34px;
        padding: 0 5px;
        text-align: left;
        width: 100%;
        padding: 0 10px;
        box-shadow: 2px 2px 4px #ddd;
        box-sizing: border-box;
        background:(url('/img/bg/tit_bg.png')) no-repeat;background-size:100% 100%;
		border-left:2px solid #628DFC
    }
}
</style>