<template>
  <div class="columnShow">
		<el-drawer
		  title="字段显隐"
		  size="50%"
		  :modal-append-to-body="false"
		  :visible.sync="drawer"
		  :modal="true"
		  >
		  <div style="padding: 0 20px;overflow: scroll;" class="table-wrapper">
				<template>
				  <el-table
				    :data="dataList"
				    stripe
				    style="width: 100%">
				    <el-table-column
				      prop="date"
				      label="字段名"
				      width="180">
				      <template slot-scope="scope">
				      	<span>{{scope.row.alias}}</span>
				      </template>
				    </el-table-column>
            <el-table-column
              prop="sort"
              label="排序"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" size="mini" style="width: 120px;"></el-input>
              </template>
            </el-table-column>
				    <el-table-column
				      prop="name"
				      label="最小宽度"
				      width="180">
				      <template slot-scope="scope">
							  <el-input v-model="scope.row.tableWidth" size="mini" style="width: 120px;" :disabled="!scope.row.discriminatingFactor&&tabelType==2"></el-input>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="是否显示">
				      <template slot-scope="scope">
					    <el-select v-model="scope.row.isShow"  size="mini" style="width: 150px;">
					      <el-option label="是" value="1"></el-option>
					      <el-option label="否" value="0"></el-option>
					    </el-select>
				      </template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="固定定位">
				      <template slot-scope="scope">
						    <el-select v-model="scope.row.istFixed"  size="mini" style="width: 150px;"  :disabled="!scope.row.discriminatingFactor&&tabelType==2">
						      <el-option label="否" value=""></el-option>
						      <el-option label="左固定" value="left"></el-option>
						    </el-select>
				      </template>
				    </el-table-column>
				  </el-table>
				  <div style="margin-top: 15px;">
					    <el-button type="primary" @click="confirm()" size="small">确认</el-button>
					    <el-button size="small" @click="drawer=false">取消</el-button>
				  </div>
				</template>
		  </div>
		</el-drawer>
  </div>
</template>

<script>
	import { saveDynamicHeader,systemRouter } from "@/api/common/common";
  export default {
    name: "columnShow",
    props:{
    	data:{
    		type:Array,
    		default:[]
    	}
    },
		data() {
	      return {
	      	dataList:[],
	        drawer: false,
	        formInline: {
	          user: '3',
	          region: '0'
	        },
          isSortEmpty:false,
	      };

		},
		computed:{
			 tabelType(){
			 	  let type;
			 	  let hash = window.location.hash.split('?')[0].replace(/#/g, '')
			 	  for(var i=0;i<systemRouter.length;i++){
			 	  	if(hash==systemRouter[i].routerUrl){
			 	  		type=systemRouter[i].tabelType
			 	  		break;
			 	  	}
			 	  }
			 	  return type
			 }
		},
    methods:{
    	showWin(){
    		this.drawer=true
    		this.dataList=[]
    		this.dataList=this.copyArray(this.data)  // 深拷贝数组
    	},
    	// 深拷贝数组
      copyArray(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        }
        for(var i in obj){
           newobj[i] = typeof obj[i] === 'object' ? this.copyArray(obj[i]) : obj[i];
        }
        return newobj
      },

    	confirm(){
    	  this.dataList.forEach(item=>{
    	    item.sort = item.sort?item.sort:'0'
        })
        let hash=window.location.hash.split('?')[0].replace(/#/g,'')
        saveDynamicHeader(hash,JSON.stringify(this.dataList)).then(res=>{
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.drawer=false
          this.$emit('success')
        })
    	},
    },
  };
</script>

<style lang="scss">
.columnShow{
	.el-drawer__header{margin-bottom: 10px;}
	.el-drawer{overflow: scroll;}
	.el-table td{padding: 8px 0;}
}
</style>
