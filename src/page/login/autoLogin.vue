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
      //判断是否自动登录
      let tenantId = "739644";
      let username = this.$route.query.username;
      let password = this.$route.query.password;
      if (tenantId && username && password) {
        this.handleAutoLogin({
          "tenantId": tenantId,
          "username": username,
          "password": password}
          );
      } else {
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
        let systemCode = selectedSystemCode.replace("-1", "")
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
      changeSelectedImg(item) {
        item.code = item.code + "-1";
        item.cursor = "pointer";
        item.imgUrl = this.formatMenuUrl(item)
      },
      changeUnselectedImg(item) {
        item.code = item.code.replace("-1", "")
        item.imgUrl = this.formatMenuUrl(item)
      },
      handleLogout() {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({path: "/login"});
        });
      },
      handleAutoLogin(loginForm) {
        let that = this;
        this.$store.dispatch("LoginByUsername2", loginForm).then(() => {
          if (!localStorage.getItem('saber-themeName')) {
            that.$store.commit("SET_THEME_NAME", 'squirrel');
          }
          localStorage.setItem('systemType', "22")
          that.$router.push({
            path: that.tagWel.value
          });
        }).catch(() => {
          this.$router.push({
            path: "/autoLoginError"
          });
        });
      }
    }
  };
</script>
<!--this.$store.commit("SET_THEME_NAME", 'theme-dark');-->
<style scoped>
</style>
