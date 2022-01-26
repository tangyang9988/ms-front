<template>
	<div class="tabelContainer">
		<el-row style="height:calc(100%)" class="bigdata-setting">
			<basic-container>
				<dashboard design-mode></dashboard>
			</basic-container>
		</el-row>
	</div>
</template>

<script>
	import dashboard from "@/components/dashboard/dashboard-templateconfig";

	export default {
		components: {
			dashboard: dashboard
		},
	}
</script>

<style lang="scss">
	.bigdata-setting {
		background: #0f162d;
		.el-card {
			background: none;
		}
		.chart_wrapper {
			height: 100%;
			background: rgba(211, 211, 211, 0.1);
			border-radius: 4px;
			box-sizing: border-box;
			.header {
				color: #5F88F2;
				position: absolute;
				// border-top-left-radius: 4px;
				// border-top-right-radius: 4px;
				line-height: 34px;
				width: 100%;
				padding: 0 10px;
				box-sizing: border-box;
				// background: -moz-linear-gradient(top, #4a63a8 0%, #1a2e74 100%);
				// background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4a63a8), color-stop(100%,#1a2e74));
				// background: -webkit-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
				// background: -o-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
				// background: -ms-linear-gradient(top, #4a63a8 0%,#1a2e74 100%);
				// background: linear-gradient(to bottom, #4a63a8 0%,#1a2e74 100%);
				background: (url('/img/bg/tit_bg.png')) no-repeat;
				background-size: 100% 100%;
				border-left: 2px solid #628DFC
			}
		}
	}
</style>