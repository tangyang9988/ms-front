<template>
    <div class="wrapper">    	
        <div class="header">实时环境指数</div>     
        <div style="background: #1e2539;flex: 1;overflow-y:hidden;position: relative;">
	        
	          <div class="section">
	            <div class="body_wrap">
	              <div class="env-item">PM2.5</div>
	              <div class="env-val"><font style="font-size:30px">{{PM25}}</font>  {{PM25Unit}}</div>
	            </div>
	            <div class="body_wrap">
	              <div class="env-item">PM10</div>
	              <div class="env-val"><font style="font-size:30px">{{PM10}}</font>  {{PM10Unit}}</div>
	            </div>
	            <div class="body_wrap">
	              <div class="env-item">TSP</div>
	              <div class="env-val"><font style="font-size:30px">{{TSP}}</font>  {{TSPUnit}}</div>
	            </div>
	            <div class="body_wrap">
	              <div class="env-item">噪音</div>
	              <div class="env-val"><font style="font-size:30px">{{Noise}}</font>  {{NoiseUnit}}</div>
	            </div>	            
	          </div>	

	         
       
        </div>        
    </div>
</template>

<script>
import { getData } from "@/api/dust/supervise";
export default {
    data() {
        return {
           PM25:'',
           PM10:'',
           TSP:'',
           Noise:'',
           PM25Unit:'',
           PM10Unit:'',
           TSPUnit:'',
           NoiseUnit:''
        }
    },
    mounted() {
       this.init()
    },
    methods: {
       init(){
        getData().then(res => { 
          this.TSP=res.data.data.length>0?res.data.data[2].value:0
          this.PM10=res.data.data.length>0?res.data.data[1].value:0
          this.PM25=res.data.data.length>0?res.data.data[0].value:0
          this.Noise=res.data.data.length>0?res.data.data[3].value:0
          this.TSPUnit=res.data.data.length>0?res.data.data[2].unit:''
          this.PM10Unit=res.data.data.length>0?res.data.data[1].unit:''
          this.PM25Unit=res.data.data.length>0?res.data.data[0].unit:''
          this.NoiseUnit=res.data.data.length>0?res.data.data[3].unit:''          
        });           
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
  .realtime-env-index>div {
    display: flex;
    height: 30%;
    width:100%
  }

  .realtime-env-index > div > div {
    height: 100%;
    width:40%;
    background-color: #262D42;
    margin-top: 3%;
    margin-left:6%;
    border-radius: 5px;
  }

  .env-item{
    width:100%;
    height:30%;
    padding: 3px 5px
  }

  .env-val{
  	padding-right: 5%;
  	text-align: right;
    margin-left:10%;
  }
  .section{display: flex;flex-wrap: wrap;padding: 20px;position: absolute;width: 100%;height: 100%;box-sizing: border-box;}
  .body_wrap{border:2px solid #2f3550;width: 46%;margin-right: 4%;}
  .body_wrap:nth-child(2n){margin-right: 0;}
  .body_wrap:nth-child(1){margin-bottom: 4%;}
  .body_wrap:nth-child(2){margin-bottom: 4%;}
</style>

