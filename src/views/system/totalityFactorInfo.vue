<template>
  <div class="tabelContainer">
    <basic-container>
      <avue-crud :data="data" :option="option" :page="page" :permission="permissionList" :table-loading="loading" @current-change="currentChange" @on-load="onLoad" @refresh-change="refreshChange" @row-del="rowDel" @row-save="rowSave" @row-update="rowUpdate" @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange" @size-change="sizeChange" ref="crud" v-model="form">
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import { getList, remove, submit } from "@/api/system/totalityFactorInfo";
  import { mapGetters } from "vuex";
  import website from "@/config/website";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: this.$pageSize,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height: 'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          viewBtn: true,
          addBtn: true,
          dialogClickModal: false,
          column: [{
            label: "系统名称",
            prop: "bizTypeName",
            span: 24,
            minRows: 6,
            search: true,
            type: "select",
            editDisabled: true,
            dicUrl: "/api/blade-system/dict/dictionary?code=biz_type",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
          },
            {
              label: "因子编号",
              editDisabled: true,
              prop: "id",
              span: 24,
              minRows: 6,
              search: true,
            },
            {
              label: "因子名称",
              editDisabled: false,
              prop: "name",
              span: 24,
              minRows: 6,
            },
            {
              label: "单位",
              prop: "unit",
              editDisabled: false,
              span: 24,
              minRows: 6,
            },{
              label: "默认分配",
              prop:"isDefaultAssign",
              span:6,
              minRows:6,
              type: "select",
              hide:true,
              dicData: [{
                label: '是',
                value: 1
              }, {
                label: '否',
                value: 0
              }],
              value:1
            },{
              label: "在用状态",
              prop:"",
              span:6,
              minRows:6,
              type:'select',
              hide:true,
              dicData:[{
                label:"不在用",
                value:0
              },{
                label:"在用",
                value:1
              }],
              value:1
            },{
              label: "因子类型",
              prop:"codeType",
              span:6,
              minRows:6,
              type: "select",
              hide:true,
              dicData: [{
                label: '监控因子',
                value: 1
              }, {
                label: '设备参数',
                value: 2
              }],
              value:1
            },{
              label: "因子分组",
              prop:"factorGroup",
              span:6,
              minRows:6,
              hide:true,
              type:"select",
              dicUrl: "/api/blade-system/dict/dictionary?code=vocs98_group",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
            },
            {
              label: "是否统计",
              prop: "isStatistics",
              span: 6,
              minRows: 6,
              hide: true,
              type: "select",
              dicData: [{
                label: '否',
                value: 0
              }, {
                label: '是',
                value: 1
              }],
              value:0
            },
            {
              label: "是否留样",
              prop: "isSample",
              span: 6,
              minRows: 6,
              hide: true,
              type: "select",
              dicData: [{
                label: '否',
                value: 0
              }, {
                label: '是',
                value: 1
              }],
              value:0
            },
            {
              label: "是否评价",
              prop: "isEvaluation",
              span: 6,
              minRows: 6,
              hide: true,
              type: "select",
              dicData: [{
                label: '否',
                value: 0
              }, {
                label: '是',
                value: 1
              }],
              value:0
            },
            {
              label: "是否显示",
              prop: "isShow",
              span: 6,
              minRows: 6,
              hide: true,
              type: "select",
              dicData: [{
                label: '否',
                value: 0
              }, {
                label: '是',
                value: 1
              }],
              value:1
            }
          ]
        },
        data: [],
        st: '',
        factorCodeId: ''
      };
    },
    // beforeMount(){
    //   getStByTenantId().then(res=>{
    //     this.systemNameList = res.data.data
    //   })
    // },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          viewBtn: this.vaildData(this.permission.factorConfig_view, false),
          delBtn: this.vaildData(this.permission.factorConfig_delete, false),
          editBtn: this.vaildData(this.permission.factorConfig_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowUpdate(row,index,done,loading) {
        this.addAndUpdate(row,index,done,loading)
      },
      rowSave(row, done, loading, index){
        row.st = row.bizTypeName
        this.addAndUpdate(row, index, done, loading)
      },

      addAndUpdate(row, index, done, loading){
        submit(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id, row.st);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      // searchChange(params, done) {
      //   console.log(params)
      //   this.factorCodeId = params.factorCodeId
      //   this.st = params.bizTypeName
      //   this.query = params;
      //   this.page.currentPage = 1;
      //   this.onLoad(this.page, params);
      //   done();
      // },
      searchChange(params, done) {
        params.st = params.bizTypeName
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
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
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
    }
  };
</script>

<style>

</style>
