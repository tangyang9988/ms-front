<template>
  <div></div>
</template>
<script>
  import userLogin from "./userlogin";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import {getQueryString, getTopUrl} from "@/util/util";
  import $ from "jquery";
  import {rootMenus, getSystemNameByTenantId} from "@/api/user";

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
        getSystemName: '',
        changeType: '第三方登录',
        menuList: [],
      };
    },
    watch: {
      $route() {
        this.handleLogin();
      }
    },
    created() {
      //this.handleLogin();
      //this.getTime();
    },
    mounted() {
      debugger
      //判断是否自动登录
      let info = this.$route.query.info;
      if(info){
        let user =  JSON.parse(window.atob(info))
        this.handleAutoLogin(user);
      }else{
        this.beforeLogin()
      }
    },
    destroyed() {
      this.dynamicCloud.dispose();
      this.dynamicCloud = undefined;
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
      initSystemName(tenantId) {
        getSystemNameByTenantId(tenantId).then(res => {
          this.getSystemName = res.data.data === "" ? "" : res.data.data;
          this.systemTitle = this.getSystemName;
          // this.systemTitle=this.getSystemName+'-'+this.changeType;
        })
      },
      selectSystem(selectedSystemCode) {
        let systemCode = selectedSystemCode.replace("-1","")
        if (systemCode == "00") {
          this.backToLogin()
        } else {
          // 判断是否有 默认主题
          if (!localStorage.getItem('saber-themeName')) {
            this.$store.commit("SET_THEME_NAME", 'squirrel');
          }
          localStorage.setItem('systemType', systemCode)
          // 选择业务后，跳转页面
          this.$router.push({
            path: this.tagWel.value
          });
        }
      },
      /**
       * 切换账号
       */
      backToLogin() {
        this.changeType = '登录'
        this.systemTitle = this.getSystemName
        // this.systemTitle =this.getSystemName+'-'+this.changeType
        this.selected = null
        // 隐藏业务选择
        $('.systemType-wrapper').removeClass('systemType-show')
        $('.systemType-wrapper').addClass('systemType-hide')
        // 显示登录表单
        $('.login-wrapper').removeClass('login-hide')
        $('.login-wrapper').addClass('login-show')
        $('.tips').show()
        $('.account').hide()
      },
      /**
       * 登入系统前选择业务（子组件登录验证通过后调用
       */
      beforeLogin() {
        this.changeType = '业务选择'
        this.systemTitle = this.getSystemName
        rootMenus().then(res => {
          this.menuList = []
          let arr = res.data.data
          for (var i = 0; i < arr.length; i++) {
            arr[i].imgUrl = this.formatMenuUrl(arr[i])
            if (arr[i].code !== '03' && arr[i].code !== '05') {
              this.menuList.push(arr[i])
            }
          }
        })
      },
      formatMenuUrl(obj) {
        return `/img/loginSystem/${obj.code}.png`
      },
      /**
       * 租户000000的特别登录（最高权限01
       */
      specialLogin() {
        localStorage.setItem('systemType', '22')
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
        if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
          let source = topUrl.split("?")[0];
          source = source.split(redirectUrl)[1];
          this.socialForm.source = source;
        }
        if (!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
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
      },
      changeSelectedImg(item){
        item.code = item.code + "-1";
        item.cursor = "pointer";
        item.imgUrl = this.formatMenuUrl(item)
      },
      changeUnselectedImg(item){
        item.code = item.code.replace("-1","")
        item.imgUrl = this.formatMenuUrl(item)
      },
      handleLogout() {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      },
      handleAutoLogin(loginForm){
        let that = this;
        this.$store.dispatch("LoginByUsername", loginForm).then(() => {
            if (!localStorage.getItem('saber-themeName')) {
              that.$store.commit("SET_THEME_NAME", 'squirrel');
            }
            localStorage.setItem('systemType', "22")
            that.$router.push({
              path: that.tagWel.value
            });
            //this.beforeLogin()
        }).catch(() => {
            this.$router.push({
              path: "/login"
            });
        });
      }
    }
  };
</script>
<!--this.$store.commit("SET_THEME_NAME", 'theme-dark');-->
<style scoped>
  /*-webkit-box-reflect: below -28px;*/
  .outWrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login-container {
    display: none;
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
    /*align-items: center;*/
    /*justify-content: center;*/
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
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='rgba(53, 57, 74, 0)', endColorstr='rgb(0, 0, 0)', GradientType=1);
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
    background: url("/img/bg/system-bg.jpg") no-repeat;
    background-size: 100% 100%
  }

  .system-title {
    margin-bottom: 100px;
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

  .systemType-wrapper .wrapper_flex {
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

  .img_wrap {
    background-size: contain;
    background-repeat: no-repeat;
    width: 13%;
    margin: 10px 40px 40px 20px;
    text-align: center;
    color: white;
    font-size: 13px;
    padding:8% 0 3% 0;
  }

  .grid-content-word span {
    display: inline-block;
    width: 100px;
  }

  .account img {
    width: 60px;
    height: 60px;
    display: block;
  }


  .system-wrapper {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow:row wrap;
    //margin-left: 10%;
  }

  .system-name-wrapper{
    width: 50%;
    margin-left: 25%;
    font-weight: bold;
  }

  .logout-img{
    position: absolute;
    width: 30px;
    margin-left: 92%
  }

  .logout-img img{
    width: 30px;
  }
</style>
