<template>
	<div class="login-container" @keyup.enter.native="handleLogin">
		<div class="outWrap">
			<div class="system-title">
				<div class="title-cn">{{ systemTitle }}</div>
			</div>
			
			<div style="position: relative;">
				<div class="login-wrapper">
					<user-login></user-login>
				</div>
			</div>
			
			<div class="tips">
				<div class="tel">售后电话: 0510-85126279</div>
				<div class="other">
					<span>当前版本: V4.0.0</span>
					<span style="margin-left: 35px;">技术支持: 江苏蓝创智能科技股份有限公司</span>				
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import userLogin from "./userlogin";
	import { mapGetters } from "vuex";
	import { dateFormat } from "@/util/date";
	import { validatenull } from "@/util/validate";
	import { getQueryString, getTopUrl } from "@/util/util";
	//import DynamicCloud from "./dynamic-cloud";
	import { rootMenus,getSystemNameByTenantId } from "@/api/user";

	export default {
		name: "login",
		components: {
			userLogin
		},
		data() {
			return {				
				time: "",
				activeName: "user",
				socialForm: {
					tenantId: "000000",
					source: "",
					code: "",
					state: "",
				},
				dynamicCloud: null,
				showLogin: true,
				systemTitle: '',
				getSystemName:'大气立体监测综合管控平台',
				changeType:'登录',
				menuList: [],
			};
		},
		watch: {
			$route() {
				this.handleLogin();
			}
		},
		created() {
			this.handleLogin();
			this.getTime();
		},
		mounted() {	
			if(this.$route.query.tenantId){
			    this.initSystemName(this.$route.query.tenantId)
			}else{
				this.systemTitle='大气立体监测综合管控平台'
			}

      if(this.$route.query.type=="changeSystem"){
        this.$store.dispatch("changeSystemToken").then(() => {
          this.beforeLogin()
        })
      }else{
          this.backToLogin()
      }
			/*this.dynamicCloud = new DynamicCloud(this.$root.$el); //传入app div
			this.dynamicCloud.init();
			this.dynamicCloud.animate();*/
		},
		destroyed() {
			/*this.dynamicCloud.dispose();
			this.dynamicCloud = undefined;*/
		},
		computed: {
			...mapGetters(["website", "tagWel"])
		},
		props: [],
		methods: {
			isEmptyObj(obj) {
			    for (var key in obj) {
			        if ({}.hasOwnProperty.call(obj, key)) return false;
			    }
			    return true;
            },
			initSystemName(tenantId){
			},
			selectSystem(systemCode) {				
				if(systemCode=="00"){
					this.backToLogin()
				}else{
					// 判断是否有 默认主题
					if(!localStorage.getItem('saber-themeName')) {
						this.$store.commit("SET_THEME_NAME", 'squirrel');
					}

				}
			},
			/**
			 * 切换账号
			*/
			backToLogin() {
				this.changeType='登录'
			},
			/**
			 * 登入系统前选择业务（子组件登录验证通过后调用
			 */
			beforeLogin() {
				rootMenus().then(res => {
					this.menuList=[]
					let arr=res.data.data
					for(var i=0;i<arr.length;i++){
						arr[i].imgUrl=this.formatMenuUrl(arr[i])
						this.menuList.push(arr[i])
					}
				})
			},
			formatMenuUrl(obj){
				return `/img/loginSystem/${obj.code}.png`
			},
			/**
			 * 租户000000的特别登录（最高权限01
			 */
			specialLogin() {
				localStorage.setItem('systemType', '01')
				// 选择业务后，跳转页面
				this.$router.push({
					path: this.tagWel.value
				});
			},
			getTime() {
				setInterval(() => {
					this.time = dateFormat(new Date());
				}, 1000);
			},
			handleLogin() {
				const topUrl = getTopUrl();
				const redirectUrl = "/oauth/redirect/";
				this.socialForm.source = getQueryString("source");
				this.socialForm.code = getQueryString("code");
				this.socialForm.state = getQueryString("state");
				if(validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
					let source = topUrl.split("?")[0];
					source = source.split(redirectUrl)[1];
					this.socialForm.source = source;
				}
				if(!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
					const loading = this.$loading({
						lock: true,
						text: '第三方系统登录中,请稍后。。。',
						spinner: "el-icon-loading"
					});
					this.$store.dispatch("LoginBySocial", this.socialForm).then(() => {
						window.location.href = topUrl.split(redirectUrl)[0];
						this.$router.push({
							path: this.tagWel.value
						});
						loading.close();
					}).catch(() => {
						loading.close();
					});
				}
			}
		}
	};
