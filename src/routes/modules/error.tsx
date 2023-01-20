import React from "react"
import LazyLoad from "../utils/lazyLoad"
import { RouteObject } from "../interface"

// 错误页面模块
const errorRouter: RouteObject[] = [
  {
    path: "/403",
    element: LazyLoad(React.lazy(() => import("@/components/ErorrMsg/403"))),
    meta: {
      requireAuth: true,
      title: "403页面",
      key: "403",
    },
  },
  {
    path: "/404",
    element: LazyLoad(React.lazy(() => import("@/components/ErorrMsg/404"))),
    meta: {
      requireAuth: false,
      title: "404页面",
      key: "404",
    },
  },
  {
    path: "/500",
    element: LazyLoad(React.lazy(() => import("@/components/ErorrMsg/500"))),
    meta: {
      requireAuth: true,
      title: "500页面",
      key: "500",
    },
  },
]

export default errorRouter
