<template>		
    <el-row class="GIS-container" v-loading="loading">
        <baidu-map 
            ref="map" 
            class="map" 
            :center="center" 
            :zoom="zoom" 
            @zoomend="zoomEnd"
            :scroll-wheel-zoom="true" 
            :map-click="false" 
            @moveend="moveEnd"
            @ready="handler"
        >
            <div v-for="(item, index) in pointList">
	            <bm-marker 
	            	v-if="formatFactorList(item.factorList)&&item.factorList"
	                :key="index"
	                :icon="{url: '/img/bg/tuding3.png', size: {width: 30, height: 30}}"
	                :position="item.position" 
	                @mouseover="pointClick(item)"	
	            ></bm-marker>
	            <bm-marker 
	            	v-else-if="!formatFactorList(item.factorList)&&item.factorList"
	                :key="index"
	                :icon="{url: '/img/bg/tuding/icon6.png', size: {width: 30, height: 30}}"
	                :position="item.position" 
	                @mouseover="pointClick(item)"
	            ></bm-marker>	            
            </div>
            <!-- 信息窗体 -->
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
    </el-row>
</template>

<script>
import {getGISData} from "@/api/swaq/gis";

export default {
    
    data() {
        return {
            // 设置center和zoom之后地图才会进行渲染
            center: '', 
            zoom: '11', 
            pointList: [],          // 点位数组，用于渲染到地图
            infoData: {},           //  信息窗体数据
            infoShow: false,        // 信息窗体显隐
            currentPointId: null,   // 当前选择的点位
            dialogTitle: null,      // 弹框标题
            videoVisible: false,    // 弹框显隐
            loading: false,
        };
    },
    mounted() {
        // this.drawMap()
    },
    methods: {
    	handler(){
            this.loading = true
            this.getMapData().then(resData => {
                this.pointList = []
                resData.forEach(item => {
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
            console.log(point)
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
<style>
.anchorBL {
    display: none;
}
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
</style>
<style lang="scss" scoped>
.GIS-container {
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
</style>