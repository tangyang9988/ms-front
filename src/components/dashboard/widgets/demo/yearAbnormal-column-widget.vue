<template>
    <div class="chart_wrapper">
        <div class="header">全年超标数量</div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";

export default {
    data() {
        return {
            chartOptions: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: '{a0}: {c0}'
                },
                color: '#ffa900',
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
                            color: '#888'
                        },
                        axisLine:{
                            lineStyle:{ color: '#999' }    // x轴坐标轴颜色
                        },
                        axisTick: false
                    }
                ],
                yAxis: [
                    {
                        minInterval: 1,
                        type: 'value',
                        axisLabel: {
                            color: '#888'
                        },
                        axisLine:{
                            lineStyle:{ color: '#999' }    // x轴坐标轴颜色
                        },
                        axisTick: false,
                        splitLine:{ 
                            show:true, 
                            lineStyle:{ 
                                color: '#dedede',
                                type:'dashed'//设置背景为虚线 
                            } 
                        } 
                    }
                ],
                series: [
                    {
                        name: '预警',
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
        getChartData(6).then(res => {
            this.chartOptions.xAxis[0].data = res.data.data.x
            this.chartOptions.series[0].data = res.data.data.y
        })
    }
}
</script>

<style lang="scss" scoped>
// .chart_wrapper {
//     height: 100%;
//     background: #fff;
//     border-radius: 3px;
//     box-shadow: 2px 2px 4px #ddd;
//     padding: 10px;
//     box-sizing: border-box;
// }
</style>