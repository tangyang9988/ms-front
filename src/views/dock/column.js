export const column2 = [
  {
    label: '企业名称',
    prop: 'deptName',
    align: 'center',
    minWidth:120,
    editDisplay: false
  },
  {
    label: 'mn号',
    prop: 'mn',
    align: 'center',
    minWidth:120,
    editDisplay: false
  },
  {
    label: '第三方ID',
    prop: 'thirdObjId',
    align: 'center',
    minWidth:120,
    hide:true,
    editDisplay: false
  },
  {
    label: '设备状态',
    prop: 'device_status',
    type:'select',
    align: 'center',
    hide:true,
    rules:[{
	    required:true,
	    message:'请输入设备状态',
	    trigger:'blur'
    }],
    value:'1',
    dicData:[{
      label:"正常",
      value:'1'
    },{
      label:"维修",
      value:'2'
    },{
      label:"暂停使用",
      value:'3'
    },{
      label:"注销",
      value:'4'
    }],

  },{
    label: '变更时间',
    prop: 'update_date',
    align: 'center',
    format: "yyyy-MM-dd",
    valueFormat:'yyyy-MM-dd',
    hide:true,
    type:'date',
    rules:[{
      required:true,
      message:'请输入变更时间',
      trigger:'blur'
    }]
  },{
    label: '备注',
    prop: 'memo',
    align: 'center',
    span:24,
    hide:true,
    rules:[{
      required:true,
      message:'请输入备注',
      trigger:'blur'
    }]
  }  
]
export const column = [
  {
    label: '厂商名称',
    prop: 'manufacturer_name',
    align: 'center',
    minWidth:120,
    editDisplay: false,
  },{
    label: '厂商联系人',
    prop: 'manufacturer_person',
    editDisplay: false,
    align: 'center'
  },{
    label: '联系方式',
    prop: 'manufacturer_tele',
    editDisplay: false,
    minWidth:120,
    align: 'center',
  },{
    label: '企业名称',
    prop: 'enterprise_name',
    editDisplay: false,
    minWidth:140,
    align: 'center',
  },{
    label: '企业地址',
    prop: 'enterprise_address',
    minWidth:150,
    editDisplay: false,
    align: 'center'
  },{
    label: '统一信用代码',
    prop: 'uni_code',
    editDisplay: false,
    minWidth:120,
    align: 'center'
  },{
    label: '点位名称',
    prop: 'point_name',
    minWidth:140,
    editDisplay: false,
    align: 'center'
  },{
    label: '点位地址',
    prop: 'point_address',
    editDisplay: false,
    minWidth:150,
    align: 'center'
  },{
    label: '所属行政街道代码',
    prop: 'point_ssjd',
    editDisplay: false,
    align: 'center'
  },{
    label: '经度',
    prop: 'lng',
    minWidth:100,
    editDisplay: false,
    align: 'center'
  },{
    label: '纬度',
    prop: 'lat',
    minWidth:100,
    editDisplay: false,
    align: 'center'
  },{
    label: '综合体名称',
    prop: 'synthesis_name',
    minWidth:140,
    editDisplay: false,
    align: 'center'
  },{
    label: '设备id',
    prop: 'device_id',
    minWidth:160,
    editDisplay: false,
    align: 'center'
  },{
    label: '厂商设备编号',
    prop: 'device_num',
    editDisplay: false,
    minWidth:120,
    align: 'center'
  },{
    label: '设备名称',
    prop: 'device_name',
    editDisplay: false,
    minWidth:120,
    align: 'center'
  },{
    label: '设备类型',
    prop: 'device_type',
    editDisplay: false,
    align: 'center'
  },{
    label: '设备状态',
    prop: 'device_status',
    type:'select',
    align: 'center',
    rules:[{
    required:true,
    message:'请输入设备状态',
    trigger:'blur'
    }],
    value:'1',
    dicData:[{
      label:"正常",
      value:'1'
    },{
      label:"维修",
      value:'2'
    },{
      label:"暂停使用",
      value:'3'
    },{
      label:"注销",
      value:'4'
    }],

  },{
    label: '设备安装位置',
    prop: 'device_location',
    editDisplay: false,
    align: 'center'
  },{
    label: '设备安装时间',
    prop: 'installation_time',
    minWidth:120,
    editDisplay: false,
    align: 'center'
  },{
    label: '审核状态',
    prop: 'audit_status',
    minWidth:100,
    editDisplay: false,
    align: 'center',
    slot:true
  },{
    label: '审核意见',
    prop: 'audit_opinion',
    editDisplay: false,
    align: 'center'
  },{
    label: '变更时间',
    prop: 'update_date',
    align: 'center',
    format: "yyyy-MM-dd",
    valueFormat:'yyyy-MM-dd',
    hide:true,
    type:'date',
    rules:[{
      required:true,
      message:'请输入变更时间',
      trigger:'blur'
    }]
  },{
    label: '备注',
    prop: 'memo',
    align: 'center',
    span:24,
    hide:true,
    rules:[{
      required:true,
      message:'请输入备注',
      trigger:'blur'
    }]
  }]

export const aduitStatusList = [{
    label:"未通过",
    value:'0'
  },{
    label:"已通过",
    value:'1'
  },{
    label:"待审核",
    value:'2'
  }]

