<template>
  <div class="reaizewrap">
    <div class="reaize_box" ref="box" id="reaize_box">
      <div class="left" ref="left" id="left">
        <div class="leftTreeWrap box treeBox">
          <lcTree deviceType="1" @ready="ready"></lcTree>
        </div>
      </div>
      <div class="resize" ref="resize" id="resize">
        <img src="/img/show.png" alt="" class="resize_img" />
      </div>

      <div class="right table-wrapper" ref="right" id="right">
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="data"
          ref="crud"
          v-model="form"
          :permission="permissionList"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          :before-open="beforeOpen"
          :page.sync="page"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot="menuLeft">
            <el-button
              type="danger"
              size="small"
              plain
              icon="el-icon-delete"
              v-if="permission.vehiclemanage_delete"
              @click="handleDelete"
              >删 除
            </el-button>
          </template>
          <!-- 地图表单自定义 -->
          <template slot="deptMapForm">
            <div>
              <baidu-map
                class="map"
                :center="center"
                :zoom="zoom"
                @ready="handler"
              >
                <el-input
                  placeholder="关键词查询"
                  v-model="searchWord"
                  style="
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 180px;
                  "
                >
                  <template slot="append">
                    <el-button
                      icon="el-icon-search"
                      id="citySearch"
                    ></el-button>
                  </template>
                </el-input>
                <el-button v-if="this.dialogType != 'view'" size="mini" type="primary" style="
                    position: absolute;
                    top: 12px;
                    left: 200px;" @click="clear()">清空轨迹</el-button>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <!-- <bm-marker :position="mapPosition" :dragging="true"></bm-marker> -->
              </baidu-map>
            </div>
          </template>
        </avue-crud>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getDeptLazyTree,
  submit,
  remove,
} from "@/api/archives/roadinfo";
import lcTree from "@/components/common/tree.vue";
import BMap from 'vue-baidu-map'
import { mapGetters } from "vuex";
export default {
  components: {
    lcTree,
  },
  data() {
    return {
      map:"",
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: this.$pageSize, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      nodeId: "",
      deptInfoName: "",
      deptInfoId: "",
      dragging: false,
      center: {
        lng: 121.447254,
        lat: 31.32362,
      },
      mapPosition: {
        lng: 121.447254,
        lat: 31.32362,
      },
      zoom: 10,
      searchWord: "",
      dialogType: "",
      option: {
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        labelWidth: 100,
        columnBtn: false, //控制表格列显隐按钮不需要；
        column: [
          {
            label: "企业名称",
            prop: "deptName",
            align: "center",
            display: false,
          },
          {
							label: "行政区域",
							prop: "regionCode",
							align: "center",
							type: "tree",
							hide: true,
							dicUrl: "/api/ms-ficm/deptinfo/getReginTree",
							props: {
								label: "title"
							},
							rules: [{
								required: true,
								message: "请选择行政区域",
								trigger: "change"
							}]
						},
          {
            label: "所属区域",
            prop: "roadRegionName",
            align: "center",
            display: false,
          },
          {
            label: "道路名称",
            prop: "roadName",
            align: "center",
            rules: [
              {
                required: true,
                message: "请输入道路名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "道路起点",
            prop: "roadStart",
            align: "center",
            rules: [
              {
                required: false,
                message: "请输入道路起点",
                trigger: "blur",
              },
            ],
          },
          {
            label: "道路终点",
            prop: "roadEnd",
            align: "center",
            rules: [
              {
                required: false,
                message: "请输入道路终点",
                trigger: "blur",
              },
            ],
          },
          {
            label: "负责人",
            prop: "respUserId",
            align: "center",
            rules: [
              {
                required: false,
                message: "请输入负责人",
                trigger: "blur",
              },
            ],
          },
          {
            label: "",
            prop: "deptMap",
            span: 24,
            hide: true,
            formslot: true,
          },
        ],
      },
      data: [],
      coordinates: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.vehiclemanage_add, false),
        viewBtn: this.vaildData(this.permission.vehiclemanage_view, false),
        delBtn: this.vaildData(this.permission.vehiclemanage_delete, false),
        editBtn: this.vaildData(this.permission.vehiclemanage_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    // 地图处理事件
    handler({ BMap, map }) {
      let _this = this;
      _this.map =map
      if (_this.dialogType == "edit" || _this.dialogType == "add") {
        map.clearOverlays();
        map.enableScrollWheelZoom(true);
        var coordinatesOrder =1;
        _this.$nextTick(() => {
          // 给坐标搜索按钮绑定点击事件
          document
            .getElementById("citySearch")
            .addEventListener("click", function () {
              let localSearch = new BMap.LocalSearch(map);
              localSearch.setSearchCompleteCallback((searchResult) => {
                let poi = searchResult.getPoi(0);
                if (!poi) {
                  return _this.$message.warning("该地址不存在");
                } else {
                  _this.center = {
                    lng: poi.point.lng,
                    lat: poi.point.lat,
                  };
                  _this.form.jd = poi.point.lng;
                  _this.form.wd = poi.point.lat;
                }
              });
              localSearch.search(_this.searchWord);
            });
        });
        // 添加marker点
        map.addEventListener("click", function (e) {
          _this.form.jd = e.point.lng;
          _this.form.wd = e.point.lat;
           var myP1 = new BMap.Point(e.point.lng,e.point.lat);
          var opts = {
            position : myP1,                    // 指定文本标注所在的地理位置
            offset   : new BMap.Size(10, -30)    //设置文本偏移量
          }
           var m1 = new BMap.Marker(myP1);
           map.addOverlay(m1);
           var label = new BMap.Label("删除", opts);
           map.addOverlay(label);
          label.addEventListener("click", function () { console.log("删除此点") });
          _this.coordinates.push({
            lng: e.point.lng,
            lat: e.point.lat,
            coordinatesOrder: coordinatesOrder,
          });
          coordinatesOrder++;
        });
        var pointArr = _this.coordinates;
        var driving = new BMap.DrivingRoute(map);
        		// 生成坐标点
        var trackPoint = [];
        for (var i = 0, j = pointArr.length; i < j; i++) {
          trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
        }
        for (var i = 0; i < trackPoint.length; i++) {
            if(i != trackPoint.length -1 ){
              driving.search(trackPoint[i], trackPoint[i+1]);
              }
        }
        driving.setSearchCompleteCallback(function(){
            var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
            var polyline = new BMap.Polyline(pts,{ strokeColor:"red", strokeWeight: 5, strokeOpacity: 1 });
            map.addOverlay(polyline);
            setTimeout(function(){
                map.setViewport(trackPoint);//调整到最佳视野
            },1000);

        });
      } else if (_this.dialogType == "view") {
        map.enableScrollWheelZoom(false);
        var pointArr = _this.coordinates;
        var driving = new BMap.DrivingRoute(map);
        		// 生成坐标点
        var trackPoint = [];
        for (var i = 0, j = pointArr.length; i < j; i++) {
          trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
        }
        for (var i = 0; i < trackPoint.length; i++) {
            if(i != trackPoint.length -1 ){
              driving.search(trackPoint[i], trackPoint[i+1]);
              }
        }
        driving.setSearchCompleteCallback(function(){
            var pts = driving.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
            var polyline = new BMap.Polyline(pts,{ strokeColor:"red", strokeWeight: 5, strokeOpacity: 1 });
            map.addOverlay(polyline);
            setTimeout(function(){
                map.setViewport(trackPoint);//调整到最佳视野
            },1000);

        });
      }
    },
    /**
     * 树点击事件
     */
    clear(){
      this.map.clearOverlays();
      this.coordinates=[];
    },
    ready(data) {
      this.nodeId = data.key;
      this.deptInfoId = data.key;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    rowSave(row, done, loading) {
      row.deptInfoId = this.deptInfoId;
      row['coordinates'] = this.coordinates;
      submit(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      row.deptInfoId = this.deptInfoId;
      row.coordinates = this.coordinates;
      submit(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      this.dialogType = type;
      if (["add"].includes(type)) {
        if (this.treeDeptId == "") {
          this.$message({
            type: "warning",
            message: "请选择左侧树企业!",
          });
        }
        this.coordinates=[]
      }else if(type=="edit" || type=="view"){
        this.coordinates=this.form.coordinates
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query),
        this.deptInfoId
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 500px;
}
.reaizewrap {
  height: calc(100% - 60px);
  background: #f0f0f0;
  .reaize_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
  }
  .leftTreeWrap {
    height: 100%;
    margin-bottom: 0;
    padding: 15px;
    overflow: scroll;
  }
  .left {
    width: 16%;
    height: 100%;
    background: #fff;
    border-radius: 4px;
    ::-webkit-scrollbar {
      display: none;
    }
  }
  .resize {
    width: 5px;
    height: 100%;
    cursor: w-resize;
    position: relative;
    .resize_img {
      position: absolute;
      top: 50%;
      width: 19px;
      left: -10px;
      margin-top: -61px;
      z-index: 100;
    }
  }
  .right {
    padding: 15px 15px 0;
    flex: 1;
    height: 100%;
    background: #fff;
    overflow: scroll;
    border-radius: 4px;
  }
}

* {
  box-sizing: border-box;
}
</style>
