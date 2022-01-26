<template>
  	<div class="uploadWrap">
		<el-upload
		  class="avatar-uploader"
		  name="multipartFile"
		  :headers='headers'
		  action="/api/ms-ficm/file/upload"
		  :show-file-list="false"
		  :on-success="PicSuccess"
		  :beforeUpload="BeforePicUpload"
		  :on-error="PicError"
		  >
		  <img v-if="imageUrl" :src="imageUrl" class="avatar">
		  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>	
    </div>	
</template>

<script>
	import {headers} from "@/api/dust/personnel";	
	export default {
		data() {
			return { 
			   headers:headers() // 自定义上传空间需要的权限	
			}
		},
		props:{
			imageUrl:{
				type: String,
				default:''
			}
		},		
		methods:{
	        // 证件照上传成功后 执行的函数
	    	PicSuccess(res){
	    	 	this.imageUrl=res.data // 模拟
	    	 	this.$emit('success',this.imageUrl)
	    	},
	　　　      BeforePicUpload(file) {                 
	            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)  
	            const extension = testmsg === 'jpg'
	            const extension2 = testmsg === 'png'
	            const isLt4M = file.size / 1024 / 1024 < 4
	            if(!extension && !extension2) {
	                this.$message({
	                    message: '上传文件只能是 jpg、png!',
	                    type: 'warning'
	                });
	            }
	            if(!isLt4M) {
	                this.$message({
	                    message: '上传文件大小不能超过 4MB!',
	                    type: 'warning'
	                });
	            }
	            return (extension || extension2) && isLt4M
	        },
	        PicError(){
                this.$message({
                    message: '文件上传失败',
                    type: 'error'
                });	        	
	        }
		}
	}
</script>

<style lang="scss">
.uploadWrap{
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #fbfdff;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }	
} 	
</style>