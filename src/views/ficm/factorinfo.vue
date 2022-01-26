<template>
  <basic-container style="height: calc(100% - 40px)">
    <avue-form
      ref="form"
      :option="formOption"
      v-model="formData"
      @submit="submitForm"
      @error="error"
    ></avue-form>
  </basic-container>
</template>

<script>
  import {formSubmit, getFactorDetail, getFactorList} from "@/api/ficm/factorinfo";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: false,
        formOption: {
          label: '新增因子',
          submitText: '提交',
          labelWidth: 160,
          column: [
            {
              label: '监控因子',
              prop: 'tenantFactorId',
              type: 'select',
              dicData: [
                {
                  name: '测试因子',
                  id: '测试因子'
                }
              ],
              props: {
                label: 'alias',
                value: 'id'
              },
              rules: [{
                required: true,
                message: '请选择监控因子',
                trigger: 'change'
              }]
            },
            {
              label: '因子别名',
              prop: 'alias',
              disabled: true
            },
            {
              label: '单位',
              prop: 'unit',
              disabled: true
            },
            {
              label: '标识',
              prop: 'identify',
              value:0,
              rules: [{
                required: true,
                message: '请输入标识',
                trigger: 'blur'
              }]
            },

            {
              label: '是否统计',
              prop: 'isStatistics',
              disabled: true,
              type:"select",
              span:6,
              dicData:[
                {
                  label:'否',
                  value:0
                },{
                  label:'是',
                  value:1
                }
              ]
            },
            {
              label: '是否留样',
              prop: 'isSample',
              disabled: true,
              type:"select",
              span:6,
              dicData:[
                {
                  label:'否',
                  value:0
                },{
                  label:'是',
                  value:1
                }
              ]
            },
            {
              label: '是否评价',
              prop: 'isEvaluation',
              disabled: true,
              type:"select",
              span:6,
              dicData:[
                {
                  label:'否',
                  value:0
                },{
                  label:'是',
                  value:1
                }
              ]
            },
            {
              label: '是否显示',
              prop: 'isShow',
              disabled: true,
              span:6,
              type:"select",
              dicData:[
                {
                  label:'否',
                  value:0
                },{
                  label:'是',
                  value:1
                }
              ]
            },
            {
              label: '排序',
              prop: 'orderNum',
              disabled: true,
              span:12,
            },

            {
              label: '是否数字量',
              prop: 'isDigital',
              type: 'radio',
              dicData: [
                {
                  label: '是',
                  value: 1
                },
                {
                  label: '否',
                  value: 0
                },
              ],
              value: 1,
              rules: [{
                required: true,
                message: '请选择是否数字量',
                trigger: 'change'
              }]
            },
            {
              label: '系数',
              prop: 'unitCoefficient',
              value:1,
              span: 12,
              rules: [{
                required: true,
                message: '请输入系数',
                trigger: "blur"
              }, {
                    pattern: /^(-)?(([0-9])|([1-9]([0-9]+)))(.[0-9]+)?$/,
                    message: '请输入数字',
                    trigger: 'blur'
              }]
            }
            // {
            //   label: '上限',
            //   prop: '',
            //   rules: [{
            //     required: true,
            //     message: '请输入上限',
            //     trigger: 'blur'
            //   }, {
            //     pattern: /^[0-9]{0,3}$/,
            //     message: '请输入三位以内的数字',
            //     trigger: 'blur'
            //   }]
            // },
            // {
            //   label: '下限',
            //   prop: 'down',
            //   rules: [{
            //     required: true,
            //     message: '请输入下限',
            //     trigger: 'blur'
            //   }, {
            //     pattern: /^[0-9]{0,3}$/,
            //     message: '请输入三位以内的数字',
            //     trigger: 'blur'
            //   }]
            // },
          ]
        },
        formData: {},
        tenantFactorId: '',
        deptInfoId:'',//企业id
        siteInfoId:'',//站点id
      };
    },
    watch: {
      'formData.tenantFactorId'(val) {
        const column = this.findObject(this.formOption.column, "tenantFactorId")        
        column.dicData.forEach(item => {        	
          if(item.id == val) {
            this.formData.alias = item.alias
            this.formData.unit = item.unit
            this.formData.isStatistics = item.isStatistics
            this.formData.isSample = item.isSample
            this.formData.isEvaluation = item.isEvaluation
            this.formData.isShow = item.isShow
            this.formData.orderNum = item.orderNum
            this.formData.unitCoefficient = '1.00'
          }
        })
      }
    },
    computed: {
      ...mapGetters(["permission"])
    },
    mounted() {
      // 表单类型。是新增还是编辑
      if(this.$route.query.formType == 'add') {
        this.formOption.label = '新增因子'
        this.formOption.submitText = '提交'
      }else if(this.$route.query.formType == 'edit') {
        this.formOption.label = '编辑因子'
        this.formOption.submitText = '修改'
        // 获取因子详细信息
        getFactorDetail(this.$route.query.tenantFactorId).then(res => {
          this.formData = res.data.data
        })
      }
      this.formData.deptInfoId = this.$route.query.deptInfoId
      this.formData.siteInfoId = this.$route.query.siteInfoId
      if(this.$route.query.parentId) {
        this.formData.deviceInfoId = this.$route.query.parentId
      }
      this.initData()
    },
    methods: {
      initData() {
        getFactorList(this.$route.query.deptInfoId,this.$route.query.params).then(res => {
          const column = this.findObject(this.formOption.column, "tenantFactorId")
          column.dicData = res.data.data
        })
      },
      submitForm(form, done) {
        // 提交时从route获取mn
        let that=this
        this.formData.mn = this.$route.query.mn
        // 暂时先把-1替换掉，防止提交出错
        if(this.formData.others==-1) this.formData.others = null
        if(this.formData.groupId==-1) this.formData.groupId = null
        if(this.formData.parentId==-1) this.formData.parentId = null
        formSubmit(this.formData).then(res => {
          if(res.data.success) {
            this.$message.success('操作成功')
            // 如果是新增操作，新增成功后重新获取仪器数据,将页面标题改为编辑
            if(this.$route.query.formType == 'add') {
                this.$message.success('操作成功')
                this.$refs.form.resetFields()
            }
          }else {
            this.$message.success('操作失败')
          }
          done()
        },function(err){ 
        	done()
        })
      }
    }
  };
</script>

<style>
</style>
