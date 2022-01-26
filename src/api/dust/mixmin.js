export const getMixMin = {
		watch: {

		},				
		mounted() {
			
		},
		methods: {
	    	// 证件照上传成功后 执行的函数
	    	PicSuccess(res){
	    	 	this.imageUrl=res.data.urlsrc
	    	},
	　　　     beforePicUpload(file) {                 
	            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)  
	            const extension = testmsg === 'jpg'
	            const extension2 = testmsg === 'png'
	            const isLt2M = file.size / 1024 / 1024 > 4
	            if(!extension && !extension2) {
	                this.$message({
	                    message: '上传文件只能是 jpg、png!',
	                    type: 'warning'
	                });
	            }
	            if(!isLt2M) {
	                this.$message({
	                    message: '上传文件大小不能超过 4MB!',
	                    type: 'warning'
	                });
	            }
	            return extension || extension2 && isLt2M
	        },
	        // 证件照上传成功后 执行的函数
	    	PicSuccess2(res){
	    	 	this.imageUrl=res.data.urlsrc
	    	},
	　　　     beforePicUpload2(file) {                 
	            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)  
	            const extension = testmsg === 'jpg'
	            const extension2 = testmsg === 'png'
	            const isLt2M = file.size / 1024 / 1024 > 4
	            if(!extension && !extension2) {
	                this.$message({
	                    message: '上传文件只能是 jpg、png!',
	                    type: 'warning'
	                });
	            }
	            if(!isLt2M) {
	                this.$message({
	                    message: '上传文件大小不能超过 4MB!',
	                    type: 'warning'
	                });
	            }
	            return extension || extension2 && isLt2M
	        }	       
		}
}
