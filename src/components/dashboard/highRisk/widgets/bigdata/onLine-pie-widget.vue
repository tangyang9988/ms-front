<template>
	<div class="onLine_wrapper">
		<div class="header">实时在线率</div>
		<div style="padding:10px;background: #1e2539;flex: 1;overflow-y: hidden;">
			<e-chart autoresize :options="chartOptions" style="height:100%;"></e-chart>
			<div class="lentit">
				<div class="lentit1"><span style="background:#FA8C16"></span>卸料机</div>
				<div class="lentit2"><span style="background:#50E3C2"></span>升降机</div>
				<div class="lentit3"><span style="background:#4A90E2"></span>塔吊机</div>
			</div>
		</div>

	</div>
</template>
<script>
	import { getRealTimeOnlineRate } from "@/api/dust/supervise";
	export default {
		data() {
			return {
				data:{},
				chartOptions: {
					tooltip: {
						formatter: '{a} <br/>{b} : {c}%'
					},
					toolbox: {
						feature: {
							restore: {},
							saveAsImage: {}
						}
					},
					series: [{
							name: '卸料机',
							type: 'gauge',
							center: ['19%', '45%'], // 位置设置
							radius: '55%', // 圆的半径
							min: 0, // 最小值
							max: 100, // 最大值
							endAngle: -45, // 仪表盘的结束角度  可以控制不封闭多少角度
							splitNumber: 7,
							axisLine: { // 坐标轴线 （圆的粗细）
								show: true,
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8,
									color: [
										[0, '#fa8c16'],
										[1, '#ffe2b2']
									] // 控制颜色
								}
							},
							axisLabel: { // 刻度标签属性
								show: false
							},
							axisTick: { // 坐标轴小标记
								show: false
							},
							splitLine: { // 刻度线属性
								show: false
							},
							pointer: { // 指针属性
								show: false
							},
							title: {
								show: true,
								offsetCenter: [0, '100%'], // x, y，单位px
								color: '#f8f8f8'
							},
							detail: {
								formatter: '{value}%',
								offsetCenter: [0, '0%']

							},
							data: [{
								value: 0
							}]
						},
						{
							name: '升降机',
							type: 'gauge',
							center: ['50%', '45%'], // 位置设置
							radius: '55%', // 圆的半径
							min: 0, // 最小值
							max: 100, // 最大值
							endAngle: -45, // 仪表盘的结束角度  可以控制不封闭多少角度
							splitNumber: 7,
							axisLine: { // 坐标轴线 （圆的粗细）
								show: true,
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8,
									color: [
										[0, '#4aceb3'],
										[1, '#b0d6d2']
									] // 控制颜色
								}
							},
							axisLabel: { // 刻度标签属性
								show: false
							},
							axisTick: { // 坐标轴小标记
								show: false
							},
							splitLine: { // 刻度线属性
								show: false
							},
							pointer: { // 指针属性
								show: false
							},
							title: {
								show: true,
								offsetCenter: [0, '100%'], // x, y，单位px
								color: '#f8f8f8'
							},
							detail: {
								formatter: '{value}%',
								offsetCenter: [0, '0%']

							},
							data: [{
								value: 0
							}]
						},
						{
							name: '塔吊机',
							type: 'gauge',
							center: ['81%', '45%'], // 位置设置
							radius: '55%', // 圆的半径
							min: 0, // 最小值
							max: 100, // 最大值
							endAngle: -45, // 仪表盘的结束角度  可以控制不封闭多少角度
							splitNumber: 7,
							axisLine: { // 坐标轴线 （圆的粗细）
								show: true,
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8,
									color: [
										[0, '#628dfc'],
										[1, '#cde2fa']
									] // 控制颜色
								}
							},
							axisLabel: { // 刻度标签属性
								show: false
							},
							axisTick: { // 坐标轴小标记
								show: false
							},
							splitLine: { // 刻度线属性
								show: false
							},
							pointer: { // 指针属性
								show: false
							},
							title: {
								show: true,
								offsetCenter: [0, '100%'], // x, y，单位px
								color: '#f8f8f8'
							},
							detail: {
								formatter: '{value}%',
								offsetCenter: [0, '0%']

							},
							data: [{
								value: 0
							}]
						}
					]
				}
			}
		},
		methods: {
			init(){
				getRealTimeOnlineRate().then(res=>{
					console.log(res)
					this.data.elevatorOnlineRate=Number(res.data.data.elevatorOnlineRate)
					this.data.materialOnlineRate=Number(res.data.data.materialOnlineRate)
					this.data.towerOnlineRate=Number(res.data.data.towerOnlineRate)
					this.chartOptions.series[0].axisLine.lineStyle.color[0][0]=(this.data.materialOnlineRate)                
					this.chartOptions.series[0].data[0].value=this.data.materialOnlineRate*100
					this.chartOptions.series[1].axisLine.lineStyle.color[0][0]=(this.data.elevatorOnlineRate)               
					this.chartOptions.series[1].data[0].value=this.data.elevatorOnlineRate*100
					this.chartOptions.series[2].axisLine.lineStyle.color[0][0]=(this.data.towerOnlineRate)                
					this.chartOptions.series[2].data[0].value=this.data.towerOnlineRate*100				
				})
			}
		},
		mounted() {
            this.init()
		}		
	}
</script>

<style lang="scss" scoped>
	.onLine_wrapper {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		border-radius: 3px;
		.header {
			color: #fff;
			line-height: 34px;
			width: 100%;
			padding: 0 10px;
			box-sizing: border-box;
			background: (url('/img/bg/tit_bg.png')) no-repeat;
			background-size: 100% 100%;
			border-left: 2px solid #628DFC !important;
		}
		.lentit {
			text-align: center;
			position: absolute;
			top: 75%;
			left: 0;
			width: 100%;
			padding: 0 3%;
			display: flex;
			span {
				display: inline-block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				margin-right: 5px;
				
			}			
			.lentit1{
				color: #fff;
				margin-left: 10%;
			}
			.lentit2{
				color: #fff;
				margin-left: 19%;
			}	
			.lentit3{
				color: #fff;
				margin-left:17%;
			}							
		}
		
		
		
			/*div {
				width: 33%;
				color: #fff;
				font-size: 14px;
				span {
					display: inline-block;
					width: 10px;
					height: 10px;
					border-radius: 50%;
					margin-right: 5px;
				}
			}		*/
	}
</style>