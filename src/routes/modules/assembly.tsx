import React from "react"
import lazyLoad from "../utils/lazyLoad"
import { LayoutIndex } from "../constant"
import { RouteObject } from "../interface"

const assemblyRouter: Array<RouteObject> = [
  {
    path: "/assembly/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "常用组件",
    },
    children: [
      {
        path: "svgIcon",
        element: lazyLoad(React.lazy(() => import("@/views/assembly/svgIcon/index"))),
        meta: {
          title: "SVG 图标",
          requireAuth: true,
          key: "svgIcon",
        },
      },
      {
        path: "guide",
        element: lazyLoad(React.lazy(() => import("@/views/assembly/guide/index"))),
        meta: {
          title: "Guide 引导页",
          requireAuth: true,
          key: "guide",
        },
      },
      {
        path: "selectIcon",
        element: lazyLoad(React.lazy(() => import("@/views/assembly/selectIcon/index"))),
        meta: {
          title: "selectIcon 选择icon",
          requireAuth: true,
          key: "selectIcon",
        },
      },
      {
        path: "batchImport",
        element: lazyLoad(React.lazy(() => import("@/views/assembly/batchImport/index"))),
        meta: {
          title: "batchImport 批量导入",
          requireAuth: true,
          key: "batchImport",
        },
      },
    ],
  },
]

export default assemblyRouter
