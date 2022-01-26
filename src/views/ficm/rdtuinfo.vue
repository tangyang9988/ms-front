<template>
  <basic-container style="height: calc(100% - 40px)">
    <avue-form
      ref="form"
      :option="formOption"
      v-model="formData"
      @submit="submitForm"
      @error="error"
    >
      <!--自定义站点名称 2020/10/10-->
      <!--      <template slot-scope="scope" slot="siteInfoId">-->
      <!--        <div>-->
      <!--          <el-input v-model="siteInfoId" placeholder="请输入站点名称" disabled></el-input>-->
      <!--        </div>-->
      <!--      </template>-->
      <!--      <template slot-scope="scope" slot="siteName">-->
      <!--        <div>-->
      <!--          <el-input v-model="siteName" placeholder="请输入站点名称" disabled></el-input>-->
      <!--        </div>-->
      <!--      </template>-->
    </avue-form>

    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad"
               v-if="$route.query.formType=='edit'">
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          plain
          v-if="permission.rdtuinfo_addinst"
          @click="handleAddinst"
        >新增仪器设备
        </el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          v-if="permission.rdtuinfo_deleteinst"
          @click="handleDelete"
        >删 除
        </el-button>
      </template>
      <!-- 自定义表格行内编辑按钮 -->
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          icon="el-icon-edit"
          size="small"
          v-if="permission.rdtuinfo_editinst"
          @click="handleEdit(scope.row)"
        >编辑
        </el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          size="small"
          v-if="permission.rdtuinfo_deleteinst"
          @click="handleDel(scope.row)"
        >删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getDetail,
  add,
  update,
  remove,
  getSiteList,
  formSubmit,
  getRdtuDetail,
  getInstList,
  checkMn
} from "@/api/ficm/rdtuinfo";
import {mapGetters} from "vuex";

