<template>
    <div class="chart_wrapper">
        <div class="header">实时空气等级</div>
        <p class="time">2020年1月1日1：00发布</p>
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
                    data: ['严重污染', '重度污染', '中度污染', '轻度污染', '良', '优'],
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
                                    let color = '#5FC872'
                                    switch (params.name) {
                                        case '优':
                                            color = '#5FC872'
                                            break;
                                        case '良':
                                            color = '#FFDE19'
                                            break;
                                        case '轻度污染':
                                            color = '#FF9A00'
                                            break;
                                        case '中度污染':
                                            color = '#E15D51'
                                            break;
                                        case '重度污染':
                                            color = '#CC4B89'
                                            break;
                                        case '严重污染':
                                            color = '#7E0023'
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
        // getChartData(3).then(res => {
        //     this.chartOptions.series[0].data = []
        //     res.data.data.y.forEach(item => {
        //         this.chartOptions.series[0].data.unshift(item)
        //     })
        // })
            let data = {"x":["优","良","轻度污染","中度污染","重度污染","严重污染"],"y":[1,2,1,1,1,1]}
            this.chartOptions.series[0].data = []
            data.y.forEach(item => {
                this.chartOptions.series[0].data.unshift(item)
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
.chart_wrapper {
//     height: 100%;
//     background: #fff;
//     border-radius: 3px;
//     box-shadow: 2px 2px 4px #ddd;
//     padding: 10px;
//     box-sizing: border-box;
    .time{position:absolute;top:0px;right:20px;font-size:12px;}
}
</style>