<template>
  <!-- <basic-container> -->
  <div :class="wzpath == '/wel/index' ? 'wz' : 'wz_bigScreen'">
    <!-- <div class="wz-left">
			<el-button @click="showBZMarkerLabel = !showBZMarkerLabel">隐藏名字</el-button>
			<el-button @click="zbwr">周边污染</el-button>
			<el-button @click="bgxs">表格显示</el-button>
		</div> -->
    <!-- 左侧菜单 start -->
    <div class="wz-left">
      <div
        v-for="item in leftMenus"
        :key="item.id"
        :class="item.id == activeMenu ? 'active' : ''"
        class="wz-left-menu">
        <div class="menu-icon">
          <img :src="item.id == activeMenu ? item.selIcon : item.icon" :class="isDataLoading?'disactive':''" @click="menuClick(item.id)"/>
        </div>
        <div class="menu-title">{{ item.title }}</div>
      </div>
    </div>
    <!-- 左侧菜单 end -->
    <!-- 右侧地图 start -->
    <div class="wz-right">
      <div id="map" :class="tabbac=='深色'?'wz-mapBacground_dark':'wz-mapBacground_light'"></div>
      <div v-show="!showBz" class="bz bz-hide">
        <span class="bz-hide-btn" @click="showBz = true">&lt;&lt;</span>
      </div>
      <!-- 标站点击详情 -->
      <!-- <transition name="slide">
        <div v-show="showBzDetail" class="bz bz-chart">
          <img
            @click="showBzDetail = false"
            style="width: 100%; height: 100%"
            :src="bzImageSource"
          />
        </div>
      </transition> -->
      <!-- 标站图标点击弹框 -->
      <transition name="slide">
        <div v-if="showBzPoint" class="bz-click">
          <div class="bz-point-detail">
            <div class="close-bz" @click="closeBzDetail"></div>
            <div class="layer-title">
              <i class="el-icon-arrow-right left-first"></i>
              <i class="el-icon-arrow-right"></i>
              <span>{{bzPoint.stationname}}</span>
              <i class="el-icon-arrow-left"></i>
              <i class="el-icon-arrow-left right-second"></i>
            </div>
            <div class="bz-point-content">
              <div style="margin-left:12px;margin-bottom:5px;"><el-form
        class="dark"
        size="mini"
        :show-message="false"
        inline
        label-width="45px"
      >
        <el-form-item label="时间:">
          <!-- 实时 -->
          <div v-if="timeType == 10" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="bzPoint.time"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
              :popper-append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 小时 -->
          <div v-if="timeType == 1" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
              :popper-append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 日 -->
          <div v-if="timeType == 2">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="date"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="time"
              placeholder="选择日期"
              :clearable="false"
              :popper-append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 周 -->
          <div v-if="timeType == 3">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="week"
              class="wd-190"
              popper-class="dark"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择周"
              :clearable="false"
              :popper-append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 月 -->
          <div v-if="timeType == 4">
            <el-date-picker
              v-model="searchData.dateTime"
              disabled
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择月份"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 旬 -->
          <div v-if="timeType == 11 || timeType == 12 || timeType == 13">
            <el-date-picker
              v-model="searchData.dateTime"
              disabled
              time-arrow-control=""
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form></div>
            <div>
              <span class="bz-item-name" style="margin-left:15px;">经度：{{bzPoint.longitude}}</span>
              <span class="bz-item-name" style="margin-left: 70px;">纬度：{{bzPoint.latitude}}</span>
            </div>
              <div class="bz-point-item" v-for="item in bzData" :key="item.name">
                <div><span class="bz-item-name">{{item.name}}:</span><span class="bz-item-value" :style="{background:getItemColor(item.name,item.value)}">{{item.value}}{{item.unit}}</span></div>
              </div>
            </div>
            <div id="bz-point-line"></div>
          </div>
        </div>
      </transition>
      <!-- 走航数据点击详情 -->
      <transition name="slide">
        <div v-show="showDotChart" class="dot-chart">
          <img
            @click="showDotChart = false"
            style="width: 100%; height: 100%"
            :src="wzImageSource"
          />
        </div>
      </transition>
      <!-- 走航数据微站点点击详情 -->
      <transition name="slide">
        <div v-show="showSitePoint" class="dot-chart">
          <div class="site-detail" style="width: 100%; height: 100%">
            <div class="close-site-point" @click="closeMobileWzDetail"></div>
            <div class="layer-title">
              <i class="el-icon-arrow-right left-first"></i>
              <i class="el-icon-arrow-right"></i>
              <span>站点详情</span>
              <i class="el-icon-arrow-left"></i>
              <i class="el-icon-arrow-left right-second"></i>
            </div>
            <div class="site-content">
              <div class="time"><el-form
        class="dark"
        size="mini"
        :show-message="false"
        inline
        label-width="62px"
      >
        <el-form-item label="时间:">
          <!-- 实时 -->
          <div v-if="timeType == 10" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="sitePoint.collTime"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="暂无时间"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 小时 -->
          <div v-if="timeType == 1" style="z-index:11;">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="datetime"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 日 -->
          <div v-if="timeType == 2">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="date"
              class="wd-190"
              popper-class="dark"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="time"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 周 -->
          <div v-if="timeType == 3">
            <el-date-picker
              disabled
              v-model="searchData.dateTime"
              type="week"
              class="wd-190"
              popper-class="dark"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择周"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 月 -->
          <div v-if="timeType == 4">
            <el-date-picker
              v-model="searchData.dateTime"
              disabled
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择月份"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 旬 -->
          <div v-if="timeType == 11 || timeType == 12 || timeType == 13">
            <el-date-picker
              v-model="searchData.dateTime"
              disabled
              time-arrow-control=""
              type="month"
              class="wd-190"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form></div>
              <p class="site-content-1">PM10: <span class="pm10" :style="{background:getItemColor('PM10',sitePoint.pm10)}">{{sitePoint.pm10!=''?Math.round(sitePoint.pm10*100)/100:'--'}}(ug/m3)</span>PM2.5: <span class="pm2_5" :style="{background:getItemColor('PM2.5',sitePoint.pm25)}">{{sitePoint.pm25!=''?Math.round(sitePoint.pm25*100)/100:'--'}}(ug/m3)</span></p>
              <p class="site-content-1">TVOC: <span class="pm10" :style="{background:getItemColor('TVOC',sitePoint.tvoc)}">{{sitePoint.tvoc!=''?Math.round(sitePoint.tvoc*100)/100:'--'}}(ug/m3)</span></p>
              <p class="site-content-2"><span>经纬度：</span><span class="location">{{sitePoint.logitude}} , {{sitePoint.latitude}}</span></p>
            </div>
            <div class="site-radio">
              <el-radio-group size="mini" v-model="pmChange">
                <el-radio-button label="PM2.5"></el-radio-button>
                <el-radio-button label="PM10"></el-radio-button>
                <el-radio-button label="TVOC"></el-radio-button>
              </el-radio-group>
            </div>
            <div v-show="pmChange == 'PM10'" id="zouhang-charts-pm10"></div>
            <div v-show="pmChange == 'PM2.5'" id="zouhang-charts-pm25"></div>
            <div v-show="pmChange == 'TVOC'" id="zouhang-charts-tvoc"></div>
          </div>
        </div>
      </transition>
      <!-- 污染排名表格 -->
      <transition name="slide-left">
        <div v-if="showWRPMTable" class="bg-chart">
          <!-- <div class="sort-pm">
            <span class="pm-title">{{pollutionRankDesc?'污染排名':'清洁排名'}}</span>
            <el-form
              class="dark"
              size="mini"
              :show-message="false"
              inline
            >
            <el-form-item label="">
              <el-select
                class="wd-100"
                v-model="pollutionRankDesc"
                :popper-append-to-body="false"
                placeholder="请选择"
                @change="getPollutionRank"
              >
                <el-option
                  v-for="item in sortPm"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            </el-form>
          </div>
          <div class="wrpm"> -->
           <!-- <i class="el-icon-d-caret sort" @click="wrpmSort"></i> -->
           <!-- <div class="close-wrpm" @click="bzCheckMenus[2].isCheck = false;yuntuCheckMenus[2].isCheck = false;showWRPMTable = false;"></div>
           <div class="wrpm-content">
             <basic-container>
              <avue-crud
              :data="rankdata"
              :option="bzoption"
              :page.sync="bzPage"
              @current-change="currentChange"
            > -->
              <!-- 重定义因子名称 -->
              <!-- <template slot="alias" slot-scope="scope">
              <span v-if="scope.row.alias=='a34004'">PM2.5</span>
              <span v-if="scope.row.alias=='a34002'">PM10</span>
              <span v-if="scope.row.alias=='a21026'">SO2</span>
              <span v-if="scope.row.alias=='a21004'">NO2</span>
              <span v-if="scope.row.alias=='a21005'">CO</span>
              <span v-if="scope.row.alias=='a05024'">O3</span>
              <span v-if="scope.row.alias=='AQI'">AQI</span>
              </template>
            </avue-crud>
            <div class="diypage">
                <el-pagination
                background
                small
                :hide-on-single-page="false"
                :pager-count="5"
                layout="total, prev, pager, next"
                :current-page="bzPage.currentPage"
                :page-size="bzPage.pageSize"
                :total="bzPage.total"
                @current-change="currentChange">
              </el-pagination>
              </div>
             </basic-container>
           </div>
          </div> -->
          <wrpmTable ref="wrpmTable" :distance="bzAroundArea" :timeType="timeType" :searchData="searchData" :stationFacType="stationFacType" @closeWrpm="bzCheckMenus[2].isCheck = false;yuntuCheckMenus[2].isCheck = false;showWRPMTable = false;" @bzRowClick="bzRowClick"></wrpmTable>
        </div>
      </transition>
      <!-- 微站报警 -->
      <transition name="slide-left">
        <div class="baojing-chart" v-show="showBaojing">
          <!-- <div class="wrpm">
            <div class="close-wrpm" @click="wzCheckMenus[2].isCheck = false;yuntuCheckMenus[5].isCheck = false;showBaojing = false"></div>
            <div class="wrpm-content">
              <basic-container>
                <avue-crud
                  :data="data"
                  :option="option"
                  :page.sync="page"
                  @on-load="onLoad"
                  @search-change="searchChange"
                  @current-change="wzbjcurrentChange"
                >
                <template slot="menuLeft">
                  <div style="margin:20px 0px 40px 10px">
                    <sapn style="color:#fff;font-size:13px !important;">设备号：</sapn>
                    <el-input size="mini" v-model="mn" placeholder="请输入设备号" style="width:150px;margin-right:10px;">
                    </el-input>
                    <sapn style="color:#fff;font-size:13px !important;">时间：</sapn>
                    <div class="baojing-time"><el-date-picker size="mini" v-model="alertTime"   type="date" popper-class="dark" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :clearable="false"></el-date-picker></div>
                    <el-button size="mini" type="primary" style="width:60px;box-sizing:border-box;" @click="onLoad()">查询
                    </el-button>
                    <el-tag size="mini" type="success" @click.native="weiAlertClick()" style="cursor:pointer;">详情
                    </el-tag>
                  </div>
                </template>
                </avue-crud>
                <div class="diypage">
                <el-pagination
                background
                small
                :hide-on-single-page="false"
                :pager-count="5"
                layout="total, prev, pager, next"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                :total="page.total"
                @current-change="wzbjcurrentChange">
              </el-pagination>
              </div>
              </basic-container>
            </div>
          </div> -->
          <!-- <div>
            <el-button>收缩</el-button>
          </div> -->
          <bjTable type="wzbj" :factorCode="activeMenu=='menu-wz'?wepmType:yunFacType" @closeWzbj="wzCheckMenus[2].isCheck = false;yuntuCheckMenus[5].isCheck = false;showBaojing = false"></bjTable>
        </div>
      </transition>
      <!-- 移动微站 -->
      <transition name="slide-left">
        <div v-show="showwrbj" class="baojing-chart">
          <!-- <div class="wrpm">
           <div class="close-wrpm" @click="ydwzCheckMenus[2].isCheck = false;yuntuCheckMenus[8].isCheck = false;showwrbj = false"></div>
           <div class="wrpm-content">
             <basic-container>
            <avue-crud
              :data="wrbjdata"
              :option="option"
              :page.sync="pageWrbj"
              @on-load="wrbjLoad"
              @search-change="searchChangeWrbj"
              @current-change="wrbjcurrentChange"
            >
              <template slot="menuLeft">
                  <div style="margin:20px 0px 40px 10px">
                    <sapn style="color:#fff;font-size:13px !important;">设备号：</sapn>
                    <el-input size="mini" v-model="mnWrbj" placeholder="请输入设备号" style="width:150px;margin-right:10px;">
                    </el-input>
                    <sapn style="color:#fff;font-size:13px !important;">时间：</sapn>
                    <div class="baojing-time"><el-date-picker size="mini" v-model="alertTimeWrbj"   type="date" popper-class="dark" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" :clearable="false"></el-date-picker></div>
                    <el-button size="mini" type="primary" style="width:60px;box-sizing:border-box;" @click="wrbjLoad()">查询
                    </el-button>
                    <el-tag size="mini" type="success" @click.native="vehicleAlertClick()" style="cursor:pointer;">详情
                    </el-tag>
                  </div>
                </template>
            </avue-crud>
             <div class="diypage">
                <el-pagination
                background
                small
                :hide-on-single-page="false"
                :pager-count="5"
                layout="total, prev, pager, next"
                :current-page="pageWrbj.currentPage"
                :page-size="pageWrbj.pageSize"
                :total="pageWrbj.total"
                @current-change="wrbjcurrentChange">
              </el-pagination>
              </div>
             </basic-container>
           </div>
          </div> -->
          <bjTable type="wrbj" :factorCode="activeMenu == 'menu-ydwz'?moveFacType:yunFacType" @closeWrbj="ydwzCheckMenus[2].isCheck = false;yuntuCheckMenus[8].isCheck = false;showwrbj = false" @vehicleRowClick="vehicleRowClick"></bjTable>
        </div>
      </transition>
      <!-- 移动微站排名 -->
      <transition name="slide-left">
        <div v-show="showMovingRank" class="baojing-chart">
          <movingRankTable ref="movingRankTable" id="compareBz" :timeType="timeType" :activeWZRankType="activeWZRankType" :searchData="searchData" :moveFacType="moveFacType" @closeMovingRank="showMovingRank= false" @movingRowClick="movingRowClick"></movingRankTable>
        </div>
      </transition>
      <!-- 移动云图 -->
      <transition name="hide">
        <div v-show="showZhzdLabel" class="airmap">
          <img
            @click="airmapClick"
            style="width: 100%; height: 100%"
            :src="airmapImageSource"
          />
        </div>
      </transition>
      <!-- 微站点击详情 -->
      <transition name="slide">
        <div v-show="showWzDetail" class="bz wz-chart">
          <WzDetail @closeWzDetail="closeWzDetail" @resetSiteId="resetSiteId" :siteId="siteId" :wzSite="wzSite" :timeType="timeType" :time="searchData.dateTime"></WzDetail>
        </div>
      </transition>
      <!-- 区县排名表格 -->
      <transition name="slide">
        <div v-show="showAreaRank" class="qxpm-chart">
          <!-- <div class="sort-pm">
            <span class="pm-title">{{areaRankDesc?'污染排名':'清洁排名'}}</span>
            <el-form
              class="dark"
              size="mini"
              :show-message="false"
              inline
            >
            <el-form-item label="">
              <el-select
                class="wd-100"
                v-model="areaRankDesc"
                :popper-append-to-body="false"
                placeholder="请选择"
                @change="rankLoad"
              >
                <el-option
                  v-for="item in sortPm"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            </el-form>
          </div>
          <div class="wrpm">
           <div class="close-qxpm" @click="showAreaRank = false;activeWZRankType = 0;"></div>
           <div class="wrpm-content">
             <basic-container>
              <avue-crud
                :data="areaData"
                :option="areaOption"
                :page.sync="areaPage"
                @current-change="areaCurrentChange"
              ></avue-crud>
              <div class="diypage">
                <el-pagination
                background
                small
                :hide-on-single-page="false"
                :pager-count="5"
                layout="total, prev, pager, next"
                :current-page="areaPage.currentPage"
                :page-size="areaPage.pageSize"
                :total="areaPage.total"
                @current-change="areaCurrentChange">
              </el-pagination>
              </div>
             </basic-container>
           </div>
          </div> -->
          <areaRankTable ref="areaRankTable" :distance="bzAroundArea" :id="compareBz" :timeType="timeType" :activeWZRankType="activeWZRankType" :searchData="searchData" :wepmType="wepmType" @closeAreaRank="showAreaRank = false;activeWZRankType = 0;"></areaRankTable>
        </div>
      </transition>
      <!-- 固定微站自排名表格 -->
      <transition name="slide">
        <div v-show="showFixedRank" class="qxpm-chart">
          <fixedRankTable ref="fixedRankTable" :distance="bzAroundArea" :timeType="timeType" :activeWZRankType="activeWZRankType" :searchData="searchData" :wepmType="wepmType" @closeFixedRank="showFixedRank = false;" @rowClick="rowClick"></fixedRankTable>
        </div>
      </transition>
      <!-- 道路排名表格 -->
      <transition name="slide">
        <div v-show="showRoadRank" class="qxpm-chart">
          <!-- <div class="sort-pm">
            <span class="pm-title">{{roadRankDesc?'污染排名':'清洁排名'}}</span>
            <el-form
              class="dark"
              size="mini"
              :show-message="false"
              inline
            >
            <el-form-item label="">
              <el-select
                class="wd-100"
                v-model="roadRankDesc"
                :popper-append-to-body="false"
                placeholder="请选择"
                @change="ywRankLoad"
              >
                <el-option
                  v-for="item in sortPm"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            </el-form>
          </div>
          <div class="wrpm">
           <div class="close-qxpm" @click="showRoadRank = false;activeWZRankType = 0;"></div>
           <div class="wrpm-content">
             <basic-container>
              <avue-crud
                :data="roadData"
                :option="roadOption"
                :page.sync="roadPage"
                @current-change="roadCurrentChange"
              ></avue-crud>
              <div class="diypage">
                <el-pagination
                background
                small
                :hide-on-single-page="false"
                :pager-count="5"
                layout="total, prev, pager, next"
                :current-page="roadPage.currentPage"
                :page-size="roadPage.pageSize"
                :total="roadPage.total"
                @current-change="roadCurrentChange">
              </el-pagination>
              </div>
             </basic-container>
           </div>
          </div> -->
          <!-- <roadRankTable ref="roadRankTable" :distance="bzAroundArea" :timeType="timeType" :searchData="searchData" :moveFacType="moveFacType" @closeRoadRank="showRoadRank = false;activeWZRankType = 0;"></roadRankTable> -->
        </div>
      </transition>
      <!-- 尘源识别 -->
      <transition name="slide">
        <div v-show="showCyRank" class="qxpm-chart">
          <cyRankTable ref="cyRankTable" id="compareBz" :timeType="timeType" :activeWZRankType="activeWZRankType" :searchData="searchData" :wepmType="wepmType" @closeCyRank="showCyRank= false"></cyRankTable>
        </div>
      </transition>
      <!-- 车辆图标点击详情 -->
      <transition name="slide">
        <div
          v-show="showVehicleDetail"
          class="vehicle-chart">
          <div class="car-detail" style="width: 100%; height: 100%">
            <div class="close-car" @click="closeCarDetail"></div>
            <div class="layer-title">
              <i class="el-icon-arrow-right left-first"></i>
              <i class="el-icon-arrow-right"></i>
              <span>{{carData.plateNumber}}</span>
              <i class="el-icon-arrow-left"></i>
              <i class="el-icon-arrow-left right-second"></i>
              <el-tag size="mini" type="success" @click.native="vehicleHistoryClick(carData.vehicleId)" style="cursor:pointer;">历史</el-tag>
              <el-tag size="mini" type="success" @click.native="vehicleAlertClick()" style="position: absolute;right:0;cursor:pointer" >报警</el-tag>
            </div>
            <div class="car-content">
              <p class="car-content-1">PM10: <span class="pm10" :style="{background:getItemColor('PM10',carData.pm10)}">{{Math.round(carData.pm10*100)/100}}(ug/m3)</span>PM2.5: <span class="pm2_5" :style="{background:getItemColor('PM2.5',carData.pm2_5)}">{{Math.round(carData.pm2_5*100)/100}}(ug/m3)</span></p>
              <p class="car-content-1">TVOC: <span class="pm10" :style="{background:getItemColor('TVOC',carData.tvoc)}">{{carData.tvoc!=''?Math.round(carData.tvoc*100)/100:'--'}}(ug/m3)</span></p>
              <p class="car-content-2"><span>更新时间: </span> <span class="time">{{carData.collectTime}}</span></p>
              <p class="car-content-3">设备号: <span class="shebeihao">{{carData.mn}}</span>速度: <span class="speed">{{carData.speed}}(km/h)</span></p>
              <p class="car-content-4"><span>经纬度：</span><span class="location">{{carData.lng}},{{carData.lat}}</span></p>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 右侧地图 end -->

    <!-- 时间查询 start -->
    <transition name="slide-left">
    <div class="wz-search" id="wz-search" v-if="tucengShow">
      <el-form
        class="dark"
        size="mini"
        :show-message="false"
        inline
        label-width="75px"
      >
        <el-form-item label="时间类型:">
          <el-select
            class="wd-80"
            v-model="timeType"
            :popper-append-to-body="false"
            placeholder="请选择"
            @change="timeTypeChange"
          >
            <el-option
              v-for="item in timeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <!-- 小时 -->
          <div v-if="timeType == 1" style="z-index:11;">
            <el-date-picker
              v-model="searchData.dateTime"
              type="datetime"
              class="wd-330"
              popper-class="dark"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOption"
              placeholder="选择时间"
              :clearable="false"
              @change="hourSelectChange($event)"
              :append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 日 -->
          <div v-if="timeType == 2">
            <el-date-picker
              v-model="searchData.dateTime"
              type="date"
              class="wd-330"
              popper-class="dark"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
              :append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 周 -->
          <div v-if="timeType == 3">
            <el-date-picker
              v-model="searchData.dateTime"
              type="week"
              class="wd-330"
              popper-class="dark"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOption"
              placeholder="选择周"
              :clearable="false"
              :append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 月 -->
          <div v-if="timeType == 4">
            <el-date-picker
              v-model="searchData.dateTime"
              type="month"
              class="wd-330"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择月份"
              :clearable="false"
              :append-to-body="false"
            ></el-date-picker>
          </div>
          <!-- 旬 -->
          <div v-if="timeType == 11 || timeType == 12 || timeType == 13">
            <el-date-picker
              v-model="searchData.dateTime"
              time-arrow-control=""
              type="month"
              class="wd-330"
              popper-class="dark"
              value-format="yyyy-MM"
              :picker-options="pickerOption"
              placeholder="选择日期"
              :clearable="false"
              :append-to-body="false"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button size="mini" type="primary" @click="buttonSearch()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    </transition>

    <!-- 数据图层 start -->
    <transition name="slide-left">
    <div class="wz-data-layer" v-if="tucengShow">
      <div class="layer-title">
        <i class="el-icon-arrow-right left-first"></i>
        <i class="el-icon-arrow-right"></i>
        <span>数据图层</span>
        <i class="el-icon-arrow-left"></i>
        <i class="el-icon-arrow-left right-second"></i>
      </div>
      <!-- 标站 -->
      <div v-show="activeMenu == 'menu-bz'" class="layer-bz">
        <div class="close-tuceng" @click="closeTuceng"></div>
        <div class="layer-menus">
          <div
            v-for="item in bzCheckMenus"
            :key="item.id"
            @click="layerCheck(item)"
            :class="item.isCheck ? 'active' : ''"
            class="bz-check-menu"
          >
            <img
              class="menu-icon"
              :src="item.isCheck ? item.selIcon : item.icon"
            />
            <div class="menu-title">{{ item.title }}</div>
          </div>
        </div>
        <div class="layer-split"></div>
        <el-form class="dark" size="mini" :show-message="false" inline>
          <el-form-item label-width="0">
            <el-select
              class="wd-75"
              v-model="stationFacType"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="stationFacTypeChange()"
            >
              <el-option
                v-for="item in stationFacList"
                :key="item.id"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="周边范围:" label-width="75px">
            <el-select
              class="wd-75"
              :popper-append-to-body="false"
              v-model="bzAroundArea"
              placeholder="请选择"
              @change="changeRadius()"
            >
              <el-option label="1.5km" :value="1500"></el-option>
              <el-option label="3km" :value="3000"></el-option>
              <el-option label="5km" :value="5000"></el-option>
              <el-option label="10km" :value="10000"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!-- 微站 -->
      <div v-show="activeMenu == 'menu-wz'" class="layer-wz">
        <div class="close-tuceng" @click="closeTuceng"></div>
        <div class="layer-menus">
          <div
            v-for="item in wzCheckMenus"
            :key="item.id"
            @click="layerCheck(item)"
            :class="item.isCheck ? 'active' : ''"
            class="bz-check-menu"
          >
            <img
              class="menu-icon"
              :src="item.isCheck ? item.selIcon : item.icon"
            />
            <div class="menu-title">{{ item.title }}</div>
          </div>
        </div>
        <div class="layer-split"></div>
        <!-- 排名 -->
        <!-- <el-radio-group
          v-model="activeWZRankType"
          size="mini"
          class="rankRadio mb-10"
          @change="wzRankClick()"
        >
        </el-radio-group> -->
        <div style="display:flex">
        <!-- <el-button size="mini"
          class="rankRadio mb-10"  @click="wzRankClick()">排 名</el-button> -->
        <!-- <el-button size="mini"
          class="rankRadio mb-10"  @click="cyRankClick()">尘源排名</el-button> -->
        <el-button size="mini"
          class="rankRadio mb-10"  @click="fixedRankClick()">微站排名</el-button>
        </div>
        <el-form class="dark" size="mini" :show-message="false" inline>
          <el-form-item label-width="0">
            <el-select
              class="wd-75"
              v-model="wepmType"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="wepmTypeChange"
            >
              <el-option
                v-for="item in wepmList"
                :key="item.id"
                :label="item.value"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="周边范围:" label-width="75px">
            <el-select
              class="wd-75"
              :popper-append-to-body="false"
              v-model="bzAroundArea"
              placeholder="请选择"
              @change="changeRadius()"
            >
              <el-option label="1.5km" :value="1500"></el-option>
              <el-option label="3km" :value="3000"></el-option>
              <el-option label="5km" :value="5000"></el-option>
              <el-option label="10km" :value="10000"></el-option>
            </el-select>
          </el-form-item> -->

        </el-form>
        <!-- <el-form class="dark" size="mini" :show-message="false" inline style="margin-top:10px;">
           <el-form-item label="标站:" label-width="45px">
            <el-select
              class="wd-100"
              :popper-append-to-body="false"
              v-model="compareBz"
              placeholder="请选择"
            >
              <el-option :label="item.stationname" :value="item.id" v-for="item in bzSelectList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form> -->
      </div>
      <!-- 移动微站 -->
      <div v-show="activeMenu == 'menu-ydwz'" class="layer-wz">
        <div class="close-tuceng" @click="closeTuceng"></div>
        <div class="layer-menus">
          <div
            v-for="item in ydwzCheckMenus"
            :key="item.id"
            @click="layerCheck(item)"
            :class="item.isCheck ? 'active' : ''"
            class="bz-check-menu"
          >
            <img
              class="menu-icon"
              :src="item.isCheck ? item.selIcon : item.icon"
            />
            <div class="menu-title">{{ item.title }}</div>
          </div>
        </div>
        <div class="layer-split"></div>
        <!-- 道路排名 -->
          <!-- <el-radio-group
            v-model="activeWZRankType"
            size="mini"
            class="rankRadio mb-10"
            @change="ywRoadRank()"
          >
          <el-radio-button
            >微站排名</el-radio-button>
          </el-radio-group> -->
          <!-- <el-button size="mini"
          class="rankRadio mb-10"  @click="ywRoadRank()">排 名</el-button> -->
        <el-form class="dark" size="mini" :show-message="false" inline>
          <el-form-item label-width="0">
            <el-select
              class="wd-80"
              v-model="moveFacType"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="moveFacClick()"
            >
              <el-option
                v-for="item in moveFacList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" class="rankRadio mb-10"  @click="movingRankClick">排 名</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 云图 -->
      <div v-show="activeMenu == 'menu-yuntu'" class="layer-wz">
        <div class="close-tuceng" @click="closeTuceng"></div>
        <div class="layer-menus">
          <div
            v-for="item in yuntuCheckMenus"
            :key="item.id"
            @click="layerCheck(item)"
            :class="item.isCheck ? 'active' : ''"
            class="bz-check-menu"
          >
            <img
              class="menu-icon"
              :src="item.isCheck ? item.selIcon : item.icon"
            />
            <div class="menu-title">{{ item.title }}</div>
          </div>
        </div>
        <div class="layer-split"></div>
        <el-form class="dark" size="mini" :show-message="false" inline>
          <el-form-item label-width="0">
            <el-select
              class="wd-75"
              v-model="yunFacType"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="ytTypeChange"
            >
              <el-option
                v-for="item in yunpmList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="周边范围:" label-width="75px">
            <el-select
              class="wd-75"
              :popper-append-to-body="false"
              v-model="bzAroundArea"
              placeholder="请选择"
              @change="ytTypeChange()"
            >
              <el-option label="1.5km" :value="1500"></el-option>
              <el-option label="3km" :value="3000"></el-option>
              <el-option label="5km" :value="5000"></el-option>
              <el-option label="10km" :value="10000"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    </transition>
    <!-- 数据图层 end -->
    <div class="wz-loading" v-if="isDataLoading">
      <Loading></Loading>
    </div>
    <div class="wz-vueBox">
        <div class="marquee">
            <div class="marquee_title">
                <span>最新快报</span>
            </div>
            <div class="marquee_box">
                <ul class="marquee_list" :class="{marquee_top:animate}">
                    <li v-for="(item, index) in marqueeList">
                        <span>{{item}}</span>
                        <!-- <span>在</span>
                        <span class="red"> {{item.city}}</span>
                        <span>杀敌</span>
                        <span class="red"> {{item.amount}}</span>
                        <span>万</span> -->
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="wz-bac">
      <el-radio-group v-model="tabbac" size="mini" type="vertical" @change="tabbacChange">
        <el-radio-button label="深色" ></el-radio-button>
        <el-radio-button label="浅色"></el-radio-button>
      </el-radio-group>
    </div>
    <!-- 空气质量指数类别颜色 start -->
    <color-card @sliderChange="sliderChange" class="wz-color" :swatches="swatches" :buttonSearchClick="buttonSearchClick" :resetColorValue="resetColorValue" :activeMenu="activeMenu"></color-card>
    <!-- 空气质量指数类别颜色 end -->
    <!-- <div class="wz-dust" v-if="showCysbLabel">
      <div>
      <div class="wz-dust-cicle1"></div><sapn style="font-weight:700;font-size: 16px;margin-left:14px;">代表大颗粒</sapn>
      </div>
      <div style="margin-top:10px">
      <div class="wz-dust-cicle2"></div><sapn style="font-weight: 700;font-size: 16px;margin-left:14px;">代表小颗粒</sapn>
      </div>
    </div> -->
  </div>

  <!-- </basic-container> -->
