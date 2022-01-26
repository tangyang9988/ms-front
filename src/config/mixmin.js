import { system } from "@/components/common/option/system.js";
import { mapGetters } from "vuex";
export default {
	data() {
		return {
			currentLeft:0,
		    isOpen:true,			
			searchName:'',
			leftWidth: this.$leftWidth,
			rightWidth: this.$rightWidth,
			page: {
				pageSize: this.$pageSize,
				currentPage: 1,
				total: 0
			}			
		}
	},
	computed: {
		...mapGetters(["userInfo", "permission"]),
		systemInfo() {
			let systemType = localStorage.getItem('systemType');
			let obj = null
			for(var i = 0; i < system.length; i++) {
				if(system[i].systemId == systemType) {
					return system[i];
					break;
				}
			}
		},
	},
	mounted() {
       
	},
	methods: {	
		dragControllerDiv(){
			let that=this  // 一定要写这个 涉及到this指向问题
			var resize = document.getElementById('resize');
			var left = document.getElementById('left');
			var right = document.getElementById('right');
			var box = document.getElementById('reaize_box');
			resize.onmousedown = function(e) {
				var startX = e.clientX;
				resize.left = resize.offsetLeft;
				document.onmousemove = function(e) {
					var endX = e.clientX;
					var rightW = right.offsetWidth;
					var moveLen = resize.left + (endX - startX);
					var maxT = box.clientWidth - resize.offsetWidth;
					if(moveLen < 200) moveLen = 200;
					// if (moveLen > maxT - rightW ) moveLen = maxT - rightW ;	
					resize.style.left = moveLen;
					left.style.width = moveLen + 'px';
					that.currentLeft= moveLen					
				}
				document.onmouseup = function(evt) {
					document.onmousemove = null;
					document.onmouseup = null;
					resize.releaseCapture && resize.releaseCapture();					
				}
				resize.setCapture && resize.setCapture();
				return false;
			}
		},				
		changeTreeBox1(){
			var resize = document.getElementById('resize');
			var left = document.getElementById('left');				
			// 当前是展开 点击后收缩
			if(this.isOpen){
				resize.style.left = 0;
				left.style.width = 0 + 'px';					
			}
			// 当前是收缩 点击后展开
			else{
				resize.style.left = this.currentLeft;
				left.style.width = this.currentLeft + 'px';						
			}
			this.isOpen=!this.isOpen			
		},		
		swapArray(arr, index1, index2) {
		   arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		   return arr;
		},	
		zIndexDown(arr,index){
		   let length=arr.length
		   if(index+1 != length){
		      this.swapArray(arr, index, index+1);
		   }else{
		      this.$message('已经处于置底，无法下移');
		  }
		},
		zIndexUp(arr,index){
		   let length=arr.length	
		   if(index!= 0){
		       this.swapArray(arr, index, index-1);
		   }else{
		      this.$message('已经处于置顶，无法上移');
		  }
		},		
		// 数组对象是否有空值
		isNullArr(arr,field){
			let status=false;
			for(var i =0; i<arr.length; i++){
          		if(!arr[i][field]){
          			status=true
          		}          		
			}	
            return status		
		},		
		// 数组对象去重		
		removal(arr,field){
			var result = [];
			var obj = {};
			var num=0;
			var resultObj={}
			for(var i =0; i<arr.length; i++){
				if(!obj[arr[i][field]]){
					 result.push(arr[i]);
					 obj[arr[i][field]] = true;
				}else{
					num++
				}				
			}	
			resultObj.result=result
			resultObj.num=num
            return 	resultObj		
		},
		filterData(data){			
			return data.filter((item) => item[this.systemInfo.filterDataField].includes(this.searchName))
		},
		// 根据某个字段删除数组的那一项
		delArr(arr,field,value){
			arr.splice(arr.findIndex(item => item[field] === value), 1)
		},
		// 根据某个字段检测对象数组中是否存在（对象）
		checkArr(arr,field,value){
			var result = arr.some(item=>{
			   if(item[field]==value){
			      return true 
			  } 
			})
			return result
		},
		// 单元格样式
		cellStyle({row}) {
			return row.isAbnormal ? {
				color: 'red'
			} : {}
		},		
		// 显隐控制显示
		showColumn() {
			this.$refs.columnShow.showWin()
		},		
		// 搜索
		search() {
			this.page.currentPage = 1
			this.onLoad()
		},
		// 左右收缩
		changeTreeBox() {
			this.leftWidth = this.leftWidth == this.$leftWidth ? 0 : this.$leftWidth
			this.rightWidth = this.rightWidth == this.$rightWidth ? 24 : this.$rightWidth
		},
		// 页码改变
		currentChange(currentPage) {			
			this.page.currentPage = currentPage;
			this.onLoad();
		},
		// 每页条数改变
		sizeChange(pageSize) {			
			this.page.currentPage = 1
			this.page.pageSize = pageSize;
			this.onLoad()
		},
		// 搜索表单重置（需设置搜索对象）
		searchReset() {
			this.onLoad();
		},
		// 刷新当前表单
		refreshChange() {
			this.onLoad();
		},
		// 限制在线率或者达标率显示
		hideOnlineAndStand(systemId, field) {
			if(field == "online") {
				if(systemId == '21') {
					return true
				} else {
					return false
				}
			} else if(field == "stand") {
				if(systemId == '21') {
					return true
				} else {
					return false
				}
			} else {
				return flase
			}

		}
	}
}