<template>
    <div class="siteMonitor_wrapper">
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
            ></el-table-column>
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
            tableHead: [
                {
                    label: '站点',
                    prop: 'siteName',
                    align: 'center',
                },
                {
                    label: '水质类别',
                    prop: 'wqi',
                    align: 'center',
                },
                {
                    label: '设备状态',
                    prop: 'deviceStatus',
                    align: 'center',
                },
                {
                    label: '监测时间',
                    prop: 'time',
                    align: 'center',
                },
            ],
            tableData: [],
            timer: null,
        }
    },
    mounted() {
        clearInterval(this.timer)
        this.timer = null
        this.getTableData()
        setInterval(() => {
            clearInterval(this.timer)
            this.timer = null
            this.getTableData() 
        }, 1800000)
        let _this = this
        $(".bigdata-table").hover(function (){
            clearInterval(_this.timer)
            _this.timer = null
        }, function (){  
            _this.timer = setInterval(() => {
                let firstData = _this.tableData[0]
                _this.tableData = _this.tableData.slice(1,_this.tableData.length)
                _this.tableData.push(firstData)
            }, 2000)
        })
    },
    methods: {
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
                        label: `${item.alias}(${item.unit})`,
                        prop: item.factorCode,
                        align: 'center'
                    })
                })
                this.tableHead.push(
                    {
                        label: '水质类别',
                        prop: 'wqiLevel',
                        align: 'center',
                    },
                    {
                        label: '监测时间',
                        prop: 'collectTime',
                        align: 'center',
                        width: 130
                    }
                )
                res.data.data.y.forEach(item => {
                    // 根据表头数据，赋默认值‘-’
                    res.data.data.x.forEach(el => {
                        item[el.factorCode] = '-'
                    })
                    // 根据表体数据赋值
                    item.factorList.forEach(el => {
                        item[el.factorCode] = el.avgVal
                    })
                })
                this.tableData = res.data.data.y
            }).then(() => {
                this.timer = setInterval(() => {
                    let firstData = this.tableData[0]
                    this.tableData = this.tableData.slice(1,this.tableData.length)
                    this.tableData.push(firstData)
                }, 2000)
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
    
	.bigdata-table .el-table__body-wrapper {
		overflow-y: hidden;
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
        // background: -moz-linear-gradient(top, #4a63a8 0%, #1a2e74 100%);
        // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4a63a8), color-stop(100%,#1a2e74));
        // background: -webkit-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
        // background: -o-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
        // background: -ms-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
        // background: linear-gradient(to bottom, #4a63a8 0%,#1a2e74 100%);
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