</template>
<script>
import { getAQIColor,getPM2_5Color,getPM10Color,getSO2Color,getNO2Color,getCOColor,getO3Color,getTVOCColor } from './color-card.js';
import { title_getAQIColor,title_getPM2_5Color,title_getPM10Color,title_getSO2Color,title_getNO2Color,title_getCOColor,title_getO3Color,title_getTVOCColor } from './title-card.js';
import { bz_getAQIColor,bz_getPM2_5Color,bz_getPM10Color,bz_getSO2Color,bz_getNO2Color,bz_getCOColor,bz_getO3Color,bz_getTVOCColor } from './bz-icon.js';
import { wz_getAQIColor,wz_getPM2_5Color,wz_getPM10Color,wz_getSO2Color,wz_getNO2Color,wz_getCOColor,wz_getO3Color,wz_getTVOCColor } from './wz-icon.js';

import * as echarts from 'echarts';
import { deepClone } from "@/util/util.js";
import iconBzGreenSel from "@/assets/img/map/bz-green-sel.png";
import iconWzYellow from "@/assets/img/map/wz-yellow.png";
import iconVehicle from "@/assets/img/map/vehicle.png";

import bz from "@/assets/img/map/gldl.png";
import wz from "@/assets/img/map/zhsj.png";
import bg from "@/assets/img/map/wrpm.png";
import airmap from "@/assets/img/map/airmap.png";
import baojing from "@/assets/img/map/baojing.png";
import qxpm from "@/assets/img/map/qxpm.png";
import vehicleDetailImage from "@/assets/img/map/vehicel-detail.png";
import wzDetailImage from "@/assets/img/map/wz-detail.png";
import {
  getBanner,
  getStationFactors,
  getStatSite,
  getFixedSiteFactors,
  getWeMapData,
  getStationMapData,
  getMobilesiteData,
  getAlertList,
  getMobileAlertList,
  getTimeList,
  getAreaRank,
  getRoadRank,
  getPollutionRank,
  getAroundSite,
  getMobilesiteFactors,
  getMobileSiteCount,
  getYunPMCode,
  getVehicleList,
  getMobileSiteDetail,
  getBzPonitDetail
} from "@/api/microstation/index.js";
const defaultIconSize = { width: 30, height: 60 };

