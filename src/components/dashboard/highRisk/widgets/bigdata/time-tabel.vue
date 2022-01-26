<template>
	<div class="wrapper">
		<div class="header">24h预警</div>
		<div style="padding:10px;background: #1e2539;flex: 1;overflow-y: hidden;">
			<el-table :data="tableData">
				<el-table-column prop="deviceName" label="设备名称" align="center">
				</el-table-column>
				<el-table-column prop="warningTime" label="时间" align="center">
					<template slot-scope="scope">
						<div>{{formatDatetime(scope.row.warningTime)}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="waringStatus" label="状态" align="center">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import { getTwentyFourWarning } from "@/api/dust/supervise";
	import { dateFormat } from "@/util/date";
	export default {
		data() {
			return {
				tableData: [],
				timer:null,
				allData:[], // 储存总数据，
				dataIndex:0, // 当前轮训的下标
				len:0,// 
			}
		},
		mounted() {
			this.timer = null
			this.init()
			// 定时请求数据 3分钟请求一次数据
	        setInterval(() => {
	            clearInterval(this.timer)
	            this.timer = null
	            this.tableData=[]
	            this.allData=[]	            
	            this.dataIndex=0
	            this.init() 
	        }, 1800000)	
		},
		methods: {
			formatDatetime(str) {
				if(str) {
					str = dateFormat(new Date(str))
					str=str.substring(5)
					return str
				} else {
					return ''
				}
			},
			scrollTable(){
                this.timer = setInterval(() => {
                	let firstData = this.allData[this.dataIndex]
                	this.tableData = this.tableData.slice(1,this.tableData.length)
                	this.tableData.push(firstData)
                	if(this.dataIndex==this.len-1){
                		this.dataIndex=0
                	}else{
                		this.dataIndex++
                	}            
                }, 1000)				
			},			
			init() {
				getTwentyFourWarning().then(res => {
					 if(res.data.data.length>0){
						 this.allData = res.data.data
						 this.len=res.data.data.length
						 for(var i=0;i<15;i++){
						 	this.tableData.push(this.allData[this.dataIndex])
						 	this.dataIndex++
						 }
						 this.scrollTable()					 	
					 }
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