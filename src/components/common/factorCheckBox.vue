
<template>
  <el-checkbox-group v-model="factorChildList" class="checkbox" @change="checkboxChange">
    <el-checkbox v-for="(alias) in checkChildList" :label="alias" :key="alias" :value="alias"></el-checkbox>
  </el-checkbox-group>
</template>
<script>
	export default {
		data() {
			return {
				factorChildList:[],
				checkChildList:[],
				currentList:[],
				returnList:[]
      		}
		},
    props: {
      checkList:Object,
	  currentPageList:Object,
    },
	watch:{
	 checkList(){
		 this.checkChildList = this.checkList;
		 this.factorChildList = this.checkList;
	 },
	 currentPageList(){
		 debugger
		this.currentList = this.returnList;
	 }
	},
	methods: {
			checkboxChange(){
			console.log(this.currentList)
			var titlelist= this.currentList.slice(0,2)
			this.returnList= this.currentList.splice(2);
			this.returnList.forEach(item=>{
				var isSelect =false;
				var children =item.children;
				for(var i=0;i<this.factorChildList.length;i++){
				if(item.label.indexOf(this.factorChildList[i])!= -1){
					isSelect =true;
					for(var j=0;j<children.length;j++){
						children[j]["hide"]=false;
					}
					break;
				}else{
					isSelect =false;
					var children =item.children;
					for(var j=0;j<children.length;j++){
						children[j]["hide"]=true;
					}
				}
				}
				if(isSelect){
					item["hide"]=false;
					}else{
					item["hide"]=true;
				}
			})
			this.returnList =titlelist.concat(this.returnList);
			// this.currentList = this.returnList;
			this.$emit("checkboxChange",this.returnList,this.factorChildList)
			},
		}
	};
</script>