const mapIconBzGreenSel = {
  url: iconBzGreenSel,
  size: defaultIconSize,
  opts: { imageSize: defaultIconSize },
};
const mapIconWzYellow = {
  url: iconWzYellow,
  size: defaultIconSize,
  opts: { imageSize: defaultIconSize },
};
/*const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [30, 60],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  },
});*/
// 左侧菜单
const leftMenuData = [
  {
    id: "menu-bz",
    title: "标站",
    icon: "/img/map/menu/icon-menu-bz.png",
    selIcon: "/img/map/menu/icon-menu-bz-sel.png",
  },
  {
    id: "menu-wz",
    title: "固定微站",
    icon: "/img/map/menu/icon-menu-wz.png",
    selIcon: "/img/map/menu/icon-menu-wz-sel.png",
  },
  {
    id: "menu-ydwz",
    title: "移动微站",
    icon: "/img/map/menu/icon-menu-yidong.png",
    selIcon: "/img/map/menu/icon-menu-yidong-sel.png",
  },
  {
    id: "menu-yuntu",
    title: "云图",
    icon: "/img/map/menu/icon-menu-yuntu.png",
    selIcon: "/img/map/menu/icon-menu-yuntu-sel.png",
  },
];
// 微站排名类型
const wzRankTypeData = [
  {
    id: "rank-01",
    name: "区县排名",
    value: 1,
  },
  {
    id: "rank-02",
    name: "街道排名",
    value: 2,
  },
];
// 标站周边微站模拟数据
import ColorCard from "./color-card.vue";
import WzDetail from "./wzDetail.vue";
import wrpmTable from "./wrpmTable.vue";
import roadRankTable from "./roadRankTable.vue";
import cyRankTable from "./cyRankTable.vue";
import movingRankTable from "./movingRankTable.vue";
import areaRankTable from "./areaRankTable.vue";
import fixedRankTable from "./fixedRankTable.vue";
import bjTable from "./bjTable.vue";
import Loading from '../../components/loading.vue';
import States from "./states.json";
export default {
  name: "air-monitor",
  components: {
    ColorCard,
    WzDetail,
    Loading,
    wrpmTable,
    roadRankTable,
    cyRankTable,
    areaRankTable,
    bjTable,
    fixedRankTable,
    movingRankTable,
  },
  data() {
    return {
      animate: false,
      marqueeList: [],
      tabbac:"深色",
      buttonSearchClick:false, //查询按钮点击还原因子色卡值
      resetColorValue:false,
      sliderValue:[0,250],
      maxValue:250,
      tucengShow:true, //图层是否显示
      swatches:"a34004", // 默认色卡因子a34004
      isFullscreen: false,
      mnWrbj:"",
      alertTimeWrbj:"",
      mn:"",
      alertTime:"",
      title: '正在载入',
      isDataLoading:false,
      data: [],
      pmChange:'PM2.5',
      bzData:'',
      //标站点位信息
      bzPoint:'',
      //标站标记点击显示
      showBzPoint:false,
      //走行数据详情
      sitePoint:"",
      showSitePoint:false,
      //实时车辆点击数据
      carData:"",
      siteId: "",
      wzSite:"",
      areaData: [],
      wrbjdata: [],
      rankdata :[],
      pollutionRankDesc:1,
      areaRankDesc:1,
      roadRankDesc:1,
      sortPm:[
        {
          label:"污染排名",
          id:1
        },
        {
          label:"清洁排名",
          id:0
        }
      ],
      loading: true,
      page: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      bzoption: {
        align: "center",
        menu: false,
        size:'mini',
        border: true,
        index: true,
        searchShow: true,
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "站点名称",
            width: 200,
            prop: "name",
          },
          {
            label: "因子",
            prop: "alias",
            slot:true,
          },
          {
            label: "浓度",
            prop: "val",
          },
        ],
      },
      option: {
        title: "微站报警",
        titleSize: "h6",
        titleStyle: {
          color: "red",
        },
        align: "center",
        menu: false,
        border: true,
        size: "mini",
        index: true,
        indexWidth:60,
        searchShow: true,
        searchMenuSpan: 8,
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "站点名称",
            prop: "siteName",
            width: 120,
          },

          {
            label: "设备号",
            prop: "mn",
            width: 100,
          },
          {
            label: "报警日期",
            prop: "startTime",
            // search: true,
            type: "date",
            align: "center",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            searchSpan: 8,
          },
          {
            label: "报警类型",
            prop: "description",
          },
          {
            label: "报警值",
            prop: "curVal",
          },
        ],
      },
      areaPage: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      //道路表格
      roadData:[],
      roadPage: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      bzPage: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      pageWrbj: {
        pageSize: 5, //调用全局分页参数
        currentPage: 1,
        total: 0,
      },
      areaOption: {
        title: "区域排名",
        titleSize: "h6",
        titleStyle: {
          color: "red",
        },
        align: "center",
        menu: false,
        border: true,
        index: true,
        size: "mini",
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "名称",
            prop: "name",
          },
          {
            label: "因子",
            prop: "alias",
          },
          {
            label: "浓度",
            prop: "val",
          },
        ],
      },
      roadOption: {
        title: "道路排名",
        titleSize: "h6",
        titleStyle: {
          color: "red",
        },
        align: "center",
        menu: false,
        border: true,
        index: true,
        size: "mini",
        addBtn: false,
        refreshBtn: false,
        columnBtn: false, //控制表格列显隐按钮不需要；
        menuAlign: "center",
        column: [
          {
            label: "名称",
            prop: "name",
          },
          {
            align: "center",
            label: "所属区域",
            prop: "belongDistrict",
          },
          {
            label: "因子",
            prop: "alias",
          },
          {
            label: "浓度",
            prop: "val",
          },
        ],
      },
      activeMenu: "menu-bz", // 左侧菜单选中项
      leftMenus: leftMenuData, // 左侧菜单
      wzpath: "",
      // 时间查询
      searchData: {
        dateType: 10,
        dateTime: this.formatSelectDate(new Date()),
      },
      // 头部检索时间
      timeType: "10",
      timeList: [],
      moveFacType: "",
      moveFacList: [],
      yunFacType: "",
      yunpmList: [],
      query: {},
      /* === 数据图层 start === */
      defaultBZMenus: [
        {
          id: "bz-bzmc",
          title: "标站名称",
          isCheck: false,
          checkEvent: this.bzmcClick,
          icon: "/img/map/menu/icon-menu-bz.png",
          selIcon: "/img/map/menu/icon-menu-bz-sel.png",
        },
        {
          id: "bz-zbwr",
          title: "周边污染",
          isCheck: false,
          checkEvent: this.zbwrClick,
          icon: "/img/map/bz/icon-bz-zbwr.png",
          selIcon: "/img/map/bz/icon-bz-zbwr-sel.png",
        },
        {
          id: "bz-wrpm",
          title: "污染排名",
          isCheck: false,
          checkEvent: this.wrpmClick,
          icon: "/img/map/bz/icon-bz-wrpm.png",
          selIcon: "/img/map/bz/icon-bz-wrpm-sel.png",
        },
      ], // 微站菜单
      defaultWZMenus: [
        {
          id: "wz-wzmc",
          title: "微站名称",
          isCheck: false,
          checkEvent: this.wzmcClick,
          icon: "/img/map/menu/icon-menu-wz.png",
          selIcon: "/img/map/menu/icon-menu-wz-sel.png",
        },
        {
          id: "wz-cysb",
          title: "尘源识别",
          isCheck: false,
          checkEvent: this.cysbClick,
          icon: "/img/map/wz/icon-wz-fc.png",
          selIcon: "/img/map/wz/icon-wz-fc-sel.png",
        },
        {
          id: "bz-guo",
          title: "微站预警",
          isCheck: false,
          checkEvent: this.baojingClick,
          icon: "/img/map/bz/icon-bao-jing.png",
          selIcon: "/img/map/bz/icon-bao-jing-sel.png",
        },
      ], // 微站菜单
      defaultYDWZMenus: [
        {
          id: "wz-yuntu",
          title: "道路云图",
          isCheck: true,
          checkEvent: this.zhsjClick,
          icon: "/img/map/menu/icon-menu-yuntu.png",
          selIcon: "/img/map/menu/icon-menu-yuntu-sel.png",
        },
        {
          id: "wz-che",
          title: "实时车辆",
          isCheck: false,
          checkEvent: this.vehicleClick,
          icon: "/img/map/wz/icon-wz-che.png",
          selIcon: "/img/map/wz/icon-wz-che-sel.png",
        },
        {
          id: "bz-wrbj",
          title: "移动预警",
          isCheck: false,
          checkEvent: this.wrbjClick,
          icon: "/img/map/bz/icon-wz-che-alarm.png",
          selIcon: "/img/map/bz/icon-wz-che-sel-alarm.png",
        },
      ],
      // 移动微站菜单
      bzCheckMenus: [],
      wzCheckMenus: [],
      ydwzCheckMenus: [],
      yuntuCheckMenus: [],

      // 标站
      stationFacType: "",
      stationFacList: [],
      bzMapList :[],
      bzAroundArea: 1500, // 周边范围默认值

      // 微站
      compareBz:"", //排名比较的标站
      bzSelectList:[], //标站下拉框列表
      wzList: [], // 微站站点列表
      wepmType: "",
      wepmList: [],
      activeWZRankType: 0, // 排名选中菜单 区县=10/街道=20/道路=30
      wzRankTypeList: wzRankTypeData, // 排名类型


      showZhzdLabel: false,
      showVehicleLabel :false,

      /* === 标站 start === */
      showBZMarkerLabel: false, // 是否显示标站标签
      showWzMarkerLabel: false, // 是否显示微站标签
      showWRPMTable: false, // 污染排名
      showBzDetail: false, // 标站详情
      showDotChart: false, // 走航数据详情
      showBaojing: false, // 是否显示报警图表
      showwrbj: false,
      showZbwrLabel:false, //标站-周边污染
      // toto 右侧详情图片,临时使用，后面要改成代码
      bzImageSource: bz,
      wzImageSource: wz,
      bgImageSource: bg,
      baojingImageSource: baojing,
      /* === 标站 end === */
      /* === 微站 start === */
      showAreaRank: false, // 是否显示行政区划
      showFixedRank: false,// 固定微站自排名显隐
      showCyRank: false, //尘源识别弹框
      showMovingRank: false, //移动微站
      showWzDetail: false, // 是否显示微站详情
      wzDetailImageSource: wzDetailImage, // 微站详情图片地址
      qxpmImageSource: qxpm, // 区县排名图片地址
      /* === 微站 end === */
      /* === 移动微站 start === */
      showVehicleDetail: false,
      showRoadRank:false,
      vehicleDetailImageSource: vehicleDetailImage,
      /* === 移动微站 end === */

      airmapImageSource: airmap,
      map: "",
      radius: 3,
      aroundLayer : new L.LayerGroup(),
      bzLayer: new L.LayerGroup(),
      bztitleLayer: new L.LayerGroup(),
      wzLayer: new L.LayerGroup(),
      wztitleLayer: new L.LayerGroup(),
      // 尘源识别
      dustLayer: new L.LayerGroup(),
      // 走航站点图层
      movingMarkerLayer: new L.LayerGroup(),
      // 实时车辆
      vehicleLayer: new L.LayerGroup(), bivehicleMark:"",
      // 定时器
      intervalId: null,
      mapStyle: {
        // features: ["building"],//隐藏地图上的"poi",
        style: "midnight",
        // styleJson: require('@/assets/custom_map_config.json'),
        // styleId:'dd5584dc225425d5c5e9ce6424d7345f'
      },
      vehicleMap: null,
      vehicleDataMap: null,
      mobilesiteDatas : new Map(),
      mobilesiteDatasPage : new Map(),
    };
  },
  created() {
    this.bzCheckMenus = deepClone(this.defaultBZMenus);
    this.wzCheckMenus = deepClone(this.defaultWZMenus);
    this.ydwzCheckMenus = deepClone(this.defaultYDWZMenus);
    this.yuntuCheckMenus = deepClone([
      ...this.defaultBZMenus,
      ...this.defaultWZMenus,
      ...this.defaultYDWZMenus,
    ]);
    // 默认显示标站
    this.wzpath = this.$router.history.current.path;
    this.getBanner();
    setInterval (this.showMarquee, 2000)
  },
  destroyed() {
    this.clear();
  },
  // watch: {
  //   activeWZRankType: function (nv, ov) {
  //     this.areaRankDesc = 1;
  //     // 区县=10/街道=20/道路=30
  //     switch (nv) {
  //       case 1:
  //         this.rankLoad();
  //         break;
  //       case 2:
  //         this.rankLoad();
  //         break;
  //       case 3:
  //         this.rankLoad();
  //         break;
  //     }
  //   },
  // },
  mounted() {
    let url = this.$router.history.current.path;
    this.initMap();
    this.getTimeType();
    this.getStationFac();
  },
  methods: {
    showMarquee() {
        this.animate = true;
        setTimeout (() => {
            // console.log(this.marqueeList)
            this.marqueeList.push (this.marqueeList[ 0 ]);
            this.marqueeList.shift ();
            this.animate = false;
        },300);
    },
    getBanner(){
      getBanner().then((res) => {
        const data = res.data.data;
        this.marqueeList=data;
      });
    },
    tabbacChange(e){
      // var that =this;
      // var states=States;
      // L.geoJSON(states, {
      // style: function(feature) {
      //   if(that.tabbac=='深色'){
      //     switch (feature.properties.name) {
      //         case '惠山区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '梁溪区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '锡山区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '滨湖区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '江阴市': return {color: "#fff",fillColor: "","weight": 2};
      //         case '新吴区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '经济开发区': return {color: "#fff",fillColor: "","weight": 2};
      //         case '宜兴市': return {color: "#fff",fillColor: "","weight": 2};
      //     }
      //   }else{
      //     switch (feature.properties.name) {
      //         case '惠山区': return {color: "#000",fillColor: "","weight": 2};
      //         case '梁溪区': return {color: "#000",fillColor: "","weight": 2};
      //         case '锡山区': return {color: "#000",fillColor: "","weight": 2};
      //         case '滨湖区': return {color: "#000",fillColor: "","weight": 2};
      //         case '江阴市': return {color: "#000",fillColor: "","weight": 2};
      //         case '新吴区': return {color: "#000",fillColor: "","weight": 2};
      //         case '经济开发区': return {color: "#000",fillColor: "","weight": 2};
      //         case '宜兴市': return {color: "#000",fillColor: "","weight": 2};
      //     }
      //   }
      // }
      // });
    },
    bzRowClick(val){
      this.map.setView(val, 15)
    },
    rowClick(val){
      this.map.setView(val, 16)
    },
    movingRowClick(val){
      this.map.setView(val, 20)
    },
    vehicleRowClick(val){
      this.map.setView(val, 18)
    },
    // 拖动颜色滑块的change事件
    sliderChange(value1,value2){
      this.sliderValue=value1;
      this.maxValue=value2;
      if(this.activeMenu=='menu-bz'){
        // 清空图层
        this.bzLayer.clearLayers();
        this.bztitleLayer.clearLayers();
        this.getStationMarkers();
        if(this.showZbwrLabel){
          this.aroundLayer.clearLayers();
          this.movingMarkerLayer.clearLayers();
          this.getbzZbwr();
        }
      }
      if(this.activeMenu=='menu-wz'){
        // 清空图层
        if(this.map.hasLayer(this.wzLayer)){
            this.wzLayer.clearLayers();
        }
        if(this.map.hasLayer(this.wztitleLayer)){
            this.wztitleLayer.clearLayers();
        }
        this.getWzMarkers();
        if (this.showCysbLabel) {
          this.dustLayer.clearLayers();
          this.getDustBag();
        }
      }
      if(this.activeMenu=='menu-ydwz'){
        if(this.showZhzdLabel){
          this.getMovingMarkerSearch(value1);
        }
      }
      if(this.activeMenu=='menu-yuntu'){
        // 清空图层
        this.bzLayer.clearLayers();
        this.bztitleLayer.clearLayers();
        this.getStationMarkers();
        if(this.showZbwrLabel){
          this.aroundLayer.clearLayers();
          this.movingMarkerLayer.clearLayers();
          this.getbzZbwr();
        }
        // 清空图层
          this.wzLayer.clearLayers();
          this.wztitleLayer.clearLayers();
        this.getWzMarkers();
        if (this.showCysbLabel) {
          this.dustLayer.clearLayers();
          this.getDustBag();
        }
        if(this.showZhzdLabel){
          this.getMovingMarkerSearch(value1);
        }
      }
    },
    // 周边污染颜色查询
    getZbwrSlider(value){
  //     this.mobilesiteDatasPage.clear();
  //     var bzList =this.bzMapList;
  //     for (var i = 0; i < bzList.length; i++) {
  //       let color = this.getColor(bzList[i].val);
  //       L.circle([bzList[i].latitude, bzList[i].longitude], {
  //         color: color,
  //         fillOpacity: 0,
  //         radius: this.bzAroundArea,
  //       }).addTo(this.aroundLayer);
  //     }
  //     var data =this.mobilesiteDatas;
  //     var colorValue =value;
  //     var radius = this.getPointSiteRadius();
  //     for(let item of data.values()){
  //       if(parseInt(item.collectValue==''?0:item.collectValue) <parseInt(colorValue[0]) || parseInt(item.collectValue==''?0:item.collectValue)>parseInt(colorValue[1])){
  //         continue;
  //       }else{
  //         this.mobilesiteDatasPage.set(item.siteId,item);
  //         this.drawMobilesite(item,radius);
  //       }
  // 　　}
    },
    // 移动微站颜色查询
    getMovingMarkerSearch(value){
      this.movingMarkerLayer.clearLayers();
      this.mobilesiteDatasPage.clear();
      var data =this.mobilesiteDatas;
      var colorValue =value;
      var radius = this.getPointSiteRadius();
      for(let item of data.values()){
        if(parseInt(item.collectValue==''?0:item.collectValue) <parseInt(colorValue[0]) || parseInt(item.collectValue==''?0:item.collectValue)>parseInt(colorValue[1])){
          continue;
        }else{
          this.mobilesiteDatasPage.set(item.siteId,item);
          this.drawMobilesite(item,radius);
        }
  　　}
    },
    //微站报警-详情跳转
    weiAlertClick(){
      this.$router.push({
        path: '/weiAlertDetail',
        query: {
        }
      })
    },
    // 车辆报警
    vehicleAlertClick(){
      this.$router.push({
        path: '/vehicleAlertDetail',
        query: {
        }
      })
    },
    // 车辆历史消息
  vehicleHistoryClick(carId){
    this.$router.push({
      path: '/vehicleHistoryDetail',
      query: {
        activeName:"zouhang",
        carId:carId
      }
    })
  },
  // 时间选择器change
    timeTypeChange(){
      if(this.timeType==10){
        this.searchData.dateTime=this.formatSelectDate(new Date())
      }else if(this.timeType==1){
        this.searchData.dateTime=this.formatFullDate(new Date())
      }else if(this.timeType==2){
        this.searchData.dateTime=this.formatSelectDate(new Date())
      }else if(this.timeType==3){
        this.searchData.dateTime=this.formatSelectDate(new Date())
      }else if(this.timeType==4){
        this.searchData.dateTime=this.formatMonthDate(new Date())
      }else if(this.timeType == 11 || this.timeType == 12 || this.timeType == 13){
        this.searchData.dateTime=this.formatMonthDate(new Date())
      }
    },
    hourSelectChange(val){
      this.searchData.dateTime=this.formatFullDate(new Date(val))
    },
    wzRankClick(){
      this.showAreaRank =true;
      this.$refs.areaRankTable.rankLoad();
    },
    fixedRankClick(){
      this.showFixedRank =true;
      this.$refs.fixedRankTable.rankLoad();
    },
    movingRankClick(){
      this.showMovingRank =true;
      this.$refs.movingRankTable.rankLoad();
    },
    ywRoadRank(){
      this.showRoadRank =true;
      // this.ywRankLoad();
      // this.$refs.roadRankTable.ywRankLoad();
    },
    changeRadius(){
      this.buttonSearch();
    },
    yuntuchangeRadius(){
      if(this.showZbwrLabel){
          this.aroundLayer.clearLayers();
          this.movingMarkerLayer.clearLayers();
          setTimeout(() =>{
              this.getbzZbwr();
          },500);
      }
    },
    stationFacTypeChange(){
      this.swatches= this.stationFacType
      this.buttonSearch();
    },
    wepmTypeChange(){
      this.swatches= this.wepmType;
      setTimeout(() =>{
          this.buttonSearch();
      },100);
    },
    ytTypeChange(){
      this.swatches= this.yunFacType
      this.stationFacType = this.yunFacType;
      this.wepmType = this.yunFacType;
      setTimeout(() =>{
          this.getStationMap();
      },100);
      setTimeout(() =>{
          this.getWeMapData();
      },100);
      if(this.yunFacType == 'a80219' ||this.yunFacType == 'a21026'||this.yunFacType == 'a21004'||this.yunFacType == 'a21005'||this.yunFacType == 'a05024'||this.yunFacType == 'AQI'){
        this.yuntuCheckMenus[4].icon="/img/map/wz/icon-wz-fc-disabled.png";
      }else{
        this.yuntuCheckMenus[4].icon="/img/map/wz/icon-wz-fc.png";
      }
      if(this.showZbwrLabel){
          this.aroundLayer.clearLayers();
          this.movingMarkerLayer.clearLayers();
          setTimeout(() =>{
              this.getbzZbwr();
          },500);
      }
      if(this.showZhzdLabel){
        this.mobilesiteDatasPage.clear();
        this.movingMarkerLayer.clearLayers();
        this.getWzMovingMarkers();
      }
      if(this.showCysbLabel){
          if(this.map.hasLayer(this.dustLayer)){
            this.dustLayer.clearLayers();
          }
          this.showCysbLabel=!this.showCysbLabel;
          this.showCyRank=false;
          this.yuntuCheckMenus[4].isCheck=false;
      }
      if(this.showVehicleLabel){
        this.vehicleLayer.clearLayers();
        this.map.removeLayer(this.vehicleLayer);
        debugger
        // if(!this.map.hasLayer(this.vehicleLayer)){
        this.map.addLayer(this.vehicleLayer)
        this.vehicleMap =null;
        this.vehicleDataMap =null;
        // }
        this.dataRefreh();
      }
    },
    dataRefreh() {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return;
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.getVehicleMarkers(); //加载数据函数
      }, 2000);
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId); //清除计时器
      this.intervalId = null; //设置为null
    },
    // 时间查询
    buttonSearch() {
      this.buttonSearchClick= !this.buttonSearchClick
      this.codeChange();
      this.clearAllLayer();
      if(this.activeMenu == 'menu-bz'){
        if(this.showBZMarkerLabel){
          this.map.addLayer(this.bztitleLayer)
        }else{
        }
        this.getStationMap();
        if(this.showZbwrLabel){
            this.aroundLayer.clearLayers();
            this.movingMarkerLayer.clearLayers();
            setTimeout(() =>{
                this.getbzZbwr();
            },500);
        }
        if(this.showWRPMTable){
          this.$refs.wrpmTable.getPollutionRank();
        }
      }
      if(this.activeMenu == 'menu-wz'){
        if(this.wepmType == 'a80219' ||this.wepmType == 'a21026'||this.wepmType == 'a21004'||this.wepmType == 'a21005'||this.wepmType == 'a05024'||this.wepmType == 'AQI'){
          this.wzCheckMenus[1].icon="/img/map/wz/icon-wz-fc-disabled.png";
        }else{
          this.wzCheckMenus[1].icon="/img/map/wz/icon-wz-fc.png";
        }
        if(!this.showWzMarkerLabel && !this.showCysbLabel){
          this.getWeMapData();
        }else if(this.showWzMarkerLabel){
          if(this.showWzMarkerLabel){
            this.map.addLayer(this.wztitleLayer)
          }else{
          }
          this.getWeMapData();
        }else if(this.showCysbLabel){
          this.showCysbLabel=!this.showCysbLabel;
          this.wzCheckMenus[1].isCheck=false;
          this.getWeMapData();
        }
      }
      if(this.activeMenu == 'menu-ydwz'){
        if(this.showZhzdLabel){
          this.movingMarkerLayer.clearLayers();
          this.mobilesiteDatasPage.clear();
          this.getWzMovingMarkers();
        }
        if(this.showVehicleLabel){
          this.vehicleLayer.clearLayers();
          this.dataRefreh();
          this.map.addLayer(this.vehicleLayer);
          this.vehicleMap =null;
          this.vehicleDataMap =null;
        }
      }
      if(this.activeMenu == 'menu-yuntu'){
        this.ytTypeChange();
      }
      this.siteId = '';
    },
    codeChange(){
			if(this.swatches=="a34004"){//PM2.5
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 250];
				}else{
					this.sliderValue= [75, 250];
				}
			}else if(this.swatches=="a34002"){//PM10
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 420]
				}else{
					this.sliderValue= [150, 420]
				}
			}else if(this.swatches=="a21026"){//SO2
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 1600]
				}else{
					this.sliderValue= [150, 1600]
				}
			}else if(this.swatches=="a21004"){//NO2
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 565]
				}else{
					this.sliderValue= [80, 565]
				}
			}else if(this.swatches=="a21005"){//CO
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 36]
				}else{
					this.sliderValue= [4, 36]
				}
			}else if(this.swatches=="a05024"){//O3
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 800]
				}else{
					this.sliderValue= [160, 800]
				}
			}else if(this.swatches=="AQI"){//AQI
				if(this.activeMenu=='menu-bz' ){
					this.sliderValue= [0, 300]
				}else{
					this.sliderValue= [101, 300]
				}
			}else if(this.swatches=="a80219"){//TVOC
        this.sliderValue= [250, 625]
			}
    },



    initMap() {
      let that = this;
      var veclayer = new L.GeoTDTLayer.Vector();
      var veclayer_c = new L.GeoTDTLayer.VectorAnno();
      // let tdturl='http://61.177.139.228:9000'
      // let cia_c_url,vec_c_url;
      // if(location.href.index('2.20') >-1){
      //    cia_c_url='http://2.20.101.190:9001/cia_c/wmts'
      //    vec_c_url='http://2.20.101.190:9001/vec_c/wmts'
      // }

      var map = new L.GeoMap("map", {
        center: [31.57814, 120.309906], //'无锡市',
        zoom: 12,
        basetileLayer: [],
        preferCanvas: true,
      });

      this.map = map;
      if(location.origin.indexOf('http://2.20')>-1 || location.href.indexOf('http://localhost')>-1){
           let baseLayer_vec1 = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/vec_c/wmts", {
            id: "baseLayer_vec",
            layer: "0",
            format: "image/png",
            tilematrixset: "sss",
            maxZoom: 18,
            minZoom: 0
        });
        console.log(baseLayer_vec1)

        let baseLayer_vec = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/wmts/wuxi_vector2020", {
            id: "baseLayer_vec",
            layer: "0",
            format: "image/png",
            tilematrixset: "sss",
            maxZoom: 20,
            minZoom: 18
        });

         let baseLayer_vecLabel1 = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/cva_c/wmts", {
                  id: "baseLayer_vecLabel",
                  layer: "0",
                  format: "image/png",
                  tilematrixset: "sss",
                  maxZoom: 18,
                  minZoom: 0
              });
              let baseLayer_vecLabel = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/wmts/vector_anno2020", {
                  id: "baseLayer_vecLabel",
                  layer: "0",
                  format: "image/png",
                  tilematrixset: "sss",
                  maxZoom: 20,
                  minZoom: 18
              });

             let baseLayer_img = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/wmts/wuxi_image2020", {
                  id: "baseLayer_img",
                  layer: "0",
                  format: "image/png",
                  tilematrixset: "sss",
                  maxZoom: 20,
                  minZoom: 18
              });
              let baseLayer_imgLabel = new L.GeoWMTSLayer("http://2.20.101.190:8080/serviceaccess/service/wmts/wuxi_imageanno2020", {
                  id: "baseLayer_imgLabel",
                  layer: "0",
                  format: "image/png",
                  tilematrixset: "sss",
                  maxZoom: 20,
                  minZoom: 18
              });

          //  this.map.addLayer([baseLayer_vec1, baseLayer_vecLabel1,baseLayer_vec, baseLayer_vecLabel,baseLayer_img, baseLayer_imgLabel]);

      }else{
           var baseLayer_vec = new L.GeoWMTSLayer(
            "http://61.177.139.228:9000/gateway/WMTSServer/wuxi_newvectoranno",
            {
              id: "baseLayer_vec",
              layer: "0",
              format: "image/png",
              tilematrixset: "sss",
              maxZoom: 30,
              minZoom: 14,
              ak: "pr9OvF8jfWcvEpojMlYuOWKCzccuaesn", //申请的密钥
            }
          );
          var baseLayer_vecLabel = new L.GeoWMTSLayer(
            "http://61.177.139.228:9000/gateway/WMTSServer/wuxi_newvector",
            {
              id: "baseLayer_vecLabel",
              layer: "0",
              format: "image/png",
              tilematrixset: "sss",
              maxZoom: 30,
              minZoom: 14,
              ak: "pr9OvF8jfWcvEpojMlYuOWKCzccuaesn", //申请的密钥
            }
          );
           this.map.addLayer(baseLayer_vecLabel);
           this.map.addLayer(baseLayer_vec);

      }
      this.map.addLayer(veclayer);
      this.map.addLayer(veclayer_c);
      this.map.addLayer(this.wzLayer);
      this.map.addLayer(this.bzLayer);
      this.map.addLayer(this.aroundLayer);
      this.map.addLayer(this.movingMarkerLayer);
      map.on('zoomend', function(ev) {
         if(that.showZhzdLabel || that.showZbwrLabel){
           //判断微站图层是否显示，
           that.movingMarkerLayer.clearLayers()
           that.redrawMobilesite();
         }
      });
      var states=States;
      L.geoJSON(states, {
      style: function(feature) {
          switch (feature.properties.XZQMC) {
              case '惠山区': return {color: "#0a655b",opacity: "30%","weight": 1};
              case '梁溪区': return {color: "#907b04",opacity: "30%","weight": 1};
              case '锡山区': return {color: "#9d0e6f",opacity: "30%","weight": 1};
              case '滨湖区': return {color: "#1727a0",opacity: "30%","weight": 1};
              case '江阴市': return {color: "#7125fd",opacity: "30%","weight": 1};
              case '新吴区': return {color: "#c4521a",opacity: "30%","weight": 1};
              case '经开区': return {color: "#38dc30",opacity: "30%","weight": 1};
              case '宜兴市': return {color: "#b5b5b6",opacity: "30%","weight": 1};
          }
        }
      }).addTo(map);
    },
    // 标站因子接口
    async getStationFac() {
      var that =this;
     await getStationFactors().then((res) => {
        const data = res.data.data;
        //让pm2.5和pm10排前面
        data.splice(0,0,data[4],data[5]);
        data.splice(6,2);
        that.stationFacType = data[0].id;
        that.stationFacList = data;
        that.getStationMap();
      });
    },
    // 标站数据
    async getStationMap() {
      var that = this;
      this.isDataLoading =true;
      await getStationMapData(that.stationFacType,that.timeType, that.searchData.dateTime).then((res) => {
        this.isDataLoading =false;
        const data = res.data.data;
        that.bzMapList = data;
        that.getStationMarkers();
      }).catch(() => {
          this.isDataLoading = false;
      });
    },
    // 标站显示
    getStationMarkers() {
      var bzList =this.bzMapList;
      var that = this;
      for (var i = 0; i < bzList.length; i++) {
        if(this.sliderValue[1]==this.maxValue){
            if(parseInt(bzList[i].val==''?0:bzList[i].val) >=this.sliderValue[0]){
              let bzPoint = bzList[i];
              let iconUrl = this.getMarkerIcon(bzList[i].val)
              let icon = L.icon({
              iconUrl: iconUrl,
              iconSize: [30, 60],
              iconAnchor: [15, 60],
            });
            let markerIcon = L.divIcon({
              html: bzList[i].val==null?"":bzList[i].val, //marker标注
              className: "my-div-icon",
              background:"red",
              iconSize: [25, 25], //marker宽高
              iconAnchor: [13, 60], //文字标注相对位置
            });
            let divName = this.getDivName(bzList[i].val)
            let titlelength = bzList[i].stationname.length;
            let markerTitle = L.divIcon({
              html: bzList[i].stationname, //marker标注
              className: divName,
              iconSize: [30+10*titlelength, 20], //marker宽高
              iconAnchor: [15+5*titlelength, 85], //文字标注相对位置
            });
              L.marker(
                [bzList[i].latitude, bzList[i].longitude],{icon: icon}
              ).addTo(this.bzLayer).addTo(this.map).on("click", function (e) {
                    that.bzPonitClick(bzPoint);
                });
              L.marker([bzList[i].latitude, bzList[i].longitude], {
                icon: markerIcon,}).addTo(this.bzLayer).on("click", function (e) {
                    that.bzPonitClick(bzPoint);
                });
              // 名称
              L.marker([bzList[i].latitude, bzList[i].longitude], {
                icon: markerTitle,
              }).addTo(this.bztitleLayer);
            }
        }else{
          if(parseInt(bzList[i].val==''?0:bzList[i].val) <this.sliderValue[0] || parseInt(bzList[i].val==''?0:bzList[i].val)>this.sliderValue[1]){
            continue;
          }else{
            let bzPoint = bzList[i];
            let iconUrl = this.getMarkerIcon(bzList[i].val)
            let icon = L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 60],
            iconAnchor: [15, 60],
          });
          let markerIcon = L.divIcon({
            html: bzList[i].val==null?"":bzList[i].val, //marker标注
            className: "my-div-icon",
            background:"red",
            iconSize: [25, 25], //marker宽高
            iconAnchor: [13, 60], //文字标注相对位置
          });
          let divName = this.getDivName(bzList[i].val)
          let titlelength = bzList[i].stationname.length;
          let markerTitle = L.divIcon({
            html: bzList[i].stationname, //marker标注
            className: divName,
            iconSize: [30+10*titlelength, 20], //marker宽高
            iconAnchor: [15+5*titlelength, 85], //文字标注相对位置
          });
            L.marker(
              [bzList[i].latitude, bzList[i].longitude],{icon: icon}
            ).addTo(this.bzLayer).addTo(this.map).on("click", function (e) {
                  that.bzPonitClick(bzPoint);
              });
            L.marker([bzList[i].latitude, bzList[i].longitude], {
              icon: markerIcon,}).addTo(this.bzLayer).on("click", function (e) {
                  that.bzPonitClick(bzPoint);
              });
            // 名称
            L.marker([bzList[i].latitude, bzList[i].longitude], {
              icon: markerTitle,
            }).addTo(this.bztitleLayer);
          }
        }
      }
    },
    // 固定微站因子
    getFactors() {
      var that = this;
      getFixedSiteFactors().then((res) => {
        const data = res.data.data;
        //pm2.5,pm10排前面
        data.splice(0,0,data[4],data[5]);
        data.splice(6,2);
        that.wepmType = data[0].id;
        that.wepmList = data;
        that.getWeMapData();
      });
    },
    // 固定微站数据
    async getWeMapData() {
      var that = this;
      this.isDataLoading =true;
      await getWeMapData(
        that.timeType,
        that.wepmType,
        that.searchData.dateTime
      ).then((res) => {
        that.wzList = [];
        this.isDataLoading =false;
        const data = res.data.data;
        that.wzList = data;
        that.getWzMarkers();
      }).catch(() => {
          this.isDataLoading = false;
      });
    },
    // 固定微站列表
    getWzMarkers() {
      let that = this;
      this.isDataLoading =false;
      var wzList = this.wzList;
      let iconUrl=""
      for (var i = 0; i < wzList.length; i++) {
        if(wzList[i].collectValue != ""){
          if(this.sliderValue[1]==this.maxValue){
            if(wzList[i].collectValue>=this.sliderValue[0]){
              iconUrl = this.getWzMarkerIcon(wzList[i].collectValue);
              let icon= L.icon({
                  iconUrl: iconUrl,
                  iconSize: [30,60],
                  iconAnchor: [15, 60], //文字标注相对位置
                });
              let markerIcon = L.divIcon({
                html: wzList[i].collectValue==""?"":parseInt(wzList[i].collectValue),
                className: "my-div-icon-we",
                iconSize: [30, 30],
                iconAnchor: [15, 60], //文字标注相对位置
              });
              let divName =this.getDivName(wzList[i].collectValue)
              var titlelength =wzList[i].siteName.length;
              let markerTitle = L.divIcon({
                html: wzList[i].siteName, //marker标注
                className: divName,
                iconSize: [50+10*titlelength, 20], //marker宽高
                iconAnchor: [25+5*titlelength, 85], //文字标注相对位置
              });
              let siteId = wzList[i].siteId;
              let wzSite = wzList[i];
              let marker = L.marker(
                [wzList[i].latitude, wzList[i].logitude],{ icon: icon }
              ).addTo(this.wzLayer);
              L.marker([wzList[i].latitude, wzList[i].logitude], {
                icon: markerIcon,
              }).addTo(this.wzLayer).on("click", function (e) {
                that.wzMarkerClick(siteId,wzSite);
                });
              // 名称
              L.marker([wzList[i].latitude, wzList[i].logitude], {
                icon: markerTitle,
              }).addTo(this.wztitleLayer);
            }
          }else{
          if(wzList[i].collectValue<this.sliderValue[0] ||wzList[i].collectValue>this.sliderValue[1]){
            continue;
          }else{
            iconUrl = this.getWzMarkerIcon(wzList[i].collectValue);
            let icon= L.icon({
                iconUrl: iconUrl,
                iconSize: [30,60],
                iconAnchor: [15, 60], //文字标注相对位置
              });
            let markerIcon = L.divIcon({
              html: wzList[i].collectValue==""?"":parseInt(wzList[i].collectValue),
              className: "my-div-icon-we",
              iconSize: [30, 30],
              iconAnchor: [15, 60], //文字标注相对位置
            });
            let divName =this.getDivName(wzList[i].collectValue)
            var titlelength =wzList[i].siteName.length;
            let markerTitle = L.divIcon({
              html: wzList[i].siteName, //marker标注
              className: divName,
              iconSize: [50+10*titlelength, 20], //marker宽高
              iconAnchor: [25+5*titlelength, 85], //文字标注相对位置
            });
            let siteId = wzList[i].siteId;
            let wzSite = wzList[i];
            let marker = L.marker(
              [wzList[i].latitude, wzList[i].logitude],{ icon: icon }
            ).addTo(this.wzLayer);
            L.marker([wzList[i].latitude, wzList[i].logitude], {
              icon: markerIcon,
            }).addTo(this.wzLayer).on("click", function (e) {
              that.wzMarkerClick(siteId,wzSite);
              });
            // 名称
            L.marker([wzList[i].latitude, wzList[i].logitude], {
              icon: markerTitle,
            }).addTo(this.wztitleLayer);
          }
          }
        }
      }
      console.log(that.wzLayer)
    },
    getDustBag() {
      let that = this;
      var wzList = this.wzList;
      let iconUrl=""
      for (var i = 0; i < wzList.length; i++) {
        if(this.sliderValue[1]==this.maxValue){
          if(wzList[i].collectValue>=this.sliderValue[0]){
            iconUrl = that.getWzMarkerIcon(wzList[i].collectValue);
            let icon = L.icon({
              iconUrl: iconUrl,
              iconSize: [30, 60],
              iconAnchor:[15,60],
            });
            var dust =parseInt(wzList[i].dustSource==''?3:wzList[i].dustSource)<=3?3:parseInt(wzList[i].dustSource==''?3:wzList[i].dustSource) ,percentage=0;
            if(dust<=6){
              percentage = dust-3
            }else if(dust>6){
              percentage =3
            }
            var dustStyle="";
            if(percentage==0){
              dustStyle="dust-bacground-goldenrod"
            }else if(percentage==1){
              dustStyle="dust-bacground-goldenrod_1"
            }else if(percentage==2){
              dustStyle="dust-bacground-goldenrod_2"
            }else if(percentage==3){
              dustStyle="dust-bacground-goldenrod_3"
            }
            let markerIcon = L.divIcon({
              html:wzList[i].collectValue==''?'':parseInt(wzList[i].collectValue) ,
              className: dustStyle,
              iconSize: [30+10*percentage, 30+10*percentage],
              iconAnchor: [15+5*percentage, 60+10*percentage], //文字标注相对位置
            });
            let siteId = wzList[i].siteId;
            let wzSite = wzList[i];
            let marker = L.marker(
              [wzList[i].latitude, wzList[i].logitude],{ icon: icon }
            ).addTo(this.dustLayer);
            let divName =this.getDivName(wzList[i].collectValue)
            var titlelength=wzList[i].siteName.length;
            let markerTitle = L.divIcon({
              html: wzList[i].siteName, //marker标注
              className: divName,
              iconSize: [50+10*titlelength, 20], //marker宽高
              iconAnchor: [25+5*titlelength, 85+10*percentage], //文字标注相对位置
            });
            L.marker([wzList[i].latitude, wzList[i].logitude], {
              icon: markerIcon,
            }).addTo(this.dustLayer).on("click", function (e) {
              if(wzSite.collectValue != ''){
                that.wzMarkerClick(siteId,wzSite);
              } else {
                that.$message('暂无站点数据!');
              }
              });
          }
        }else{
          if(wzList[i].collectValue<this.sliderValue[0] || wzList[i].collectValue>this.sliderValue[1]){
            continue;
          }else{
            iconUrl = that.getWzMarkerIcon(wzList[i].collectValue);
            let icon = L.icon({
              iconUrl: iconUrl,
              iconSize: [30, 60],
              iconAnchor:[15,60],
            });
            var dust =parseInt(wzList[i].dustSource==''?3:wzList[i].dustSource)<=3?3:parseInt(wzList[i].dustSource==''?3:wzList[i].dustSource) ,percentage=0;
            if(dust<=6){
              percentage = dust-3
            }else if(dust>6){
              percentage =3
            }
            var dustStyle="";
            if(percentage==0){
              dustStyle="dust-bacground-goldenrod"
            }else if(percentage==1){
              dustStyle="dust-bacground-goldenrod_1"
            }else if(percentage==2){
              dustStyle="dust-bacground-goldenrod_2"
            }else if(percentage==3){
              dustStyle="dust-bacground-goldenrod_3"
            }
            let markerIcon = L.divIcon({
              html:wzList[i].collectValue==''?'':parseInt(wzList[i].collectValue) ,
              className: dustStyle,
              iconSize: [30+10*percentage, 30+10*percentage],
              iconAnchor: [15+5*percentage, 60+10*percentage], //文字标注相对位置
            });
            let siteId = wzList[i].siteId;
            let wzSite = wzList[i];
            let marker = L.marker(
              [wzList[i].latitude, wzList[i].logitude],{ icon: icon }
            ).addTo(this.dustLayer);
            let divName =this.getDivName(wzList[i].collectValue)
            var titlelength=wzList[i].siteName.length;
            let markerTitle = L.divIcon({
              html: wzList[i].siteName, //marker标注
              className: divName,
              iconSize: [50+10*titlelength, 20], //marker宽高
              iconAnchor: [25+5*titlelength, 85+10*percentage], //文字标注相对位置
            });
            L.marker([wzList[i].latitude, wzList[i].logitude], {
              icon: markerIcon,
            }).addTo(this.dustLayer).on("click", function (e) {
              if(wzSite.collectValue != ''){
                that.wzMarkerClick(siteId,wzSite);
              } else {
                that.$message('暂无站点数据!');
              }
              });
          }
        }

      }
    },
    // 移动微站
    async getMoveFactors() {
      var that = this;
      await getMobilesiteFactors().then((res) => {
        const data = res.data.data;
        that.moveFacType = data[0].id;
        that.moveFacList = data;
        that.getWzMovingMarkers();
      });
    },
    // 云图因子列表
    async getYunFactors() {
      var that = this;
      await getYunPMCode().then((res) => {
        const data = res.data.data;
        //pm2.5,pm10排前面
        data.splice(0,0,data[4],data[5]);
        data.splice(6,2);
        that.yunFacType = data[0].id;
        that.yunpmList = data;
        that.stationFacType = that.yunFacType;
        that.wepmType = that.yunFacType;
        this.getStationMap();
        this.getWeMapData();
      });
    },
    //动态获取点位的半径
    getPointSiteRadius(){
      let zoom = this.map._zoom;
      let radius = 0.1;
      if(zoom > 13){
        radius = (zoom-13)
      }
      return radius;
    },
    // 移动微站显示
    getWzMovingMarkers() {
      this.isDataLoading =true;
      var that = this,radius = this.getPointSiteRadius();
      var mobileSize= 2000;
      this.mobilesiteDatas.clear();
      let getSiteData = async function (current){
        getMobilesiteData(
          that.timeType,
          that.moveFacType || that.yunFacType,
          that.searchData.dateTime,
          current,
          mobileSize
        ).then((res) => {
          // 数据加载缓冲
          that.isDataLoading =false;
          let data = res.data.data;
          for (var i = 0; i < data.length; i++) {
            let sitePoint = data[i];
            that.mobilesiteDatas.set(sitePoint.siteId,sitePoint);
            if(that.sliderValue[1]==that.maxValue){
              if(parseInt(sitePoint.collectValue)>=parseInt(that.sliderValue[0])){
                that.mobilesiteDatasPage.set(sitePoint.siteId,sitePoint);
                that.drawMobilesite(sitePoint,radius);
              }
            }else{
              if(parseInt(sitePoint.collectValue)>=parseInt(that.sliderValue[0]) && parseInt(sitePoint.collectValue)<=that.sliderValue[1] ){
                that.mobilesiteDatasPage.set(sitePoint.siteId,sitePoint);
                that.drawMobilesite(sitePoint,radius);
              }
            }
          }
        },(error) => {
          that.isDataLoading =false;
          if(that.showZhzdLabel){
            that.$message({
              message: "请重新加载页面!",
              type: "warning"
            });
          }

        });
      };
      // 获取移动微站总数
      getMobileSiteCount().then((res) =>{
        let mobileTotal =res.data.data
        for(let current=1; current< mobileTotal/mobileSize + 1;current++){
          getSiteData(current);
        }
      });

    },
    // 鼠标缩放重新描点
    redrawMobilesite(){
      this.movingMarkerLayer.clearLayers();
      let zoom = this.map._zoom, radius = this.getPointSiteRadius();
      for (let value of this.mobilesiteDatasPage.values()) {
        this.drawMobilesite(value,radius)
      }
    },
    //画移动站点
    drawMobilesite(sitePoint, radius){
      let that = this;
      let color,value=sitePoint.collectValue;
      if(!(value == "" || value == null || value < 0 || value == undefined)){
        color = this.getColor(sitePoint.collectValue);
        let circleMaker = L.circleMarker([sitePoint.latitude, sitePoint.logitude], {
          radius: radius,
          color: color,
          opacity: 1,
          fillOpacity: 1,
        });
        circleMaker.addTo(this.movingMarkerLayer).on("click", function (e) {
          if(that.showZhzdLabel || that.showZbwrLabel){
            that.sitePointClick(sitePoint);
          }
        });
      }
    },
    // 移动微站因子change事件
    moveFacClick() {
      this.swatches =this.moveFacType
      this.buttonSearch();
      if(this.swatches == "a34004") {
        this.pmChange = "PM2.5";
      } else if(this.swatches=="a34002"){
        this.pmChange = "PM10";
      }
    },
    //不同因子背景颜色根据色卡变化
    //getAQIColor,getPM2_5Color,getPM10Color,getSO2Color,getNO2Color,getCOColor,getO3Color
    getItemColor(item,value){
      if(item == 'SO₂'){
        return getSO2Color(value);
      } else if(item == 'NO₂'){
        return getNO2Color(value);
      } else if(item == 'CO'){
        return getCOColor(value);
      } else if(item == 'O₃'){
        return getO3Color(value);
      } else if(item == 'PM2.5'){
        return getPM2_5Color(value);
      } else if(item == 'PM10'){
        return getPM10Color(value);
      } else if(item == 'AQI'){
        return getAQIColor(value);
      }else if(item == 'TVOC'){
        return getTVOCColor(value);
      }
    },
    // 根据色卡获取不同移动微站和周边污染圆点的颜色
    getColor(value) {
			if(this.swatches=="a34004"){//PM2.5
        return getPM2_5Color(value);
			}else if(this.swatches=="a34002"){//PM10
       return getPM10Color(value);
			}else if(this.swatches=="a21026"){//SO2
        return getSO2Color(value);
			}else if(this.swatches=="a21004"){//NO2
       return getNO2Color(value);
			}else if(this.swatches=="a21005"){//CO
       return getCOColor(value);
			}else if(this.swatches=="a05024"){//O3
      return getO3Color(value);
			}else if(this.swatches=="AQI"){//AQI
       return getAQIColor(value);
			}else if(this.swatches=="a80219"){//TVOC
       return getTVOCColor(value);
			}
    },
    // 根据色卡获取不同颜色标站图标
    getMarkerIcon(value) {
			if(this.swatches=="a34004"){//PM2.5
        return bz_getPM2_5Color(value);
			}else if(this.swatches=="a34002"){//PM10
       return bz_getPM10Color(value);
			}else if(this.swatches=="a21026"){//SO2
        return bz_getSO2Color(value);
			}else if(this.swatches=="a21004"){//NO2
       return bz_getNO2Color(value);
			}else if(this.swatches=="a21005"){//CO
       return bz_getCOColor(value);
			}else if(this.swatches=="a05024"){//O3
      return bz_getO3Color(value);
			}else if(this.swatches=="AQI"){//AQI
       return bz_getAQIColor(value);
			}else if(this.swatches=="a80219"){//TVOC
       return bz_getTVOCColor(value);
			}
    },
    // 根据色卡获取不同颜色微站图标
    getWzMarkerIcon(value) {
			if(this.swatches=="a34004"){//PM2.5
        return wz_getPM2_5Color(value);
			}else if(this.swatches=="a34002"){//PM10
       return wz_getPM10Color(value);
			}else if(this.swatches=="a21026"){//SO2
        return wz_getSO2Color(value);
			}else if(this.swatches=="a21004"){//NO2
       return wz_getNO2Color(value);
			}else if(this.swatches=="a21005"){//CO
       return wz_getCOColor(value);
			}else if(this.swatches=="a05024"){//O3
      return wz_getO3Color(value);
			}else if(this.swatches=="AQI"){//AQI
       return wz_getAQIColor(value);
			}else if(this.swatches=="a80219"){//TVOC
       return wz_getTVOCColor(value);
			}
    },
    // 标题颜色
    getDivName(value){
			if(this.swatches=="a34004"){//PM2.5
        return title_getPM2_5Color(value);
			}else if(this.swatches=="a34002"){//PM10
       return title_getPM10Color(value);
			}else if(this.swatches=="a21026"){//SO2
        return title_getSO2Color(value);
			}else if(this.swatches=="a21004"){//NO2
       return title_getNO2Color(value);
			}else if(this.swatches=="a21005"){//CO
       return title_getCOColor(value);
			}else if(this.swatches=="a05024"){//O3
      return title_getO3Color(value);
			}else if(this.swatches=="AQI"){//AQI
       return title_getAQIColor(value);
			}else if(this.swatches=="a80219"){//TVOC
       return title_getTVOCColor(value);
			}
    },
    // 车辆列表
    getVehicleMarkers() {
      console.log(this.vehicleLayer)
      this.vehicleMap = this.vehicleMap?this.vehicleMap:new Map();
      this.vehicleDataMap = this.vehicleDataMap?this.vehicleDataMap:new Map();
      // this.vehicleDataMap = this.vehicleMap;
      let icon = L.icon({
        iconUrl: iconVehicle,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      var factor;
      if(this.activeMenu=='menu-ydwz' ){
					factor =this.moveFacType
				}else if(this.activeMenu=='menu-yuntu'){
					factor =this.yunFacType
				}
      var that =this;
      getVehicleList(factor).then((res) => {
        const data = res.data.data;
        for(let vehicle of data){
          if(vehicle.plateNumber && vehicle.lat && vehicle.lng){
            let vehicleMarker = that.vehicleMap.get(vehicle.plateNumber);
            that.vehicleDataMap.set(vehicle.plateNumber,vehicle);
            if(vehicleMarker){
              vehicleMarker.setLatLng([vehicle.lat, vehicle.lng]);
            }else{
              vehicleMarker = L.marker([vehicle.lat, vehicle.lng], {
                icon: icon,
              });
              vehicleMarker.addTo(that.vehicleLayer).on("click", function (e) {
                if(that.showVehicleLabel){
                  that.vehicleDetailClick(vehicle);
                }
              })
              that.vehicleMap.set(vehicle.plateNumber,vehicleMarker);
            }
          }
        }
      });
    },
    // 周边污染
    getbzZbwr() {
      var bzAroundArea =this.bzAroundArea*0.001
      // 获取圆圈范围
      var bzList =this.bzMapList;
      let radius = this.getPointSiteRadius();
      this.mobilesiteDatas.clear();
      this.mobilesiteDatasPage.clear();
      let that =this;
      let getAroundSiteData = async function (lgt,lat){
        getAroundSite(
          bzAroundArea,
          that.stationFacType,
          that.timeType,
          that.searchData.dateTime,
          lgt,
          lat
        ).then((res) => {
          const data = res.data.data;
          for (var i = 0; i < data.length; i++) {
            let color = that.getColor(data[i].collectValue);
            let sitePoint = data[i];
            let iconUrl=""
            if(data[i].siteType==2){
                iconUrl = that.getWzMarkerIcon(data[i].collectValue);
                let icon = L.icon({
                  iconUrl: iconUrl,
                  iconSize: [30, 60],
                  iconAnchor: [15, 60],
                });
                let markerIcon = L.divIcon({
                  html: data[i].collectValue==''?'':parseInt(data[i].collectValue), //marker标注
                  className: "my-div-icon-we",
                  iconSize: [30, 30],
                  iconAnchor: [15, 60], //文字标注相对位置
                });
                let divName= that.getDivName(data[i].collectValue);
                var titlelength =data[i].siteName.length;
                let markerTitle = L.divIcon({
                  html: data[i].siteName, //marker标注
                  className: divName,
                  iconSize: [50+10*titlelength, 20], //marker宽高
                  iconAnchor: [25+5*titlelength, 85], //文字标注相对位置
                });
                if(that.activeMenu !="menu-yuntu"){
                  L.marker([data[i].latitude, data[i].logitude],{icon:icon}).addTo(that.aroundLayer).addTo(that.map);
                  // 名称
                  L.marker([data[i].latitude, data[i].logitude], {icon: markerTitle,}).addTo(that.aroundLayer).addTo(that.map);
                  L.marker([data[i].latitude, data[i].logitude], {icon: markerIcon,}).addTo(that.aroundLayer).addTo(that.map).on("click", function (e) {
                    if(that.showZbwrLabel){
                      that.wzMarkerClick(sitePoint.siteId,sitePoint);
                    }
                  });
                }
            }else if(data[i].siteType==3){
                if(!that.mobilesiteDatas.get(data[i].siteId)){
                  that.mobilesiteDatas.set(data[i].siteId,data[i])
                  that.mobilesiteDatasPage.set(data[i].siteId,data[i]);
                  that.drawMobilesite(data[i],radius);
                }
            }
          }
        });
      }
      for (var i = 0; i < bzList.length; i++) {
        if(this.sliderValue==this.maxValue){
          if(parseInt(bzList[i].val==''? 0: bzList[i].val)>= this.sliderValue[0]){
              getAroundSiteData(bzList[i].longitude,bzList[i].latitude);
              let color = this.getColor(bzList[i].val);
              L.circle([bzList[i].latitude, bzList[i].longitude], {
                color: color,
                fillOpacity: 0,
                radius: this.bzAroundArea,
              }).addTo(this.aroundLayer);
          }
        }else{
          if(parseInt(bzList[i].val==''? 0: bzList[i].val)>= this.sliderValue[0] && parseInt(bzList[i].val==''? 0: bzList[i].val)<= this.sliderValue[1]){
              getAroundSiteData(bzList[i].longitude,bzList[i].latitude);
              let color = this.getColor(bzList[i].val);
              L.circle([bzList[i].latitude, bzList[i].longitude], {
                color: color,
                fillOpacity: 0,
                radius: this.bzAroundArea,
              }).addTo(this.aroundLayer);
          }
        }

      }
    },
    // onLoad(page, params = {}) {
    //   this.loading = true;
    //   this.data =[];
    //   getAlertList(
    //     this.page.currentPage,
    //     this.page.pageSize,
    //     Object.assign(params, this.query),
    //     this.mn,
    //     this.alertTime
    //   ).then((res) => {
    //     const data = res.data.data;
    //     this.page.total = data.total;
    //     this.data = data.records;
    //   });
    // },
    // // 污染报警
    // wrbjLoad(page, params = {}) {
    //   getMobileAlertList(
    //     this.pageWrbj.currentPage,
    //     this.pageWrbj.pageSize,
    //     Object.assign(params, this.query),
    //     this.mnWrbj,
    //     this.alertTimeWrbj
    //   ).then((res) => {
    //     const data = res.data.data;
    //     this.pageWrbj.total = data.total;
    //     this.wrbjdata = data.records;
    //   });
    // },
    // // 道路排名
    // rankLoad() {
    //     var time = this.formatSelectDate(new Date(this.searchData.dateTime));
    //     getAreaRank(
    //       this.areaRankDesc,
    //       this.timeType,
    //       this.activeWZRankType,
    //       this.searchData.dateTime,
    //       this.wepmType,
    //       this.areaPage.currentPage,
    //       this.areaPage.pageSize
    //     ).then((res) => {
    //       const data = res.data.data.records;
    //       data.forEach(item=>{
    //       item.val = item.val+item.unit;
    //     });
    //       this.areaData = data;
    //       this.areaPage.total =res.data.data.total;
    //     });
    // },
    // // 区域排序
    // areaSort(){
    //   if(this.areaRankDesc == 1){
    //     this.areaRankDesc = 0;
    //     this.rankLoad();
    //   } else if(this.areaRankDesc == 0){
    //     this.areaRankDesc = 1;
    //     this.rankLoad();
    //   }
    // },
    // areaCurrentChange(currentPage){
    //   this.areaPage.currentPage = currentPage;
    //   this.rankLoad();
    // },
    // //道路排名
    // ywRankLoad() {
    //     var time = this.formatSelectDate(new Date(this.searchData.dateTime));
    //     getRoadRank(
    //       this.roadRankDesc,
    //       this.timeType,
    //       this.searchData.dateTime,
    //       this.moveFacType,
    //       this.roadPage.currentPage,
    //       this.roadPage.pageSize
    //     ).then((res) => {
    //       const data = res.data.data.records;
    //       data.forEach(item=>{
    //       item.val = item.val+item.unit;
    //     });
    //       this.roadData = data;
    //       this.roadPage.total =res.data.data.total;
    //     });
    // },
    // // 道路排序
    // roadSort(){
    //   if(this.roadRankDesc == 1){
    //     this.roadRankDesc = 0;
    //     this.ywRankLoad();
    //   } else if(this.roadRankDesc == 0){
    //     this.roadRankDesc = 1;
    //     this.ywRankLoad();
    //   }
    // },
    // roadCurrentChange(currentPage){
    //   this.roadPage.currentPage = currentPage;
    //   this.ywRankLoad();
    // },
    // // 污染排名
    // getPollutionRank() {
    //   var time = this.formatSelectDate(new Date(this.searchData.dateTime));
    //   getPollutionRank(
    //     this.pollutionRankDesc,
    //     this.timeType,
    //     this.searchData.dateTime,
    //     this.stationFacType,
    //     this.bzPage.currentPage,
    //     this.bzPage.pageSize
    //   ).then((res) => {
    //     const data = res.data.data.records;
    //     data.forEach(item=>{
    //       item.val = item.val+item.unit;
    //     });
    //     this.rankdata = data;
    //     this.bzPage.total =res.data.data.total;
    //   });
    // },
    // // 污染排序
    // wrpmSort(){
    //   if(this.pollutionRankDesc == 1){
    //     this.pollutionRankDesc = 0;
    //     this.getPollutionRank();
    //   } else if(this.pollutionRankDesc == 0){
    //     this.pollutionRankDesc = 1;
    //     this.getPollutionRank();
    //   }
    // },
    // // 搜索条件改变
    // searchChange(params, done) {
    //   this.query = params;
    //   this.page.currentPage = 1;
    //   this.onLoad(this.page, params);
    //   done();
    // },
    // //微站报警分页
    // wzbjcurrentChange(currentPage) {
    //   this.page.currentPage = currentPage;
    //   this.onLoad();
    // },
    // //污染报警分页
    // wrbjcurrentChange(currentPage) {
    //   this.pageWrbj.currentPage = currentPage;
    //   this.wrbjLoad();
    // },
    // //wrbj 搜索
    // searchChangeWrbj(params, done){
    //   this.query = params;
    //   this.pageWrbj.currentPage = 1;
    //   this.wrbjLoad(this.pageWrbj, params);
    //   done();
    // },
    async getTimeType() {
      var that =this;
     await getTimeList().then((res) => {
        const data = res.data.data;
        that.timeType = data[0].id;
        that.timeList = data;
      });
    },
    // 时间格式化
    formatSelectDate(date) {
      var dateHour = new Date(date)
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}-${this.timeAdd(dateHour.getDate())}`;
    },
    formatFullDate(date) {
      var dateHour = new Date(date)
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}-${this.timeAdd(dateHour.getDate())}${' '+ this.timeAdd(dateHour.getHours())+':00:00'}`;
    },
    formatMonthDate(date) {
      var dateHour = new Date(date)
      return `${dateHour.getFullYear()}-${this.timeAdd(
        dateHour.getMonth() + 1
      )}`;
    },
    timeAdd(str) {
      if (str <= 9) {
        str = "0" + str;
      }
      return str;
    },
    // 切换菜单按钮置空数据
    resetData() {
      this.map.setView([31.57814, 120.309906], 12)
      this.swatches="a34004"
      this.searchData = {
        dateType: '10',
        dateTime: this.formatSelectDate(new Date()),
      };
      this.timeType = this.searchData.dateType;
      this.isDataLoading =false;
      this.showBZMarkerLabel = false;
      this.showWzMarkerLabel = false;
      this.showZhzdLabel = false;
      this.showMovingRank= false;
      this.showVehicleLabel =false,
      this.showWRPMTable= false;
      this.showBzDetail= false;
      this.showDotChart= false;
      this.showBaojing= false;
      this.showwrbj= false;
      this.showZbwrLabel=false;
      this.showAreaRank = false;
      this.showFixedRank = false;
      this.showRoadRank = false;
      this.showBzPoint = false;
      this.showSitePoint = false;
      this.showWzDetail = false;
      this.showVehicleDetail = false;
      this.showCysbLabel =false;
      this.bzCheckMenus = deepClone(this.defaultBZMenus);
      this.wzCheckMenus = deepClone(this.defaultWZMenus);
      this.ydwzCheckMenus = deepClone(this.defaultYDWZMenus);
      this.yuntuCheckMenus = deepClone([
        ...this.defaultBZMenus,
        ...this.defaultWZMenus,
        ...this.defaultYDWZMenus,
      ]);
      this.yuntuCheckMenus.forEach(e=>{
      if(e.id=="wz-yuntu"){
        e.isCheck =false
      }
      })
    },
    // 清空所有图层数据
    clearAllLayer(){
      this.map.removeLayer(this.wztitleLayer);
      this.map.removeLayer(this.bztitleLayer);
      this.bzLayer.clearLayers();
      this.bztitleLayer.clearLayers();
      this.wzLayer.clearLayers();
      this.wztitleLayer.clearLayers();
      this.aroundLayer.clearLayers();
      this.movingMarkerLayer.clearLayers();
      this.dustLayer.clearLayers();
      this.vehicleLayer.clearLayers();
      this.vehicleMap =null;
      this.vehicleDataMap =null;
      this.showCyRank = false;
      this.showBzPoint = false;
      this.showSitePoint = false;
      this.showWzDetail = false;
      this.showVehicleDetail = false;
      this.clear();
    },
    // 左侧菜单点击
    menuClick(id) {
    // 当点击菜单不同时才刷新页面
    if(id==this.activeMenu){
      this.tucengShow = true;
    } else {
    this.resetColorValue =!this.resetColorValue;
      this.activeMenu = id;
        switch (id) {
          // 标站
          case "menu-bz":
            this.resetData();
            this.clearAllLayer();
            this.showBZMarkerLabel = false;
            this.getStationFac();
            break;
          // 固定微站
          case "menu-wz":
            this.resetData();
            this.clearAllLayer();
            this.getFactors();
            break;
          // 移动微站
          case "menu-ydwz":
            this.resetData();
            this.clearAllLayer();
            this.showZhzdLabel = true;
            this.getMoveFactors();
            break;
          // 云图
          case "menu-yuntu":
            this.resetData();
            this.clearAllLayer();
            this.showBZMarkerLabel = false;
            this.showWzMarkerLabel = false;
            this.getYunFactors();
            break;
        }
    }
    },
    // 数据图层菜单点击
    layerCheck(item) {
      if(item.title == '尘源识别'&&(this.wepmType == 'a80219' ||this.wepmType == 'a21026'||this.wepmType == 'a21004'||this.wepmType == 'a21005'||this.wepmType == 'a05024'||this.wepmType == 'AQI' ||
      this.yunFacType == 'a80219' ||this.yunFacType == 'a21026'||this.yunFacType == 'a21004'||this.yunFacType == 'a21005'||this.yunFacType == 'a05024'||this.yunFacType == 'AQI')){
      }else {
        item.isCheck = !item.isCheck;
        if (typeof item.checkEvent === "function") item.checkEvent(item);
      }
    },
    /* === 标站图层点击 === start */
    // 标站名称
    bzmcClick() {
      this.showBZMarkerLabel = !this.showBZMarkerLabel;
      if(this.showBZMarkerLabel){
        this.map.addLayer(this.bztitleLayer)
      }else{
        this.map.removeLayer(this.bztitleLayer)
      }
    },
    // 标站站点点击
    bzPonitClick(bzPoint){
        this.bzPoint = bzPoint;
        getBzPonitDetail(bzPoint.stationcode,this.searchData.dateTime,this.timeType).then(res=>{
          let data = res.data.data;
          this.bzData = data;
          let series = [];
          let xarray = data[0].xarray;
          let legend = [];
          for(let i=0;i<data.length;i++){
            legend.push(data[i].name + '-' + data[i].unit);
            series.push({
              name: data[i].name + '-' + data[i].unit,
              type: 'line',
              data: data[i].yarray
            });
          }
          let chartDom = document.getElementById('bz-point-line');
          let myChart = echarts.init(chartDom);
          let option;
          option = {
            title: {
            text: ''
          },
          color: ['#c23531','blue', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + param.seriesName.split('-')[1]; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
										}
										htmlStr += '<div>';
										//为了保证和原来的效果一样，这里自己实现了一个点的效果
										htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
										// 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
										//htmlStr += '<span style="color:'+color+'">';
										//圆点后面显示的文本
										htmlStr += seriesName + '：' + value;
										// 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
										//htmlStr += '</span>';
										htmlStr += '</div>';
									}
									return htmlStr;
								}
          },
          legend: {
          data: legend,
          formatter: function(params) {
									let arr = params.split('-')
									return arr[0]
								},
          textStyle: {
            color: "#FFFFFF",
          },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
          type: "category",
          boundaryGap: false,
          data: xarray,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          },
          yAxis: {
            type: "value",
            axisLine: {
          lineStyle: {
            type: "solid",
            color: "#fff",
          },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            width: "0.5",
          },
          },
          },
          series: series
          };
          option && myChart.setOption(option);
        });
        this.showBzPoint = true;
    },
    //关闭标站详情
    closeBzDetail(){
      this.showBzPoint = false;
    },
    // 周边污染
    zbwrClick() {
      this.showZbwrLabel = !this.showZbwrLabel;
      if(this.showZhzdLabel){
          if (this.showZbwrLabel) {
            this.$message.warning("不能同时点击周边污染");
            this.showZbwrLabel =!this.showZbwrLabel;
            this.yuntuCheckMenus[1].isCheck=false;
          }
      }else{
        if (this.showZbwrLabel) {
          this.getbzZbwr();
        } else {
          this.movingMarkerLayer.clearLayers();
          this.aroundLayer.clearLayers();
        }
      }

    },
    // 污染排名
    wrpmClick(item) {
      this.showWRPMTable = !this.showWRPMTable;
      if(this.showWRPMTable){
        this.$refs.wrpmTable.getPollutionRank();
      }
    },
    // 报警
    baojingClick() {
      this.showBaojing = !this.showBaojing;
    },
    wrbjClick() {
      this.showwrbj = !this.showwrbj;
    },
    /* === 标站图层点击 === end */

    // 微站名称点击事件
    wzmcClick(item) {
      this.showWzMarkerLabel = !this.showWzMarkerLabel;
      if (this.showWzMarkerLabel) {
        this.map.addLayer(this.wztitleLayer);
      } else {
        this.map.removeLayer(this.wztitleLayer);
      }
    },
    // 尘源识别点击事件
    cysbClick(){
      this.showCysbLabel = !this.showCysbLabel;
      if (this.showCysbLabel) {
        this.map.addLayer(this.dustLayer);
        this.showCyRank =true;
        this.getDustBag();
      } else {
        this.map.removeLayer(this.dustLayer);
        this.showCyRank =false;
      }
    },
    // 微站标记点击事件
    wzMarkerClick(siteId,wzSite) {
      this.siteId = siteId;
      this.wzSite = wzSite;
      this.showWzDetail = true;
    },
    // 微站详情弹框关闭
    closeWzDetail(){
      this.showWzDetail = false;
    },
    resetSiteId(){
      this.siteId = '';
    },
    // 道路云图
    zhsjClick() {
      this.showZhzdLabel = !this.showZhzdLabel;
      if (this.showZbwrLabel) {
        this.$message.warning("不能同时选择道路云图");
        this.showZhzdLabel =!this.showZhzdLabel;
        this.yuntuCheckMenus[6].isCheck=false;
      }else{
        if (this.showZhzdLabel) {
            this.movingMarkerLayer.clearLayers();
            this.getWzMovingMarkers();
            this.map.addLayer(this.movingMarkerLayer);
          } else {
            this.map.removeLayer(this.movingMarkerLayer);
          }
      }

    },
    // 实时车辆
    vehicleClick(item) {
      this.showVehicleLabel = !this.showVehicleLabel
      if(this.showVehicleLabel){
        this.dataRefreh();
        this.map.addLayer(this.vehicleLayer);
      }else{
        this.vehicleLayer.clearLayers();        this.vehicleLayer.clearLayers();
        this.map.removeLayer(this.vehicleLayer);
        this.clear();
      }
    },
    // 地图微站每个小点点击事件
    sitePointClick(sitePoint) {
      let siteInfoId = sitePoint.siteId;
      let timeType = this.timeType;
      if(timeType == '实时'){
        timeType = '10'
      }
      getMobileSiteDetail(this.searchData.dateTime,timeType,siteInfoId).then(res=>{
        let data = res.data.data;
        this.sitePoint = data;
          //走航折线图
          let pm10Line = data.pm10Trend;
          let pm10MarkLine = {
                symbol:"none",               //去掉警戒线最后面的箭头
                data : [{
                    silent:false,             //鼠标悬停事件  true没有，false有
                    lineStyle:{               //警戒线的样式  ，虚实  颜色
                        type:"solid",
                        color:"red"
                    },
                    yAxis: "150"     //警戒线在y轴的坐标
                }]
            }
          let pm25Line = data.pm25Trend;
          let pm5MarkLine = {
                symbol:"none",               //去掉警戒线最后面的箭头
                data : [{
                    silent:false,             //鼠标悬停事件  true没有，false有
                    lineStyle:{               //警戒线的样式  ，虚实  颜色
                        type:"solid",
                        color:"red"
                    },
                    yAxis: "75"     //警戒线在y轴的坐标
                }]
            }
          let tvocLine = data.tvocTrend;
          let chartDom10 = document.getElementById('zouhang-charts-pm10');
          let myChart10 = echarts.init(chartDom10);
          let option10;
          option10 = {
            title: {
            text: ''
          },
          tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + '(ug/m3)'; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
										}
										htmlStr += '<div>';
										htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
										htmlStr += seriesName + '：' + value;
										htmlStr += '</div>';
									}
									return htmlStr;
								}
          },
          legend: {
          data: ['PM10'],
          textStyle: {
            color: "#FFFFFF",
          },
          },
          grid: {
            left: "3%",
            right: "7%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
          type: "category",
          boundaryGap: false,
          data: pm10Line.xarray,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          },
          yAxis: {
            type: "value",
            axisLine: {
          lineStyle: {
            type: "solid",
            color: "#fff",
          },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            width: "0.5",
          },
          },
          },
          series: [{
            name: 'PM10',
            type: 'line',
            color:'yellow',
            data: pm10Line.yarray,
            markLine:pm10MarkLine
          }]
          };
          option10 && myChart10.setOption(option10);
          //pm2.5
          let chartDom25 = document.getElementById('zouhang-charts-pm25');
          let myChart25 = echarts.init(chartDom25);
          let option25;
          option25 = {
            title: {
            text: ''
          },
          tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + '(ug/m3)'; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
										}
										htmlStr += '<div>';
										htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
										htmlStr += seriesName + '：' + value;
										htmlStr += '</div>';
									}
									return htmlStr;
								}
          },
          legend: {
          data: ['PM2.5'],
          textStyle: {
            color: "#FFFFFF",
          },
          },
          grid: {
            left: "3%",
            right: "6%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
          type: "category",
          boundaryGap: false,
          data: pm25Line.xarray,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          },
          yAxis: {
            type: "value",
            axisLine: {
          lineStyle: {
            type: "solid",
            color: "#fff",
          },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            width: "0.5",
          },
          },
          },
          series: [{
            name: 'PM2.5',
            type: 'line',
            color:'yellowgreen',
            data: pm25Line.yarray,
            markLine:pm5MarkLine
          }]
          };
          option25 && myChart25.setOption(option25);
          //tvoc
          let chartDomtvoc = document.getElementById('zouhang-charts-tvoc');
          let myCharttvoc = echarts.init(chartDomtvoc);
          let optiontvoc;
          optiontvoc = {
            title: {
            text: ''
          },
          tooltip: {
          trigger: 'axis',
          formatter: function(params, ticket, callback) {
									var htmlStr = '';
									for(var i = 0; i < params.length; i++) {
										var param = params[i];
										var xName = param.name; //x轴的名称
										var seriesName = param.seriesName.split('-')[0]; //图例名称
										var value = param.value + ' ' + '(ug/m3)'; //y轴值
										var color = param.color; //图例颜色
										if(i === 0) {
											htmlStr += xName + '<br/>'; //x轴的名称
										}
										htmlStr += '<div>';
										htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
										htmlStr += seriesName + '：' + value;
										htmlStr += '</div>';
									}
									return htmlStr;
								}
          },
          legend: {
          data: ['TVOC'],
          textStyle: {
            color: "#FFFFFF",
          },
          },
          grid: {
            left: "3%",
            right: "6%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
          type: "category",
          boundaryGap: false,
          data: tvocLine.xarray,
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          },
          yAxis: {
            type: "value",
            axisLine: {
          lineStyle: {
            type: "solid",
            color: "#fff",
          },
          },
          axisLabel: {
            textStyle: {
              color: "#fff",
            },
          },
          splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            width: "0.5",
          },
          },
          },
          series: [{
            name: 'TVOC',
            type: 'line',
            color:'yellowgreen',
            data: tvocLine.yarray,
          }]
          };
          optiontvoc && myCharttvoc.setOption(optiontvoc);
        });
      this.showSitePoint = true;
    },
    //移动微站站点详情关闭
    closeMobileWzDetail(){
      this.showSitePoint = false;
    },
    // 分页
    currentChange(currentPage) {
      this.bzPage.currentPage = currentPage;
      // this.getPollutionRank();
    },
    // 实时车辆详情
    vehicleDetailClick(carData) {
      //this.carData = carData;
      this.carData = this.vehicleDataMap.get(carData.plateNumber);
      this.showVehicleDetail = true;
    },
    // 关闭实施车辆点击详情
    closeCarDetail(){
      this.showVehicleDetail = false;
    },
    //数据图层关闭
    closeTuceng(){
      this.tucengShow = false;
    },

    /* === 移动微站 end === */

    /* === 云图 start === */
    airmapClick() {
      this.showDotChart = true;
    },
    /* === 云图 end === */
    handler() {},
    // 查看详情
    lookDetail(data, target) {
      //滚动到指定元素位置
      this.$nextTick(() => {});
    },
    dotClick(item) {
      if (!this.showDotChart) this.showDotChart = true;
      //   var activeItem = this.dotList.find((t) => t.active);
      if (activeItem && activeItem.id === item.id) return;
      if (activeItem) activeItem.active = false;
      item.active = true;
    },
  },
};
</script>
<style scoped>
@import "~@/styles/element-ui-dark.scss";
</style>
<style lang="scss" scoped>
* {
-webkit-box-sizing: content-box;
box-sizing: content-box;
}
.mb-10 {
  margin-bottom: 10px;
}
.wd-70 {
  width: 70px;
}
.wd-75 {
  width: 75px;
  /deep/.el-input__inner {
    padding-left: 8px;
  }
}
.wd-80 {
  width: 80px;
}
.wd-100 {
  width: 100px;
}
.wd-330 {
  width: 200px;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-image: url(/img/bigScreen/16.png);
  background-repeat: no-repeat;
  background-color: "#1d285d";
  background-size: 100% 100%;
  width: 100%;
  ::-webkit-scrollbar {
    display: none;
  }
  // * {
  //   box-sizing: border-box;
  // }
}
.wz {
  // height: calc(100vh - 20px);
  height:98%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  &-left {
    width: 85px;
    height: 100%;
    background-color: #011219;
    border-right: 3px solid #1d262d;
    z-index:5;
    &-menu {
      cursor: pointer;
      text-align: center;
      padding: 10px 0 5px;
      .menu-title {
        font-size: 14px;
        color: white;
        margin-top: 5px;
      }
      &:hover {
        background-color: #333;
      }
    }
    .active {
      background-color: #21627e;
    }
    .disactive {
      pointer-events: none;
    }
  }
  &-right {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  }
  &-mapBacground_dark{
    /deep/.leaflet-tile-container img {
    -webkit-filter: sepia(60%) invert(100%);
    -moz-filter: sepia(60%) invert(100%);
    -ms-filter: sepia(60%) invert(100%);
    -o-filter: sepia(60%) invert(100%);
    filter: gray sepia(60%) invert(100%);
    opacity: 0.8 !important;
    }
  }
  &-mapBacground_light{
    /deep/.leaflet-tile-container img {
      // -webkit-filter: grayscale(100%) invert(100%);
      // -moz-filter: grayscale(100%) invert(100%);
      // -ms-filter: grayscale(100%) invert(100%);
      // -o-filter: grayscale(100%) invert(100%);
      // filter: gray grayscale(100%) invert(100%);
      // opacity: 0.8 !important;
    }
  }
  &-search {
    position: absolute;
    top: 10px;
    left: 95px;
    background-image: url(/img/map/search-border.png);
    // border:1px solid #1ad1e3;
    background-size: 100% 100%;
    background-color: rgba(2, 28, 41, 0.7);
    z-index: 12;
    border-radius: 8px;
    padding: 7px 10px;
  }
  &-data-layer {
    position: absolute;
    top: 65px;
    left: 95px;
    width: 250px;
    background-image: url(/img/background-image.png);
    // border:1px solid #1ad1e3;
    background-size: 100% 100%;
    // background-color: rgba(2, 28, 41, 0.7);
    z-index: 9;
    padding: 15px;
    .layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 10px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
    .layer-menus {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .layer-split {
      height: 1px;
      background-color: #1ad1e3;
      width: 100%;
      margin-bottom: 10px;
      margin-top: 5px;
    }
    .bz-check-menu {
      // width: 65px;
      width: 25%;
      margin-left: 20px;
      margin-bottom: 5px;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      padding: 8px 0 3px;
      border: 1px solid transparent;
      .menu-icon {
        width: 40px;
        height: 40px;
      }
      .menu-title {
        font-size: 13px;
        color: white;
        margin-top: 0px;
      }
      &:nth-child(3n + 1) {
        margin-left: 0;
      }
      &:hover {
        background-color: #333;
      }
    }
    .active {
      background-color: #06394e;

      border-color: #1ad1e3;
      &:hover {
        background-color: #06394e;
      }
    }
    .rankRadio {
      ::v-deep .el-radio-button--mini .el-radio-button__inner {
        padding: 7px 5px;
      }
    }
  }
  &-loading{
    position: absolute;
    top: 30%;
    left: 45%;
    width: 243px;
    font-size: 10px;
    font-weight: 550;
    z-index: 2;
  }
  &-vueBox{
    position: absolute;
    top: 1.4%;
    right: 11%;
    width: 750px;
    z-index: 99;
    div, ul, li, span, img {
            margin: 0;
            padding: 0;
            display: flex;
            box-sizing: border-box;
        }
        .marquee {
            width: 100%;
            height: 35px;
            align-items: center;
            color: #3A3A3A;
            background-color: #b3effe;
            display: flex;
            box-sizing: border-box;
        }

        .marquee_title {
            padding: 0 20px;
            height: 30px;
            font-size: 14px;
            border-right: 1px solid #d8d8d8;
            align-items: center;
        }
        .marquee_box {
            display: block;
            position: relative;
            width: 85%;
            height: 30px;
            overflow: hidden;
        }

        .marquee_list {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
        }

        .marquee_top {
            transition: all 0.5s;
            margin-top: -30px
        }

        .marquee_list li {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            padding-left: 20px;
        }

        .marquee_list li span {
            padding: 0 2px;
        }

        .red {
            color: #FF0101;
        }
  }
  &-bac{
    position: absolute;
    top: 1.4%;
    right: 3%;
    z-index: 99;
  }
  &-color {
    position: absolute;
    bottom: 34px;
    right: 10px;
    z-index: 3;
  }
  &-dust {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    bottom: 8%;
    right: 10px;
    z-index: 4;
    width:150px;
    padding:10px;
    background-color: #dadada;
    // background-color: rgba(2, 28, 41, 0.7);

  }
  &-dust-cicle1 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 700;
    text-align: center;
    float: left;
    background: #0a4bf1;
    // border: 6px solid #0a4bf1;
  }
  &-dust-cicle2 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 700;
    text-align: center;
    float: left;
    background: #afafaf;
  }
}
.wz_bigScreen {
  height: calc(100vh - 20px);
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  &-left {
    width: 85px;
    height: 100%;
    background-color: #011219;
    border-right: 3px solid #1d262d;
    &-menu {
      cursor: pointer;
      text-align: center;
      padding: 10px 0 5px;
      .menu-title {
        font-size: 14px;
        color: white;
        margin-top: 5px;
      }
      &:hover {
        background-color: #333;
      }
    }
    .active {
      background-color: #06394e;
    }
  }
  &-right {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  }
  &-search {
    position: absolute;
    top: 10px;
    left: 95px;
    background-image: url(/img/map/search-border.png);
    // border:1px solid #1ad1e3;
    background-size: 100% 100%;
    background-color: rgba(2, 28, 41, 0.7);
    z-index: 12;
    border-radius: 8px;
    padding: 7px 10px;
  }
  &-data-layer {
    position: absolute;
    top: 65px;
    left: 95px;
    width: 243px;
    background-image: url(/img/background-image.png);
    // border:1px solid #1ad1e3;
    background-size: 100% 100%;
    // background-color: rgba(2, 28, 41, 0.7);
    z-index: 9;
    padding: 15px;
    .layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 10px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
    .layer-menus {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .layer-split {
      height: 1px;
      background-color: #1ad1e3;
      width: 100%;
      margin-bottom: 10px;
      margin-top: 5px;
    }
    .bz-check-menu {
      // width: 65px;
      width: 25%;
      margin-left: 20px;
      margin-bottom: 5px;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      padding: 8px 0 3px;
      border: 1px solid transparent;
      .menu-icon {
        width: 40px;
        height: 40px;
      }
      .menu-title {
        font-size: 13px;
        color: white;
        margin-top: 0px;
      }
      &:nth-child(3n + 1) {
        margin-left: 0;
      }
      &:hover {
        background-color: #333;
      }
    }
    .active {
      background-color: #06394e;
      border-color: #1ad1e3;
      &:hover {
        background-color: #06394e;
      }
    }
    .rankRadio {
      ::v-deep .el-radio-button--mini .el-radio-button__inner {
        padding: 7px 10px;
      }
    }
  }
  &-loading{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 243px;
    font-size: 10px;
    font-weight: 550;
    z-index: 2;
  }
  &-color {
    position: absolute;
    bottom: 2%;
    right: 10px;
    z-index: 3;
  }
  &-vueBox{
      position: absolute;
      top: 1.4%;
      right: 11%;
      width: 750px;
      z-index: 99;
      div, ul, li, span, img {
              margin: 0;
              padding: 0;
              display: flex;
              box-sizing: border-box;
          }
          .marquee {
              width: 100%;
              height: 35px;
              align-items: center;
              color: #3A3A3A;
              background-color: #b3effe;
              display: flex;
              box-sizing: border-box;
          }

          .marquee_title {
              padding: 0 20px;
              height: 30px;
              font-size: 14px;
              border-right: 1px solid #d8d8d8;
              align-items: center;
          }

          .marquee_box {
              display: block;
              position: relative;
              width: 85%;
              height: 30px;
              overflow: hidden;
          }

          .marquee_list {
              display: block;
              position: absolute;
              top: 0;
              left: 0;
          }

          .marquee_top {
              transition: all 0.5s;
              margin-top: -30px
          }

          .marquee_list li {
              height: 30px;
              line-height: 30px;
              font-size: 14px;
              padding-left: 20px;
          }

          .marquee_list li span {
              padding: 0 2px;
          }

          .red {
              color: #FF0101;
          }
    }
    &-bac{
      position: absolute;
      top: 1.4%;
      right: 3%;
      z-index: 99;
    }
    &-dust {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      bottom: 8%;
      right: 10px;
      z-index: 4;
      width:150px;
      padding:10px;
      background-color: #dadada;
      // background-color: rgba(2, 28, 41, 0.7);

    }
    &-dust-cicle1 {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-weight: 700;
      text-align: center;
      float: left;
      background: #0a4bf1;
      // border: 6px solid #0a4bf1;
    }
    &-dust-cicle2 {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-weight: 700;
      text-align: center;
      float: left;
      background: #afafaf;
    }
  }
// 微站图表高度
$bzChartHeight: 235px;
$wzChartHeight: 400px;
// 图表之间的距离
$chartSpacing: 10px;
.bz {
  position: absolute;
  top: 0;
  right: 0;
  &-hide {
    width: 40px;
    height: 40px;
    &-btn {
      background-color: #333;
      color: white;
      cursor: pointer;
      padding: 5px 10px;
    }
  }
  &-chart {
    width: 350px;
    height: $bzChartHeight;
  }
}
/* 从右到左移动动画开始 */
.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
/* 从右到左移动动画结束 */
/* 从左到右移动动画开始 */
.slide-left-enter-active {
  transition: all 0.3s linear;
  transform: translateX(0);
}
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-100%);
}
/* 从左到右移动动画结束 */
.dot-chart {
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  position: absolute;
  top: 420px;
  right: 0;
  width: 350px;
  height: 400px;
  z-index: 9;
  padding: 10px;
  .site-detail {
    color: white;
    .close-site-point {
      width: 12px;
      height: 210px;
      background-image: url(/img/system/zhan.png);
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1px;
      cursor: pointer;
    }
    .layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 10px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
    .site-content{

      &-1{
        margin-top: 20px;
        margin-left: 20px;
        font-weight: 600;
        .pm10 {
          color: black;
          border: 1px solid white;
          padding: 2.5px 5px 2.5px 5px;
          margin-left: 5px;
          margin-right: 15px;
        }
        .pm2_5 {
          color: black;
          border: 1px solid white;
          padding: 2.5px 5px 2.5px 5px;
          margin-left: 5px;
        }
      }
      &-2 {
        margin-top: 10px;
        margin-left: 20px;
        font-weight: 600;
        .location {
          font-weight: 400;
          margin-left: 5px;
        }
      }
    }
    .site-radio {
      margin-left: 20px;
    }
    #zouhang-charts-pm10 {
      width:320px;
      height: 180px;
      margin: 10px auto;
    }
    #zouhang-charts-pm25 {
      width:320px;
      height: 180px;
      margin: 10px auto;
    }
    #zouhang-charts-tvoc {
      width:320px;
      height: 180px;
      margin: 10px auto;
    }
  }
}
.bz-click {
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  position: absolute;
  top: 50px;
  right: 30px;
  width: 350px;
  height: 410px;
  padding: 10px;
  z-index: 9;
  .bz-point-detail {
    .close-bz {
      width: 12px;
      height: 210px;
      background-image: url(/img/system/zhan.png);
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1px;
      cursor: pointer;
    }
    .layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 8px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
    .bz-point-content {
      color: white;
      width: 350px;
      .time {
        margin-left: 17px;
        font-size: 12px !important;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .bz-point-item {
        margin-top: 10px;
        margin-left: 12px;
        width: 160px;
        float: left;
        .bz-item-name{
          margin-left: 5px;
          font-size: 12px !important;
          display: inline-block;
          width: 40px;
        }
        .bz-item-value{
          font-size: 8px !important;
          display: inline-block;
          width: 75px;
          color: black;
          border-radius: 5px;
          padding: 5px 10px 5px 10px;
        }
      }
    }
    #bz-point-line {
      clear: both;
      width:320px;
      height: 200px;
      margin: 140px auto;
    }
  }
}
.wz-chart {
  position: absolute;
  top: 50px;
  right: 40px;
  width: 450px;
  height: 650px;
  z-index: 9;
}
/* 区域污染表格控制 */
.bg-chart {
  width: 600px;
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  position: absolute;
  bottom: 120px;
  z-index: 2;
  // border: 1px solid #1ad1e3;
}
.el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: #212e3e !important;
}
.baojing-chart {
  position: absolute;
  bottom: 55px;
  width: 665px;
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  // border: 1px solid #1ad1e3;
  z-index: 2;
  // background-color: white;
}
// 车辆详情
.vehicle-chart {
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  position: absolute;
  top: 10px;
  right: 0px;
  width: 285px;
  height: 220px;
  padding: 10px 20px 10px 30px;
  z-index: 2;
  .car-detail {
    color: white;
    .close-car {
      width: 12px;
      height: 75%;
      background-image: url(/img/system/zhan.png);
      background-size: 100% 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0px;
      cursor: pointer;
    }
    .layer-title {
      font-size: 13px !important;
      color: #1ad1e3;
      text-align: center;
      margin-bottom: 10px;
      .left-first {
        color: #05718e;
        margin-right: -7px;
      }
      .right-second {
        color: #05718e;
        margin-left: -7px;
      }
      span {
        margin: 0 20px;
      }
    }
    .car-content{
      font-size: 13px !important;
      &-1{
        margin-top: 15px;
        font-weight: 600;
        .pm10 {
          display: inline-block;
          width: 80px;
          color: black;
          border: 1px solid white;
          padding: 2.5px 5px 2.5px 5px;
          margin-left: 5px;
          margin-right: 5px;
        }
        .pm2_5 {
          display: inline-block;
          width: 80px;
          color: black;
          border: 1px solid white;
          padding: 2.5px 5px 2.5px 5px;
          margin-left: 5px;
        }
      }
      &-2{
        margin-top: 20px;
        font-weight: 600;
        .time {
          font-weight: 400;
          margin-left: 5px;
        }
      }
      &-3{
        margin-top: 20px;
        font-weight: 600;
        .shebeihao {
          font-weight: 400;
          margin-left: 5px;
          margin-right: 5px;
        }
        .speed {
          font-weight: 400;
          margin-left: 5px;
        }
      }
      &-4{
        margin-top: 20px;
        font-weight: 600;
        .location {
          font-weight: 400;
          margin-left: 5px;
        }
      }
    }
  }
}
/* 云图控制 */
.airmap {
  position: absolute;
  top: 30%;
  left: 10%;
  width: 70%;
  height: 50%;
}
/* 区县排名表格控制 */
.qxpm-chart {
  position: absolute;
  right: 0;
  bottom: 115px;
  // width: 540px;
  width: 600px;
  background-image: url(/img/background-image.png);
  background-size: 100% 100%;
  // height: 200px;
  // border: 1px solid #1ad1e3;
  z-index: 2;
  // background-color: white;
}
/* 修改黑色背景下 element-ui 部分控件样式 */
.dark.el-form {
  .el-form-item {
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  ::v-deep .el-form-item__label {
    color: white;
  }
  ::v-deep .el-input__inner {
    border: 1px solid #1ad1e3;
    background-color: #021f2d;
    color: white;
    padding-right: 10px;
  }
  $changeColorList: input__suffix, el-range__icon, el-range-separator;
  @each $name in $changeColorList {
    ::v-deep .#{$name} {
      color: white;
      line-height: 28px;
    }
  }
  ::v-deep input {
    background-color: #021f2d;
    color: white;
    margin-top: -3px;
    width: 94%;
  }
}
#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}
.close-tuceng {
    width: 10px;
    height: 75%;
    background-image: url(/img/system/zhan.png);
    background-size: 100% 100%;
    position: absolute;
    transform: rotate(180deg);
    top: 0;
    bottom: 0;
    right: 1px;
    margin: auto;
    cursor: pointer;
    z-index: 9;
}
// .wrpm {
//   display: flex;
//   // background-image: url(/img/background-image.png);
//   // background-size: 100% 100%;
//   z-index: 9;
//   // padding: 5px 10px 0px 10px;
//   .close-wrpm {
//     width: 12px;
//     height: 75%;
//     background-image: url(/img/system/zhan.png);
//     background-size: 100% 100%;
//     position: absolute;
//     transform: rotate(180deg);
//     top: 0;
//     bottom: 0;
//     right: 1px;
//     margin: auto;
//     cursor: pointer;
//     z-index: 9;

