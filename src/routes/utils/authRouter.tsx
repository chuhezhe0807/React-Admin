import { useLocation, Navigate } from "react-router-dom"
import { AxiosCanceler } from "@/api/helper/axiosCancel"
import { searchRoute } from "@/utils/utils"
import { rootRouter } from "@/routes/index"
import { HOME_URL } from "@/config/config"
import { store } from "@/redux"

const axiosCanceler = new AxiosCanceler()

/**
 * @description 路由守卫组件
 */
const AuthRouter = (props: { children: JSX.Element }) => {
  const { pathname } = useLocation()

  const route = searchRoute(pathname, rootRouter)

  // 在路由跳转之前删除所有的请求
  axiosCanceler.removeAllPending()

  // * 判断当前路由是否需要访问权限(不需要权限直接放行)
  if (!route.meta?.requireAuth) return props.children

  // 判断是否有token
  const token = store.getState().global.token
  if (!token) {
    return <Navigate to="/login" state={{ isShowInfo: true }} replace />
  }

  // 动态路由 根据后端返回的菜单数据生成的一维数组
  const dynamicRouter = store.getState().auth.authRouter

  // 静态路由
  const staticRouter = [HOME_URL, "/403"]
  const routerList = dynamicRouter.concat(staticRouter)

  // * 如果访问的地址没有在路由表中重定向到403页面
  if (routerList.indexOf(pathname) === -1) return <Navigate to="/403" />

  // 当前帐号有权限，返回router 正常访问页面
  return props.children
}

export default AuthRouter
