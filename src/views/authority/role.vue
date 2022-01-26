<template>
	<div class="tabelContainer">
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.role_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <!--v-if="userInfo.role_name.includes('admin')"-->
        <el-button size="small"
                   icon="el-icon-setting"
                   @click="handleRole"                  
                   plain>权限设置
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="角色权限配置"
               append-to-body
               :visible.sync="box"
               width="345px">
      <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
          <el-tree :data="menuGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeMenu"
                   :default-checked-keys="menuTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="数据权限">
          <el-tree :data="dataScopeGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeDataScope"
                   :default-checked-keys="dataScopeTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="接口权限">
          <el-tree :data="apiScopeGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeApiScope"
                   :default-checked-keys="apiScopeTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
  </div>
</template>

<script>
  import {add, getList, getRole, getRoleTree, grant, grantTree, remove, update,} from "@/api/system/role";
  import {mapGetters} from "vuex";
  import website from '@/config/website';

  export default {
    data() {
      return {
      	recursionArr:[],  // 储存递归数组用
        form: {},
        box: false,
        props: {
          label: "title",
          value: "key"
        },
        menuGrantList: [],
        dataScopeGrantList: [],
        apiScopeGrantList: [],
        apiGrantList: [],
        menuTreeObj: [],
        dataScopeTreeObj: [],
        apiScopeTreeObj: [],
        selectionList: [],
        query: {},
        loading: true,
        page: {
          pageSize: this.$pageSize,
          currentPage: 1,
          total: 0
        },
        option: {
          tip: false,
          simplePage: true,
          searchShow: true,
          searchMenuSpan: 6,
          tree: true,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          dialogWidth: 900,
          dialogClickModal: false,
          column: [
            {
              label: "角色名称",
              prop: "roleName",
              search: true,
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入角色名称",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "所属租户",
              prop: "tenantId",
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
              label: "角色别名",
              prop: "roleAlias",
              search: true,
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入角色别名",
                  trigger: "blur"
                }
              ]
            },
            {
              label: "上级角色",
              prop: "parentId",
              dicData: [],
              type: "tree",
              hide: true,
              span: 24,
              props: {
                label: "title"
              },
              rules: [
                {
                  required: false,
                  message: "请选择上级角色",
                  trigger: "click"
                }
              ]
            },
            {
              label: "角色排序",
              prop: "sort",
              type: "number",
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入角色排序",
                  trigger: "blur"
                }
              ]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["userInfo", "permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.role_add, false),
          viewBtn: this.vaildData(this.permission.role_view, false),
          delBtn: this.vaildData(this.permission.role_delete, false),
          editBtn: this.vaildData(this.permission.role_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);

        });
        return ids.join(",");
      },
      idsArray() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids;
      }
    },
    methods: {
      initData(){
        getRoleTree().then(res => {
          const column = this.findObject(this.option.column, "parentId");
          column.dicData = res.data.data;
        });
      },
      // 数组去重
      unique(arr){
		    const res = new Map();
		    return arr.filter((a) => !res.has(a) && res.set(a, 1))      	
      },
      submit() {      	
        let menuList = this.$refs.treeMenu.getCheckedKeys();
        let newMenuList=[]        
        // 循环添加所有 把最外层父级全部添加进去
        menuList.forEach(item=>{        	
        	for(var i=0;i<this.recursionArr.length;i++){
        		// 是否是最外层菜单
        		if(item==this.recursionArr[i].value){
        			newMenuList.push(item)
        		}else{
        			this.recursionArr[i].allChildren.forEach(item2=>{
        				if(item2==item){
        					newMenuList.push(this.recursionArr[i].value)
        				}
        			})
        		}
        	}
        }) 
        menuList=menuList.concat(newMenuList)
        //去重
        menuList=this.unique(menuList)
        const dataScopeList = this.$refs.treeDataScope.getCheckedKeys();
        const apiScopeList = this.$refs.treeApiScope.getCheckedKeys();
        grant(this.idsArray, menuList, dataScopeList, apiScopeList).then(() => {
          this.box = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.onLoad(this.page);
        });
      },
      // 读取权限
      handleRole() {
        if (this.selectionList.length !== 1) {
          this.$message.warning("只能选择一条数据");
          return;
        }
        this.menuTreeObj = [];
        this.dataScopeTreeObj = [];
        this.apiScopeTreeObj = [];
        grantTree()
          .then(res => {
          	this.recursionArr=[]
            this.menuGrantList = res.data.data.menu;                 
            res.data.data.menu.forEach(item=>{
            	let obj={}
            	obj.title=item.title
            	obj.value=item.value
            	obj.hasChildren=item.hasChildren
            	obj.children=item.children
            	obj.allChildren=[]
            	this.recursionArr.push(obj)            	
            })
            this.recursionArr.forEach(item=>{
	            if(item.hasChildren){
	            	item.allChildren=this.recursion(item.children)
	            }            	
            })            
            this.dataScopeGrantList = res.data.data.dataScope;
            this.apiScopeGrantList = res.data.data.apiScope;
            getRole(this.ids).then(res => {
            	this.menuGrantList.forEach(item=>{                 
                 if(res.data.data.menu.includes(item.value)){               	
                 	  res.data.data.menu.splice(res.data.data.menu.findIndex(item2 => item2===item.value), 1)
                 }                 
            	})
              this.menuTreeObj = res.data.data.menu;
              this.dataScopeTreeObj = res.data.data.dataScope;
              this.apiScopeTreeObj = res.data.data.apiScope;
              this.box = true;
            });
          });
      },      
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          window.console.log(error);
          loading();
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
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
            return remove(row.id);
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
      beforeOpen(done, type) {
        const column = this.findObject(this.option.column, "roleAlias");
        column.disabled = this.form.roleAlias == 'admin' ? true : false
        if (["add", "edit"].includes(type)) {
          this.initData();
        }
        done();
      },
 
      recursion(arr,newArr=[]){
	        arr.forEach(item => {
	        	  newArr.push(item.value)
	            if(item.hasChildren) {
                newArr=newArr.concat(this.recursion(item.children))
	            }
	        })	 
	        return newArr
      },
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
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
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
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
