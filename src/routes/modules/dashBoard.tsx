import React from "react"
import { RouteObject } from "../interface"
import { LayoutIndex } from "../constant"
import lazyLoad from "../utils/lazyLoad"

const dashBoardRouter: Array<RouteObject> = [
  {
    path: "/dashboard/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "Dashboard",
    },
    children: [
      {
        path: "dataVisualize",
        element: lazyLoad(React.lazy(() => import("@/views/dashboard/dataVisualize"))),
        meta: {
          requireAuth: true,
          title: "数据可视化",
          key: "dataVisualize",
        },
      },
      {
        path: "embedded",
        element: lazyLoad(React.lazy(() => import("@/views/dashboard/embedded"))),
        meta: {
          requireAuth: true,
          title: "内嵌页面",
          key: "embedded",
        },
      },
    ],
  },
]

export default dashBoardRouter
