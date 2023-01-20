import lazyLoad from "../utils/lazyLoad"
import React from "react"
import { RouteObject } from "../interface"
import { Navigate } from "react-router-dom"

const homeRouter: Array<RouteObject> = [
  {
    path: "/home/*",
    element: lazyLoad(React.lazy(() => import("@/layouts/index"))),
    meta: {
      title: "布局",
      requireAuth: true,
    },
    children: [
      {
        path: "",
        element: <Navigate to="/home/index"></Navigate>,
      },
      {
        path: "index",
        // index: true,
        element: lazyLoad(React.lazy(() => import("@/views/home"))),
        meta: {
          requireAuth: true,
          title: "首页",
          key: "home",
        },
      },
      {
        path: "*",
        element: lazyLoad(React.lazy(() => import("@/components/ErorrMsg/404"))),
      },
    ],
  },
]

export default homeRouter
