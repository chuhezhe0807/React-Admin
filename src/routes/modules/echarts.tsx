import React from "react"
import { RouteObject } from "../interface"
import { LayoutIndex } from "../constant"
import lazyLoad from "../utils/lazyLoad"

const echartsRouter: Array<RouteObject> = [
  {
    path: "/echarts/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "ECharts",
    },
    children: [
      {
        path: "columnChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/columnChart"))),
        meta: {
          title: "柱状图",
          requireAuth: true,
          key: "columnChart",
        },
      },
      {
        path: "lineChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/lineChart"))),
        meta: {
          title: "折线图",
          requireAuth: true,
          key: "lineChart",
        },
      },
      {
        path: "waterChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/waterChart"))),
        meta: {
          title: "水型图",
          requireAuth: true,
          key: "waterChart",
        },
      },
      {
        path: "pieChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/pieChart"))),
        meta: {
          title: "饼图",
          requireAuth: true,
          key: "pieChart",
        },
      },
      {
        path: "radarChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/radarChart"))),
        meta: {
          title: "雷达图",
          requireAuth: true,
          key: "radarChart",
        },
      },
      {
        path: "nestedChart",
        element: lazyLoad(React.lazy(() => import("@/views/echarts/nestedChart"))),
        meta: {
          title: "嵌套圆形图",
          requireAuth: true,
          key: "nestedChart",
        },
      },
    ],
  },
]

export default echartsRouter
