<template>
	<div id="app">
		<router-view />
	</div>
	
</template>
<script>
	export default {
		name: "app",
		data() {
			return {};
		},
    mounted(){
    },
		watch: {},
		created() {

		},
		methods: {
    },
		computed: {}
	};
</script>
<style lang="scss">
    .pubilc_tabel_wrap{
		.el-table th>.cell {
			white-space: pre-line;
		}
		.el-table__fixed {
			height: calc(100% - 12px) !important;
		}
		.el-table__fixed-right {
			height: calc(100% - 12px) !important;
		}
		.el-table__fixed-right::before,
		.el-table__fixed::before {
			height: 0px;
		}
    }

    /*此类下所有表头全部支持换行*/
    .thCellWrap{ .el-table th>.cell {white-space: pre-line;}    	}
    .big_realMonitor_wrapper{
    	.el-table th, .el-table tr{background: #23283b!important;}
    }
	/*所有图表配置都溢出隐藏*/
    .vue-grid-item{overflow: hidden;}
    /*解决element 全屏下选择框 下拉框不显示的问题*/
    .information_select_wrap .el-select-dropdown{left: 0!important;}
	/*时间控件遮挡问题*/
	.el-picker-panel{position: absolute;z-index: 100;}
	.noScroll .el-table--scrollable-y .el-table__body-wrapper {
	    overflow-y: hidden;
	}
	.avue-crud__dialog .el-dialog__body {
	    padding-top:5px!important
	}
	.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
	    margin-bottom: 5px;
	}
    #avue-view *{font-size: 13px;}
	@font-face{
		font-family: yjsz;
		src:url('/fonts/bigScreen.TTF')
	}
  @font-face{
		font-family: titleFont;
		src:url('/fonts/PingFang-blod.ttf')
		/*src:url('/fonts/PingFang-regular.ttf')*/
	}
    /*弹窗标题设置*/
    .Dialog_title{
		.el-dialog__body{padding: 0 20px 10px;}
		.avue-form__menu--center{text-align: center;}
		.el-col{margin-bottom: 16px;}
    }
	.trendanalysis {
		.el-card__body {
			height: calc(100% - 35px);
			.avue-crud {
				height: calc(100% - 155px);
			}
		}
	}
    .menu-wrapper{.el-icon-arrow-down{margin-top: -4px;}}
    .itemTitle{
    	width: 150px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
	.BMap_pop div:nth-child(1) div {
		border-top-left-radius: 5px;
	}

	.BMap_pop div:nth-child(3) div {
		border-top-right-radius: 5px;
	}

	.BMap_pop div:nth-child(5) div {
		border-bottom-left-radius: 5px;
	}

	.BMap_pop div:nth-child(7) div {
		border-bottom-right-radius: 5px;
	}
	#app {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	.big-data{
		height: calc(100% - 40px);
		background: #0f162d;
		.el-card {
			background: none;
			.el-card__body {
				padding: 0 !important;
			}
		}
		.chart_wrapper {
			height: 100%;
			background: rgba(211, 211, 211, 0.1);
			border-radius: 4px;
			box-sizing: border-box;
			.header {
				color: #5F88F2;
				position: absolute;
				line-height: 34px;
				width: 100%;
				padding: 0 10px;
				box-sizing: border-box;

				background:(url('/img/bg/tit_bg.png')) no-repeat;background-size:100% 100%;
				border-left:2px solid #628DFC
			}
		}
	}
	/*去掉百度地图左下角的logo*/
	.anchorBL {
		display: none;
	}
	/*鼠标样式修改*/
	/*body{
		cursor:url(https://files.cnblogs.com/files/wkfvawl/cursor.ico),auto
	}		*/
	.table-wrapper{position: relative;}

	.avue-main {
		padding-bottom: 0!important;
	}
	.el-table__empty-block{width: 100%!important;}
	.system_wrap {
		margin-top: $system_wrap_top;
	}

	.basic-container {
		padding: 0!important;
	}

	.serach_input {
		margin-bottom: $common_margin_input_bottom;
	}

	.el-card__body {
		padding: $el-card_body_padding !important;
	}

	.custom-tree-node {
		overflow: hidden;
	}


	.avue-crud {
		width: 100%!important;
	}
	/*表格滚动的时候出现1px的固定线*/
	.el-table__fixed-right::before,
	.el-table__fixed::before {
		height: 0px;
	}

	.lc_wrap {
		width: 100%!important;
		height: calc(100% - 40px)!important;
	}
	.lc_wrap2 {
		width: 100%!important;
		height: calc(100% - 60px)!important;
	}	
		
	.gis_wrap{
		width: 100%!important;
		height: calc(100% - 20px)!important;
	}

	.box {
		position: relative;
		.avue-tree__filter {
			margin-bottom: $common_margin_input_bottom;
		}
		margin-right: $common_margin_right;
		* {
			font-size: $tree_fontSize;
		}
		::-webkit-scrollbar {
			display: none;
		}
		.show-ellipsis {
			display: block;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	#hidePage{
		.avue-crud__pagination{display: none;}
	}
	.tabelContainer {
		height: calc(100% - 60px)!important;
		.tabelContainer_elRow{
			::-webkit-scrollbar {
				display: none;
			}
		}
	}

	.avue-crud__menu {
		margin-bottom: 0!important
	}

	.avue-form__menu--center {
		text-align: left;
	}

	.avue-form__row {
		padding-left: 0!important;
	}

	.avue-crud__search .el-form-item--mini.el-form-item,
	.avue-crud__search .el-form-item--small.el-form-item {
		margin-bottom: 4px;
	}

	.avue-crud .avue-crud__left .el-button {
		margin-bottom: 0;
	}
	// .leaflet-tile-container img {
    //         -webkit-filter: grayscale(100%) invert(100%);
    //         -moz-filter: grayscale(100%) invert(100%);
    //         -ms-filter: grayscale(100%) invert(100%);
    //         -o-filter: grayscale(100%) invert(100%);
    //         filter: gray grayscale(100%) invert(100%);
    //         opacity: 0.8 !important;
    //     }
</style>
