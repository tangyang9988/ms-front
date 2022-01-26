import request from '@/router/axios';

// 获取该用户权限下所有系统名称
export const getMenus = () => {
  return request({
    url: '/api/ms-ficm/platformalias/getList',
    method: 'get'
  })
}

// 编辑系统别名
export const updateMenu = (row) => {
  return request({
    url: '/api/ms-ficm/platformalias/submit',
    method: 'post',
    data: row
  })
}