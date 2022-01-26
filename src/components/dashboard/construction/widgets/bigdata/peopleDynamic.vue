<template>
    <div class="wrapper">    	
        <div class="header">人员动态</div>
        <div style="background: #1e2539;flex: 1;overflow-y:hidden ;">
           <e-chart autoresize :options="personOptions" style="height:95%;width:100%"></e-chart>
        </div>
    </div>
</template>

<script>
import { getStaffTrends } from "@/api/dust/supervise";	
export default {
    data() {
        return {
          personOptions: {}
        }
    },
    mounted() {
      this.personInfo()
    },
    methods: {      	
      personInfo: function() {
      	getStaffTrends().then(res => { 
	        let data = [
	          { value: res.data.data.beCount, name: "在场", itemStyle: { color: "#628DFC" } },
	          { value: res.data.data.outCount, name: "出场", itemStyle: { color: "#FADB14" } }
	        ];
	        this.personOptions = {
	          tooltip: {
	            trigger: "item",
	            formatter: "{a} <br/>{b}: {c} ({d}%)"
	          },
	          // 中间显示的文案
	          title: {
	          	show:true,
	            text: '人员总数',
	            subtext: data[0].value+data[1].value+'',
	            x: 'center',
	            y: '37.5%',
	            textStyle: {
	              fontSize: 16,
	              color: '#FFF',
	              fontWeight:'400'
	            },
	            subtextStyle: {
	              fontSize: 26,
	              color: '#FFF',
	              fontWeight:'400'
	            }	
	          },
	          // 图例组件
	          legend: {
	            icon: 'circle',  // 图例前面的形状
	            orient: "horizontal", // 图例的排列方向 水平/垂直
	            left: "center",
	            top: "bottom",
	            textStyle: {	             
	              color: "#fff"
	            },
	            data: data,
	            formatter: function(val) {
	              let e = data.find(e => val === e.name);
	              return e.name + " " + e.value;
	            }
	          },
	          series: [
	            {
	              name: "人员总数",
	              type: "pie",
	              radius: ["55%", "70%"], // 设置中心点
	              avoidLabelOverlap: false, // 防重叠策略
	              // 图例显示 设置了title 所以不需要了
	              label: {
	                show: false
	              },
	              // 高亮区设置
	              emphasis: {
	                label: {
	                  show: false,
	                  fontSize: "30",
	                  fontWeight: "bold"
	                }
	              },
	              labelLine: {
	                show: true
	              },
	              data: data
	            }
	          ]
	        };
     	       
      	})

      },
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