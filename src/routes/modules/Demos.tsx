import React from "react";
import { LayoutIndex } from "../constant";
import { RouteObject } from "../interface";
import lazyLoad from "../utils/lazyLoad";

const DemosRouter: Array<RouteObject> = [
  {
    path: "/demos/*",
    element: <LayoutIndex></LayoutIndex>,
    meta: {
      title: "demos",
    },
    children: [
      {
        path: "undo",
        element: lazyLoad(React.lazy(() => import("@/views/demos/undo"))),
        meta: {
          title: "Undo",
          requireAuth: true,
          key: "Undo",
        },
      },
      {
        path: "empty",
        element: lazyLoad(React.lazy(() => import("@/views/demos/empty"))),
        meta: {
          title: "empty",
          requireAuth: true,
          key: "empty",
        },
      },
    ],
  },
]

export default DemosRouter;
