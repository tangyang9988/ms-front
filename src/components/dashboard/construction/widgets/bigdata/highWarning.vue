<template>
    <div class="wrapper">    	
        <div class="header">高危预警</div>
        <div style="padding:10px;background: #1e2539;flex: 1;overflow-y:hidden ;">
          <e-chart autoresize :options="highAlertOptions" style="height:100%;width:100%"></e-chart>
        </div>
    </div>
</template>
<script>
import { getHighWarning } from "@/api/dust/supervise";
export default {
    data() {
        return {
           highAlertOptions:{}
        }
    },
    mounted() {
       this.getHighAlert()
    },
    methods: {	
      getHighAlert: function() {
        getHighWarning().then(res => { 
            let data=[]
            res.data.data.x.forEach((item,index)=>{
           	 let obj={
           	 	"product":item,
           	 	"卸料机":res.data.data.materialList[index],
           	 	"升降机":res.data.data.elevatorList[index],
           	 	"塔吊机":res.data.data.towerList[index]
           	 }
           	 data.push(obj)
            })        
	        this.highAlertOptions = {
	          color: ['#ADC6FF', '#50E3C2', '#628DFC'],
	          legend: {
	            x: "center",
	            y: "bottom",
	            icon: 'circle',
	            textStyle: {
	              color: "#fff",
	            }
	          },
	          tooltip: {},
	          dataset: {
	            dimensions: ["product", "卸料机", "升降机", "塔吊机"],
	            source: data
	          },
	          textStyle:{
	            color:'#fff',
	          },
	          xAxis: {
	            name: "月",
	            type: "category" ,
	            axisLine: {
	              lineStyle: {
	                color: '#3D4461',
	                width: 2, 
	              }
	            }
	
	          },
	          yAxis: {
	            name: "个",
	            splitNumber:4,
	            splitLine:{
	              show:true,
	              lineStyle:{
	                type:'dashed',
	                color:'#414968'
	              },
	            },
	            axisLine: {
	              lineStyle: {
	                color: '#3D4461',
	                width: 2, //这里是为了突出显示加上的
	              }
	            }
	          },
	          series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
	        }                    
        });   
      }   
    }
}
</script>
<style lang="scss" scoped>
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
}
</style>