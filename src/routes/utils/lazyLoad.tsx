import React, { Suspense } from "react"
import { Spin } from "antd"

/**
 * @description 路由懒加载HOC
 * @param {Element} Comp  需要访问的组件
 * @returns element
 */
const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          tip="Loading"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        ></Spin>
      }
    >
      <Comp></Comp>
    </Suspense>
  )
}

export default lazyLoad