//   }
//   .close-qxpm {
//     width: 12px;
//     // height: 150px;
//     height: 75%;
//     background-image: url(/img/system/zhan.png);
//     background-size: 100% 100%;
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     left: 2px;
//     cursor: pointer;
//     z-index: 9;
//   }
//   // /deep/.is-always-shadow {
//   //   // height: 240px !important;
//   // }
//   ::-webkit-scrollbar-thumb {
//     display: none;
//   }
//   /deep/.el-table {
//     background-color:rgba(2, 28, 41, 1) !important;
//     // border: 1px solid white;
//     border: none;
//   }
//   /deep/.el-table::before {
//     display: none !important;
//   }
//   /deep/.el-table--border::after, .el-table--group::after, .el-table::before {
//     display: none !important;
//   }
//   /deep/.el-table__expanded-cell {
//     background-color:rgba(2, 28, 41, 1) !important;
//     // border: 1px solid white;
//     border-bottom: none;
//   }
//   /deep/.avue-crud .el-table th {
//     color: white;
//     font-size: 12px !important;
//     font-weight: 500;
//     background-color: rgba(2, 28, 41, 0.999)!important;
//     border: none;
//   }
//   /deep/.el-table__body td  {
//     background-color: rgba(2, 28, 41, 0.999)!important;
//     color: white;
//     font-size: 12px !important;
//     font-weight: 500;
//     border: none;
//   }
//   /deep/.el-pagination {
//     padding: 2px 12px 5px 5px;
//   }
//   /deep/.el-card__body {
//     padding: 0 0 !important;
//     border: none;
//   }
//   /deep/.el-table--small td{
//     padding: 1px 0 !important;
//   }
//   /deep/.el-table--small th {
//     padding: 2px 0 !important;
//   }
//   /deep/.el-pagination__total {
//     display: none;
//   }
//   /deep/.el-pagination__sizes {
//     display: none;
//   }
//   /deep/.el-pagination__jump {
//     display: none;
//   }
//   /deep/.btn-prev {
//     color: white;
//     background-color: rgba(2, 28, 41, 0);
//   }
//   /deep/.el-pager {
//     color: white;
//     .number  {
//       background-color: rgba(2, 28, 41, 0);
//     }
//     .active{
//       background-color: rgba(2, 28, 41, 0.0) !important;
//     }
//     .more {
//       background-color: rgba(2, 28, 41, 0.0) !important;
//     }
//   }
//   /deep/.btn-next {
//     color: white;
//     background-color: rgba(2, 28, 41, 0);
//   }
//   &-content {
//     // height: 195px;
//     padding: 0px 10px 0px 10px;
//     width:100%;
//     justify-content: center;
//     align-items: center;
//     /deep/.el-card {
//       background-color: rgba(2, 28, 41, 0);
//       overflow: hidden;
//     }
//     .baojing-time{
//       display: inline-block;
//       width: 30%;
//       margin-right: 2%;
//     }
//     .diypage {
//       text-align: right;
//     }
//   }
//   .arrow-btn {
//     color: white;
//     border: none;
//     background-color: rgba(2, 28, 41,0.1);
//   }
//   .refresh-btn {
//     width: 80px;
//     color: white;
//     background-color: #409EFF;
//     border: none;
//     margin-left: 273px !important;
//   }
//   .export-btn {
//     width: 80px;
//     color: white;
//     background-color: #409EFF;
//     border: none;
//   }
//   /deep/ .avue-crud__menu {
//         margin-bottom: -30px !important;
//     }
//   /deep/ .avue-crud__pagination {
//     margin-bottom: 0;
//     margin-top: -10px;
//     display: none;
//     }
//   /deep/.el-table__empty-block {
//     overflow: hidden;
//     height: 112px !important;
//     // background-color: rgb(38, 60, 70)!important;
//     .avue-empty {
//       margin-top: 30px;
//       .avue-empty__desc {
//         color: white;
//       }
//     }
//   }
// }
// .sort {
//   color: white;
//   position: absolute;
//   cursor: pointer;
//   right: 55px;
//   top: 33px;
//   z-index: 999;
// }
// .sort-pm {
//   margin: 12px 15px 0px 15px;
//   color: white;
//   position: relative;
//   .pm-title {
//     position: absolute;
//     left: 50%;
//     top:50%;
//     transform: translate(-50%,-50%);
//   }
// }
</style>
<style>
.my-div-icon {
  /* background: red; */
  text-align: center;
  line-height: 28px;
  /* opacity:0.1;  */
}
.my-div-icon-we {
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
}
.dust-bacground-goldenrod {
  border-radius: 50%;
  background: #2c99ee;
  margin:50%;
  text-align: center;
  line-height: 30px;
  /* opacity:70%; */
}
.dust-bacground-goldenrod_1 {
  border-radius: 50%;
  background: #2c99ee;
  margin:50%;
  text-align: center;
  line-height: 40px;
}
.dust-bacground-goldenrod_2 {
  border-radius: 50%;
  background: #2c99ee;
  margin:50%;
  text-align: center;
  line-height: 50px;
}
.dust-bacground-goldenrod_3 {
  border-radius: 50%;
  background: #2c99ee;
  margin:50%;
  text-align: center;
  line-height: 60px;
}
/* ', '#fcfc73', '#ff7e00', '#ff0000', '#99004c', '#7e0023',], */
.my-div-title_1 {
  background-color:rgb(0,228,0);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
  /* margin-left: -60px !important; */
}
.my-div-title_2 {
  background-color:rgb(255,255,0);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
}
.my-div-title_3 {
  background-color:rgb(255,126,0);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
}
.my-div-title_4 {
  background-color:rgb(255,0,0);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
}
.my-div-title_5 {
  background-color:rgb(153,0,76);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
}
.my-div-title_6 {
  background-color:rgb(126,0,35);
  border-radius: 100px;
  font-weight: 550;
  text-align: center;
}
</style>
