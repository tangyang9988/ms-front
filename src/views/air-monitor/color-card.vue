<template>
	<div class="air-color">
		<!-- <div class="block">
			<el-input v-model='beginVal' size="mini" style="width:30px;position:absolute;top:5px;left:-1%;" @change="beginValChange"></el-input>
			<el-slider
			v-model="value"
			range
			:max="max"
			show-stops
			style="margin-bottom:5px;width:75%;"
			@change="sliderChange()">
			</el-slider>
			<el-input v-model='endVal' size="mini" style="width:30px;position:absolute;top:5px;right:18%;" @change="endValChange"></el-input>
		</div> -->
		<div v-show="isShow">
			<el-row>极值调节</el-row>
			<!-- <el-row>
				<el-col :sapn='10'><span>最大值</span></el-col>
				<el-col :sapn='8'><el-input size="mini" style="width:60px"></el-input></el-col>
				<el-col :sapn='12'></el-col>
			</el-row> -->
			<el-row :gutter="24">
				<el-col :span="5"><span>最大值</span></el-col>
				<el-col :span="5"><el-input size="mini" style="width:60px"></el-input></el-col>
				<el-col :span="14"><el-progress type="line" :percentage="50"></el-progress></el-col>
			</el-row>
			<el-row :gutter="24">
				<el-col :span="5"><span>最小值</span></el-col>
				<el-col :span="5"><el-input size="mini" style="width:60px"></el-input></el-col>
				<el-col :span="14"><el-progress type="line" :percentage="0"></el-progress></el-col>
			</el-row>
			<el-row>
				<el-radio-group v-model="cardRadio">
					<el-radio  label="1">标准渐变</el-radio>
					<el-radio  label="2">标准阶梯</el-radio>
					<el-radio  label="3">增强渐变</el-radio>							   
				</el-radio-group>	
			</el-row>
		</div>
		<div class="img">
			<img src="/img/system/card_open.png" height="18px" width="30px" />
		</div>
		<div class="color-card">
			<div class="color-card-item" v-for="item in colorList" :style="'background-image:'+item"></div>
		</div>
		<div class="color-range">
			<div class="color-range-num" v-for="num in numbeiList">{{num}}</div>
		</div>
	</div>
	
</template>

