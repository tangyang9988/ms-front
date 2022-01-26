export const contrastFormOption = [{
		label: "站点名称",
		prop: "a",
		// tip: '滑入气泡框效果', 
		span: 12,
		disabled: true
	}, {
		label: "站点名称",
		prop: "b",
		span: 12,
		disabled: true
	}, {
		label: "时间",
		prop: "date",
		type: "date",
		span: 12,
		disabled: true,
		format: 'yyyy-MM-dd',
		valueFormat: 'yyyy-MM-dd'
	}, {
		label: "化验时间",
		prop: "date",
		type: "date",
		span: 12,
		disabled: true,
		format: 'yyyy-MM-dd',
		valueFormat: 'yyyy-MM-dd'
	}, {
		label: "PH",
		prop: "PH",
		span: 12
	}, {
		label: "PH",
		prop: "PH",
		span: 12,
		disabled: true,
	},  {
		label: "总氮",
		prop: "PH",
		span: 12
	},  {
		label: "总氮",
		prop: "PH",
		span: 12,
		disabled: true,
	},{
		label: "总磷",
		prop: "PH",
		span: 12
	}, {
		label: "总磷",
		prop: "PH",
		span: 12,
		disabled: true
	}, {
		label: "COD",
		prop: "PH",
		span: 12
	}, {
		label: "COD",
		prop: "PH",
		span: 12,
		disabled: true
	}, {
		label: "氨氮",
		prop: "PH",
		span: 12
	}, {
		label: "氨氮",
		prop: "PH",
		span: 12,
		disabled: true
	}, {
		label: "电导率",
		prop: "PH",
		span: 12
	}, {
		label: "电导率",
		prop: "PH",
		span: 12,
		disabled: true
	},
	{
		label: "修约理由",
		prop: "opinion",
		type: "textarea",
		span: 24,
		rules: [{
			required: true,
			message: "请输入修约理由",
			trigger: "blur"
		}]		
	},
]
