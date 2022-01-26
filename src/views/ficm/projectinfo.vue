<template>
  <div class="lc_wrap">
    <el-row class="deptinfo">
      <el-col :span="24">
        <basic-container>
          <avue-crud ref="crud" v-model="form" :option="option" :table-loading="loading" :data="data" :page="page"
                     :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
                     @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel" @search-change="searchChange"
                     @search-reset="searchReset" @selection-change="selectionChange" @current-change="currentChange"
                     @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad" @tree-load="treeLoad">
            <!--          <template slot="项目开始时间Form">-->
            <!--            <avue-date v-model="项目开始时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="请选择日期"></avue-date>-->
            <!--          </template>-->
            <!--          <template slot="项目截止时间Form">-->
            <!--            <avue-date v-model="项目截止时间" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" placeholder="请选择日期"></avue-date>-->
            <!--          </template>-->
            <!--          <template slot="上班考勤时间Form">-->
            <!--            <avue-time v-model="上班考勤时间" format="hh:mm:ss" value-format="hh:mm:ss" placeholder="请选择日期"></avue-time>-->
            <!--          </template>-->
            <!--          <template slot="下班考勤时间Form">-->
            <!--            <avue-time v-model="下班考勤时间" format="hh:mm:ss" value-format="hh:mm:ss" placeholder="请选择日期"></avue-time>-->
            <!--          </template>-->
            <!--          <template slot="项目面积Form">-->
            <!--            <el-input v-model="form.项目面积" placeholder="请填写项目面积">-->
            <!--              <template slot="append">万平方米</template>-->
            <!--            </el-input>-->
            <!--          </template>-->
            <template slot="mapForm">
              <div v-if="showMap">
                <baidu-map class="map" :center="center" :zoom="zoom" @ready="handler">
                  <el-input placeholder="关键词查询" v-model="searchWord"
                            style="position:absolute;top:10px;left:10px;width:180px;">
                    <template slot="append">
                      <el-button icon="el-icon-search" id="citySearch"></el-button>
                    </template>
                  </el-input>

                  <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                  <bm-marker :position="mapPosition" :dragging="true"></bm-marker>
                </baidu-map>
              </div>
            </template>

            <template slot="menuLeft">
              <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectinfo_delete"
                         @click="handleDelete">删 除
              </el-button>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="text" icon="el-icon-circle-plus-outline" size="small"
                         @click.stop="handleAdd(scope.row,scope.index)" v-if="userInfo.role_name.includes('admin')">新增子项
              </el-button>
            </template>
            <template slot-scope="{row}" slot="deptCategory">
              <el-tag>{{ row.deptCategoryName }}</el-tag>
            </template>
          </avue-crud>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  getDeptTree,
  getLazyList,
  getExtraOption,
  getLazyTree,
  checkBizLics
} from "@/api/ficm/projectinfo";
import {validateNumber, validateInter, isMobile, isIdCard, hsaMn} from "@/util/rulesReg";
import {mapGetters} from "vuex";
import website from '@/config/website';

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
        // height: '100%',//20201103 表格高度自适应 去掉最外侧边框
        lazy: true,
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        menuWidth: 300,
        labelWidth: 125,
        dialogClickModal: false,
        column: [
          {
            label: "项目简称",
            prop: "deptName",
            search: true,
            searchLabelWidth: 74, //第一个搜索条件边距
            rules: [{
              required: true,
              message: "请输入项目简称",
              trigger: "blur"
            }]
          },
          {
            label: "所属租户",
            prop: "tenantId",
            align: "center",
            type: "tree",
            dicUrl: "/api/blade-system/tenant/select",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: website.tenantMode,
            span: 24,
            props: {
              label: "tenantName",
              value: "tenantId"
            },
            hide: !website.tenantMode,
            search: website.tenantMode,
            rules: [{
              required: true,
              message: "请输入所属租户",
              trigger: "click"
            }]
          },
          {
            label: "项目全称",
            prop: "fullName",
            search: true,
            align: "center",
            rules: [{
              required: true,
              message: "请输入项目全称",
              trigger: "blur"
            }]
          },
          {
            label: "上级项目",
            prop: "parentId",
            align: "center",
            type: "tree",
            hide: true,
            dicData: [],
            props: {
              label: "title"
            },
            rules: [{
              required: false,
              message: "请选择上级项目",
              trigger: "change"
            }]
          },
          {
            label: "项目编号",
            prop: "deptCode",
            hide: true,
            align: "center",
            rules: [{
              required: true,
              message: "请输入项目编号",
              trigger: "blur"
            }]
          },
          {
            label: "行政区域",
            prop: "regionCode",
            align: "center",
            type: "tree",
            hide: true,
            dicData: [1],
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
            label: "合同备案码",
            hide: true,
            prop: "bizLics",
            align: "center",
            rules: [{
              required: true,
              message: "请输入合同备案码",
              trigger: "change"
            }]
          },
          // {
          //   label: "项目开始日期",
          //   prop: "operaDate",
          //   type: "date",
          //   format: "yyyy-MM-dd",
          //   valueFormat: "yyyy-MM-dd",
          //   pickerOptions: {
          //     disabledDate(time) {
          //       return time.getTime() > Date.now();
          //     },
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请选择项目开始日期",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "项目截止日期",
          //   prop: "operaDateEnd",
          //   type: "date",
          //   format: "yyyy-MM-dd",
          //   valueFormat: "yyyy-MM-dd",
          //   pickerOptions: {
          //     disabledDate(time) {
          //       return time.getTime() > Date.now();
          //     },
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请选择项目截止日期",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "上级机构",
          //   prop: "parentId",
          //   align: "center",
          //   type: "tree",
          //   hide: true,
          //   dicData: [],
          //   props: {
          //     label: "title"
          //   },
          //   rules: [{
          //     required: false,
          //     message: "请选择上级机构",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "机构类型",
          //   type: "select",
          //   dicUrl: "/api/blade-system/dict/dictionary?code=org_category",
          //   align: "center",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey"
          //   },
          //   dataType: "number",
          //   width: 120,
          //   prop: "deptCategory",
          //   slot: true,
          //   rules: [{
          //     required: true,
          //     message: "请输入机构类型",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "行政区域",
          //   prop: "regionCode",
          //   align: "center",
          //   type: "tree",
          //   hide: true,
          //   dicData: [1],
          //   props: {
          //     label: "title"
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请选择行政区域",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "排序",
          //   prop: "sort",
          //   type: "number",
          //   align: "center",
          //   width: 80,
          //   rules: [{
          //     required: true,
          //     message: "请输入排序",
          //     trigger: "blur"
          //   }, {
          //     pattern: /^[1-9]\d*$/,
          //     message: '请输入正整数',
          //     trigger: 'blur'
          //   }]
          // },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   span: 24,
          //   rules: [{
          //     required: false,
          //     message: "请输入备注",
          //     trigger: "blur"
          //   }],
          //   hide: true
          // },
          // {
          //   label: "组织机构代码",
          //   prop: "deptCode",
          //   hide: true,
          //   align: "center",
          //   rules: [{
          //     required: true,
          //     message: "请输入组织机构代码",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "组织类型",
          //   prop: 'deptType',
          //   align: "center",
          //   type: "select",
          //   hide: true,
          //   dataType: "number",
          //   dicUrl: "/api/blade-system/dict/dictionary?code=biz_type",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请选择组织类型",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "组织等级",
          //   prop: "deptLevel",
          //   align: "center",
          //   type: 'select',
          //   hide: true,
          //   dataType: "number",
          //   dicUrl: "/api/blade-system/dict/dictionary?code=dept_level",
          //   props: {
          //     label: "dictValue",
          //     value: "dictKey",
          //   },
          //   rules: [{
          //     required: true,
          //     message: "请选择组织等级",
          //     trigger: "change"
          //   }]
          // },
          // {
          //   label: "组织显示序列",
          //   prop: "sortNum",
          //   align: "center",
          //   hide:true,
          //   rules: [{
          //     required: false,
          //     message: "请输入组织显示序列",
          //     trigger: "blur"
          //   }]
          // },
          // {
          //   label: "组织地址",
          //   prop: "address",
          //   hide:true,
          //   align: "center",
          // },
          // {
          //   label: "营业执照",
          //   hide: true,
          //   prop: "bizLics",
          //   align: "center",
          // },
          // {
          //   label: "税务登记号",
          //   prop: "taxNum",
          //   hide: true,
          //   align: "center",
          // },
          {
            label: '',
            prop: 'map',
            span: 24,
            hide: true,
            formslot: true,
          },
          {
            label: "经度",
            prop: "logitude",
            hide: true,
            align: "center",
            rules: [{
              required: true,
              message: "请输入经度",
              trigger: "blur"
            }]
          },
          {
            label: "纬度",
            prop: "latitude",
            hide: true,
            align: "center",
            rules: [{
              required: true,
              message: "请输入纬度",
              trigger: "blur"
            }]
          },
          // {
          //   label: "添加照片",
          //   prop: "pic",
          // },
          // {
          //   label: "简介",
          //   prop: "intro",
          //   hide: true,
          //   type: 'textarea',
          //   span: 24,
          //   maxlength: 150
          // },
        ]
      },
      data: [],
      mapPosition: {
        lng: 121.4472540000,
        lat: 31.3236200000
      },
      center: {
        lng: 121.4472540000,
        lat: 31.3236200000
      },
      zoom: 10,
      dragging: false,
      showMap: true,
      searchWord: '',
      keyword: '',
      extraColumn: [],
      extraParamList: [], //扩展
      deptCategory: '1', //机构类型
      deptType: '39', //组织类型
      sort: '1', //排序
      deptLevel: '3', //组织登记
      startTime: '', //项目开始时间
      endTime: '', //项目截止时间
      workStartTime: '', //上班考勤时间
      workEndTime: '', //下班考勤时间
      bizLicsCurrent: '', //
      maps: new Map(),
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.projectinfo_add, false),
        viewBtn: this.vaildData(this.permission.projectinfo_view, false),
        delBtn: this.vaildData(this.permission.projectinfo_delete, false),
        editBtn: this.vaildData(this.permission.projectinfo_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    rowParentIds() {
      let rowParentIds = [];
      this.selectionList.forEach(ele => {
        if (rowParentIds.indexOf(ele.parentId) === -1) {//同一个父类则不添加
          rowParentIds.push(ele.parentId);
        }
      });
      return rowParentIds.join(",");
    },
  },
  watch: {
    'form.logitude'(val) {
      if (val) {
        this.mapPosition.lng = val / 1
      }
    },
    'form.latitude'(val) {
      if (val) {
        this.mapPosition.lat = val / 1
      }
    },
    'form.项目开始时间'(val) {
      this.startTime = this.form.项目开始时间
      this.endTime = this.form.项目截止时间
      if (this.startTime > this.endTime) { //如果开始时间大于结束时间 结束时间置空
        this.form.项目截止时间 = ''
      } else {
        this.form.项目截止时间 = this.endTime
      }

    },
    'form.项目截止时间'(val) {
      this.startTime = this.form.项目开始时间
      this.endTime = this.form.项目截止时间
      if (this.startTime > this.endTime) { //如果开始时间大于结束时间 结束时间置空
        this.form.项目截止时间 = ''

        this.form.项目截止时间.rules.message = '请请选择设备名称'
      }
    },
    // 'form.上班考勤时间'(val) {
    //   this.workStartTime = this.form.上班考勤时间
    //   this.workEndTime = this.form.下班考勤时间
    //   const flag = this.workStartTime > this.workEndTime
    //   console.log('上班考勤时间', this.workStartTime + '***' + this.workEndTime + '***' + flag)
    //   if (this.workStartTime > this.workEndTime) {//如果开始时间大于结束时间 结束时间置空
    //     this.form.下班考勤时间 = ''
    //   }
    // },
    // 'form.下班考勤时间'(val) {
    //   this.workStartTime = this.form.上班考勤时间
    //   this.workEndTime = this.form.下班考勤时间
    //   const flag = this.workStartTime > this.workEndTime
    //   console.log('下班考勤时间', this.workStartTime + ':' + this.workEndTime + '***' + flag)
    //   if (this.workStartTime > this.workEndTime) {//如果开始时间大于结束时间 结束时间置空
    //     console.log('111')
    //     this.form.下班考勤时间 = ''
    //   }
    // },
  },
  mounted() {
    this.initData()
    // console.log('permission', this.permission)
  },
  methods: {
    /**
     * 表格树加载
     */
    // 关键点是设置一个存储树节点的仓库，且用new Map存储
    treeLoad(tree, treeNode, resolve) {
      const parentId = tree.id;
      this.maps.set(parentId, {tree, treeNode, resolve})//将当前选中节点数据存储到maps中
      getLazyList(parentId).then(res => {
        resolve(res.data.data);
      });
    },
    updateChild() {
      /**编辑子项 更新列表 start**/
      // console.log('treeLoad(tree, treeNode, resolve)', this.maps)
      // 在表格数据实时更新后引用maps的数据，动态更新子节点的内容
      this.maps.forEach((item, key) => {
        const {tree, treeNode, resolve} = this.maps.get(key)
        this.treeLoad(tree, treeNode, resolve)
      })
      /**编辑子项 更新列表 end**/
    },
    /**
     * 地图事件处理
     */
    handler({
              BMap,
              map
            }) {
      let _this = this;
      // 鼠标缩放
      // map.enableScrollWheelZoom(true);

      // 点击事件获取经纬度
      map.addEventListener('click', function (e) {
        // 把点击的坐标赋值给输入框
        _this.form.logitude = e.point.lng
        _this.form.latitude = e.point.lat
      })

      _this.$nextTick(() => {
        // 给坐标搜索按钮绑定点击事件
        document.getElementById('citySearch').addEventListener('click', function () {
          let localSearch = new BMap.LocalSearch(map)
          localSearch.setSearchCompleteCallback(searchResult => {
            let poi = searchResult.getPoi(0)
            if (!poi) {
              return _this.$message.warning('该地址不存在')
            } else {
              _this.center = {
                lng: poi.point.lng,
                lat: poi.point.lat
              }
              _this.form.logitude = poi.point.lng
              _this.form.latitude = poi.point.lat
            }
          });
          localSearch.search(_this.searchWord);
        });
      })
    },
    /**
     * 弹框关闭处理
     */
    beforeClose(done) {
      this.searchWord = ''
      this.$refs.crud.tableForm = {};
      this.$refs.crud.value.parentId = "";
      this.$refs.crud.value.addDisabled = false;
      this.$refs.crud.option.column.filter(item => {
        if (item.prop === "parentId") {
          item.value = "";
          item.addDisabled = false;
        }
      });
      done();
    },
    /**
     * 初始化表单
     */
    initData() {
      // 上级机构
      getDeptTree().then(res => {
        const column = this.findObject(this.option.column, "parentId");
        column.dicData = res.data.data;
      });
      // 行政区域
      getLazyTree().then(res => {
        const column = this.findObject(this.option.column, "regionCode");
        column.dicData = res.data.data;
      });
      // 获取表单扩展信息
      getExtraOption().then(res => {
        let extraColumn = []
        // console.log('获取表单扩展信息', res.data.data)
        res.data.data.forEach(item => {
          // 提交表单时用于封装value时遍历的数组
          this.extraParamList.push(item.opt)
          if (item.opt == '项目面积') {
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true,
              append: '万平方米',
              // formslot: true,//将自定义表单设置为true
              rules: [{
                required: true,
                validator: validateNumber,
                trigger: "blur",
              }],
            })
          } else if (item.opt == '上班考勤时间' || item.opt == '下班考勤时间') {
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true,
              // formslot: true,//将自定义表单设置为true
              type: "time",
              format: "HH:mm:ss",
              valueFormat: "HH:mm:ss",
              // rules: [{
              //   required: true,
              //   message: "请选择" + item.opt,
              //   trigger: "change"
              // }]
            })
          } else if(item.opt == '视频ip地址' || item.opt == '用户账号' || item.opt == '用户密码'){          	
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true
            })          	
          }
          else if(item.opt == '萤石云key' || item.opt == '萤石云secret'){          	
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true
            })          	
          } else if (item.opt == '实名制项目编码') {
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true,
              rules: [{
                required: true,
                message: "请输入实名制项目编码",
                trigger: "blur"
              }]
            })
          }
          else { //考勤时间
            // 封装扩展表单的JSON
            extraColumn.push({
              label: item.opt,
              prop: item.opt,
              hide: true,
              // formslot: true,//将自定义表单设置为true
              type: "date",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
              rules: [{
                required: true,
                message: "请选择正确时间",
                // trigger: "change"
              }]
            })
          }
        })
        // 将JSON添加到表单配置中
        if (extraColumn.length) {
          let arr1 = this.option.column
          arr1.push.apply(arr1, extraColumn)
          // console.log('column', this.option.column)
          // this.option.group.push({
          //   label: '其他内容',
          //   labelWidth: 150,
          //   prop: 'extraGroup',
          //   column: extraColumn
          // })
        }
      })
    },
    /**
     * 新增子项
     */
    handleAdd(row) {
      console.log('row', row)
      this.$refs.crud.value.parentId = row.id;
      this.$refs.crud.option.column.filter(item => {
        if (item.prop === "parentId") {
          item.value = row.id;
          item.addDisabled = true;
        }
      });
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      //传入默认参数 deptCategory:1,//机构类型deptType:39,//组织类型sort:1,//排序deptLevel:3,//组织登记
      row.deptCategory = this.deptCategory // 机构类型
      row.deptType = this.deptType // 组织类型
      row.sort = this.sort // 排序
      row.deptLevel = this.deptLevel // 组织等级
      // 表单扩展内容
      // console.log('保存', row)
      // return  false
      row.extraInfo = {}
      this.extraParamList.forEach(item => {
        row.extraInfo[item] = row[item]
      })
      row.extraInfo = JSON.stringify(row.extraInfo) // JSON转string传给后台
       add(row).then(() => { 
         this.onLoad(this.page);
         this.$message({type: "success",message: "操作成功!"}); 
         done();
         this.updateChild()//新增子项刷新
       },error => {
            loading();
            window.console.log(error);
       })
      //合同备案码验证
//    checkBizLics(row.bizLics).then(res => {
//      if (res.data.data) {
//        add(row).then(() => { //如果不存在 验证通过
//          this.onLoad(this.page);
//          this.$message({
//            type: "success",
//            message: "操作成功!"
//          });
//          done();
//          this.updateChild()//新增子项刷新
//        }, error => {
//          loading();
//          window.console.log(error);
//        });
//      } else {
//        this.$message({
//          type: "error",
//          message: "合同备案码已存在!"
//        });
//        loading();
//      }
//    })
      // add(row).then(() => {
      //   this.onLoad(this.page);
      //   this.$message({
      //     type: "success",
      //     message: "操作成功!"
      //   });
      //   // 新增成功后重新请求上级机构
      //   // getDeptTree().then(res => {
      //   //   const column = this.findObject(this.option.column, "parentId");
      //   //   column.dicData = res.data.data;
      //   // });
      //   done();
      // }, error => {
      //   loading();
      //   window.console.log(error);
      // });
    },
    rowUpdate(row, index, done, loading) {
      //传入默认参数 deptCategory:1,//机构类型deptType:39,//组织类型sort:1,//排序deptLevel:3,//组织登记
      row.deptCategory = this.deptCategory // 机构类型
      row.deptType = this.deptType // 组织类型
      row.sort = this.sort // 排序
      row.deptLevel = this.deptLevel // 组织等级
      // 表单扩展内容
      row.extraInfo = {}
      this.extraParamList.forEach(item => {
        row.extraInfo[item] = row[item]
      })
      row.extraInfo = JSON.stringify(row.extraInfo) // JSON转string传给后台
      //合同备案码验证
      if (this.bizLicsCurrent != row.bizLics) { //// 没有修改过合同备案码
      	
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
          this.updateChild()//新增编辑子项刷新
        }, error => {
          loading();
          console.log(error);
        });      	
      	
