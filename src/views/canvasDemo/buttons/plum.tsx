import { useState } from "react"

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  theta: number
}

enum PlumOrigin {
  top = Math.PI / 2,
  bottom = -Math.PI / 2,
  left = 0,
  right = Math.PI,
}

const CANVAS_WIDTH = 1000 // 画布宽
const CANVAS_HEIGHT = 660 // 画布高
const PENDING_TASKS: Function[] = [] // 绘制branch的任务数组，为了延时每一步的绘制任务，使得有动画效果
let FRAME_COUNTS = 0 // 调用frame的次数计数

const plumPart = (myCanvasDom: HTMLCanvasElement, plumProp: boolean) => {
  const [plum, setPlum] = useState<boolean>(plumProp)
  /**
   * 工具函数
   * @description 画线
   */
  function lineTo(p1: Point, p2: Point) {
    const ctx = myCanvasDom!.getContext("2d")!
    ctx.strokeStyle = "#00000080"
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  /**
   * @description 根据角度和长度确定终点坐标
   */
  function getEndPoint(b: Branch) {
    return {
      x: b.start.x + b.length * Math.cos(b.theta),
      y: b.start.y + b.length * Math.sin(b.theta),
    }
  }

  /**
   * 工具函数
   * @description 画出分支
   */
  function drawBranch(b: Branch) {
    lineTo(b.start, getEndPoint(b))
  }

  /**
   * @description 随机生长
   * @param {number} depth 至少要掉几次递归，防止画出来的枝树太少
   */
  function step(b: Branch, depth = 0) {
    if (depth > 20) return
    drawBranch(b)
    const end = getEndPoint(b)

    if (depth < 4 || Math.random() < 0.5) {
      PENDING_TASKS.push(() =>
        step(
          {
            start: end,
            length: b.length + (Math.random() * 10 - 5),
            theta: b.theta - 0.3 * Math.random(),
          },
          depth + 1
        )
      )
    }

    if (depth < 4 || Math.random() < 0.5) {
      PENDING_TASKS.push(() =>
        step(
          {
            start: end,
            length: b.length + (Math.random() * 10 - 5),
            theta: b.theta + 0.3 * Math.random(),
          },
          depth + 1
        )
      )
    }
  }

  /**
   * @descroption requestAnimationFrame 中每一帧要做的事
   */
  function frame() {
    const tasks = [...PENDING_TASKS]
    PENDING_TASKS.length = 0
    tasks.forEach((fn) => fn())
  }

  /**
   * @description 播放动画
   */
  function startFrame() {
    requestAnimationFrame(() => {
      FRAME_COUNTS++
      if (FRAME_COUNTS % 5 === 0) frame()
      startFrame()
    })
  }

  /**
   * @description 生长梅花动画
   */
  const setPlumBlossom = () => {
    // 测试使用 每掉一次，需要清空函数组件外的数据
    FRAME_COUNTS = 0
    PENDING_TASKS.length = 0
    setPlum((val) => !val)
    const ctx = myCanvasDom!.getContext("2d")!
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // console.log(myCanvasDom)

    if (plum) {
      myCanvasDom?.removeEventListener("click", plumCanvasClick)
      return
    } else {
      myCanvasDom?.addEventListener("click", plumCanvasClick)
    }

    type TempType = {
      position: keyof typeof PlumOrigin
      val: number
      startPoint: Point
    }
    /**
     * @description 根据点击的坐标计算出离哪一个便距离最短
     */
    function getMiniDistancePoint(x: number, y: number): TempType {
      const orderArr: TempType[] = []
      ;["top", "bottom", "left", "right"].forEach((item) => {
        switch (item) {
          case "top":
            orderArr.push({ position: item, val: y, startPoint: { x, y: 0 } })
            break
          case "bottom":
            orderArr.push({ position: item, val: CANVAS_HEIGHT - y, startPoint: { x, y: CANVAS_HEIGHT } })
            break
          case "left":
            orderArr.push({ position: item, val: x, startPoint: { x: 0, y } })
            break
          case "right":
            orderArr.push({ position: item, val: CANVAS_WIDTH - x, startPoint: { x: CANVAS_WIDTH, y } })
            break
          default:
            break
        }
      })

      return orderArr.sort((a: TempType, b: TempType) => a.val - b.val)[0]
    }

    /**
     * @description canvas 点击事件
     */
    function plumCanvasClick(e: any) {
      // console.log(e.offsetX, e.offsetY)
      const startPoint = getMiniDistancePoint(e.offsetX, e.offsetY)

      step({
        start: startPoint.startPoint,
        length: 40,
        theta: PlumOrigin[startPoint.position],
      })
      startFrame()
    }
  }

  return [setPlumBlossom]
}

export default plumPart
