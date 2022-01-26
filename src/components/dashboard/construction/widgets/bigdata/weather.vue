<template>
    <div class="wrapper">    	
        <div class="header">实时天气</div>
	    <div class="container_body" style="background: #1e2539;flex: 1;">
             <div class="section1">
             	<div class="info">
             		<div class="timer">
             			<span class="timer1">{{timerInfo.day}}</span>
             			<span class="timer2">{{timerInfo.week}}</span>
             			<span class="timer3">{{timerInfo.hsm}}</span>             			
             		</div>
             		<div class="wendu">
             			<span class="wendu_info1">{{weather.temperature}}</span>
             			<span class="wendu_info2">{{weather.rainShine}}</span>
             		</div>
             		<div class="other">
             			<span class="other1">{{weather.windDirection}} {{weather.wind}}</span>
             			<span class="other2">最{{weather.low}}</span>
             			<span class="other3">最{{weather.high}}</span>
             		</div>
             	</div>
             	<div class="img">
             		<img :src="weather.img" alt="" />
             	</div>
             </div>
             <div class="section2">
             	<div class="wrap" v-for="(item,index) in futureWeather" :key="index">
             		<div class="day">             			
             			<span v-if="index==0">明天</span> 
             			<span v-else-if="index==1">后天</span> 
             			<span v-else>大后天</span> 
             			{{item.day}}
             		</div>
             		<div class="info">
             			<div style="margin-right: 10px;">
             				<div>{{item.type}}</div>
             				<div>{{item.wendu}}</div>
             			</div>
             			<div class="img"><img :src="item.img" alt="" /></div>
             		</div>
             	</div>  
             		
             </div>
	    </div>       
    </div>
</template>

<script>
import { getWeatherMini } from "@/api/dust/supervise";
import { dateFormat } from "@/util/date";
export default {
    data() {
        return {
          timer1:{},  // 定时器管理变量
          timerInfo:{hsm:'',day:'',week:''},   // 储存时间用
          weather: {},
          weatherPic: "/img/bg/sunny.png",
          date: {},  
          futureWeather:[],
        }
    },
    mounted() {
      this.getWeather(); 
      let that=this
      that.initDate()
      this.timer1=setInterval(function(){
      	that.initDate()
      },1000)
    },
    beforeDestroy() {
        clearInterval(this.timer1)       
        this.timer = null
    },    
    methods: {
      // 转移天气类型图片	
      formatType(type){
      	let str=''
      	if(type.indexOf('阴')>=0){
      		str='/img/bg/weather/yin.png'
      	}else if(type.indexOf('晴转多云')>=0){
      		str='/img/bg/weather/qingzhuanduoyun.png'
      	}else if(type.indexOf('晴')>=0){
      		str='/img/bg/weather/qing.png'
      	}else if(type.indexOf('云')>=0){
      		str='/img/bg/weather/yun.png'
      	}else if(type.indexOf('雨')>=0){
      		str='/img/bg/weather/yu.png'
      	}else if(type.indexOf('雪')>=0){
      		str='/img/bg/weather/xue.png'
      	}else if(type.indexOf('冰')>=0){
      		str='/img/bg/weather/bingbao.png'
      	}else if(type.indexOf('雾')>=0){
      		str='/img/bg/weather/wumai.png'
      	}else if(type.indexOf('雷')>=0){
      		str='/img/bg/weather/shandian.png'
      	}else if(type.indexOf('沙')>=0){
      		str='/img/bg/weather/shachen.png'
      	}
     	return str
      },
      initDate(){
      	let day=dateFormat(new Date())
      	let arr=day.split(' ')
      	this.timerInfo.hsm=arr[1]
      	this.timerInfo.day=arr[0].replace(/-/g,"/")
		var l = ["日","一","二","三","四","五","六"];
		var d = new Date().getDay();
		this.timerInfo.week = "星期" + l[d]; 		
      },
      getWeather: function() {
        let that = this;
        getWeatherMini("无锡").then(res => { 
          that.realtimeWeather(res.data.data);
        });
      },
      realtimeWeather: function(params) {
        let weather = params.data.forecast[0];
        this.weather.temperature = params.data.wendu + "℃";
        this.weather.rainShine = weather.type;
        this.weather.windDirection = weather.fengxiang;
        this.weather.wind = weather.fengli.replace("<![CDATA[", "").replace("]]>", "");
        this.weather.high = weather.high;
        this.weather.low = weather.low;
        this.weather.img = this.formatType(weather.type);

        
        let now = new Date();
        var day = now.getDay(),
          weeks = new Array(
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
          );
        this.date.day =now.getFullYear() +"/" +((now.getMonth()+1) < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1)) +"/" +(now.getDate() < 10 ? "0" + now.getDate() : now.getDate());
        this.date.week = weeks[day];
        this.futureWeather = [];
        let currentDay = now.getDate();
        
        
        for(var i =1 ;i<4;i++){
          let forecast =  params.data.forecast[i];
          var day = forecast.date.split("日星期")[0];
          var month = now.getMonth();
          month = month+1;
          let wendu = forecast.low.replace("低温","").replace("℃","")+"-"+forecast.high.replace("高温","");
          let img=this.formatType(forecast.type)
          this.futureWeather.push({day:month+'/'+day,type:forecast.type,wendu:wendu,img:img})
        }
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
.container_body{flex: 1;color: #f8f8f8;padding:10px 10px 10px 30px;
    overflow-y:hidden;
    .section1{display: flex;align-items: center;
       .info{flex: 1;
         .timer1{margin-right: 10px;}
         .timer2{margin-right: 10px;}
       }
       .wendu{
       	 display: flex;margin: 10px 0;
       	 .wendu_info1{font-size: 40px;margin-right: 10px;}
       	 .wendu_info2{font-size: 14px;}
       }
       .other{
       	 font-size: 14px;
       	 .other1{margin-right: 10px;}
       	 .other2{margin-right: 10px;}
       	 .other3{}
       }
       .img{width: 100px;padding-right: 20px;img{width: 100%;height: 100%;}}
    }
    .section2{display: flex;margin-top: 20px;
      .day{margin-bottom: 10px;color: #628dfc;}
      .wrap{flex: 1;display: flex;justify-content: center;flex-direction: column;}
      .info{display: flex;align-items: center;font-size: 14px;}
      .img{width: 40px;height: 40px;img{width: 100%;height: 100%;}}
    }
}
</style>


