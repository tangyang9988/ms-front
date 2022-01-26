<template>
    <div class="chart_wrapper">
        <div class="header">当月水质等级</div>
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
                    trigger: 'item',
                    formatter: '{b}：{d}%'
                },
                legend: {
                    orient: 'vertical',
                    right: '10%',
                    y: 'center',
                    icon: 'circle',
                    itemWidth: 6,
                    itemHeight: 6,
                    align: 'left',
                    textStyle: { 
                        fontSize: 12,
                        color: '#f8f8f8'
                    },
                    data: ['I类','II类','III类','IV类','V类','劣V类']
                },
                color: ['#caddfe', '#6196fd', '#64c676', '#ffde19', '#ff9a00', '#db4d4d'],
                series: [
                    {
                        name: '当月水质等级',
                        type: 'pie',
                        radius: ['40%', '65%'],
                        center: ['35%', '55%'],
                        label: {
                            normal: {   // normal 是图形在默认状态下的样式
                                show: false,
                                position: 'center',
                                fontSize: 12,
                                color: '#f8f8f8',
                                formatter: '{b}：{d}%'  // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '14',
                            }
                        },
                        data: [],
                    }
                ],
            },
        }
    },
    mounted() {
        getChartData(3).then(res => {
            if(res.data.success) {
                let seriesData = []
                res.data.data.x.forEach((item, index) => {
                    seriesData[index] = {}
                    seriesData[index].name = item
                })

                let sum = 0
                res.data.data.y.forEach((item, index) => {
                    seriesData[index].value = item
                    sum += item
                })
                let perArr = []
                res.data.data.y.forEach((item) => {
                    perArr.push(sum?item/sum*100:0)
                })
                
                seriesData.forEach(item => {
                    if(item.value == 0) {
                        item.label = {
                            normal: {
                                show: false
                            }
                        }
                    }
                })
                this.chartOptions.series[0].data = seriesData
                this.chartOptions.legend.formatter = (name) => {
                    return name + ' ' + res.data.data.y[res.data.data.x.indexOf(name)]
                }
            }
        })
    },
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