<template>
    <div class="chart_wrapper">
        <div class="header">全年数据传输有效性</div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
    </div>
</template>

<script>
// import { getChartData } from "@/api/ficm/dashboard";

export default {
    data() {
        return {
            chartOptions: {
                series: [
                    {
                        name: '数据上传率',
                        type: 'pie',
                        radius: ['60%', '75%'],
                        top: '10%',
                        left: 0,
                        right: '66.6667%',
                        label: {    //  饼图图形上的文本标签
                            normal: {   // normal 是图形在默认状态下的样式
                                show: true,
                                position: 'center',
                                fontSize: 14,
                                color: '#000',
                                formatter: '{b}\n{d}%'  // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                            }
                        },
                        avoidLabelOverlap: false,
                        labelLine: false,
                        data: [
                            {
                                name: '数据上传率', 
                                value: 84, 
                                itemStyle: {color: '#6196fd'},
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: '空', 
                                value: 16, 
                                itemStyle: {color: '#f4f4f4'}, 
                                label: {
                                    normal: {
                                        show: false
                                    }
                                }
                            },
                        ]
                    },
                    {
                        name: '数据有效率',
                        type: 'pie',
                        radius: ['60%', '75%'],
                        top: '10%',
                        left: '33.3333%',
                        right: '33.3333%',
                        label: {    //  饼图图形上的文本标签
                            normal: {   // normal 是图形在默认状态下的样式
                                show: true,
                                position: 'center',
                                fontSize: 14,
                                color: '#000',
                                formatter: '{b}\n{d}%'  // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                            }
                        },
                        avoidLabelOverlap: false,
                        labelLine: false,
                        data: [
                            {
                                name: '数据有效率', 
                                value: 88, 
                                itemStyle: {color: '#64c676'},
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: '空', 
                                value: 12, 
                                itemStyle: {color: '#f4f4f4'}, 
                                label: {
                                    normal: {
                                        show: false
                                    }
                                }
                            },
                        ]
                    },
                    {
                        name: '传输有效率',
                        type: 'pie',
                        radius: ['60%', '75%'],
                        top: '10%',
                        left: '66.6667%',
                        right: 0,
                        label: {    //  饼图图形上的文本标签
                            normal: {   // normal 是图形在默认状态下的样式
                                show: true,
                                position: 'center',
                                fontSize: 14,
                                color: '#000',
                                formatter: '{b}\n{d}%'  // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
                            }
                        },
                        avoidLabelOverlap: false,
                        labelLine: false,
                        data: [
                            {
                                name: '传输有效率', 
                                value: 74, 
                                itemStyle: {color: '#ff9a00'},
                                label: {
                                    normal: {
                                        show: true
                                    }
                                }
                            },
                            {
                                name: '空', 
                                value: 26, 
                                itemStyle: {color: '#f4f4f4'}, 
                                label: {
                                    normal: {
                                        show: false
                                    }
                                }
                            },
                        ]
                    },
                ]
            },
        }
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