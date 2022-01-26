<template>
  <div class="realMonitor_wrapper">
    <div id="header">实时监测</div>

    <!-- 搜索栏位 -->
    <div class="search_container">

      <!-- 点位 -->
      <label class="select_label">点位</label>
      <el-select size="medium" v-model="pointName">
        <el-option 
          v-for="(item, index) in pointNameOption" 
          :key="index" 
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      
      <!-- 化合物类型 -->
      <label class="select_label">化合物类型</label>
      <el-select size="medium" v-model="vocType">
        <el-option 
          v-for="(item, index) in vocTypeOption" 
          :key="index" 
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <!-- 搜索 -->
      <el-button class="search_btn" type="primary" size="small" icon="el-icon-search" @click="searchBtn">搜 索</el-button>

      <!-- 清空 -->
      <el-button type="" size="small" icon="el-icon-delete" @click="searchReset">清 空</el-button>
    </div>

    <!-- 表格内容 -->
    <el-table
      size="mini"
      :height="tableHeight"
      :data="tableData"
      :header-cell-style="{ background: '#f4f4f4', color: '#666' }"
    >
      <el-table-column
        v-for="(item, index) in tableHead"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
      ></el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getDeptTree, getFactors, getData } from "@/api/evoc/index";

export default {
  data() {
    return {
      pointName: "",
      vocType: "all",
      pointNameOption: [],
      vocTypeOption: [],
      vocTypesArr: [],
      allOption: {
        label: "全部",
        value: "all"
      },
      realtimeData: [],
      tableHeight: "calc(100% - 50px)",
      tableData: [],
      tableHead: [
        {
          label: "化合物中文名称",
          prop: "chineseName",
          align: "center"
        }, {
          label: "单位",
          prop: "unit",
          align: "center"
        }, {
          label: "值",
          prop: "value",
          align: "center"
        }, {
          label: "时间",
          prop: "time",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.getTableData();
    setInterval(() => {
      this.getTableData();
    }, 1800000);
  },
  methods: {

    // 获取实时数据
    getTableData() {
      getData().then(res => {
        if(res.data.success !== true) {
          return;
        }
        var resData = res.data.data;

        this.realtimeData = resData;
        this.tableData = [];
        this.pointNameOption = [];
        this.vocTypesArr = [];
        this.vocTypeOption = [this.allOption];

        resData.forEach(item => {
          this.pointNameOption.push({
            label: item.pointName,
            value: item.pointId
          });
          item.factorInformationVOS.forEach(factor => {
            if(this.vocTypesArr.indexOf(factor.typeId) < 0) {
              this.vocTypesArr.push(factor.typeId);
              this.vocTypeOption.push({
                label: factor.typeName,
                value: factor.typeId
              });
            }
          });
        });

        this.pointName = this.pointNameOption.length > 0 ? this.pointNameOption[0].value : "";
        this.vocType = this.allOption.value;
        this.onload();
      });
    },

    // 获取table data
    onload() {
      this.tableData = [];
      this.realtimeData.forEach(item => {
        if(this.pointName === item.pointId) {
          if(this.vocType === this.allOption.value) {
            this.tableData = item.factorInformationVOS;
          } else {
            item.factorInformationVOS.forEach(factor => {
              if(this.vocType === factor.typeId) {
                this.tableData.push(factor);
              }
            });
          }
        }
      });
    },

    // 点击搜索按钮
    searchBtn() {
      this.onload();
    },

    // 点击清空按钮
    searchReset() {
      this.pointName = this.pointNameOption[0].value;
      this.vocType = this.allOption.value;
      this.onload();
    }
  }
}
</script>

<style lang="scss" scoped>
.realMonitor_wrapper {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: 2px 2px 4px #ddd;
  #header {
    color: #5f88f2;
    line-height: 34px;
    padding: 0 5px;
    text-align: left;
    width: 100%;
    padding: 0 10px;
    box-shadow: 2px 2px 4px #ddd;
    box-sizing: border-box;
    background: (url("/img/bg/tit_bg.png")) no-repeat;
    background-size: 100% 100%;
    border-left: 2px solid #628dfc;
  }
}

.search_container {
  height: 50px;
  line-height: 50px;
  width: 100%;
  .select_label{
    margin: 0px 10px;
    font-size: 14px;
  }
  .search_btn {
    margin-left: 10px;
  }
}

</style>
