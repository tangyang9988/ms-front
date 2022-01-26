<template>
    <div>    	
        <!-- 工具栏 -->
        <div v-if="designMode">
            <el-select v-model="tenant" value-key="id" @change="onTenantChange" :loading="tenantsLoading"
                filterable remote :remote-method="getTenants" size="mini" placeholder="请选择租户" disabled >
                <el-option v-for="item in tenants" :key="item.id" :label="item.tenantName" :value="item"></el-option>
            </el-select>&nbsp;          
            <el-select v-model="bizType" value-key="id" @change="onBizTypeChange" size="mini" placeholder="请选择业务类型" filterable >
                <el-option v-for="item in bizTypes" :key="item.dictKey" :label="item.dictValue" :value="item"></el-option>
            </el-select>&nbsp;
            <el-select v-model="entType" value-key="id" @change="onEntTypeChange" size="mini" placeholder="请选择企业类型">
                <el-option v-for="item in entTypes" :key="item.dictKey" :label="item.dictValue" :value="item"></el-option>
            </el-select>&nbsp;
            <el-select v-model="limit" value-key="id" size="mini" placeholder="请选择" @change="onLimitChange">
                <el-option v-for="item in limitList" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>&nbsp;
            <el-dropdown @command="addWidget">
                <el-button size="mini">
                    添加图表<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in allWidgets" :key="item.id" :command="item.id">{{ item.n }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>&nbsp;
            <el-select v-model="template" value-key="id" size="mini" placeholder="请选择" @change="onTemplateChange">
                <el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>&nbsp;
            <el-button @click="saveSettings" size="mini">保存配置</el-button>
        </div>
        <!-- 布局容器 -->
        <grid-layout :layout.sync="layout" :col-num="12" :row-height="rowHeight" :max-rows="maxRows"
            :is-draggable="designMode" :is-resizable="designMode">
            <grid-item class="panel" v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
                :key="item.i" @mouseover.native="onEnterPanel(item.i)" @mouseleave.native="onLeavePanel(item.i)">
                <!-- 浮动按钮 -->
                <el-button v-show="showPanelButtons(item.i)" class="panel_button" @click="delWidget(item.i)" size="mini"
                    type="danger" icon="el-icon-delete" circle></el-button>
                <!-- 动态widget -->
                <component :is="item.widget"></component>
            </grid-item>
        </grid-layout>
    </div>
