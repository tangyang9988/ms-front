<template>
    <div class="wrapper">    	
        <div class="header">考勤统计</div>
        <div style="padding:10px;background: #1e2539;flex: 1;overflow-y:hidden ;">
              <div class="chuqing">
                <div style="height:15px">出勤人数</div>
                <div class="chuqin-container">
                  <div style="height:100%;width:91%;background-color:#597EF7; border-radius: 2px;"></div>
                </div>
                <div>58</div>
              </div>
              <div class="chuqing">
                <div>缺勤人数</div>
                <div class="chuqin-container">
                  <div
                    style="height:100%;width:13%;background-color:#adc6ff; border-radius: 2px;"
                  ></div>
                </div>
                <div>3</div>
              </div>

              <div class="chuqing">
                <div>迟到人数</div>
                <div class="chuqin-container">
                  <div
                    style="height:100%;width:8%;background-color:#597EF7; border-radius:2px;"
                  ></div>
                </div>
                <div>8</div>
              </div>

              <div class="chuqing">
                <div>早退人数</div>
                <div class="chuqin-container">
                  <div
                    style="height:100%;width:14%;background-color:#adc6ff; border-radius:2px;"
                  ></div>
                </div>
                <div>4</div>
              </div>
           
        </div>
    </div>
</template>

<script>
import { getAttendanceStatistics } from "@/api/dust/supervise";
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.getData()
    },
    methods: {
    	getData(){
	        getAttendanceStatistics().then(res => { 
	
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
  .chuqing {
    display: flex;
    justify-content: space-around;
    width: 80%;
    margin-left: 7%;
    margin-top: 20px;
  }

  .chuqin-container {
    margin-left: 20px;
    width: 70%;
    height: 15px;
    background-color: #343c5d;
    border-radius: 5px;
  }
</style>