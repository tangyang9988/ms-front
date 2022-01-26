
var BaseConfig = {
    arrSrv: [
        { key: 'imglayer', value: 'http://t0.tianditu.cn/img_c/wmts' },
        { key: 'imglayer_c', value: 'http://t0.tianditu.cn/cia_c/wmts' },
        { key: 'veclayer', value: 'http://t0.tianditu.cn/vec_c/wmts' },
        { key: 'veclayer_c', value: 'http://t0.tianditu.cn/cva_c/wmts' },
        { key: 'baseLayer_vec', value: 'http://32.63.213.15/serviceaccess/wmts/vector' },
        { key: 'baseLayer_vecLabel', value: 'http://32.63.213.15/serviceaccess/wmts/vectoranno' },
        { key: 'baseLayer_img', value: 'http://32.63.213.15/serviceaccess/wmts/image' },
        { key: 'baseLayer_imgLabel', value: 'http://32.63.213.15/serviceaccess/wmts/imageanno' },
        { key: 'image1966', value: 'http://32.63.213.15/serviceaccess/wmts/image1966' },
        { key: 'image2009', value: 'http://32.63.213.15/serviceaccess/wmts/image2009' },
        { key: 'image2012', value: 'http://32.63.213.15/serviceaccess/wmts/image2012' },
        { key: 'image2014', value: 'http://32.63.213.15/serviceaccess/wmts/image2014' },
        { key: 'baseLayer_vec_tdt', value: 'http://58.215.18.147/wmtsservice/wuxi_vector' },
        { key: 'baseLayer_vecLabel_tdt', value: 'http://58.215.18.147/wmtsservice/wuxi_anno_vector' },
        { key: 'wms', value: '"http://192.168.1.188:6080/arcgis/services/wxcloud/pm25/MapServer/WMSServer"' },
    ],
    getSrv: function (key) {
        var result = '';
        this.arrSrv.forEach(function (e, i) {
            if (e.key == key) {
                result = e.value;
            }
        }, this);
        return result;
    },

}
var ConfigServer = {
    dmdz_url:"http://2.20.101.190:8080/serviceaccess/service/poi",
    layer_query_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/poi/MapServer",
    feature_polyline_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/grid_road/MapServer",
    feature_point_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/poi/MapServer",
    feature_polygon_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/grid_road/MapServer",
    wms_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/services/guotu/benzhengchuangkou/MapServer/WMSServer",
    spatial_query_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/grid_road/MapServer/5",
    boundary_search_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/poi/MapServer/0",
    dynamic_url:"http://2.20.101.190:8080/serviceaccess/service/arcgis/rest/services/chengguan/grid_road/MapServer",
    cva_url:"http://2.20.101.180:32457/serviceaccess/service/cva_c/wmts",
    vec_url:"http://2.20.101.180:32457/serviceaccess/service/vec_c/wmts",
    cia_url:"http://2.20.101.190:8080/serviceaccess/service/ogcservice/wmts/wuxi_image",
    img_url:"http://2.20.101.190:8080/serviceaccess/service/ogcservice/wmts/wuxi_imageanno",
    tdt_vec_url:"http://2.20.101.190:9001/vec_c/wmts",
    tdt_cia_url:"http://2.20.101.190:9001/cva_c/wmts",
    tdt_img_url:"http://2.20.101.190:9001/img_c/wmts",
    tdt_cva_url:"http://2.20.101.190:9001/cia_c/wmts",
    img_url1:"http://2.20.101.190:8080/serviceaccess/service/ogcservice/wmts/image2010",
    img_url2: "http://2.20.101.190:8080/serviceaccess/service/ogcservice/wmts/image2011",
    img_url3:"http://2.20.101.190:8080/serviceaccess/service/ogcservice/wmts/image2018",
    img_url4:"http://61.177.139.228:9000/gateway/WMTSServer/wuxi_image",

}
