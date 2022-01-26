import request from '@/router/axios';

//获取表格内容
export const getList = () =>{
  return request({
    url: '/api/ms-ficm/systemConfig/getList',
    method: 'get',
  })
}

// //删除
// export const remove = (ids) =>{
//   return request({
//     url: '/api/ms-ficm/tenantfactor/remove',
//     method: 'post',
//     params:{
//       ids
//     }
//   })
// }

//修改提交
export const submit = (row) =>{
  return request({
    url: '/api/ms-ficm/systemConfig/submit',
    method: 'post',
    data: row
  })
}



export const getSystemConfig = () =>{
  return request({
    url: '/api/ms-ficm/systemConfig/getSystemConfig',
    method: 'get',
  })
}