//      checkBizLics(row.bizLics).then(res => {
//        if (res.data.data) { //如果不存在 验证通过
//          update(row).then(() => {
//            this.onLoad(this.page);
//            this.$message({
//              type: "success",
//              message: "操作成功!"
//            });
//            done();
//            this.updateChild()//新增编辑子项刷新
//          }, error => {
//            loading();
//            console.log(error);
//          });
//        } else {
//          this.$message({
//            type: "error",
//            message: "合同备案码已存在!"
//          });
//          loading();
//        }
//      })
      } else {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
          this.updateChild()//新增编辑子项刷新
        }, error => {
          loading();
          console.log(error);
        });
      }
      // update(row).then(() => {
      //   this.onLoad(this.page);
      //   this.$message({
      //     type: "success",
      //     message: "操作成功!"
      //   });
      //   done();
      // }, error => {
      //   loading();
      //   console.log(error);
      // });
    },
    rowDel(row, index, done) {
      // console.log('row', row)
      // console.log('parentId', row.parentId)
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$set(this.$refs.crud.$refs.table.store.states.lazyTreeNodeMap, row.parentId, this.onLoad(this.page))//将对应节点下的数据清空，从而实现数据的重新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          done(row);
        });
    },
    handleDelete() {
      if (this.length === 0) {
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
          this.onLoad(this.page);
          this.$set(this.$refs.crud.$refs.table.store.states.lazyTreeNodeMap, this.rowParentIds, this.onLoad(this.page))//将对应节点下的数据清空，从而实现数据的重新加载
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      switch (type) {
        case 'add':
          this.showMap = true
          this.mapPosition = {
            lng: 121.4472540000,
            lat: 31.3236200000
          }
          this.center = {
            lng: 121.4472540000,
            lat: 31.3236200000
          }
          break
        case 'edit':
          this.showMap = true
          // 根据id，请求表单内容
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
            // 扩展表单内容
            let obj = JSON.parse(this.form.extraInfo)
            for (const key in obj) {
              this.form[key] = obj[key]
            }
            // 打开编辑页面，将地图中心定位到当前点位
            this.center = {
              lng: res.data.data.logitude,
              lat: res.data.data.latitude
            }
            this.zoom = 8
            this.bizLicsCurrent = this.form.bizLics //获取当前请求的合同备案码
          });

          break
        case 'view':
          this.showMap = false
          // 根据id，请求表单内容
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
            // 扩展表单内容
            let obj = JSON.parse(this.form.extraInfo)
            for (const key in obj) {
              this.form[key] = obj[key]
            }
            // 打开编辑页面，将地图中心定位到当前点位
            this.center = {
              lng: res.data.data.logitude,
              lat: res.data.data.latitude
            }
            this.zoom = 8
            this.bizLicsCurrent = this.form.bizLics //获取当前请求的合同备案码
          });
          break

        default:
          break
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
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        if (res.data.success) {
          this.data = res.data.data
          this.selectionClear();
          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
      })
    },
  }
};
</script>
<style lang="scss">
.anchorBL {
  display: none;
}

.deptinfo {
  .el-card__body {
    height: calc(100% - 35px);

    .avue-crud {
      height: calc(100% - 120px);
    }
  }
}
</style>
<style scoped>
.map {
  width: 100%;
  height: 500px;
}

.el-row {
  height: calc(100% - 20px);
  /*20201103表格最下方留白距离*/
}

.el-col {
  height: 100%;
}
</style>
