<template>
	<div class="tabelContainer">
		<basic-container>
			<div class="system_wrap">
				<avue-form v-model="form" :option="option" @submit="handleSubmit">
					  <template slot-scope="scope" slot="zoomLevel">
					    <div>
                            <el-input-number v-model="form.zoomLevel" :precision="0" :step="1" :max="16"></el-input-number>
					    </div>
					  </template>					
					<template slot-scope="scope" slot="systemPic">
						<div>
							<el-upload class="upload-demo" drag action="/api/ms-ficm/file/upload" :show-file-list="false" name="multipartFile" :headers='headers' :on-success="PicSuccess">
								<div class="noUp" v-if="!form.systemPic">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
								</div>
								<div class="hasUp" v-else>
									<img :src="form.systemPic" alt="" class="logo" />
								</div>
								<div class="el-upload__tip" slot="tip">
									<div>提示:文件格式为jpg/png,尺寸大小建议为 100*100</div>
									<div v-if="form.systemPic">文件服务器地址:{{form.systemPic}}</div>
								</div>
							</el-upload>
						</div>
					</template>
				</avue-form>
			</div>
		</basic-container>
	</div>
</template>

<script>
	import { getSystemConfig, submit } from "@/api/ficm/systemName";
	import { headers } from "@/api/dust/personnel";
	import { systemName } from "@/util/rulesReg";
	export default {

		data() {
			return {
				headers: headers(), // 自定义上传空间需要的权限	
				form: {},
				option: {
					column: [
					    {
							label: "系统名称",
							labelWidth:120,
							prop: "systemName",
							span: 24,
							minRows: 6,
							editDisabled: true,
							rules: [{
								validator: systemName,
								trigger: 'blur',
								required: true
							}]
						},
					    {
							label: "gis地图缩放比例",
							labelWidth:120,
							prop: "zoomLevel",
							span: 6,
							minRows: 6,
							formslot:true,
							editDisabled: true,
						},						
						{
							label: "logo",
							labelWidth:120,
							prop: "systemPic",
							span: 24,
							minRows: 6,
							formslot: true
						}
					]
				}
			};
		},
		mounted() {
			this.init()
		},
		methods: {
			PicSuccess(res) {
				this.form.systemPic = res.data // 模拟	 	
			},
			init() {
				getSystemConfig().then(res => {
					this.form = res.data.data
				});
			},
			handleSubmit(form, done) {
				if(!form.zoomLevel)form.zoomLevel=0
				submit(form).then(res => {
					if(res.data.success) {
						this.$message({
							type: "success",
							message: "修改信息成功!"
						});
						this.init()
					} else {
						this.$message({
							type: "error",
							message: res.data.msg
						});
					}
					done()
				},error=>{
					done()
				})
			}
		}
	};
</script>

<style lang="scss" scoped="">
	.system_wrap {
		padding: 40px 20px;
		* {
			box-sizing: border-box;
		}
	}
	
	.hasUp {
		padding: 20px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		img {
			width: 150px;
			height: 150px;
		}
	}
</style>