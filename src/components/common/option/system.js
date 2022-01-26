export const system = [{
		systemId: 21,
		systemName: '地表水系统',
		treeType: '2',
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "countreport_export",
		printBtn: "countreport_print",
		filterDataField:'siteName',
		searchPlaceholder:'请输入站点名称'
	},
	{
		systemId: 22,
		systemName: '空气智能监控系统',
		treeType: '2',
		server: 'airq', //api地址 自定义
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "airq_countreport_export",
		printBtn: "airq_countreport_print",
		filterDataField:'siteName',
		searchPlaceholder:'请输入站点名称'
	},
	{
		systemId: 27,
		systemName: '挥发性有机物监测系统',
		treeType: '2',
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "voc_countreport_export",
		printBtn: "voc_countreport_print",
		filterDataField:'deptName',
		searchPlaceholder:'请输入企业名称'
	},
	{
		systemId: 31,
		systemName: 'VOC环境智能监管系统',
		treeType: '2',
		customHead: [{
			'label': '企业名称',
			"prop": 'deptName'
		}],
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "psoa31_countreport_export",
		printBtn: "psoa31_countreport_print"
	},
	{
		systemId: 32,
		systemName: '地表水体环境污染源监测系统',
		treeType: '2',
		customHead: [{
			'label': '企业名称',
			"prop": 'deptName'
		}],
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "psoa32_countreport_export",
		printBtn: "psoa32_countreport_print"
	},
	{
		systemId: 39,
		systemName: '智慧工地扬尘系统',
		treeType: '2',
		customHead: [{
			'label': '项目名称',
			"prop": 'deptName'
		}],
		auditServer: 'service',
		auditHeadUrl: '/api/squirrel-service/historyData/getHead',
		exportBtn: "environmental_export",
		printBtn: "environmental_print",
		filterDataField:'deptName',
		searchPlaceholder:'请输入企业名称'
	},
	{
		systemId: 99,
		systemName: '餐饮油烟监控管理系统',
		treeType: '3',
		auditServer: 'loam',
		auditHeadUrl: '/api/squirrel-loam/historyData/getAuditDataHead',
		exportBtn: "loam_countreport_export",
		printBtn: "loam_countreport_print"
	}
]
export const mapStyle3 = {
	styleJson: [{
                "featureType": "water",
                "elementType": "all",
                "stylers": {
                    "color": "#031628"
                }
            }, {
                "featureType": "land",
                "elementType": "geometry",
                "stylers": {
                    "color": "#000102"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#147a92"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#0b3d51"
                }
            }, {
                "featureType": "local",
                "elementType": "geometry",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "railway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "railway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#08304b"
                }
            }, {
                "featureType": "subway",
                "elementType": "geometry",
                "stylers": {
                    "lightness": -70
                }
            }, {
                "featureType": "building",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#857f7f"
                }
            }, {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#000000"
                }
            }, {
                "featureType": "building",
                "elementType": "geometry",
                "stylers": {
                    "color": "#022338"
                }
            }, {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                    "color": "#062032"
                }
            }, {
                "featureType": "boundary",
                "elementType": "all",
                "stylers": {
                    "color": "#465b6c"
                }
            }, {
                "featureType": "manmade",
                "elementType": "all",
                "stylers": {
                    "color": "#022338"
                }
            }, {
                "featureType": "label",
                "elementType": "all",
                "stylers": {
                    "color": "#022338",
                    "visibility": "off"
                }
            }]

}

export const mapStyle = {
	styleJson: [{
		'featureType': 'water',
		'elementType': 'all',
		'stylers': {
			'color': '#123549'
		}
	}, {
		'featureType': 'land',
		'elementType': 'geometry',
		'stylers': {
			'color': '#000102'
		}
	}, {
		'featureType': 'highway',
		'elementType': 'all',
		'stylers': {
			'color': '#0A1A29'
		}
	}, {
		'featureType': 'arterial',
		'elementType': 'geometry.fill',
		'stylers': {
			'color': '#000000'
		}
	}, {
		'featureType': 'arterial',
		'elementType': 'geometry.stroke',
		'stylers': {
			'color': '#0b3d51'
		}
	}, {
		'featureType': 'local',
		'elementType': 'geometry',
		'stylers': {
			'color': '#000000'
		}
	}, {
		'featureType': 'railway',
		'elementType': 'geometry.fill',
		'stylers': {
			'color': '#000000'
		}
	}, {
		'featureType': 'railway',
		'elementType': 'geometry.stroke',
		'stylers': {
			'color': '#08304b'
		}
	}, {
		'featureType': 'subway',
		'elementType': 'geometry',
		'stylers': {
			'lightness': -70
		}
	}, {
		'featureType': 'building',
		'elementType': 'geometry.fill',
		'stylers': {
			'color': '#000000'
		}
	}, {
		'featureType': 'building',
		'elementType': 'geometry',
		'stylers': {
			'color': '#022338'
		}
	}, {
		'featureType': 'green',
		'elementType': 'geometry',
		'stylers': {
			'color': '#062032'
		}
	}, {
		'featureType': 'boundary',
		'elementType': 'all',
		'stylers': {
			'color': '#465b6c'
		}
	}, {
		'featureType': 'manmade',
		'elementType': 'all',
		'stylers': {
			'color': '#022338'
		}
	}, {
		'featureType': 'label',
		'elementType': 'all',
		'stylers': {}
	}, {
		'featureType': 'all',
		'elementType': 'labels.text.stroke',
		'stylers': {
			'color': '#000000',
		}
	}, {
		'featureType': 'all',
		'elementType': 'labels.icon',
		'stylers': {
			'visibility': 'off'
		}
	}, {
		'featureType': 'all',
		'elementType': 'labels.text.fill',
		'stylers': {
			'color': '#27AEA9',
		}
	}]
}