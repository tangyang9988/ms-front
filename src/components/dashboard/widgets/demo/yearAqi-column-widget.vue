<template>
    <div class="chart_wrapper">
        <div class="header">实时空气指数<span>2020年1月2日1:00发布</span></div>
        <e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
        <div class="detail">
            <p>空气质量：轻度污染</p>
            <!-- <p>轻度污染</p> -->
            <p>首要污染物 PM2.5</p>
            <p>浓度值 138ug/m³</p>
        </div>
    </div>
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";

export default {
    data() {
        return {
            chartOptions: {
                // backgroundColor: '#fff',
                title: [{
                    text: 'AQI',
                    left: '24%',
                    top: '84%',
                    textAlign: 'center',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: '16',
                        color: '#AAAFC8',
                        textAlign: 'center',
                    },
                }],
                //第一个图表
                series: [{
                        type: 'pie',
                        hoverAnimation: false, //鼠标经过的特效
                        radius: ['55%', '65%'],
                        center: ['25%', '60%'],
                        startAngle: 235,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                position: 'center'
                            }
                        },
                        data: [{
                                value: 100,
                                itemStyle: {
                                    normal: {
                                        color: '#E1E8EE'
                                    }
                                },
                            }, {
                                value: 25,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        },
                                        color: "rgba(0,0,0,0)",
                                        borderWidth: 0
                                    },
                                    emphasis: {
                                        color: "rgba(0,0,0,0)",
                                        borderWidth: 0
                                    }
                                },
                            },

                        ]
                    },
                    //上层环形配置
                    {
                        type: 'pie',
                        hoverAnimation: false, //鼠标经过的特效
                        radius: ['55%', '65%'],
                        center: ['25%', '60%'],
                        startAngle: 235,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                position: 'center'
                            }
                        },
                        data: [{
                                value: 75,
                                itemStyle: {
                                    normal: {
                                        color: '#FF8100'
                                    }
                                },
                                label: {
                                    normal: {
                                        formatter: '{c}',
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '50',
                                            fontWeight: 'normal',
                                            color: '#34374E'
                                        }
                                    }
                                },
                            }, {
                                value: 25,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        },
                                        color: "rgba(0,0,0,0)",
                                        borderWidth: 0
                                    },
                                    emphasis: {
                                        color: "rgba(0,0,0,0)",
                                        borderWidth: 0
                                    }
                                },
                            },

                        ]
                    },
                ]
            }
        }
    },
    mounted() {
        

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
    // height: 100%;
    // background: #fff;
    // border-radius: 3px;
    // box-shadow: 2px 2px 4px #ddd;
    // padding: 10px;
    // box-sizing: border-box;
    .header{
        width:100%;
        span{float:right;font-size:12px;line-height: 24px;margin-right:30px;}

    } 
    .detail{
        position: absolute;
        // width:100px;
        // height:100px;
        left:55%;
        top:28%;
        p:nth-child(1){line-height: 30px;margin:0 0 10px 0;font-size:17px;}
        p:nth-child(2),p:nth-child(3){font-size:14px;line-height: 24px;color:#333;margin:0;}
    }
}
</style>