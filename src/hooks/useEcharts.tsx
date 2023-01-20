import * as echarts from "echarts"
import { useEffect, useRef } from "react"

/**
 * @description 使用Echarts 只是为了添加图表响应式
 * @param {Element} data 数据
 * @param {Object} options 绘制Echarts 参数
 */
export const useEcharts = (options: echarts.EChartsCoreOption, data?: any) => {
  const myChart = useRef<echarts.EChartsType>()
  const echartsRef = useRef<HTMLDivElement>(null)

  const echartsResize = () => {
    echartsRef && myChart?.current?.resize()
  }

  // 当 【】 中有值时，会在一开始执行一次，后续其中的值发生变化时，就是会执行 没有值时，仅会在挂载的时候执行
  useEffect(() => {
    if (data?.length !== 0) {
      myChart?.current?.setOption(options)
    }
  }, [data])

  useEffect(() => {
    if (echartsRef?.current) {
      myChart.current = echarts.init(echartsRef.current as HTMLDivElement)
    }

    myChart?.current?.setOption(options)
    window.addEventListener("resize", echartsResize)

    return () => {
      window.removeEventListener("resize", echartsResize)
      myChart?.current?.dispose()
    }
  }, [])

  return [echartsRef]
}
