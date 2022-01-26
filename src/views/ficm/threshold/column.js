export const threshold = [{
	label: '企业名称',
	prop: 'deptName',
	align: 'center'
},  {
	label: '监测因子',
	prop: 'factorName',
	align: 'center'
}, {
	label: '智能阈值',
	prop: 'thresholdVal',
	align: 'center',
}, {
	label: '最近更新日期',
	prop: 'updateTime',
	align: 'center'
}]

export const computerOption=[{
	label: '企业名称',
	prop: 'deptName',
	align: 'center'
}, {
	label: '监测因子',
	prop: 'factorName',
	align: 'center',
	// overHidden: true,
	// width: 140
}, {
	label: '智能阈值',
	prop: 'thresholdVal',
	align: 'center',
}]
export const thresholdFormOption=[{
		label: "超标检出率",
		prop: "jcl",
		type: "select",
		dicData: [{
	        label: '50%',
	        value: '0.5'
	    }, {
	        label: '75%',
	        value: '0.75'
	    }, {
	        label: '100%',
	        value: '1'
	    }],
		span: 12,
		rules: [{
			required: true,
			message: "请输入超标检出率",
			trigger: "blur"
		}]
	}, {
		label: "送检正确率",
		prop: "zql",
		type: "select",
		dicData: [{
	        label: '50%',
	        value: '0.5'
	    }, {
	        label: '75%',
	        value: '0.75'
	    }, {
	        label: '100%',
	        value: '1'
	    }],		
		span: 12,
		rules: [{
			required: true,
			message: "请输入送检正确率",
			trigger: "blur"
		}]
	}, {
		label: "敏感因子",
		prop: "fac",
		span: 24,
		formslot: true
	},
]