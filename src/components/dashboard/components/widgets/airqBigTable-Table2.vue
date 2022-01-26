<template>
	<div class="custom-wrapper thCellWrap systemhomebg">
		<div class="header">环境监测(小时)</div>		
		<div class="body">			
			<el-row>
				<el-col :span="4">
					<el-input size="small" placeholder="请输入站点" prefix-icon="el-icon-search" v-model="searchContent">
					</el-input>
				</el-col>
			</el-row>
						
			<div class="tabel_Wrap">
		    <el-table
		      size="mini"
		      border
		      :height="tableHeight"
		      :data="data.filter((item) => item.siteName.includes(searchContent))"
		      :header-cell-style="{ background: '#23283b', color: '#6189f2',border:'1px solid #273051' }"
		      :cell-style="{ background: '#23283b', color: '#6189f2',border:'1px solid #273051' }"
		    >
			      <el-table-column 
			      	v-for="(item, index) in tableHead"
			      	v-if="!item.children"
			        :prop="item.prop"
			        :label="item.label"
			        :align="item.align"	
			        :width="item.width"
			        :key="index"
			      >            
			      </el-table-column>     	
			      <el-table-column :label="item.label" :align="item.align" v-else>
					      <el-table-column 
					      	v-for="(item2,index2) in item.children"
					      	:label="item2.label" 
					      	:align="item2.align" 
					      	:width="item2.width" 
					      	:prop="item2.prop"
					      	:key="index2"
					      	>
						        <template slot-scope="scope">
						          <div v-if="item2.prop=='aqiLevel'" class="level_env_bg"
						               :class="getEnvBgColor(scope.row[item2.prop])"></div> 
						          <div v-else>
						          	{{scope.row[item2.prop]}}
						          </div>           
						        </template>					      	
					      </el-table-column>
			      </el-table-column>        
		    </el-table>	   				
			</div>
		</div>
	
	</div>
</template>

