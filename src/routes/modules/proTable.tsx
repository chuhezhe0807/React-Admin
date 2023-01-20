import React from "react"
import { LayoutIndex } from "../constant"
import { RouteObject } from "../interface"
import lazyLoad from "../utils/lazyLoad"

const proTableRouter: Array<RouteObject> = [
  {
    path: "/proTable/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "超级表格",
    },
    children: [
      {
        path: "useComponent",
        element: lazyLoad(React.lazy(() => import("@/views/propTable/useComponent"))),
        meta: {
          title: "使用类组件",
          requireAuth: true,
          key: "useComponent",
        },
      },
      {
        path: "useHooks",
        element: lazyLoad(React.lazy(() => import("@/views/propTable/useHooks"))),
        meta: {
          title: "使用类组件",
          requireAuth: true,
          key: "useHooks",
        },
      },
    ],
  },
]

export default proTableRouter
