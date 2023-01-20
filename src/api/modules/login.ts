import { Login } from "@/api/interface";
import { PORT1 } from "@/api/config/servicePorts";
import { menuList, buttonsList, loginReturns } from './loginOfflineData'
import qs from 'qs'

import http from '@/api'

/**
 * @name 登录模块
*/
// 用户登录接口
// export const loginApi = (params: Login.ReqLoginForm) => {
//   return http.post<Login.ResLogin>(PORT1 + '/login', params);
//   return http.post<Login.ResLogin>(PORT1 + '/login', {}, { params }) // post 请求携带 query参数 => ?username=admin&passwpord=123456
//   return http.post<Login.ResLogin>(PORT1 + '/login', qs.stringify(params)) // post 请求携带表单参数 application/x-www-form-urlencode
//   return http.post<Login.ResLogin>(PORT1 + '/login', params, { headers: { noLoading: true } }) // 控制当前请求不显示loading
// }
export const loginApi = (params: Login.ReqLoginForm) => {
  // console.log('login params', params);

  return new Promise<Login.ResLogin>((resolve) => {
    resolve(loginReturns)
  })
}

// 获取按钮权限
// export const getAuthorButtons = () => {
//   return http.get<Login.ResAuthButtons>(PORT1 + '/auth/buttons')
// }
export const getAuthorButtons = () => {
  return new Promise<Login.ResAuthButtons>((resolve) => {
    resolve(buttonsList)
  })
}

// 获取menu列表
// export const getMenuList = () => {
//   return http.get<Menu.MenuOptions[]>(PORT1 + '/menu/list')
// }

export const getMenuList = () => {
  return new Promise<Menu.MenuOptions[]>((resolve) => {
    resolve(menuList)
  })
}