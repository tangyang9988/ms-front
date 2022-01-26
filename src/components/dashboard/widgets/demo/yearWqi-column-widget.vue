<template>
    <div class="chart_wrapper">
        <div class="header">全年水质等级</div>
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
                    formatter: '{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}:{c2}<br/>{a3}: {c3}<br/>{a4}: {c4}<br/>{a5}: {c5}'
                },
                color: ['#caddfe', '#6196fd', '#64c676', '#ffde19', '#ff9a00', '#db4d4d'],
                legend: {
                    orient: 'horizontal',
                    icon: 'circle',
                    top: 10,
                    x: 'right',
                    itemWidth: 6,
                    itemHeight: 6,
                    textStyle: { 
                        fontSize: 12,
                    },
                    data: []
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
                        type: 'value',
                        axisLabel: {
                            formatter:'{value} ',
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
                series: [],
            },
        }
    },
    mounted() {
        getChartData(4).then(res => {
            if(res.data.success) {
                let yArray = res.data.data.y
                // 每月各级水质总和的数组
                let sumList = []
                for (let i = 0; i < 12; i++) {
                    // 求每月各级水质值的和
                    let sum = 0
                    yArray.forEach(item => {
                        sum += item.list[i]
                    })
                    sumList.push(sum)
                }
                let legendData = [] // 图例
                let seriesData = [] // 图表数据
                yArray.forEach(item => {
                    // 水质等级占各月百分比的数组
                    let perList = []
                    item.list.forEach((el, key) => {
                        if(sumList[key]) {
                            perList.push(el)
                        }else {
                            perList.push(0)
                        }
                    })
                    legendData.push(item.name)
                    seriesData.push({
                        name: item.name,
                        type: 'bar',
                        barWidth: '30%',
                        stack: 'wqi',
                        data: perList
                    })
                })
                this.chartOptions.xAxis[0].data = res.data.data.x
                this.chartOptions.legend.data = legendData
                this.chartOptions.series = seriesData
            }
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