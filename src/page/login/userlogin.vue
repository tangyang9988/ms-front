<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0"
           @submit.native.prevent>
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.tenantId"
                auto-complete="off"
                
                placeholder="请输入账号编码">
        <i slot="prefix" class="icon-quanxian"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                :placeholder="$t('login.username')">
        <i slot="prefix" class="icon-yonghu"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                :placeholder="$t('login.password')">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"/>
        <i slot="prefix" class="icon-mima"/>
      </el-input>
    </el-form-item>
    <el-form-item v-if="this.website.captchaMode" prop="code">
      <el-row :span="24" :gutter="5">
        <el-col :span="14">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.code"
                    auto-complete="off"
                    :placeholder="$t('login.code')">
            <i slot="prefix" class="icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <div style="margin-bottom: 20px;">
      <el-checkbox v-model="isSavePwd">
        <span style="color: rgb(230, 230, 230);">记住密码</span> 
      </el-checkbox>
    </div>
    <el-form-item>
      <el-button type="primary"
                 size="medium"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{$t('login.submit')}}
      </el-button>
      <div style="text-align: center;font-size: 12px;color: #fff;">建议使用chrome浏览器登录</div>
      <div style="text-align: center;font-size: 12px;color: #fff;margin-top: -20px;">建议使用分辨率1920px * 1080px</div>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from "vuex";
  import {info} from "@/api/system/tenant";
  import {getCaptcha} from "@/api/user";
  import {getTopUrl} from "@/util/util";

  export default {
    name: "userlogin",
    data() {
      return {

        tenantMode: this.website.tenantMode,
        loginForm: {
          //租户ID
          tenantId: "",
          //用户名
          username: "",
          //密码
          password: "",
          //账号类型
          type: "account",
          //验证码的值
          code: "",
          //验证码的索引
          key: "",
          //预加载白色背景
          image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        },
        loginRules: {
          tenantId: [
            {required: true, message: "请输入账号编码", trigger: "blur"}
          ],
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 1, message: "密码长度最少为6位", trigger: "blur"}
          ]
        },
        passwordType: "password",
        isSavePwd: false, // 记住密码
      };
    },
    created() {
      this.getTenant();
      this.refreshCode();
    },
    mounted() {
      // 页面初始化时从cookie获取租户、用户名、密码
      let tenantId=''
      if(this.$route.query.tenantId){

      	tenantId=this.$route.query.tenantId
      
      }else{

      	tenantId = this.getCookie('tenantId')
      	
      }
      this.loginForm.tenantId = tenantId
      let username = this.getCookie('username')
      let password = this.getCookie('password')
      if(tenantId && username && password) {
        // 如果cookie中有信息则勾选记住密码
        this.isSavePwd = true        
        this.loginForm.username = username
        this.loginForm.password = password
      }else {
        // 否则不勾选
        this.isSavePwd = false
      }
    },
    computed: {
      ...mapGetters(["tagWel"])
    },
    props: [],
    methods: {
      //设置cookie
      setCookie(name, value, day){
        let date = new Date()
        date.setDate(date.getDate() + day)
        document.cookie = `${name}=${value};expires=${date}`
      },
      //获取cookie
      getCookie(name){
        let reg = RegExp(name+'=([^;]+)')
        let arr = document.cookie.match(reg)
        return arr?arr[1]:null
      },
      //删除cookie
      delCookie(name){
        this.setCookie(name, null, -1)
      },
      refreshCode() {
        getCaptcha().then(res => {
          const data = res.data;
          this.loginForm.key = data.key;
          this.loginForm.image = data.image;
        })
      },
      showPassword() {
        this.passwordType === ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
            	this.$parent.initSystemName(this.loginForm.tenantId)
              // 登录成功后，如果勾选记住密码则往cookie存入登录信息：租户、用户名、密码；否则清除cookie信息
              if(this.isSavePwd) {
                this.setCookie('tenantId', this.loginForm.tenantId, 7)
                this.setCookie('username', this.loginForm.username, 7)
                this.setCookie('password', this.loginForm.password, 7)
              }else {
                this.delCookie('tenantId')
                this.delCookie('username')
                this.delCookie('password')
              }
              if(this.loginForm.tenantId == '000000') {
                // 000000关系户做特殊处理。不用业务选择，直接给最高权限
                this.$parent.specialLogin()
              }else {
                localStorage.setItem('systemType', 22)
                this.$router.push({
                  path: this.tagWel.value
                });
              }
            }).catch(() => {
              this.refreshCode(); // 刷新验证码
            });
          }
        });
      },
      getTenant() {
        let domain = getTopUrl();
        // 临时指定域名，方便测试
        //domain = "https://bladex.vip";
        info(domain).then(res => {
          const data = res.data;
          if (data.success && data.data.tenantId) {
            this.tenantMode = false;
            this.loginForm.tenantId = data.data.tenantId;
            this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
.login-submit {
  width: 100%
}

.login-code-img {
  margin-top: 4px;
  border-radius: 4px;
  width: 100%!important;
  height: 30px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  line-height: 32px;
  text-align: center;
  cursor:pointer!important;
}
</style>
