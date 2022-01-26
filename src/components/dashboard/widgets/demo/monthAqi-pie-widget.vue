<template>
    <div class="chart_wrapper">
        <div class="header">当月空气质量等级</div>
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
                    },
                    data: ['优','良','轻度污染','中度污染','重度污染','严重污染']
                },
                color: ['#5FC872', '#FFDE19', '#FF9A00', '#E15D51', '#CC4B89', '#7E0023'],
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
                                color: '#000',
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
        // getChartData(3).then(res => {
        //     if(res.data.success) {
                let seriesData = []
                let resdatadata = {"x":["优","良","轻度污染","中度污染","重度污染","严重污染"],"y":[0,1,2,0,1,0]}
                resdatadata.x.forEach((item, index) => {
                    seriesData[index] = {}
                    seriesData[index].name = item
                })

                let sum = 0
                resdatadata.y.forEach((item, index) => {
                    seriesData[index].value = item
                    sum += item
                })
                let perArr = []
                resdatadata.y.forEach((item) => {
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
                    return name + ' ' + perArr[resdatadata.x.indexOf(name)] + '%'
                }
        //     }
        // })
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