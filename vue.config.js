const webpack = require('webpack')
const path = require('path')
module.exports = {
  //路径前缀
  publicPath: "/",
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/public.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    });
    const entry = config.entry('app');
    entry.add('babel-polyfill').end();
    entry.add('classlist-polyfill').end();
    entry.add('@/mock').end();
  },

  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/api': {
        //  target: 'http://172.16.1.205',// 测试
        //  target: 'http://124.71.156.219:8073',// 华为云测试
         target: 'http://116.147.3.140:8081',// 政务云
        // target: 'http://localhost',  // 本地
        // target: 'http://172.20.0.93',  // 李俊
        //  target: 'http://172.20.0.89',// 徐星泽
        ws: true,
        pathRewrite: {
          // '^/api': '/',
          '^/api': '/api'
        }
      }
    }
  }
};
