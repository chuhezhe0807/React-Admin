import React from "react"
import lazyLoad from "../utils/lazyLoad"
import { RouteObject } from "../interface"
import { LayoutIndex } from "../constant"

const formRouter: Array<RouteObject> = [
  {
    path: "/form/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "表单 Form",
      requireAuth: true,
    },
    children: [
      {
        path: "basicForm",
        element: lazyLoad(React.lazy(() => import("@/views/form/basicForm"))),
        meta: {
          title: "基础 Form",
          key: "basicForm",
          requireAuth: true,
        },
      },
      {
        path: "validateForm",
        element: lazyLoad(React.lazy(() => import("@/views/form/validateForm"))),
        meta: {
          title: "验证 Form",
          key: "validateForm",
          requireAuth: true,
        },
      },
      {
        path: "dynamicForm",
        element: lazyLoad(React.lazy(() => import("@/views/form/dynamicForm"))),
        meta: {
          title: "动态 Form",
          key: "dynamicForm",
          requireAuth: true,
        },
      },
      {
        path: "*",
        element: lazyLoad(React.lazy(() => import("@/components/ErorrMsg/404"))),
      },
    ],
  },
]

export default formRouter
