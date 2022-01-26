<template>
  <div class="tabelContainer">
    <basic-container>
      <el-form  :inline="true" class="demo-form-inline p_form crud_class">
        <el-form-item label="mn号">
          <el-input size="small" v-model="query.mn" placeholder="请输入mn"></el-input>
        </el-form-item>      	
        <!--<el-form-item label="企业名称">
          <el-input size="small" v-model="query.enterpriseName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker size="small"  type="date" v-model="query.startDate" value-format="yyyy-MM-dd" placeholder="请输入开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker size="small"  type="date" v-model="query.endDate" value-format="yyyy-MM-dd" placeholder="请输入结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="点位名称">
          <el-input size="small" v-model="query.pointName" placeholder="请输入点位名称"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select size="small" v-model="query.auditStatus" style="width: 150px;">
            <el-option v-for="(item, index) in aduitColumn" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>-->
          <el-button type="primary" @click="searchBtn" size="small" icon="el-icon-search">搜索</el-button>
          <el-button type="" size="small" icon="el-icon-delete" @click="searchReset">清 空</el-button>
        </el-form-item>
      </el-form>
      <avue-crud :data="data" :option="option" :page.sync="page" :table-loading="loading" 
      	@on-load="onLoad" @row-update="rowUpdate" @selection-change="selectionChange"
      	 :before-open="beforeOpen"
      	 @refresh-change="refresh"  @search-reset="searchReset" ref="crud">
        <template slot="audit_status" slot-scope="scope">
          <el-tag size="small" type="danger" v-if="scope.row.audit_status==='0'">未通过</el-tag>
          <el-tag size="small" type="success" v-else-if="scope.row.audit_status==='1'">已通过</el-tag>
          <el-tag size="small" type="warning" v-else>待审核</el-tag>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {deviceSearch, statusUpdate} from "@/api/dock/searchdevch"
  import {column, aduitStatusList,column2} from "./column"
  import { dateFormat, getPreDay } from "@/util/date";
  export default {
    name: "searchdevch",
    data(){
      return{
        query:{
//        auditStatus:'',
//        enterpriseName:'',
//        pointName:'',
//        startDate:'',
//        endDate :'',
          mn:''
        },
//      aduitColumn:aduitStatusList,
        data:[],
        menu:false,
        loading:false,
        page:{},
        option:{
          addBtn: false,
          tip:false,
          delBtn:false,
          index:true,
          indexLabel:'序号',
          // selection:true,
          menuWidth:90,
          column:column2
        }
      }
    },
    methods:{
    	beforeOpen(done,type){
    		done()
    	},
      onLoad(){
        this.loading = true
        let params = Object.assign({}, this.query, {
          current: this.page.currentPage,
          size: this.page.pageSize
        })
        console.log(params)
        deviceSearch(params).then(res=>{
        	console.log(res)
          this.loading = false
          this.data = res.data.data
        })
      },
      //搜索清空
      searchReset() {
        this.query = {
          auditStatus:'',
          enterpriseName:'',
          pointName:'',
          startDate:'',
          endDate :'',
        };
        this.page.currentPage = 1
        this.onLoad();
      },
      //搜索
      searchBtn() {
        this.page.currentPage = 1
        this.onLoad()
      },
      //刷新
      refresh(){
        this.page.currentPage = 1
        this.onLoad()
      },
      //编辑
      rowUpdate(form,index,done,loading){
        let params = {
          memo:form.memo,
          status:form.device_status,
          updateDate:form.update_date,
          deviceId:form.thirdObjId
        }
        statusUpdate(params).then(res=>{
        	this.$message.success("修改成功！")	        
	        this.onLoad()  
	        done();
        })
      }
    }
  }
</script>

<style scoped>
 .crud_class{
   margin-bottom: -40px;
 }
</style>
