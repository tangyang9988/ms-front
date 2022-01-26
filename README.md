
解决 Failed to connect to github.com port 443: Timed out
    git config --global --unset http.proxy
    git config --global --unset https.proxy

mock 模拟接口数据

  安装mockjs
  设置mock:true,直接调用api地址
      function getFakeList() {
      const json = {code: 200, success: true, msg: '操作成功'};
      const list = [];
      list.push(
      {
      id: '1',
      paramName: '是否开启注册功能--mock测试',
      paramKey: 'account.registerUser',
      paramValue: 'true',
      remark: '描述',
      },
      {
      id: '2',
      paramName: '账号初始密码--mock测试',
      paramKey: 'account.initPassword',
      paramValue: '123456',
      remark: '描述',
      }
      );
      json.data = {
      total: 10,
      size: 10,
      current: 1,
      searchCount: true,
      pages: 1,
      records: list,
      };
      return json;
      }
    export default ({mock}) => {
      if (!mock) return;
      Mock.mock(/\/api\/blade-system\/param\/list/, 'get', getFakeList);
    }

