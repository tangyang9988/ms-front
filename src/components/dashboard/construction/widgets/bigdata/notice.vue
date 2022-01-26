<template>
    <div class="wrapper">    	
        <div class="header">公告栏</div>
        <div style="padding:20px;background: #1e2539;flex: 1;overflow-y:hidden ;">
            <div class="section" v-for="(item,index) in infoControlShowDatas" @mouseover="pauseTimer()" @mouseleave="restartTimer()" @click="showNotice(item)">
            	<div class="img"><img src="/img/bg/sound.png"/></div>
            	<div class="content">{{item.title}}</div>
            	<div class="time">{{formatTime(item.releaseTime)}}</div>
            </div>  
        </div>
    </div>
</template>
<script>
import { getNotices } from "@/api/dust/supervise";
export default {
    data() {
        return {
          infoControlShowDatas: [],
          infoControlDatas:[],
          timer:null,
          infoControllTimerRun: true,
          infoControllIndex: 0,
        }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },    
    mounted() {
      this.init() 	
      // this.timer = setInterval(this.infoControllTimer, 2000);	
    },
    methods: {
		formatTime(str){	      	  
	       	  if(str){
	       	  	 let arr=str.split(' ')
	       	  	 return arr[0].replace(/-/g,"/")
	       	  }
		},
	    pauseTimer:function(){
	        this.infoControllTimerRun = false
	    },
	    restartTimer:function(){
	        this.infoControllTimerRun = true
	    },       
	    infoControllTimer: function() {
	        if (this.infoControllTimerRun == true) {
	          let total = this.infoControlDatas.length;
	          if (this.infoControllIndex == total) {
	            this.infoControllIndex = 0;
	          }	          
	          let temp = Object.assign(this.infoControlShowDatas, []);
	          temp.push(this.infoControlDatas[this.infoControllIndex]);
	          if (temp.length > 7) {
	            temp.shift();
	          }	          
	          this.infoControlShowDatas = temp;
	          ++this.infoControllIndex;	

	        }
	    },       
        init(){
	        getNotices().then(res => { 
	           if(res.data.data.length>7){
	           	 this.infoControlDatas=res.data.data
	           	 this.timer = setInterval(this.infoControllTimer, 2000);	
	           }else{
	           	 this.infoControlShowDatas=res.data.data
	           }	           		           
	        })    
        }
    }
}
</script>
<style lang="scss" scoped>

.wrapper {
	color: #f8f8f8;
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
.section{display: flex;align-items: center;margin-bottom: 10px;
  .img{}
  .content{width: 70%;padding-right: 10%;padding-left: 5%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
  .time{flex: 1;}
}
</style>