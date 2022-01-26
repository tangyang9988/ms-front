<template>
  <el-row class="GIS-container" v-loading="loading">
    <!-- 图标 -->
    <div class="ele_1">
      <span>正常</span>
      <span>超标</span>
      <span>离线</span>
    </div>
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
      <div v-for="(item, index) in pointList" :key="index">
        <bm-marker
          v-if="item.devices && item.status === '1'"
          :key="index"
          :icon="{
            url: '/img/bg/normalMap.png',
            size: { width: 30, height: 30 }
          }"
          :position="item.position"
          @mouseover="pointClick(item)"
        ></bm-marker>
        <bm-marker
          v-else-if="item.devices && item.status === '2'"
          :key="index"
          :icon="{
            url: '/img/bg/abnormalMap.png',
            size: { width: 30, height: 30 }
          }"
          :position="item.position"
          @mouseover="pointClick(item)"
        ></bm-marker>
        <bm-marker
          v-else-if="item.devices && item.status === '3'"
          :key="index"
          :icon="{
            url: '/img/bg/offlineMap.png',
            size: { width: 30, height: 30 }
          }"
          :position="item.position"
          @mouseover="pointClick(item)"
        ></bm-marker>
      </div>
      <bm-info-window
        :position="infoData.position"
        :title="infoData.deptName"
        :show="infoShow"
        :offset="{ width: 0, height: -20 }"
        :closeOnClick="false"
        style="max-height:300px;overflow-y: auto;"
        @clickclose="withInfoClose"
      >
        <div class="info_item">
          <div class="info_label">所属地区：</div>
          <div class="info_value">
            <span>{{ infoData.regionName }}</span>
          </div>
        </div>
        <div v-for="(device, dIndex) in infoData.devices" :key="dIndex">
          <div
            class="info_item"
            @click="toHistory(device)"
            style="cursor: pointer;"
            v-if="device.factorList"
          >
            <div
              class="info_value"
              :style="device.factorList.length > 2 ? 'width:540px' : 'width:360px'"
            >
              <p class="device_title">机组： {{device.groupName}}</p>
              <span
                v-for="(item, index) in device.factorList"
                :key="index"
                style="display:block;line-height:26px;"
              >
                <span v-if="item.alias !== '风机' && item.alias !== '净化器'">
                  <span v-if="item.isAbnormal > 0" style="color: #FF0000;"
                    >{{ item.alias }} : {{ item.collectValue || "-" }}
                    {{ item.collectValue ? item.unit : "" }}</span
                  >
                  <span v-else
                    >{{ item.alias }} : {{ item.collectValue || "-" }}
                    {{ item.collectValue ? item.unit : "" }}</span
                  >
                </span>
                <span v-else>
                  {{ item.alias }} : 
                  <img class="motion_state_img" v-if="item.collectValue" alt="" :src="getMotionSrc(item.collectValue)"/>
                  <span v-else>-</span>
                </span>
              </span>
            </div>
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
        <video
          class="dialog-video"
          ref="dialogVideo"
          src=""
          controls="controls"
        ></video>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { getData } from "@/api/loam/index";
