<template>
    <div class="chart_wrapper">
        <div class="header">当月站点统计</div>
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
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    minInterval : 1,
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
                },
                yAxis: {
                    type: 'category',
                    data: ['劣V类', 'V类', 'IV类', 'III类', 'II类', 'I类'],
                    axisLabel: {
                        interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                        color: '#888'
                    },
                    axisLine:{
                        lineStyle:{ color: '#999' }    // x轴坐标轴颜色
                    },
                    axisTick: false
                },
                series: [
                    {
                        name: '站点数量',
                        type: 'bar',
                        barWidth: '55%',
                        itemStyle: {
                            normal: {
                                color: (params) => {
                                    let color = '#db4d4d'
                                    switch (params.name) {
                                        case 'I类':
                                            color = '#caddfe'
                                            break;
                                        case 'II类':
                                            color = '#6196fd'
                                            break;
                                        case 'III类':
                                            color = '#64c676'
                                            break;
                                        case 'IV类':
                                            color = '#ffde19'
                                            break;
                                        case 'V类':
                                            color = '#ff9a00'
                                            break;
                                        case '劣V类':
                                            color = '#db4d4d'
                                            break;

                                        default:
                                            break;
                                    }
                                    return color
                                },
                            }
                        },
                        data: []
                    },
                ]
            },
        }
    },
    mounted() {
        getChartData(3).then(res => {
            this.chartOptions.series[0].data = []
            res.data.data.y.forEach(item => {
                this.chartOptions.series[0].data.unshift(item)
            })
        })
    },
    methods: {
        /**
         * 取随机数
         */
        getRandom() {
            return Math.round(Math.random()*100)
        },
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