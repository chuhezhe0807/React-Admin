import React from "react"
import lazyLoad from "../utils/lazyLoad"
import { RouteObject } from "../interface"
import { LayoutIndex } from "../constant"

const canvasDemoRouter: Array<RouteObject> = [
  {
    path: "/canvasDemo/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "CanvasDemo",
    },
    children: [
      {
        path: "index",
        element: lazyLoad(React.lazy(() => import("@/views/canvasDemo/index"))),
        meta: {
          title: "画布Demo",
          requireAuth: true,
          key: "canvasDemo",
        },
      },
    ],
  },
]

export default canvasDemoRouter