</script>
<!--this.$store.commit("SET_THEME_NAME", 'theme-dark');-->
<style  scoped>
	/*-webkit-box-reflect: below -28px;*/
	.outWrap{display: flex;flex-direction: column;align-items: center;}
	.tips{text-align: center;margin-top: 70px;color: #3a4f76;}
	.tel{font-weight: 600;font-size: 16px;margin-bottom: 5px;}
	.other{
	font-size: 14px;
	-webkit-box-reflect: below -2px  -webkit-gradient(linear,left top,left bottom, from(rgba(0,0,0,0)),to(rgba(255,255,255,0.2)));
	}
	.login-container {
		position: absolute;
		/* margin: auto; */
		/* width: 290px;
  height: 300px; */
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		padding: 80px 40px 40px 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* backgound & shadow */
		/* box-shadow: 0px 0px 20px 4px rgba(6, 17, 47, 0.7);
  background: #35394a; */
		/* Old browsers */
		/* FF3.6+ */
		/* background: -webkit-gradient(linear, left bottom, right top, color-stop(0%, #35394a), color-stop(100%, rgb(0, 0, 0))); */
		/* Chrome,Safari4+ */
		/* background: -webkit-linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%); */
		/* Chrome10+,Safari5.1+ */
		/* Opera 11.10+ */
		/* IE10+ */
		/* background: linear-gradient(230deg, rgba(53, 57, 74, 0) 0%, rgb(0, 0, 0) 100%); */
		/* W3C */
		filter: progid: DXImageTransform.Microsoft.gradient( startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)', GradientType=1);
		/* IE6-9 fallback on horizontal gradient */
		-moz-user-select: none;
		/*火狐*/
		-webkit-user-select: none;
		/*webkit浏览器*/
		-ms-user-select: none;
		/*IE10*/
		-khtml-user-select: none;
		/*早期浏览器*/
		user-select: none;
    background-image: url("/img/bg/bg-img.jpg");
    background-repeat:no-repeat;
    background-size:100% 100%;
	}
	
	.system-title {
		margin-bottom: 100px;
	}
	
	.title-cn {
		/* color: rgb(230, 230, 230); */
		font-size: 60px;
		color: #fafafa;
		letter-spacing: 0;
		text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135
	}
	
	.login-wrapper {
		width: 370px;
		padding: 60px 40px 10px 40px;
		box-sizing: border-box;
		box-shadow: 0px 0px 20px 4px rgba(14, 74, 129, 0.7);
		background: rgba(14, 74, 129, 0.2);
		background: -webkit-gradient(linear, left bottom, right top, color-stop(0%, rgba(14, 74, 129)), color-stop(60%, rgb(14, 74, 129)));
		background: -webkit-linear-gradient(230deg, rgba(14, 74, 129, 0.1) 0%, rgba(14, 74, 129, 0.6) 100%);
		background: linear-gradient(230deg, rgba(14, 74, 129, 0.1) 0%, rgba(14, 74, 129, 0.6) 100%);
	}
	
	.login-show {
		transition: 0.5s;
		opacity: 1;
		transform: scale(1);
	}
	
	.login-hide {
		transition: 0.5s;
		opacity: 0;
		transform: scale(0);
	}
	
	.systemType-wrapper {
		width: 1200px;
		padding: 20px;
		box-shadow: 0px 0px 20px 4px rgba(14, 74, 129, 0.7);
		background: rgba(14, 74, 129, 0.2);
		background: -webkit-gradient(linear, left bottom, right top, color-stop(0%, rgba(14, 74, 129)), color-stop(60%, rgb(14, 74, 129)));
		background: -webkit-linear-gradient(230deg, rgba(14, 74, 129, 0.1) 0%, rgba(14, 74, 129, 0.6) 100%);
		background: linear-gradient(230deg, rgba(14, 74, 129, 0.1) 0%, rgba(14, 74, 129, 0.6) 100%);
		opacity: 0;
		transform: scale(0);
		position: absolute;
		top: 0;
		left: -120%;
		color: #fafafa;
	}
	.systemType-wrapper .wrapper_flex{
		text-align: center;
		width: 100%;
	}	
	.systemType-show {
		transition: 0.5s;
		opacity: 1;
		transform: scale(1);
	}
	
	.systemType-hide {
		transition: 0.5s;
		opacity: 0;
		transform: scale(0);
	}
	
	.systemType-top {
		display: flex;
		margin-bottom: 20px;
	}
	
	.backToLogin {
		font-size: 12px;
		cursor: pointer;
	}
	
	.system-item {
		padding: 5px;
	}
	
	.system-item-content {
		text-align: center;
		border: 1px solid #ddd;
		border-radius: 5px;
		line-height: 30px;
		cursor: pointer;
		font-size: 14px;
	}
	
	
	.img_wrap{padding: 0 20%;}
	.grid-content-img{display: block;margin-bottom: 8px;width: 100%;}
	.grid-content-word{text-align: center;color: #333;font-size: 14px}
	.grid-content-word span{display: inline-block;width: 100px;}
	.account{position: absolute;bottom: 40px;right: 80px;}
	.account img{width: 60px;height: 60px;display: block;}
	.changeAccount{font-size: 12px;text-align: center;margin-top: 6px;}
</style>
