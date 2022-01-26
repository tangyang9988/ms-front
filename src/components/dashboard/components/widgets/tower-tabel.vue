<template>
	<div class="wrapper towerWrapper">
		<div class="header">塔吊机监测<span class="subTitle" @click="linkTab">历史数据</span></div>
		<div style="padding:10px;background: #1e2539;flex: 1;overflow-y: hidden;">
			<el-table :data="tableData" size="mini">
				<el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<div v-if="scope.row.deviceName">{{scope.row.deviceName}}</div>
						<div v-else>-</div>
					</template>						
				</el-table-column>
				<el-table-column prop="datetime" label="时间" align="center" width="120">
					<template slot-scope="scope">
						<div>{{formatDatetime(scope.row.datetime)}}</div>
					</template>
				</el-table-column>				
				<el-table-column prop="weight" label="实时起重量(吨)" width="120" align="center">
					<template slot-scope="scope">
						<div>{{formatData(scope.row.weight)}}</div>
					</template>						
				</el-table-column>
				<el-table-column prop="torque" label="实时力矩" align="center">
					<template slot-scope="scope">
						<div>{{formatData(scope.row.torque)}}</div>
					</template>						
				</el-table-column>
				<el-table-column prop="magnitude" label="实时幅度" align="center">
					<template slot-scope="scope">
						<div>{{formatData(scope.row.magnitude)}}</div>						
					</template>							
				</el-table-column>
				<el-table-column prop="height" label="实时高度" align="center">
					<template slot-scope="scope">
						<div>{{formatData(scope.row.height)}}</div>	
					</template>					
				</el-table-column>
				<el-table-column prop="warning" label="预警" align="center" >
					<template slot-scope="scope">
						<div class="cal_wrap">
							<span class="cal" v-if="scope.row.deviceStatus==1"></span>
							<span class="cal cal2" v-else></span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import { devicetowerdata } from "@/api/dust/supervise";
	import { dateFormat } from "@/util/date";
	export default {
		data() {
			return {
				tableData: [],
				timer:null,
				timer2:null
			}
		},
		mounted() {
			this.timer = null
			this.init()			
			this.timer2=setInterval(() => {
				clearInterval(this.timer)
				this.timer = null
				this.init()
			}, 1800000)			
		},
	    beforeDestroy() {
	        clearInterval(this.timer)  
	        clearInterval(this.timer2)  
	        this.timer = null
	        this.timer2 = null
	    },			
		methods: {			
			linkTab() {
				this.$store.commit('SET_TOWER')
				this.$router.push({
					path: '/dust/highRisk/tower/tower'
				})
			},		
			formatDatetime(str) {
				if(str) {
					str = dateFormat(new Date(str))
					str=str.substring(5)
					return str
				} else {
					return '-'
				}
			},
			formatData(str){
				if(typeof str=='number'){
					return str
				}else{
					return '-'
				}
			},			
			scrollTable() {
				this.timer = setInterval(() => {
					if(this.tableData.length > 0) {
						let firstData = this.tableData[0]
						this.tableData = this.tableData.slice(1, this.tableData.length)
						this.tableData.push(firstData)
					}
				}, 2000)
			},			
			init() {
				devicetowerdata().then(res => {
					this.tableData = res.data.data
					this.scrollTable()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'reset/reset.css';
	.wrapper {
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
		.el-table {
			background: none;
			color: #f8f8f8;
		}
		.el-table::before {
			background: none;
			color: #f8f8f8;
		}
	}
	
	.subTitle {
		color: #999;
		font-size: 14px;
		margin-left: 10px;
		cursor: pointer;
	}
	
	.cal_wrap {
		width: 100%;
		text-align: center;
	}
	
	.cal {
		background: #F56C6C;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
	
	.cal.cal2 {
		background: #67C23A;
	}
</style>