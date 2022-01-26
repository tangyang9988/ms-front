<template>
    <div class="chart_wrapper">
        <div class="header">当月AQI</div>
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
                    formatter: (params) => {
                        let res = null
                        switch (params[0].value) {
                            case 1:
                                res = '优'
                                break;
                            case 2:
                                res = '良'
                                break;
                            case 3:
                                res = '轻度污染'
                                break;
                            case 4:
                                res = '中度污染'
                                break;
                            case 5:
                                res = '重度污染'
                                break;
                            case 6:
                                res = '严重污染'
                                break;
                        
                            default:
                                res = null
                                break;
                        }
                        return res
                    }
                },
                // color: '#1148ff',
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
                        name:'日',
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
                yAxis: {
                    type: 'value',
                    axisLabel:{
                        color: '#888',
                        formatter: (value) => {
                            let texts = []
                            switch (value) {
                                case 1:
                                    texts.push('优')
                                    break;
                                case 2:
                                    texts.push('良')
                                    break;
                                case 3:
                                    texts.push('轻度污染')
                                    break;
                                case 4:
                                    texts.push('中度污染')
                                    break;
                                case 5:
                                    texts.push('重度污染')
                                    break;
                                case 6:
                                    texts.push('严重污染')
                                    break;
                            
                                default:
                                    texts.push('')
                                    break;
                            }
                            return texts
                        }
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
                },
                visualMap: [{
                    show:false,
                    pieces: [{
                        gt: 0,
                        lte: 1,
                        color: '#5FC872'
                    }, {
                        gt: 1,
                        lte: 2,
                        color: '#FFDE19'
                    }, {
                        gt: 2,
                        lte: 3,
                        color: '#FF9A00'
                    }, {
                        gt: 3,
                        lte: 4,
                        color: '#E15D51'
                    }, {
                        gt: 4,
                        lte: 5,
                        color: '#CC4B89'
                    }, {
                        gt: 5,
                        color: '#7E0023'
                    }],
                    outOfRange: {
                        color: '#999'
                    }
                }],
                series: [
                    {
                        name:'AQI',
                        data: [],
                        type: 'line',
                    }
                ]
            },
        }
    },
    mounted() {
        // getChartData(7).then(res => {
        //     if(res.data.success) {
        //         this.chartOptions.xAxis[0].data = res.data.data.x
        //         let array = res.data.data.y.map(item => {
        //             return item ? item : 1
        //         })
        //         this.chartOptions.series[0].data = array
        //     }
        // })
        this.chartOptions.xAxis[0].data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        this.chartOptions.series[0].data = [1,1,1,2,3,1,1,1,1,1,1,1,5,1,1,1,1,3,1,1,1,1,1,1,1,1,1,6,1,2,4]
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