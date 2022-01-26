<template>
  <basic-container>
    <div class="system_wrap">
      <avue-form v-model="form" :option="option" @submit="handleSubmit">
      </avue-form>
    </div>
  </basic-container>
</template>

<script>
  import { validateInter } from "@/util/rulesReg";
  import { getDetail, submit } from "@/api/ficm/paramConfig";
  export default {
    data() {
      return {
        form: {},
        loading: false,
        option: {
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          dialogClickModal: false,
          refreshBtn: false,
          delBtn: false,
          header: false,
          column: [
            {
              label: "过期时间(小时)",
              labelWidth:120,
              prop: "val",
              span: 6,
              minRows: 6,
              rules: [{
                validator: validateInter,
                trigger: 'blur',
                required: true
              }]
            },
            {
              label: "离线时间(小时)",
              labelWidth:120,
              prop: "latestConfigTime",
              span: 6,
              minRows: 6,
              rules: [{
                validator: validateInter,
                trigger: 'blur',
                required: true
              }]
            }
          ]
        },
        data: []
      };
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        getDetail().then(res => {
          this.form = res.data.data;
        })
      },
      handleSubmit(form, done) {
        submit(form).then(res => {
          if(res.data.success) {
            this.$message({
              type: "success",
              message: "修改成功!"
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
  }
</script>

<style lang="scss">
  .system_wrap {
    padding: 40px 20px;
    * {
      box-sizing: border-box;
    }
  }
</style>

<style scoped>

</style>

