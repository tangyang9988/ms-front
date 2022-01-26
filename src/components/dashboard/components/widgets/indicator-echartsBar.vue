<template>
    <div class="chart_wrapper">
        <div class="header">当月评价指标断面超标率(%)
          <div class="tips">
		    <el-tooltip class="item" effect="light" content="断面超标率=某评价指标超过III类标准的断面个数 / 断面（点位）总数 * 100%"
		    	 placement="top">
		        <div style="font-size: 12px;color: #fff;">规则</div>
		    </el-tooltip>          	
          </div>
        
        </div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
</template>


<script>
import { getChartData } from "@/api/ficm/dashboard";

export default {
    data() {
        return {
            chartOptions: {
            	color: ['#ffa900'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{a0}:{c0}%'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisLabel: {
                            interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                            color: '#fff'
                        },
                        axisLine:{
                            lineStyle:{ color: '#505b83' }    // x轴坐标轴颜色
                        },
                        axisTick: false
                    }
                ],
                yAxis: [
                    {
                        minInterval: 1,
                        type: 'value',
                        axisLabel: {
                            color: '#fff'
                        },
                        axisLine:{
                            lineStyle:{ color: '#505b83' }    // x轴坐标轴颜色
                        },
                        max:100,
                        min:0,
                        axisTick: false,
                        splitLine:{ 
                            show:true, 
                            lineStyle:{ 
                                color: '#374062',
                                type:'dashed'//设置背景为虚线 
                            } 
                        } 
                    }
                ],
                series: [
                    {
                        name: '超标率',
                        type: 'bar',
                        barWidth: '30%',
                        stack: 'wqi',                      
                        data: []
                    }
                ],
            },
        }
    },
    mounted() {
        getChartData(8).then(res => {
            this.chartOptions.xAxis[0].data = res.data.data.x
            this.chartOptions.series[0].data = res.data.data.y
        })
    }
}
</script>

<style lang="scss" scoped>
.tips{position: absolute;top: 0;right: 2%;z-index: 1000;}
</style>