<script>
	import { getHourData } from "@/api/airq/airqIndex";
	import mixmin from '@/config/mixmin'
	export default {
		data() {
			return {
				searchContent:'',
				tableHeight: "calc(100% - 10px)",
				isTableShow: true,
				loading: false,
				tableHead:[],
				data: [],
				factorList: [], // 存放因子标识的数组，用于给因子赋默认值'-'
			}
		},
		computed: {
			/** 环境等级**/
			getEnvBgColor() {
				return function(level) {
					return 'level_env_bg_' + level
				}
			}
		},
		mounted(){
			 this.onLoad()
		},
		mixins: [mixmin],
		methods: {
			onLoad() {
				// this.loading = true;
				getHourData().then(res=>{
					let arr=res.data.data
					// 封装表头
					if(arr.length == 0) {
						this.isTableShow = false;
						return;
					} else {
						this.isTableShow = true;
					}	
					// ===封装表头开始
					this.tableHead=[
					  {
							label: "站点名称",
							prop: "siteName",
							align: "center",
							width:180
						},
						{
							label: "统计时间",
							prop: "statTime",
							align: "center",
							width:150
						}
					] 				
					arr[0].factorList.forEach((item,index)=>{						
							let formatStr
							// 一定要过滤【.】 否侧匹配不成功
							if(item.head=='颗粒物(粒径小于等于2.5µm)'){
								formatStr='颗粒物(粒径小于等于25µm)'
							}else{
								formatStr=item.head
							}
							this.factorList.push(formatStr+item.airType+'_avg')
							let obj={
									label: `${item.head} \n ${item.airType}`,
									align: 'center',
									children: [{
										label: `${item.avg}\n${item.unit}`,
										prop: formatStr+item.airType+'_avg',
										align: 'center',
										width: item.qi?100:200
									}]							
							}
							if(item.qi){
								let qi=	{
										label: item.qi,
										prop: formatStr+item.airType+'_qi',
										align: 'center',
										width: 100
								}
								this.factorList.push(formatStr+item.airType+'_qi')
								obj.children.push(qi)
							}							
							this.tableHead.push(obj)							
					})
					// 添加其他因子
					this.tableHead.push(
						{label: "空气质量指数\n(AQI)",prop: "aqiVal",align: "center"}, 
						{label: "首要污染物",prop: "primaryFactor",align: "center"}, 
						{label: "空气质量指数类别",prop: "word",align: "center"}, 
						{label: "空气质量指数类别",align: "center",children: [{label: '类别',prop: 'type',align: "center"}, {label: '颜色',prop: 'aqiLevel',align: "center"}]
					})
					// ===封装表头完毕
					
					// ===数据处理开始
					res.data.data.forEach((item,index) => {		
						
						let obj = {
							siteName: item.siteName,
							time: '-',
							statTime: item.statTime,
							aqiVal: item.aqiVal,
							aqiLevel: item.aqiLevel, //等级
							primaryFactor: item.primaryFactor || '-', //首要污染物
							type: item.type,
							word: item.word
						}						
						this.factorList.forEach(el => {								
							obj[el] = '-'
						})								
						item.factorList.forEach(el => {
							let formatStr
							if(el.head=='颗粒物(粒径小于等于2.5µm)'){
								formatStr='颗粒物(粒径小于等于25µm)'
							}else{
								formatStr=el.head
							}													
							obj[`${formatStr}${el.airType}_avg`] = el.avgVal?el.avgVal:'-'
							if(el.qi){								
								obj[`${formatStr}${el.airType}_qi`] = el.aqiVal?el.aqiVal:'-'								
							}
						})
						this.data.push(obj)
					})							
					// ===数据处理结束					
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
.custom-wrapper {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  .header {
    color: #5F88F2;
    background: #fff;
    line-height: 34px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: (url('/img/bg/tit_bg.png')) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628DFC
  }
		.body{flex: 1;padding: 10px 10px 0;display: flex;flex-direction: column;
		  .tabel_Wrap{flex: 1;}
		}  
}

.icon-right:before {
  content: "";
  position: absolute;
  right: 0;
  top: 0px;
  display: block;
  width: 0;
  height: 0;
  border-width: 8px;
  border-style: solid;
  border-color: #00e400 #00e400 transparent transparent;
}

.level_row_color_1:before {
  border-color: #00e400 #00e400 transparent transparent;
}

.level_row_color_2:before {
  border-color: #ffff00 #ffff00 transparent transparent;
}

.level_row_color_3:before {
  border-color: #ff7e00 #ff7e00 transparent transparent;
}

.level_row_color_4:before {
  border-color: #ff0000 #ff0000 transparent transparent;
}

.level_row_color_5:before {
  border-color: #99004c #99004c transparent transparent;
}

.level_row_color_6:before {
  border-color: #7e0023 #7e0023 transparent transparent;
}

.level_env_bg {
  content: '';
  background: #00e400;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}

.level_env_bg_1 {
  background: #00e400;
}

.level_env_bg_2 {
  background: #ffff00;
}

.level_env_bg_3 {
  background: #ff7e00;
}

.level_env_bg_4 {
  background: #ff0000;
}

.level_env_bg_5 {
  background: #99004c;
}

.level_env_bg_6 {
  background: #7e0023;
}


/**信息舱背景**/
.systemhomebg {
  background: 0;
  .container {
    background: rgba(211, 211, 211, 0.1);
    color: #fff !important;
    .date {
      color: #ddd;
    }
  }
  .el-table {
    background: 0;
    border: 0
  }
  .el-table--border::after, .el-table--group::after {
	    top: 0;
	    right: 0;
	    width: 1px;
	    height: 100%;
	    background:#273051 ;
   }
  .el-table::before {
    background: none;
    color: #f8f8f8;
  }
}
</style>

<style lang="scss">
.systemhomebg {
  .gutter {
    background: #11182e !important;
    border:1px solid #273051!important;
    
  }

  .el-input--small .el-input__inner {
    background: 0;
    border: 2px solid #2e3d70;
  }

}
</style>