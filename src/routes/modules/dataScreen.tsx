import React from "react"
import lazyLoad from "../utils/lazyLoad"
import { RouteObject } from "../interface"

const dataScreenRouter: Array<RouteObject> = [
  {
    path: "/dataScreen/index",
    element: lazyLoad(React.lazy(() => import("@/views/dataScreen/index"))),
    meta: {
      title: "数据大屏",
      requireAuth: true,
      key: "dataScreen",
    },
  },
]

export default dataScreenRouter
