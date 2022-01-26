export default {
  column: [{
    label: '个人信息',
    prop: 'info',
    option: {
      submitText: '修改',
      column: [
//    {
//      label: '头像',
//      type: 'upload',
//      listType: 'picture-img',
//      propsHttp: {
//        res: 'data',
//        url: 'link',
//      },
//      canvasOption: {
//        text: ' ',
//        ratio: 0.1
//      },
//      action: '/api/blade-resource/oss/endpoint/put-file',
//      tip: '只能上传jpg/png用户头像，且不超过500kb',
//      span: 12,
//      row: true,
//      prop: 'avatar',
//      display: false
//    },
        {
          label: '姓名',
          span: 12,
          row: true,
          prop: 'name'
        }, {
          label: '用户名',
          span: 12,
          row: true,
          prop: 'realName'
        }, {
          label: '手机号',
          span: 12,
          row: true,
          prop: 'phone',
          rules: [{
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号格式错误',
            trigger: 'blur'
          }]
        }, {
          label: '邮箱',
          prop: 'email',
          span: 12,
          row: true,
          rules: [{
            pattern: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
            message: '邮箱格式错误',
            trigger: 'blur'
          }]
        }]
    }
  }, {
    label: '修改密码',
    prop: 'password',
    option: {
      submitText: '修改',
      column: [{
        label: '原密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'oldPassword'
      }, {
        label: '新密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword',
        rules: [
          {
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
            message: '只可以输入数字和字母',
            trigger: 'blur'
          }]
      }, {
        label: '确认密码',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword1',
        rules: [{
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
          message: '只可以输入数字和字母',
          trigger: 'blur'
        }]
      }]
    }
  }]
}
