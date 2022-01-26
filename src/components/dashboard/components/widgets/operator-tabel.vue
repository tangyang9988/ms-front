<template>
    <div class="wrapper">    	
        <div class="header">操作员识别</div>
        <div style="background: #1e2539;flex: 1;overflow-y: hidden;">
	        <div class="operatorWrap">
	        	<div class="section" v-for="item in 4">
	        		<div class="left">
	        			<img src="/img/bg/bg1.jpg" alt="" />
	        		</div>
	        		<div class="right">
	        		     某某某在2020/08/21 06:10:43对XXX设备进行操作,身份3202021212121212 <span style="color: #5F88F2;">比对通过</span>
	        		</div>
	        	</div>
	        </div>
        </div>        
    </div>
</template>

<script>
import { getChartData } from "@/api/ficm/dashboard";
import $ from "jquery"

export default {
    data() {
        return {
            tableHeight: 'calc(100% - 35px)',
            tableData: [
              {a1:"08:47",a2:"XXXXXX",a3:"10",a4:"80",a5:"1"},
              {a1:"08:47",a2:"XXXXXX",a3:"10",a4:"80",a5:"2"},
              {a1:"08:47",a2:"XXXXXX",a3:"10",a4:"80",a5:"1"}
            ]
        }
    },
    mounted() {
  
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
@import 'reset/reset.css';
.wrapper {
	display:flex;
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
        background:(url('/img/bg/tit_bg.png')) no-repeat;background-size:100% 100%;
		border-left:2px solid #628DFC !important;
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
.operatorWrap{
	padding: 30px 20px;
	overflow-y:scroll ;
	.section{display: flex;margin-bottom:30px;
	  .left{width: 40px;height: 40px;background: red;border-radius:50% ;
	    img{width: 100%;height: 100%;border-radius:50% ;}
	  }
	  .right{flex: 1;margin-left: 10px;color: #ccc;font-size: 14px}
	}
}
</style>