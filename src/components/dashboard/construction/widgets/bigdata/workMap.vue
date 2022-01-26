<template>
    <el-row class="GIS-container-big" v-loading="loading">
        <baidu-map 
            ref="map" 
            class="map" 
            :center="center" 
            :zoom="14" 
            @zoomend="zoomEnd"
            :scroll-wheel-zoom="true" 
            :map-click="false" 
            @moveend="moveEnd"
            :mapStyle="mapStyle"
            @ready="handler"
        >
            <div v-for="(item, index) in pointList">
	            <bm-marker 
	            	v-if="formatFactorList(item.factorList)&&item.factorList"
	                :key="index"
	                :icon="{url: '/img/bg/tuding3.png', size: {width: 30, height: 30}}"
	                :position="item.position" 
	                @mouseover="pointClick(item)"
	                @mouseout="infoShow = false"
	          
	            ></bm-marker>
	            <bm-marker 
	            	v-else-if="!formatFactorList(item.factorList)&&item.factorList"
	                :key="index"
	                :icon="{url: '/img/bg/tuding/icon6.png', size: {width: 30, height: 30}}"
	                :position="item.position" 
	                @mouseover="pointClick(item)"
	                @mouseout="infoShow = false"
	                
	            ></bm-marker>	            
            </div>
            <bm-info-window 
                :position="infoData.position" 
                :title="infoData.siteName+'-'+infoData.deviceName" 
                :show="infoShow" 
                :offset="{width: 0, height: -20}"
                :closeOnClick="false"
                @clickclose="withInfoClose"               
            >
                <!-- 设备状态 -->
                <div class="info_item">
                    <div class="info_label">设备状态：</div>
                    <div class="info_value">
                        <span>{{ infoData.state }}</span>
                    </div>
                </div>
                <!-- 因子 -->
                <div class="info_item" @click="toHistory" style="cursor: pointer;" v-if="infoData.factorList">
                    <div class="info_value" :style="infoData.factorList.length>2?'width:540px':'width:360px'">
						<span v-for="(item, index) in infoData.factorList" :key="index" style="display:inline-block;width:180px;line-height:26px;">
							<span v-if="item.isAbnormal>0" style="color: #FF0000;">{{ item.alias }} : {{ item.collectValue || '-' }} {{item.unit}}</span>
                            <span v-else>{{ item.alias }} : {{ item.collectValue || '-' }} {{item.unit}}</span>
						</span>
                    </div>
                </div>
            </bm-info-window>
        </baidu-map>
        <!-- 视频弹框 -->
        <el-dialog
            :visible.sync="videoVisible"
            :modal="false"
            :title="dialogTitle"
            width="65%"
        >
            <div class="dialog-content">
                <video class="dialog-video" ref="dialogVideo" src="" controls="controls"></video>
            </div>
        </el-dialog>
    
        <div class="fugaiwu">
          <div>工期剩余天数</div>
          <div class="shengyutianshu">
            <span>{{timer.date1}}</span>
            <span>{{timer.date2}}</span>
            <span>{{timer.date3}}</span>
          </div>
        </div>
        
        <div class="process">
        	<div style="text-align: center;">工期进度</div>
        	<div style="text-align: center;margin-top: 10px;">
        		 <el-progress type="circle"  :percentage="percentage" :width="70" :show-text="false"></el-progress>
        		 <div class="percentage">{{percentage}}%</div>
        	</div>
        </div>
            
    </el-row>
</template>

