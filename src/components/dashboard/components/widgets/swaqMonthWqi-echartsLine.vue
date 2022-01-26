<template>
    <div class="chart_wrapper">
        <div class="header">当月水质趋势</div>
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
                                res = 'I类'
                                break;
                            case 2:
                                res = 'II类'
                                break;
                            case 3:
                                res = 'III类'
                                break;
                            case 4:
                                res = 'IV类'
                                break;
                            case 5:
                                res = 'V类'
                                break;
                            case 6:
                                res = '劣V类'
                                break;
                        
                            default:
                                res = null
                                break;
                        }
                        return res
                    }
                },
                color: '#1148ff',
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
                            // interval: 0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
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
                                    texts.push('I类')
                                    break;
                                case 2:
                                    texts.push('II类')
                                    break;
                                case 3:
                                    texts.push('III类')
                                    break;
                                case 4:
                                    texts.push('IV类')
                                    break;
                                case 5:
                                    texts.push('V类')
                                    break;
                                case 6:
                                    texts.push('劣V类')
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
                series: [
                    {
                        data: [],
                        type: 'line'
                    }
                ]
            },
        }
    },
    mounted() {
        getChartData(7).then(res => {
            if(res.data.success) {
                this.chartOptions.xAxis[0].data = res.data.data.x
                let array = res.data.data.y.map(item => {
                    return item ? item : null
                })
                this.chartOptions.series[0].data = array
            }
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