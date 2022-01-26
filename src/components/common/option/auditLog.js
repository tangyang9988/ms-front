export const group = [{
		label: '审核数据',
		icon: 'el-icon-document',
		column: [{
			labelWidth: 0,
			span: 24,
			label: '',
			prop: 'data',
			formslot: true
		}]
	},
	{
		label: '审核流程',
		icon: 'el-icon-folder-checked',
		column: [{
			labelWidth: 0,
			span: 24,
			label: '',
			prop: 'opinion',
			formslot: true
		}]
	}

]
export const column = [{
		label: '企业',
		prop: 'deptInfoName',
		align: 'center',
		display: false
	},
	{
		label: '站点',
		prop: 'siteInfoName',
		align: 'center',
		display: false
	},
	{
		label: '监测时间',
		prop: 'collectionDate',
		align: 'center',
		display: false
	},
	{
		label: '最后操作人',
		prop: 'submitUserName',
		align: 'center',
		display: false
	},
	{
		label: '最后操作时间',
		prop: 'operationTime',
		align: 'center',
		display: false,
		width:160
	},
    {
      label:'提交人',
      prop:'submitUserName',
      align:'center',
      display:false
    },
    {
      label:'提交时间',
      prop:'createTime',
      align:'center',
      display:false,
      width:160
    }, 	
	{
		label: '当前节点',
		prop: 'taskName',
		align: 'center',
		display: false
	}	
]