<script>
import {getGISData} from "@/api/swaq/gis";
import { getBuildingSiteCycle } from "@/api/dust/supervise";
export default {    
    data() {
        return {
            // 设置center和zoom之后地图才会进行渲染           
            center: null, 
            percentage:0,
            surplusDays:null,
            zoom: '11', 
            pointList: [],          // 点位数组，用于渲染到地图
            infoData: {},           //  信息窗体数据
            infoShow: false,        // 信息窗体显隐
            currentPointId: null,   // 当前选择的点位
            dialogTitle: null,      // 弹框标题
            videoVisible: false,    // 弹框显隐
            timer:{date1:0,date2:0,date3:0},// 日期百十个
            loading: false,
            // 自定义个性化地图
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#123549'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#000102'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'all',
                    'stylers': {
                        'color':'#0A1A29'
                    }
                },{
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#000000'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.stroke',
                    'stylers': {
                        'color': '#0b3d51'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#000000'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#000000'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'geometry.stroke',
                    'stylers': {
                        'color': '#08304b'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'geometry',
                    'stylers': {
                        'lightness': -70
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#000000'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#022338'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#062032'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#465b6c'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#022338'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'all',
                    'stylers': {
                    }
                },{
                    'featureType': 'all',
                    'elementType': 'labels.text.stroke',
                    'stylers': {
                        'color': '#000000',
                    }
                }, {
                    'featureType': 'all',
                    'elementType': 'labels.icon',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'all',
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': '#27AEA9',
                    }
                }]
            }
        };
    },
    mounted() {
        // this.drawMap()
        this.init()
    },
    methods: {
    	formatFactorList(arr){
    		let status=true
    		for(var i=0;i<arr.length;i++){
    			if(arr[i].isAbnormal>0){
    				status=false
    				break;
    			}
    		}
    		return status
    	},      	
        init(){        	
        	getBuildingSiteCycle().then(res=>{
                if(res.data.data.surplusDays==0){
                	this.percentage=100
                	this.timer={date1:0,date2:0,date3:0}
                }else{
                	this.percentage=res.data.data.pace
                	let a=res.data.data.surplusDays
                	this.timer.date1=Math.floor(a/100)
                	this.timer.date2=Math.floor(a%100/10)
                	this.timer.date3=Math.floor(a%10)
                }
        	})	              	
        },
        	
        /**
         * 获取当前缩放比
         */
        zoomEnd({target}) {
            this.zoom = target.getZoom()
        },
        /**
         * 地图拖拽结束后触发
         */
        moveEnd({target}) {
            // 重新定位中心点，解决同一个点位在拖拽后无法再次定位的问题
            this.center = target.getCenter()
        },
        /**
         * 跳转
         */
        toHistory() {
            this.$router.push({
                path: '/swaq/history/historydata',
                query: {
                    id: this.infoData.deptInfoId
                }
            })
        },
        handler(){
        	this.loading = true
            this.getMapData().then(resData => {
                this.pointList = []
                resData.forEach((item,index) => {
                    this.pointList.push({
                        siteId: item.siteId,
                        deptInfoId: item.deptInfoId,
                        siteName: item.siteName,
                        deviceName: item.deviceName,
                        position: {lng: item.logitude, lat: item.latitude},
                        state: item.state,
                        factorList: item.factorList,
                    })
                })
                this.loading = false
                this.currentPointId = this.pointList[0].siteId
                this.focusPoint()
            }).catch(() => {
                this.loading = false
            })         	
        },
        // 聚焦到选择的点位
        focusPoint() {
        	let status=false
            if(this.currentPointId) {
                this.pointList.forEach(item => {
                    if(item.siteId == this.currentPointId) {
                        this.center = item.position // 设置中心点
                        status=true
                    }
                })
                if(!status){
                	this.center='无锡'
                }
            }else {
                this.$message.info('请先选择点位')
            }
        },
        /**
         * 请求地图数据
         */
        getMapData() {
            return new Promise((resolve, reject) => {
                getGISData().then(res => {
                    if(res.data.success) {
                        resolve(res.data.data)
                    }else {
                        reject('网络拥堵，请退出重试')
                    }
                })
            })
        },
        /**
         * 显示监控
         */
        showVideo(point) {
            this.dialogTitle = point.siteName
            this.videoVisible = true
        },
        /**
         * 点击信息窗口关闭按钮时触发
         */
        withInfoClose() {
            // 把控制信息窗口显隐的变量置为false
            this.infoShow = false
        },
        /**
         * 点击点位触发
         */ 
        pointClick(point) {
            // 展示信息窗口
            this.infoData = point
            this.infoShow = true
        },
    }
}
</script>
<style lang="scss">
.anchorBL {
    display: none;
}
.GIS-container-big {
	color: #f8f8f8;
    .map > div:first-child{background-color:#000!important;}
    .BMap_pop div{background: #3E486D!important;border-color:#3E486D!important;color:#FFF}
    .BMap_pop div:nth-child(1) div {
        border-top-left-radius: 5px;
    }
    .BMap_pop div:nth-child(3) div{
        border-top-right-radius: 5px;
    }
    .BMap_pop div:nth-child(5) div {
        border-bottom-left-radius: 5px;
    }
    .BMap_pop div:nth-child(7) div{
        border-bottom-right-radius: 5px;
    }
    .BMap_pop div:nth-child(8){
        background:url('/img/bg/arrow.png') no-repeat !important;background-size: 100% 100%!important;
        img{display:none}
    }
}
</style>
<style lang="scss" scoped>
.GIS-container-big {
	overflow-y: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 !important;
    .map {
        height: 100%;
        .info_item {
            display: flex;
            font-size: 12px;
            margin: 5px 0;
            .state_online {
                color: #009e00;
            }
            .state_offline {
                color: #8a8a8a;
            }
        }
    }
    .dialog-video {
        width: 100%;
    }
    .overlay_top {
        position: absolute;
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        .count_wrapper {
            display: flex;
            .count_item {
                width: 20%;
                height: 100%;
                margin: 0 10px;
                .count_label {
                    font-size: 25px;
                    height: 40px;
                    text-align: center;
                }
                .count_value {
                    display: flex;
                    .number_cell {
                        margin: 0 5px;
                        padding: 2px 5px;
                        font-size: 35px;
                        border-radius: 5px;
                        background: rgba(170, 170, 170, 0.4);
                    }
                }
            }
        }
    }
}

  .percentage{position: absolute;color: #fff;left: 50%;top: 50%;width: 50px;font-weight: bold;
  height:50px;margin-left: -25px;text-align: center;margin-top: -5px;}
  .fugaiwu{
    position: absolute;
    top: 3%;
    left:3%;
    z-index: 500;
    width: 31%;
  }
  .process{
  	 position: absolute;
  	 top: 3%;
  	 left:18%;
  	 width: 100px;
  	 height: 120px;
  	 z-index: 500;
  }
  .shengyutianshu{
    width: 50%;
    display:inline-block;
  }
  .shengyutianshu>span{
    display: inline-block;
    width:23%;
    height:75px;
    line-height:75px;
    margin:5px 5%;
    text-align:center;
    background-color: #28324D;
    border-radius:3px;
    font-size: 23px;
  }
</style>