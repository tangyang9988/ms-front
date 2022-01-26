<template>
	<div id="big-data-title-wrap">
		<div class="big-data-title">
			<!-- <div style="margin-right: 3%;"><img :src="logo" alt="" style="align-items: center;width: 120px" /></div> -->
			<div class="systemName">{{systemName}}</div>
		</div>
		<div class="time-wrap">
			<div style="font-size: 24px;">{{timeArr[1]}} {{timeArr[0]}}</div>
		</div>
	</div>
</template>

<script>
	import { getSystemConfig } from "@/api/ficm/systemName";
	export default {
		data() {
			return {
				timeArr: [],
				timer: null,
				systemName:'',
				logo:''
			}
		},
		mounted() {
			getSystemConfig().then(res=>{
                this.systemName=res.data.data.systemName
                this.logo=res.data.data.systemPic
			})
			this.init()
			let that = this
			this.timer = setInterval(function() {
				that.init()
			}, 1000)
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			checkTime(i) {
				if(i < 10) {
					i = "0" + i;
				}
				return i;
			},
			init() {
				this.timeArr = []
				var today = new Date();
				var yyyy = today.getFullYear();
				var MM = today.getMonth() + 1;
				var dd = today.getDate();
				var hh = today.getHours();
				var mm = today.getMinutes();
				var ss = today.getSeconds();
				MM = this.checkTime(MM);
				dd = this.checkTime(dd);
				mm = this.checkTime(mm);
				ss = this.checkTime(ss);
				var day;
				if(today.getDay() == 0) day = "星期日 "
				if(today.getDay() == 1) day = "星期一 "
				if(today.getDay() == 2) day = "星期二 "
				if(today.getDay() == 3) day = "星期三 "
				if(today.getDay() == 4) day = "星期四 "
				if(today.getDay() == 5) day = "星期五 "
				if(today.getDay() == 6) day = "星期六 "
				this.timeArr.push(hh + ":" + mm + ":" + ss)
				this.timeArr.push(yyyy + "-" + MM + "-" + dd)
			}
		}
	}
</script>

<style lang="scss" scoped>
	* {
		box-sizing: border-box;
	}
	.systemName{font-size: 36px!important;color: #91bbff;font-family: titleFont; transform: translateX(-40%);}
	#big-data-title-wrap {
		background: url('/img/bg/HeaderTitleBg.png')no-repeat;
		height: 100%;
		position: relative;
		color: #91bbff;
		background-size: 100% 100%;
	}

	.big-data-title {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		padding-left: 20%;
		img {
			display: block;
		}
	}
	.time-wrap {
		position: absolute;
		right: 2%;
		height: 60%;
		top: 0;
		display: flex;
		align-items: center;
	}
</style>
