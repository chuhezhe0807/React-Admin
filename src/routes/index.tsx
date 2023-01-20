import { Navigate, useRoutes } from "react-router-dom"
import { RouteObject } from "./interface"
import Login from "@/views/login"

// 导入所有router
const metaRouters: Record<string, { [key: string]: any }> = import.meta.glob("./modules/*.tsx", { eager: true })

// 处理路由
export const routerArray: RouteObject[] = []
Object.keys(metaRouters).forEach((item) => {
  Object.keys(metaRouters[item]).forEach((key: any) => {
    routerArray.push(...metaRouters[item][key])
  })
})

export const rootRouter: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login"></Navigate>,
  },
  {
    path: "/login",
    element: <Login></Login>,
    meta: {
      requireAuth: false,
      title: "登录页",
      key: "login",
    },
  },
  ...routerArray,
  {
    path: "*",
    element: <Navigate to="/404"></Navigate>,
  },
]

const Router = () => {
  const router = useRoutes(rootRouter as any)
  return router
}

export default Router