var baseUrl = 'https://cli.avuejs.com/api/area'
export default {
  data() {
    return {
      form: {},
      query: {},
      loading: false,
      page: {
        pageSize: this.$pageSize,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        // height:'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: "仪器名称",
            prop: "name",
            align: 'center'
          },
          {
            label: "机组",
            prop: "groupName",
            align: 'center'
          },
          {
            label: "在用状态",
            prop: "stateName",
            align: 'center'
          },
          {
            label: "安装位置",
            prop: "location",
            align: 'center'
          },
          {
            label: "型号",
            prop: "model",
            align: 'center'
          },
          {
            label: "品牌",
            prop: "brand",
            align: 'center'
          },
          {
            label: "mn号",
            prop: "mn",
            align: 'center'
          },
          {
            label: "出厂编号",
            prop: "sn",
            align: 'center'
          },
        ]
      },
      data: [],
      formOption: {
        label: '新增数采仪',
        submitText: '提交',
        labelWidth: 160,
        column: [
          {
            label: "站点名称",
            prop: "siteName",
            // formslot: true,//自定义插件
            disabled: true,//只读不可点击
          },
          // {
          //   label: "站点名称",
          //   prop: "siteInfoId",
          //   type: 'select',
          //   typeslot: true,
          //   dicData: [],
          //   props: {
          //     label: 'name',
          //     value: 'id',
          //   },
          //   rules: [{
          //     required: true,
          //     message: '请选择站点名称',
          //     trigger: 'change'
          //   }]
          // },
          {
            label: "数采仪名称",
            prop: "name",
            rules: [{
              required: true,
              message: '请输入数采仪名称',
              trigger: 'blur'
            }]
          },
          {
            label: "型号",
            prop: "model",
            rules: [{
              required: false,
              message: '请输入型号',
              trigger: 'blur'
            }]
          },
          {
            label: "品牌",
            prop: "brand",
            rules: [{
              required: false,
              message: '请输入品牌',
              trigger: 'blur'
            }]
          },
          {
            label: 'MN号',
            prop: 'mn',
            rules: [{
              required: true,
              message: '请输入MN号',
              trigger: 'blur'
            }]
          },
          {
            label: '出厂编号',
            prop: 'sn',
            rules: [{
              required: true,
              message: '请输入出厂编号',
              trigger: 'blur'
            }]
          },
          {
            label: '安装位置',
            prop: 'location',
            rules: [{
              required: true,
              message: '请输入安装位置',
              trigger: 'blur'
            }]
          },
          {
            label: "在用状态",
            prop: 'state',
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=device_storing_state",
            props: {
              label: "dictValue",
              value: 'dictKey'//2020/10/20 传参id改为dictKey
            },
            rules: [{
              required: true,
              message: "请选择在用状态",
              trigger: "change"
            }]
          },
          {
            label: "采样周期",
            prop: "period",
            /*append: '分',*/
            rules: [{
              required: true,
              message: "请输入采样周期",
              trigger: "blur"
            }]
          },
          {
            label: "采样周期单位",
            prop: 'periodUnit',
            type: "select",
            dicUrl: "/api/blade-system/dict/dictionary?code=periodUnit",
            props: {
              label: "dictValue",
              value: 'dictKey'//2020/10/20 传参id改为dictKey
            },
            rules: [{
              required: true,
              message: "请选择采样周期单位",
              trigger: "change"
            }]
          },
          {
            label: "安装时间",
            prop: "installationTime",
            type:'date',
            format: "yyyy-MM-dd",
            valueFormat:'yyyy-MM-dd',
            rules: [{
              required: true,
              message: "请选择安装时间",
              trigger: "blur"
            }]
          },
        ]
      },
      formData: {},
      mn:"",
      rdtuInfoId: null,
      deptInfoName: '',//企业名称
      deptInfoId: '',//企业id
      siteInfoId: '',//2020.10.9 获取站点 传值不需另外获取getSiteList
      siteName: null,//2020.10.9 获取站点name
      isSiteInfo: false,//2020/10/10 修改组织树到站点 是否点击了站点
      state: '',
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.rdtuinfo_add, false),
        viewBtn: this.vaildData(this.permission.rdtuinfo_view, false),
        delBtn: this.vaildData(this.permission.rdtuinfo_delete, false),
        editBtn: this.vaildData(this.permission.rdtuinfo_edit, false)
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
  mounted() {
    // 表单类型。是新增还是编辑
    if (this.$route.query.formType == 'add') {
      this.formOption.label = '新增数采仪'
      this.formOption.submitText = '提交'
    } else if (this.$route.query.formType == 'edit') {
      this.formOption.label = '编辑数采仪'
      this.formOption.submitText = '修改'
      // getRdtuDetail(this.$route.query.rdtuInfoId).then(res => {
      //   this.formData = res.data.data
      //   this.mn = res.data.data.mn
      //   this.formData.state = this.formData.state.toString()//在用状态 转换成字符串
      // })
      this.mn = this.$route.query.row.mn
      this.formData=this.$route.query.row
      this.formData.state = this.formData.state.toString()//在用状态 转换成字符串
    }
    this.initData()
  },
  methods: {
    /**数采仪配置页面 行按钮 删除仪器设备**/
    handleDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return remove(row.id)
      }).then(() => {
        this.onLoad(this.page)
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    /**数采仪配置页面 行按钮 编辑仪器设备**/
    handleEdit(row) {
      // console.log('rduinfo编辑', this.$route.query)
      this.$router.push({
        path: '/instinfo',
        query: {
          deptInfoId: this.$route.query.deptInfoId,
          mn: this.formData.mn,
          period: this.formData.period,//采样周期
          parentId: this.formData.id,
          siteInfoId: this.formData.siteInfoId,
          siteName: this.formData.siteName,
          instInfoId: row.id,
          formType: 'edit',
          row:row,
          siteType :this.$route.query.siteType
        }
      })
    },
    /**新增仪器设备**/
    handleAddinst() {
      if (this.$route.query.formType == 'add') {
        this.$message.warning('请先完成新增')
        return
      }
      // console.log('数采仪query',this.$route.query)
      this.$router.push({
        path: '/instinfo',
        query: {
          deptInfoId: this.$route.query.deptInfoId,
          mn: this.formData.mn,
          period: this.formData.period,//采样周期
          parentId: this.formData.id,
          siteInfoId: this.formData.siteInfoId,
          siteName: this.formData.siteName,
          formType: 'add',
          ismncheck: true
        }
      })
    },
    initData() {
      this.formData.type = 1//type1新增或者编辑数采仪
      this.formData.deptInfoId = this.$route.query.deptInfoId//企业id
      this.formData.siteName = this.$route.query.siteName//站点名称
      this.formData.siteInfoId = this.$route.query.siteInfoId//站点id
      // console.log('this.siteName', this.formData)
      // 根据id请求所属点位下拉框内容
      // getSiteList(this.$route.query.deptInfoId).then(res => {
      //   const column = this.findObject(this.formOption.column, "siteInfoId");
      //   column.dicData = res.data.data;
      // })
    },
    /**新增 修改 数采仪 提交**/
    async submitForm(form, done) {
      // 新增时判断mn唯一性
      if (this.formData.mn != this.mn) {
        let flag = true
        await checkMn(this.formData.mn).then(res => {
          flag = res.data.data
        })
        if (!flag) {
        this.$message.warning('MN已存在')
        done()
        return
      }
      }
      this.formData.type = 1//type1新增或者编辑数采仪
      formSubmit(this.formData).then(res => {
        if (res.data.success) {
          this.$message.success('操作成功')
          // 如果是新增操作，新增成功后清空表单
          if (this.$route.query.formType == 'add') {
            this.$refs.form.resetFields()
          }
        } else {
          this.$message.success('操作失败')
        }
        this.onLoad();//编辑数采仪修改后 重新加载下方的仪器设备列表
        done()
      })
    },
    error(err) {
      this.$message.error(err);
    },
    /**无用**/
    rowSave(row, done, loading) {
      console.log('addrow', row)
      row.deptInfoId = this.deptInfoId  // 企业（组织）id
      row.siteInfoId = this.siteInfoId  // 站点（组织）id
      add(row).then(() => {
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        loading();
        window.console.log(error);
      });
    },
    /**无用**/
    rowUpdate(row, index, done, loading) {
      console.log('editrow', row)
      update(row).then(() => {
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        loading();
        console.log(error);
      });
    },
    /**无用**/
    rowDel(row) {
      console.log('删除', row)
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    /**数采仪配置页面 左侧按钮 删除仪器设备**/
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad();
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad();
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
      this.onLoad();
    },
    onLoad() {
      if (this.$route.query.rdtuInfoId) {
        this.loading = true;
        getInstList(this.$route.query.rdtuInfoId, this.siteInfoId).then(res => {
          this.data = res.data.data
          this.loading = false
          this.selectionClear()
        })
      }
    }
  }
};
</script>

<style>
</style>