</template>
<script>
import gridLayout from "vue-grid-layout";
import { getList } from "@/api/system/tenant";
import { fullscreenEnable } from "@/util/util";
import { getDetail, add, update, getChartSelectOption,getEntTypeApi,getDizTypeApi,getDefaultTemplate } from "@/api/ficm/dashboard";
import { limitListAll } from "./option";
export default {
  components: {
    GridLayout: gridLayout.GridLayout,
    GridItem: gridLayout.GridItem
  },
  props: {
    designMode: Boolean,        //是否设计模式
    readDefaultOption: Boolean, //是否读取默认配置
    type: String,
  },
  data() {
    return {
      tenantsLoading: false, // 租户列表下拉框输入的时候是否显示正在查询中
      tenants: [],           // 储存租户列表的数据
      tenant: null,          // 储存当前选中的租户数据
      limitList: [],          // 储存限制类型数据
      limit: null,            // 储存当前的限制类型
      type: null,             // 暂时未知 之后补
      bizTypes: [],          // 储存业务类型数据列表
      bizType: null,         // 储存当前业务类型
      layout: [],            // 储存当前布局方案
      entTypes: [],          // 储存监管单位
      entType: null,          // 储存当前的监管单位
      templateList: [],       // 储存默认模板列表
      template: null,         // 储存当前选中的模板
      widgets: {},           // 储存当前模板列表下要显示的图表列表
      currentId: null,      // 储存当前的配置ID 保存的时候要用到
      hoverPanel: -1,        // 当前mouse下的widget的id
      layout: [],            // 储存当前的布局 【后端获取】
      allWidgets: [],
      maxRows: 12,
      rowHeight: 50,
      limitListAll:limitListAll
    }
  },
  mounted() {
    //如果设计时，加载租户列表
    this.getTenants()
    
    // 获取第三个下拉框的值
    this.getEntList()
    this.resizeScreen()
  },
  methods: {
  	// 深复制对象
    cloneLayout(defaultLayout) {
      let res = []
      for (const p of defaultLayout) {
        res.push(Object.assign({}, p))
      }
      return res
    },  	
    // 鼠标划入后会显示一个删除按钮 点击删除按钮执行的事件
    delWidget(id) {
      let index = this.layout.findIndex(t => t.i == id);
      if (index >= 0) {
        this.layout.splice(index, 1);
      }
    },
    /** 查询绑定租户列表|| 远程搜索*/
    getTenants(nameKey) {
      // 远程搜索需要的参数 这个在输入的时候 会存在nameKey
      let query = {}
      if (nameKey) {
        query.tenantName = nameKey
      }
      this.tenantsLoading = true
//    做级联了 这边不要先赋值      
//    if (this.type) {
//      for (let i = 0; i < this.limitList.length; i++) {
//        if (this.limitList[i].id == this.type) {
//          this.limit = this.limitList[i]
//        }
//      }
//    } else {
//      this.limit = this.limitList[0]
//    }
      // 获取租户列表接口 1代表页码 20代表页码条数
      // TODO:后期如果要给 000000用户配置这个权限的话 20可能会不够
      getList(1, 20, query).then(res => {
        const data = res.data.data
        this.tenants = data.records // TODO:考虑过滤掉管理组
        this.tenantsLoading = false
        // 如果租户数量大于 默认选中第一个租户去请求数据
        if (this.tenants.length > 0) {
          this.tenant = this.tenants[0]
          // 租户改变时重组业务类型列表
          this.onTenantChange()
        }
      });
    },
    /** 查询企业类型列表 */
    getEntList() {
      getEntTypeApi().then(res => {
        this.entTypes = res.data.data;
        this.entType = res.data.data[0];
      })
    },
    /** 改变租户时加载相应的业务类型 */
    onTenantChange() {
      this.bizTypes = [] //清空业务类型
      // 加载业务类型列表 （暂时全部加载）（第二个下拉列表）
      // TODO:之后应该根据此用户拥有的系统权限去显示对应的业务类型列表
      getDizTypeApi().then(res => {
        this.bizTypes = res.data.data;
        // 默认选择第一个
        if (this.bizTypes.length > 0) {
          this.bizType = this.bizTypes[0]
          this.getLimitList()          
        }
      })
    },
    getLimitList(){
       this.limitList=[];
       this.limit=null;
       this.layout=[];
       this.allWidgets=[]
       this.templateList=[]
       this.template=null
       this.limitList=this.checkLimit(this.bizType.dictKey)
       if(this.limitList.length>0){
      	 this.limit = this.limitList[0]
      	 this.defaultTemplate()
      	 this.onTypeChange()          	
       }else{       	 
      	 return false
       }    	
    },
    checkLimit(system){
    	let arr=[]
    	this.limitListAll.forEach(item=>{
    		if(item.system==system){
    			arr.push(item)
    		}
    	})
    	return arr
    },
    // 找出对应的配置文件
    formatConfig(arr,system,type){
    	let obj=null
    	arr.forEach(item=>{
    		if(item.system==system&&item.type==type){
    			obj=item
    		}
    	})
    	return obj
    },
    onLimitChange(val){
    	this.limit=val
    	this.defaultTemplate()
    	this.onTypeChange() 	
    },
    onBizTypeChange(val){
    	this.bizType=val
        this.getLimitList()  
    },
    onEntTypeChange(val){
    	this.entType=val
    	this.defaultTemplate()
    	this.onTypeChange()
    },
    // 渲染默认模板列表
    defaultTemplate() {    
      getDefaultTemplate(this.entType.dictKey,this.bizType.dictKey,this.limit.id).then(res => {
        this.template = null;
        this.templateList = res.data.data;
      })
    },    
    onTemplateChange(val){
      // 需要切换本地默认配置	 
      this.onTypeChange(true,val.opts)
    },    
    /** 设计时：业务类型改变加载相应的布局配置 */
    onTypeChange(TemplateChange,TemplateOpts) {      
      // 根据业务类型加载可用widgets列表，相同业务类型可打包在一起
      this.layout = [] //清空布局
      // 根据选择的系统请求不同的布局配置以及图表下拉内容。
      if (this.bizType) {
        // 获取默认模板 注意这边没有用到这个
        // 获取 可配置图表
        getChartSelectOption(this.bizType.dictKey).then(result => {
          // 需要根据系统和类型获取配置          
          let opts = () => import('./components/index')
          if (!opts) return
          let that = this 
          let defaultLayout = null
          if(TemplateChange){
          	 opts().then(res => {
	          	// 首先需要确定配置文件
	          	let config=that.formatConfig(res.default,that.limit.system,that.limit.id)
	            // res 获取本地配置模板   result.data.data根据当前的业务系统返回数据库储存的模板列表 然后2者进行匹配
	            that.widgets = {}
	            // 遍历接口的数据，匹配对应的选择项 如果有本地模板就加入widgets
	            result.data.data.forEach(item => {
	              for (const key in config.widgets) {
	                let el = config.widgets[key]
	                if (el.n == item.dictValue) {
	                  that.widgets[key] = el
	                }
	              }
	            })
	            // 给 allWidgets 赋值(第五个下拉选择框)
	            that.parseAllWidgets()
	            that.parseLayout(TemplateOpts)
          	 })
          }else{
	          opts().then(res => {
	          	// 首先需要确定配置文件
	          	let config=that.formatConfig(res.default,that.limit.system,that.limit.id)
	            // res 获取本地配置模板   result.data.data根据当前的业务系统返回数据库储存的模板列表 然后2者进行匹配
	            that.widgets = {}
	            // 遍历接口的数据，匹配对应的选择项 如果有本地模板就加入widgets
	            result.data.data.forEach(item => {
	              for (const key in config.widgets) {
	                let el = config.widgets[key]
	                if (el.n == item.dictValue) {
	                  that.widgets[key] = el
	                }
	              }
	            })                        
	            // 给 allWidgets 赋值(第五个下拉选择框)
	            that.parseAllWidgets()
	            // 复制一份当前业务系统下本地的默认布局
	            defaultLayout = that.cloneLayout(config.defaultLayout)
                return getDetail(that.tenant.tenantId, that.bizType.dictKey, that.entType.dictKey, that.limit.id)
	          }).then(res => {
	            that.currentId = null
	            if (res.data.code != 200) {
	              that.$message.error("读取配置错误")
	              that.parseDefaultLayout(defaultLayout)
	            } else if (res.data.msg == '暂无承载数据') {              
	              that.parseDefaultLayout(defaultLayout)
	            } else {
	              // 记录当前的配置ID 保存配置的时候用到
	              that.currentId = res.data.data.id
	              // 获取当前的布局
	              let opts = res.data.data.opts
	              //如果有配置项，开始解析 因为是个字符串
	              if (opts) {
	                that.parseLayout(opts)
	              } else {
	                this.layout = defaultLayout
	              }
	            }
	          })          	
          }
        })
      }
    },
    // 重组 allWidgets
    parseAllWidgets() {
      this.allWidgets = []
      if (this.widgets) {
        for (const key in this.widgets) {
          if (this.widgets.hasOwnProperty(key)) {
            this.allWidgets.push({id: key, n: this.widgets[key].n})
          }
        }
      }
    },
    parseDefaultLayout(json) {
      if (json.length > 0) {
        let status = true
        let layout = json;
        for (const p of layout) {
          try {
            p.widget = this.widgets[p.c].c;
          } catch (e) {
            status = false
          }
        }
        if (status) {
          this.layout = layout;
        } else {
          this.layout = []
        }
      }
    },
    // 重组 layout
    parseLayout(json) {
      // :解析失败默认配置
      let layout = JSON.parse(json).layout;
      for (const p of layout) {
        p.widget = this.widgets[p.c].c;
      }
      this.layout = layout;
    },
    onEnterPanel(i) {
      this.hoverPanel = i;
    },
    onLeavePanel() {
      this.hoverPanel = -1;
    },
    showPanelButtons(i) {
      return this.designMode && this.hoverPanel === i;
    },
    /** 添加组件至Dashboard */
    addWidget(widget) {
      let id = 0;
      let found = true;
      while (found) {
        if (this.layout.find(t => t.i == id)) {
          id++;
        } else {
          found = false;
          break;
        }
      }
      let nw = {i: id, x: 0, y: 0, w: 12, h: 2, c: widget, widget: this.widgets[widget].c, o: {}}
      this.layout.push(nw);
    },

    /** 保存当前布局配置 */
    saveSettings() {
      if (!this.tenant || !this.bizType) {
        this.$message.error("未选择租户及业务类型");
        return;
      }
      let s = {layout: []};
      for (const p of this.layout) {
        s.layout.push({i: p.i, x: p.x, y: p.y, w: p.w, h: p.h, c: p.c, o: p.o});
      }
      const res = JSON.stringify(s);
      let api = null;
      if (this.currentId) { //更新
        api = update({id: this.currentId, opts: res})
      } else { //新建
        api = add({
          tenantId: this.tenant.tenantId,
          st: this.bizType.dictKey,
          deptType: this.entType.dictKey,
          type: this.limit.id,
          opts: res
        })
      }
      api.then(res => {
        if (res.data.code == 200) {
          this.$message.success("保存配置成功")
        } else {
          this.$message.error("保存配置失败")
        }
      })
    },
    resizeScreen() {    
      window.onresize = () => {      	
        return (() => {
          if (fullscreenEnable()) {
            this.setRowHeight(this.layout);
          } else {
            this.rowHeight = 50;
          }
        })()
      }
    },
    setRowHeight(layout) {      
      let yset = new Set();
      layout.forEach((val) => {
        yset.add(val.y);
      })
      if (yset.size > 0) {
        let height = document.getElementById("avue-view").offsetHeight - yset.size * 60;
        this.rowHeight = height / this.maxRows;
      }
    }

  },

  watch: {
    layout: function (layout) {
      if (layout.length > 0) {
        this.setRowHeight(layout);
      }
    }
  },
}
</script>

<style scoped>
.panel {
  /* background-color: silver; */
}

.panel_button {
  position: absolute;
  z-index: 99;
  top: 0;
  right: 0;
  float: right;
}
</style>