import { getSystemConfig} from "@/api/ficm/systemName";
export default {
  data() {
    return {
      // 设置center和zoom之后地图才会进行渲染
      center: "",
      zoom: 0,
      pointList: [], // 点位数组，用于渲染到地图
      pointListObj: {}, // 点位对象（按照企业格式化）
      infoData: {}, //  信息窗体数据
      infoShow: false, // 信息窗体显隐
      currentPointId: null, // 当前选择的点位
      dialogTitle: null, // 弹框标题
      videoVisible: false, // 弹框显隐
      loading: false
    };
  },
  methods: {
    // 地图ready事件
    handler() {
      this.loading = true;
			getSystemConfig().then(res=>{
				if(res.data.data.zoomLevel){
					this.zoom=res.data.data.zoomLevel
				}else{
					this.zoom=11
				}
			})	      
      this.getMapData()
        .then(resData => {
          this.pointList = [];
          this.pointListObj = {};
          resData.gisVOList.forEach(item => {
            if(this.pointListObj[item.deptInfoId] === undefined) {
              this.pointListObj[item.deptInfoId] = {
                deptInfoId: item.deptInfoId,
                deptName: item.deptName,
                regionCode: item.regionCode,
                regionName: item.regionName,
                position: {
                  lng: item.logitude,
                  lat: item.latitude
                },
                devices: [],
                status: ""
              };
            }
            this.pointListObj[item.deptInfoId].devices.push({
              collectTime: item.collectTime,
              deviceName: item.deviceName,
              factorList: item.factorList,
              groupId: item.groupId,
              groupName: item.groupName,
              mn: item.mn,
              siteId: item.siteId,
              siteName: item.siteName,
              state: item.state,
              status: item.status
            });
          });

          for(var deptInfoId in this.pointListObj) {
            // 该企业下所有设备的状态集合
            var deptStatusArr = [];
            this.pointListObj[deptInfoId].devices.forEach(device => {
              if(deptStatusArr.indexOf(device.status) < 0) {
                deptStatusArr.push(device.status);
              }
            });

            // 该企业的实际状态（只要有一个超标，就算超标， 全部离线才算离线）
            if (deptStatusArr.length === 1) {
              this.pointListObj[deptInfoId].status = deptStatusArr[0];
            } else {
              if (deptStatusArr.indexOf("2") >= 0) this.pointListObj[deptInfoId].status = "2";
              else this.pointListObj[deptInfoId].status = "1";
            }

            this.pointList.push(this.pointListObj[deptInfoId]);
          }

          this.loading = false;
          this.currentPointId = this.pointList[0].deptInfoId;
          this.focusPoint();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    
    // 获取当前缩放比
    zoomEnd({ target }) {
      this.zoom = target.getZoom();
    },
    
    // 地图拖拽结束后触发，重新定位中心点，解决同一个点位在拖拽后无法再次定位的问题
    moveEnd({ target }) {
      this.center = target.getCenter();
    },

    // 跳转至综合（历史）数据页面
    toHistory(device) {
      this.$store.commit("SET_GISID", {
        value: device.groupId
      });
      this.$router.push({
        path: "/loam/history/historydata"
      });
    },

    // 聚焦到选择的点位
    focusPoint() {
      let status = false;
      if (this.currentPointId) {
        this.pointList.forEach(item => {
          if (item.deptInfoId == this.currentPointId) {
            this.center = item.position;
            status = true;
          }
        });
        if (!status) {
          this.center = "无锡";
        }
      }
    },
    
    // 请求地图数据
    getMapData() {
      return new Promise((resolve, reject) => {
        getData().then(res => {
          if (res.data.success) {
            resolve(res.data.data);
          } else {
            reject("网络拥堵，请退出重试");
          }
        });
      });
    },
    
    // 显示监控
    showVideo(point) {
      this.dialogTitle = point.siteName;
      this.videoVisible = true;
    },
    
    // 点击信息窗口关闭按钮时触发，把控制信息窗口显隐的变量置为false
    withInfoClose() {
      this.infoShow = false;
    },
    
    // 点击点位触发，展示信息窗口
    pointClick(point) {
      this.infoData = point;
      this.infoShow = true;
    },

    // 根据0/1返回风机、净化器运行状态图表
    getMotionSrc(value) {
      var imgSrc = "";
      if (value === "1") imgSrc = "/img/bg/normal.png";
      else if (value === "0") imgSrc = "/img/bg/offline.png";
      return imgSrc;
    }
  }
};
</script>

<style>
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
  .ele_1 {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 99;
    background: rgba($color: #fff, $alpha: 0.9);
    padding: 5px 0;
    span {
      display: block;
      border-radius: 5px;
      color: #fff;
      text-align: center;
      font-size: 13px;
      line-height: 20px;
      width: 40px;
      margin: 5px 10px;
    }
    span:first-child {
      background: #009e00;
    }
    span:nth-child(2) {
      background: #ff0000;
    }
    span:nth-child(3) {
      background: #5c5c5c;
    }
  }
  .device_title{
    font-weight: bold;
  }
  .motion_state_img{
    width: 15px;
    height: 15px;
    margin-bottom: -3px;
  }
}
</style>