<script>
export default {
	name: 'test',
	props:{
	swatches:{
		type: String,
		default:''
		},
	resetColorValue:{
		type: Boolean,
		default:''
		},
	activeMenu:{
		type: String,
		default:''
		},
	buttonSearchClick:{
		type: Boolean,
		default:''
		},
	},
	watch: {
		resetColorValue:function(value){
			this.value= [75, 250]
		},
		activeMenu:function(){
			if(this.activeMenu=='menu-bz' ){
				this.max=250;
				this.value= [0, 250]
			}else if(this.activeMenu=='menu-wz' ){
				this.max=250;
				this.value= [75, 250]
			}else if(this.activeMenu=='menu-ydwz'){
				this.max=250;
				this.value= [75, 250]
			}
			else{
				this.max=250;
				this.value= [0, 250]
			}
			this.sliderChange();
			this.beginVal='';
			this.endVal='';
		},
		buttonSearchClick:function(value){
			if(this.swatches=="a34004"){//PM2.5
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 250];
				}else{
					this.value= [75, 250];
				}
				this.max=250;
			}else if(this.swatches=="a34002"){//PM10
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 420]
				}else{
					this.value= [150, 420]
				}
				this.max=420;
			}else if(this.swatches=="a21026"){//SO2
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 1600]
				}else{
					this.value= [150, 1600]
				}
				this.max=1600;
			}else if(this.swatches=="a21004"){//NO2
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 565]
				}else{
					this.value= [80, 565]
				}
				this.max=565;
			}else if(this.swatches=="a21005"){//CO
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 36]
				}else{
					this.value= [4, 36]
				}
				this.max=36;
			}else if(this.swatches=="a05024"){//O3
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 800]
				}else{
					this.value= [160, 800]
				}
				this.max=800;
			}else if(this.swatches=="AQI"){//AQI
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 300]
				}else{
					this.value= [101, 300]
				}
				this.max=300;
			}else if(this.swatches=="a80219"){//TVOC
				if(this.activeMenu=='menu-bz' ){
					this.value= [0, 625]
				}else{
					this.value= [250, 625]
				}
				this.max=625;
			}
		},
		swatches: function (value) {
			if(value=="a34004"){//PM2.5
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 35, 75,115, 150, 250, ">250"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 250];
				}else{
					this.value= [75, 250];
				}
				this.max=250;
			}else if(value=="a34002"){//
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 50, 150,250, 350, 420, ">420"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu' ){
					this.value= [0, 420]
				}else{
					this.value= [150, 420]
				}
				this.max=420;
			}else if(value=="a21026"){//SO2
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 50, 150,475, 800, 1600, ">1600"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 1600]
				}else{
					this.value= [150, 1600]
				}
				this.max=1600;
			}else if(value=="a21004"){//NO2
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 40, 80,180, 280, 565, ">565"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 565]
				}else{
					this.value= [80, 565]
				}
				this.max=565;
			}else if(value=="a21005"){//CO
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 2, 4,14, 24, 36, ">36"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 36]
				}else{
					this.value= [4, 36]
				}
				this.max=36;
			}else if(value=="a05024"){//O3
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 100, 160,215, 265, 800, ">800"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 800]
				}else{
					this.value= [160, 800]
				}
				this.max=800;
			}else if(value=="AQI"){//AQI
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 50, 100,150, 200, 300, ">300"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 300]
				}else{
					this.value= [101, 300]
				}
				this.max=300;
			}else if(value=="a80219"){//TVOC
				this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
				this.numbeiList= [0, 125, 250,375, 500, 625, ">625"];
				if(this.activeMenu=='menu-bz' || this.activeMenu=='menu-yuntu'){
					this.value= [0, 625]
				}else{
					this.value= [250, 625]
				}
				this.max=625;
			}
			this.sliderChange();
		},
	},
	data() {
		return {
			cardRadio:'1',
			isShow:true,
			beginVal:'',
			endVal:'',
			colorList: [],
			numbeiList: [],
			max:0,
			value: 15,
		}
	},
	methods: {
	beginValChange(){
		var end= this.value[1]
		this.value=[this.beginVal,end]
		this.sliderChange();
	},
	endValChange(){
		var begin= this.value[0]
		this.value=[begin,this.endVal]
		this.sliderChange();
	},
	 sliderChange(){
		 this.$emit("sliderChange",this.value,this.max)
	 }
	},
	mounted() {
		this.colorList= ['linear-gradient(to right, rgb(0,228,0) , rgb(255,255,0))', 'linear-gradient(to right, rgb(255,255,0) , rgb(255,126,0))', 'linear-gradient(to right, rgb(255,126,0) , rgb(255,0,0))', 'linear-gradient(to right, rgb(255,0,0) , rgb(153,0,76))', 'linear-gradient(to right, rgb(153,0,76) , rgb(126,0,35))', 'linear-gradient(to right, rgb(126,0,35) , rgb(126,0,35))',];
		this.numbeiList= [0, 35, 75,115, 150, 250, ">250",];
		if(this.activeMenu=='menu-bz' ){
			this.value=[0,250];
		}else{
			this.value=[75,250];
		}
		this.max=250;
	}
}
</script>
<style lang="scss" scoped>
.air-color {
	padding:10px 10px 0 10px;
	border: 1px solid #e4e7ed;
	border-radius: 10px;
	background: #fff;
	// .block{
	// 	margin:0 -20px;
	// }
	/deep/.el-input__inner{
		padding:0px;
	}
	.img{
		text-align: center;
	}
	/deep/.el-input--mini .el-input__inner {
		height: 20px;
		line-height: 20px;
	}
	.color-card {
		display: flex;
		width:98%;
		border-radius: 10px;
		&-item {
			width: 50px;
			height: 12px;
		}
	}
	.color-range{
		width:98%;
		margin-right: -5px;
		display: flex;
		justify-content: space-between;
		color: #000;
	}
}
</style>

