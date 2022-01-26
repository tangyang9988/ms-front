<template>
	<div class="system-home" style="height:calc(100% - 40px)" :class="{systemhomebg:systemType==39}">
		<basic-container style="padding: 5px 0;color: #333!important;">
			<dashboard :design-mode="false" :readDefaultOption="readDefaultOption" :id="id"></dashboard>
		</basic-container>
	</div>
</template>

<script>
	import {mapGetters} from "vuex";
	import dashboard from "@/components/dashboard/dashboard.vue";
	export default {
		name: "wel",
		components: {
			dashboard: dashboard
		},
		data() {
			return {
				readDefaultOption: false,
				id:2
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			systemType:function(){
				return localStorage.getItem('systemType')
			}
		},
	}
</script>

<style lang="scss">
.systemhomebg{background-image: url("/img/bg/beijingtu3.png");}	
.system-home {		
	.el-card {
		background: none;
		.el-card__body {
			padding: 0 !important;
		}
	}
	.chart_wrapper {
		height: 100%;
		background: #fff;
		border-radius: 4px;
		// box-sizing: border-box;
		.header {
			color: #5F88F2;
			position: absolute;
			background: #fff;
			line-height: 34px;
			width: 100%;
			box-shadow: 2px 2px 4px #ddd;
			padding: 0 10px;
			// box-sizing: border-box;
			background:(url('/img/bg/tit_bg.png')) no-repeat;background-size:100% 100%;
			border-left:2px solid #628DFC
		}
	}
}
</style>
<style scoped>

</style>

