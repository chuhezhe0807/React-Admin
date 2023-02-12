import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Dropdown, MenuProps, message, Space } from "antd"

import { CoordinateSystem, BlockType, MyEvent, ControlPointIndexArr } from "./Constants"
import { isPointInElement, runAnimate } from "./utils"
import useThrottle from "@/hooks/useThrottle"
import { DownOutlined, SmileOutlined } from "@ant-design/icons"
import Triangle from "./shapes/class/triangle"
import { BlockInfo, CanvasObj, IPoint } from "./interface"
import Circle from "./shapes/class/circle"
import Rect from "./shapes/class/rect"
import PathSearch from "./utils/pathSearch"

type TempType = {
    position: keyof typeof PlumOrigin
    val: number
    startPoint: Point
}

interface Point {
    x: number
    y: number
}

interface Branch {
    start: Point
    length: number
    theta: number
}

interface LastPos {
    x: number
    y: number
    scale: number
}

interface NearNode {
    x: number // 坐标,以网格为单元的值
    y: number
    parent?: NearNode
    g: number // 当前点与附近点的距离,写死
    h: number // 当前点与终点水平垂直方向距离之和
    f: number // g+h之和
}

type PaintedElement = Triangle | Circle

interface PaintedElementRef {
    objects: PaintedElement[]
}

interface HoveredElementRef {
    element: PaintedElement | null
}

const TempPosition = ["TOP", "TOP_RIGHT", "RIGHT", "BOTTOM_RIGHT", "BOTTOM", "BOTTOM_LEFT", "LEFT", "TOP_LEFT", "ROTATE"] as const

type TempControlPoint = typeof TempPosition[number] | ""

interface CurrentControlPointRef {
    position: TempControlPoint
    index: number
}

enum PlumOrigin {
    top = Math.PI / 2,
    bottom = -Math.PI / 2,
    left = 0,
    right = Math.PI,
}

const ZERO_COLOR = CoordinateSystem.ZERO_COLOR // 0 点坐标系颜色
const SOLID_COLOR = CoordinateSystem.SOLID_COLOR // 实线颜色
const DASHED_COLOR = CoordinateSystem.DASHED_COLOR // 虚线颜色
const CANVAS_WIDTH = 1000 // 画布宽
const CANVAS_HEIGHT = 660 // 画布高
const PENDING_TASKS: Function[] = [] // 绘制branch的任务数组，为了延时每一步的绘制任务，使得有动画效果
let FRAME_COUNTS = 0 // 调用frame的次数计数

const CanvasDemo = () => {
    // 当前 canvas 的 0 0 坐标，我们设置 canvas 左上角顶点为 0 0，向右👉和向下👇是 X Y 轴正方向，0，0 为 pageSlicePos 初始值
    const [pageSlicePos, setPageSlicePos] = useState<Point>({
        x: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        y: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
    })
    const [ctxVal, setCtxVal] = useState<any>() // canvas 的 ctx
    const [scale, setScale] = useState<number>(CoordinateSystem.NATIVE_SCALE) // 缩放比例
    const [plum, setPlum] = useState<boolean>(false)
    const [automaticRoute, setAutomaticRoute] = useState<boolean>(false)
    // 自动寻路的起点
    const [originNode, setOriginNode] = useState<IPoint>()
    // 是否仅支持四个方向移动
    const [rightAngle, setRightAngle] = useState<boolean>(true)

    const myCanvasRef = useRef<HTMLCanvasElement>(null)
    // 存储canvas画布对象（仅添加到画布时新增）
    const canvasObjRef = useRef<CanvasObj>({ objects: [] })
    // 存储绘制的元素（添加到画布时、重新绘制时新增）
    const paintedElementRef = useRef<PaintedElementRef>({ objects: [] })
    // 存储上一次点击画布的事件，用于判断是否是双击
    const lastCanvasClickTimeRef = useRef<number>(0)
    // 存储上一次的网格大小、（鼠标点的）坐标位置
    const { current: lastPos } = useRef<LastPos>({
        x: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        y: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        scale: (CoordinateSystem.NATIVE_SCALE * CoordinateSystem.GRID_SIZE) as number,
    })
    // 存储当前鼠标悬浮的元素
    const hoveredElementRef = useRef<HoveredElementRef>({ element: null })
    // 保存当前鼠标悬浮的控制点的位置信息
    const CurrentControlPointRef = useRef<CurrentControlPointRef>({ position: "", index: -1 })

    // 监听 pageSlicePos 数据，有变动则进行 canvas 的绘制
    useEffect(() => {
        if (!plum) {
            if (ctxVal) {
                // 重新绘制之前清空 canvas
                ctxVal.clearRect(0, 0, ctxVal.canvas.width, ctxVal.canvas.height)
            }
            drawLineGrid()
        }
    }, [pageSlicePos, plum])

    // 挂载、卸载时添加、移除监听事件
    useEffect(() => {
        if (!plum) {
            //滚轮事件wheel替换了已被弃用的非标准[`mousewheel`]事件。
            myCanvasRef.current!.addEventListener("wheel", mousewheel)
            myCanvasRef.current!.addEventListener("mousedown", mousedown)
            myCanvasRef.current!.addEventListener("mousemove", mousemove)
            return () => {
                myCanvasRef.current!.removeEventListener("wheel", mousewheel)
                myCanvasRef.current!.removeEventListener("mousedown", mousedown)
                myCanvasRef.current!.removeEventListener("mousemove", mousemove)
            }
        } else {
            myCanvasRef.current!.addEventListener("click", plumCanvasClick)
            return () => myCanvasRef.current!.removeEventListener("click", plumCanvasClick)
        }
    }, [scale, pageSlicePos, plum])

    // 自动寻路监听事件
    useEffect(() => {
        if (automaticRoute) {
            myCanvasRef.current!.addEventListener("click", startPointClick)
            return () => myCanvasRef.current!.removeEventListener("click", startPointClick)
        }
    }, [automaticRoute, rightAngle])

    // 自动寻路 state 驱动更新方块的位置
    useEffect(() => {
        if (!originNode) return
        drawLineGrid()
        // 绘制障碍物
        paintObstacles()
        // 绘制终点
        paintPathSquare({ x: 19, y: 9 }, "#fff566")
        paintPathSquare(originNode)

        // return () => {
        //     clearPaintedPathSquare(originNode)
        // }
    }, [originNode])

    /**
     * 绘制网格
     * @param scaleVal 缩放倍数
     * @param scaleVal 缩放倍数
     */
    const drawLineGrid = (scaleVal = scale) => {
        // console.log("x, y", x, y);
        // console.log("draw")

        /*获取绘图工具*/
        var ctx = ctxVal || myCanvasRef.current!.getContext("2d")
        setCtxVal(ctx)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.save()
        // 设置网格大小
        var girdSize = CoordinateSystem.GRID_SIZE * scaleVal

        // 获取Canvas的width、height
        var CanvasWidth = myCanvasRef.current!.width
        var CanvasHeight = myCanvasRef.current!.height

        // 在 pageSlicePos 的 x，y 点位画一个 10 * 10 的红色标记用来表示当前页面的 0 0 坐标
        ctx.lineWidth = 1
        ctx.strokeStyle = "#002766"
        ctx.fillRect(pageSlicePos.x - 5, pageSlicePos.y - 5, 10, 10) // 效果图红色小方块

        const canvasXHeight = CanvasHeight - pageSlicePos.y
        const canvasYWidth = CanvasWidth - pageSlicePos.x
        // 从 pageSlicePos.y 处开始往 Y 轴正方向画 X 轴网格
        const xPageSliceTotal = Math.ceil(canvasXHeight / girdSize)

        for (let i = 0; i < xPageSliceTotal; i++) {
            ctx.beginPath() // 开启路径，设置不同的样式
            ctx.moveTo(0, pageSlicePos.y + girdSize * i)
            ctx.lineTo(CanvasWidth, pageSlicePos.y + girdSize * i)
            ctx.strokeStyle = i === 0 ? ZERO_COLOR : i % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke()
        }

        // 从 pageSlicePos.y 处开始往 Y 轴负方向画 X 轴网格
        const xRemaining = pageSlicePos.y
        const xRemainingTotal = Math.ceil(xRemaining / girdSize)
        for (let i = 0; i < xRemainingTotal; i++) {
            if (i === 0) continue
            ctx.beginPath() // 开启路径，设置不同的样式
            ctx.moveTo(0, pageSlicePos.y - girdSize * i - 0.5) // -0.5是为了解决像素模糊问题
            ctx.lineTo(CanvasWidth, pageSlicePos.y - girdSize * i)
            ctx.strokeStyle = i === 0 ? ZERO_COLOR : i % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke()
        }

        // 从 pageSlicePos.x 处开始往 X 轴正方向画 Y 轴网格
        const yPageSliceTotal = Math.ceil(canvasYWidth / girdSize) // 计算需要绘画y轴的条数
        for (let j = 0; j < yPageSliceTotal; j++) {
            ctx.beginPath() // 开启路径，设置不同的样式
            ctx.moveTo(pageSlicePos.x + girdSize * j, 0)
            ctx.lineTo(pageSlicePos.x + girdSize * j, CanvasHeight)
            ctx.strokeStyle = j === 0 ? ZERO_COLOR : j % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke()
        }

        // 从 pageSlicePos.x 处开始往 X 轴负方向画 Y 轴网格
        const yRemaining = pageSlicePos.x
        const yRemainingTotal = Math.ceil(yRemaining / girdSize)
        for (let j = 0; j < yRemainingTotal; j++) {
            if (j === 0) continue
            ctx.beginPath() // 开启路径，设置不同的样式
            ctx.moveTo(pageSlicePos.x - girdSize * j, 0)
            ctx.lineTo(pageSlicePos.x - girdSize * j, CanvasHeight)
            ctx.strokeStyle = j === 0 ? ZERO_COLOR : j % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke()
        }
        ctx.restore()

        // 开始绘制 canvasObjRef 中的元素
        // console.log("执行----=");

        let temp: PaintedElement
        // let tempArr: BlockInfo[] = []
        paintedElementRef.current.objects = []
        for (let item of canvasObjRef.current.objects) {
            if (item.type == "TRIANGLE") {
                temp = new Triangle(
                    ctxVal,
                    (scale / item.scale) * item.relative2originX + pageSlicePos.x,
                    (scale / item.scale) * item.relative2originY + pageSlicePos.y,
                    item.relative2originX,
                    item.relative2originY,
                    item.width || undefined,
                    item.height || undefined,
                    item.fillColor || undefined,
                    scale,
                    item?.rotateDeg || 0
                )
                // console.log("temp", temp);
                if (item.isDragged) {
                    temp.isDragged = true
                } else {
                    temp.isDragged = false
                }
                temp.draw()
                // console.log(temp)
                if (item.isSelected) {
                    temp.setFocusStyle(scale)
                    temp.setSelected = true
                } else {
                    temp.setSelected = false
                }
            } else if (item.type == "CIRCLE") {
                temp = new Circle(
                    ctxVal,
                    (scale / item.scale) * item.relative2originX + pageSlicePos.x,
                    (scale / item.scale) * item.relative2originY + pageSlicePos.y,
                    item.relative2originX,
                    item.relative2originY,
                    item.width || undefined,
                    item.height || undefined,
                    item.fillColor || undefined,
                    scale
                )
                // console.log("temp", temp);
                temp.draw()
                // console.log(temp)
                if (item.isSelected) {
                    temp.setFocusStyle(scale)
                    temp.setSelected = true
                } else {
                    temp.setSelected = false
                }
            } else {
                temp = new Rect(
                    ctxVal,
                    (scale / item.scale) * item.relative2originX + pageSlicePos.x,
                    (scale / item.scale) * item.relative2originY + pageSlicePos.y,
                    item.relative2originX,
                    item.relative2originY,
                    item.width || undefined,
                    item.height || undefined,
                    item.fillColor || undefined,
                    scale
                )
                // console.log("temp", temp);
                temp.draw()
                // console.log(temp)
                if (item.isSelected) {
                    temp.setFocusStyle(scale)
                    temp.setSelected = true
                } else {
                    temp.setSelected = false
                }
            }
            // 存储绘制的元素
            paintedElementRef.current.objects.push(temp)
        }
        // canvasObjRef.current.objects = [...tempArr]
    }

    /**
     * 点击缩放，设置缩放倍数
     * @param {Boolean} type 放大(true)或者缩小(false)
     */
    const clickScale = (type: boolean) => {
        let scaleVal = type ? scale + CoordinateSystem.SCALE_ABILITY : scale - CoordinateSystem.SCALE_ABILITY
        if (scale <= CoordinateSystem.MIN_SCALESIZE) {
            scaleVal = scale + CoordinateSystem.SCALE_ABILITY
            message.warning("已经最小缩放了~")
        }
        if (scale >= CoordinateSystem.MAX_SCALESIZE) {
            scaleVal = scale - CoordinateSystem.SCALE_ABILITY
            message.warning("已经最大缩放了~")
        }
        setScale(scaleVal)
        // // 把一个范围内的所有的像素都设置为透明的以达到 擦除一个矩形区域的目的
        // ctxVal.clearRect(0, 0, ctxVal.canvas.width, ctxVal.canvas.height)
        drawLineGrid(scaleVal)
    }

    /**
     * 滚轮滚动事件,重绘网格
     * @param e
     * @returns
     */
    const mousewheel = (e: any) => {
        // console.log(e.offsetX, e.offsetY);

        if (automaticRoute) return
        e.preventDefault()
        // 放大
        if (e.wheelDelta > 0) {
            if (scale + CoordinateSystem.SCALE_ABILITY >= CoordinateSystem.MAX_SCALESIZE) {
                setCtxVal(CoordinateSystem.MAX_SCALESIZE)
                drawLineGrid()
                return
            } else {
                setScale((c) => c + CoordinateSystem.SCALE_ABILITY)
            }
        } else {
            if (scale - CoordinateSystem.SCALE_ABILITY <= CoordinateSystem.MIN_SCALESIZE) {
                setCtxVal(CoordinateSystem.MIN_SCALESIZE)
                drawLineGrid()
                return
            } else {
                setScale((c) => c - CoordinateSystem.SCALE_ABILITY)
            }
        }
        back2center(e.offsetX, e.offsetY)
    }

    function back2center(x: number, y: number) {
        const different = scale * CoordinateSystem.GRID_SIZE - lastPos.scale

        const { x: posX, y: posY } = pageSlicePos

        setPageSlicePos({
            x: posX - ((x - lastPos.x) / lastPos.scale) * different,
            y: posY - ((y - lastPos.y) / lastPos.scale) * different,
        })

        lastPos.scale = scale * CoordinateSystem.GRID_SIZE
        lastPos.x = pageSlicePos.x
        lastPos.y = pageSlicePos.y
    }

    /**
     * 监听点击事件
     */
    const mousedown = (e: any) => {
        if (automaticRoute) return

        document.dispatchEvent(new CustomEvent(MyEvent.POINT_DOWN, { detail: e }))
    }

    /**
     * @description 监听鼠标移事件
     */
    const mousemove = (e: any) => {
        const point: IPoint = {
            x: e.offsetX | 0,
            y: e.offsetY | 0,
        }

        // console.log(canvasObjRef.current.objects.some((item) => item.isSelected))

        // let draggedEle: BlockInfo | undefined;
        // const isAnyEleDragged = canvasObjRef.current.objects.some((item) => {
        //     if (item.isDragged) {
        //         draggedEle = item
        //     }
        //     return item.isDragged
        // })
        // console.log("isAnyEleDragged", isAnyEleDragged, draggedEle)

        const pointArrs = paintedElementRef.current.objects.map((item) => ({
            pointArr: item.retCoordinate(),
            element: item,
        }))
        if (!pointArrs.length) return

        function mouseOnEle() {
            return pointArrs.some((item) => {
                const temp = isPointInElement(point, item.pointArr)
                // if (draggedEle) {
                //     hoveredElementRef.current!.element = draggedEle
                // }
                if (temp) {
                    hoveredElementRef.current!.element = item.element
                }
                return temp
            })
        }

        if (mouseOnEle()) {
            myCanvasRef.current!.style.cursor = "pointer"
            // 监听双击事件，用于删除元素
            document.addEventListener(MyEvent.DB_CLICK, dbClick)
            // console.log(hoveredElementRef.current!.element)
        } else {
            myCanvasRef.current!.style.cursor = "auto"
            document.removeEventListener(MyEvent.DB_CLICK, dbClick)
            hoveredElementRef.current!.element = null
        }

        if (CurrentControlPointRef.current.position) {
            document.removeEventListener(CurrentControlPointRef.current.position, controlPointClick)
        }
        // 重置鼠标悬浮控制点位置信息
        CurrentControlPointRef.current = {
            position: "",
            index: -1,
        }

        // 如果画布上有被选中元素
        const isSelectedItem = paintedElementRef.current.objects.find((item) => item.isSelected)
        const isSelectedItemIndex = paintedElementRef.current.objects.findIndex((item) => item.isSelected)
        if (isSelectedItem) {
            // console.log(isSelectedItem.getControlPointsArr)
            isSelectedItem.getControlPointsArr.forEach((item, index) => {
                if (isPointInElement(point, item)) {
                    switch (index) {
                        case 0:
                            myCanvasRef.current!.style.cursor = "ns-resize"
                            break
                        case 1:
                            myCanvasRef.current!.style.cursor = "nesw-resize"
                            break
                        case 2:
                            myCanvasRef.current!.style.cursor = "ew-resize"
                            break
                        case 3:
                            myCanvasRef.current!.style.cursor = "nwse-resize"
                            break
                        case 4:
                            myCanvasRef.current!.style.cursor = "ns-resize"
                            break
                        case 5:
                            myCanvasRef.current!.style.cursor = "nesw-resize"
                            break
                        case 6:
                            myCanvasRef.current!.style.cursor = "ew-resize"
                            break
                        case 7:
                            myCanvasRef.current!.style.cursor = "nwse-resize"
                            break
                        case 8:
                            myCanvasRef.current!.style.cursor = "pointer"
                            break
                    }

                    const position = ControlPointIndexArr[index] as TempControlPoint
                    // 保存当前鼠标悬浮的控制点的位置
                    CurrentControlPointRef.current = { position, index: isSelectedItemIndex }
                    // console.log("position", position)
                    document.addEventListener(position, controlPointClick)
                } else {
                    if (CurrentControlPointRef.current.position) {
                        document.removeEventListener(CurrentControlPointRef.current.position, controlPointClick)
                    }
                }
            })
        }

        // console.log(CurrentControlPointRef.current)

        // console.log(canvasObjRef.current.objects[0]!.retCoordinate)
    }

    /**
     * @description 监听鼠标悬浮控制点时的点击事件
     * @param {Event} e
     */
    const controlPointClick = (e: any) => {
        console.log(e, CurrentControlPointRef.current.position)

        const currentSelectedEle = canvasObjRef.current.objects.find((item) => item.isSelected)
        // const _x = e.offsetX;
        // const _y = e.offsetY;
        // const _width = currentSelectedEle!.width;
        // const _height = currentSelectedEle!.height;

        // const ctx = myCanvasRef.current?.getContext('2d')!
        // ctx.save()
        // ctx.translate(_x + _width / 2, _y + _height / 2)
        // ctx.rotate((1 * Math.PI) / 180)
        // ctx.restore()
        currentSelectedEle!.rotateDeg = 90
        drawLineGrid()

        document.onmousemove = (e: any) => {
            console.log("move", e)
        }

        document.onmouseup = (e: any) => {
            console.log("up", e)

            document.onmousemove = null
            document.onmouseup = null
        }

        document.removeEventListener(CurrentControlPointRef.current.position, controlPointClick)
    }

    /**
     * @description 双击 删除鼠标悬浮的元素
     */
    const dbClick = (e: any) => {
        if (!hoveredElementRef.current.element) return
        // (310, 120) 为canvas左上角的 clientX，clientY 坐标
        const point = {
            x: e.detail.clientX - 310,
            y: e.detail.clientY - 120,
        }
        const pointArrs = paintedElementRef.current.objects.map((item) => ({
            pointArr: item.retCoordinate(),
            element: item,
        }))
        if (!pointArrs.length) return

        pointArrs.forEach((item) => {
            const temp = isPointInElement(point, item.pointArr)
            if (temp) {
                hoveredElementRef.current!.element = item.element
            }
        })

        const id = hoveredElementRef.current.element!.id
        const index = paintedElementRef.current.objects.findIndex((item) => item.id == id)
        if (index !== -1) {
            canvasObjRef.current.objects.splice(index, 1)
            drawLineGrid()

            myCanvasRef.current!.style.cursor = "auto"
            document.removeEventListener(MyEvent.DB_CLICK, dbClick)
            hoveredElementRef.current!.element = null
        } else {
            console.log("index 出错")
        }
    }

    /**
     * 拖动 canvas 动态渲染，拖动时，动态设置 pageSlicePos 的值
     * @param e Event
     */
    const mouseDown = (e: any) => {
        // console.log("down", CurrentControlPointRef.current, 123)

        if (automaticRoute) return
        const isDblClick = Date.now() - lastCanvasClickTimeRef.current < 300
        if (isDblClick) {
            document.dispatchEvent(new CustomEvent(MyEvent.DB_CLICK, { detail: e }))
        }
        lastCanvasClickTimeRef.current = Date.now()

        // 当画布中有选中的元素就派发选中元素控制点点击事件（如果鼠标悬浮在控制上，才会监听点击事件）
        if (CurrentControlPointRef.current.position) {
            console.log(new CustomEvent(CurrentControlPointRef.current.position))

            document.dispatchEvent(new CustomEvent(CurrentControlPointRef.current.position, { detail: e }))
        }

        // 点击时没有 hoveredElementRef.current!.element 则取消所有元素的选中效果并重新绘制
        if (!hoveredElementRef.current!.element) {
            canvasObjRef.current.objects = canvasObjRef.current.objects.map((item) => {
                item.isSelected = false
                return item
            })
            // drawLineGrid()
        } else {
            const id = hoveredElementRef.current.element!.id
            const index = paintedElementRef.current.objects.findIndex((item) => item.id == id)

            if (index === -1) return
            // canvasObjRef.current.objects[index].isSelected = true
            canvasObjRef.current.objects.forEach((_, i) => {
                if (i === index) {
                    canvasObjRef.current.objects[i].isSelected = true
                    canvasObjRef.current.objects[i].isDragged = true
                } else {
                    canvasObjRef.current.objects[i].isSelected = false
                    canvasObjRef.current.objects[i].isDragged = false
                }
            })
        }

        if (CurrentControlPointRef.current.index !== -1) {
            canvasObjRef.current.objects.forEach((_, i) => {
                if (i === CurrentControlPointRef.current.index) {
                    canvasObjRef.current.objects[i].isSelected = true
                    canvasObjRef.current.objects[i].isDragged = true
                } else {
                    canvasObjRef.current.objects[i].isSelected = false
                    canvasObjRef.current.objects[i].isDragged = false
                }
            })
        }

        drawLineGrid()

        if (CurrentControlPointRef.current.index !== -1) return

        const downX = e.clientX
        const downY = e.clientY
        const { x, y } = pageSlicePos

        lastPos.x = x
        lastPos.y = y

        // 记录下上一次的 moveX moveY （第一次为 downX downY）
        let _downX = downX
        let _downY = downY

        // 监听doucument的鼠标移动事件，提升体验
        document.addEventListener("mousemove", docMousemoveEvt)

        function docMousemoveEvt(e: any) {
            const moveX = e.clientX
            const moveY = e.clientY
            // 鼠标正 hover 与某个元素上
            if (hoveredElementRef.current!.element) {
                const index = paintedElementRef.current.objects.findIndex((item) => item.id == hoveredElementRef.current.element!.id)
                if (index === -1) return
                const item = canvasObjRef.current.objects[index]

                item.relative2originX = item.relative2originX + ((moveX - _downX) * item.scale) / scale
                item.relative2originY = item.relative2originY + ((moveY - _downY) * item.scale) / scale
                item.isSelected = true
                drawLineGrid()

                _downX = moveX
                _downY = moveY
            } else {
                setPageSlicePos({
                    x: x + (moveX - downX),
                    y: y + (moveY - downY),
                })
            }
        }

        myCanvasRef.current!.onmouseleave = (e: any) => {
            document.removeEventListener("mousemove", docMousemoveEvt)
        }

        myCanvasRef.current!.onmouseup = (en: any) => {
            myCanvasRef.current!.onmousemove = null
            myCanvasRef.current!.onmouseup = null
            myCanvasRef.current!.onmouseleave = null
            document.removeEventListener("mousemove", docMousemoveEvt)

            canvasObjRef.current.objects = canvasObjRef.current.objects.map((item) => {
                item.isDragged = false
                return item
            })
            if (!hoveredElementRef.current!.element) {
                setPageSlicePos({
                    x: x + (en.clientX - downX),
                    y: y + (en.clientY - downY),
                })
            }
            drawLineGrid()
        }
    }

    /**
     * @description 回到初始点
     */
    const back2Initial = () => {
        runAnimate(
            pageSlicePos,
            {
                x: CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3,
                y: CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3,
            },
            1000,
            (e: any) => {
                setPageSlicePos({ x: e.x, y: e.y })
            }
        )
    }
    const throttleBack2Initial = useThrottle(back2Initial, 1000)

    /**
     * 工具函数
     * @description 画线
     */
    function lineTo(p1: Point, p2: Point) {
        const ctx = myCanvasRef.current!.getContext("2d")!
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
        const ctx = ctxVal || myCanvasRef.current!.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
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
                    orderArr.push({
                        position: item,
                        val: CANVAS_HEIGHT - y,
                        startPoint: { x, y: CANVAS_HEIGHT },
                    })
                    break
                case "left":
                    orderArr.push({ position: item, val: x, startPoint: { x: 0, y } })
                    break
                case "right":
                    orderArr.push({
                        position: item,
                        val: CANVAS_WIDTH - x,
                        startPoint: { x: CANVAS_WIDTH, y },
                    })
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

    /**
     * @description 清空画布
     */
    const clearPlumBlossom = () => {
        const ctx = ctxVal || myCanvasRef.current!.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    /**
     * @description 画
     */
    const drawBlock = (type: BlockType) => {
        message.info("请在画布上单击某点作为元素的绘制位置")
        document.addEventListener(MyEvent.POINT_DOWN, getClickPoint)
        let createBlock
        function getClickPoint(e: any) {
            switch (type) {
                case BlockType.TRIANGLE:
                    // console.log("点击三角形", e.detail.offsetX, e.detail.offsetY, ctxVal)
                    createBlock = new Triangle(ctxVal, e.detail.offsetX, e.detail.offsetY, e.detail.offsetX - pageSlicePos.x, e.detail.offsetY - pageSlicePos.y, undefined, undefined, undefined, scale)

                    canvasObjRef.current?.objects.push(createBlock.retCanvasObj)
                    paintedElementRef.current.objects.push(createBlock)
                    // console.log("createBlock", createBlock, canvasObjRef.current);
                    createBlock.draw()
                    // 设置高亮
                    createBlock.setFocusStyle(scale)
                    document.removeEventListener(MyEvent.POINT_DOWN, getClickPoint)
                    break
                case BlockType.CIRCLE:
                    // console.log("circel")
                    createBlock = new Circle(ctxVal, e.detail.offsetX, e.detail.offsetY, e.detail.offsetX - pageSlicePos.x, e.detail.offsetY - pageSlicePos.y, undefined, undefined, undefined, scale)

                    canvasObjRef.current?.objects.push(createBlock.retCanvasObj)
                    paintedElementRef.current.objects.push(createBlock)

                    createBlock.draw()
                    // console.log("createBlock", createBlock)

                    // 设置高亮
                    createBlock.setFocusStyle(scale)
                    document.removeEventListener(MyEvent.POINT_DOWN, getClickPoint)
                    break
                case BlockType.RECT:
                    createBlock = new Rect(ctxVal, e.detail.offsetX, e.detail.offsetY, e.detail.offsetX - pageSlicePos.x, e.detail.offsetY - pageSlicePos.y, undefined, undefined, undefined, scale)

                    canvasObjRef.current?.objects.push(createBlock.retCanvasObj)
                    paintedElementRef.current.objects.push(createBlock)

                    createBlock.draw()

                    // 设置高亮
                    createBlock.setFocusStyle(scale)
                    document.removeEventListener(MyEvent.POINT_DOWN, getClickPoint)
                    break
                default:
                    break
            }
        }
    }

    /**
     * @description 点击了自动寻路
     */
    const automaticRouting = () => {
        setAutomaticRoute((val) => !val)
        if (!automaticRoute) {
            setScale(CoordinateSystem.NATIVE_SCALE)
            canvasObjRef.current.objects = []
            drawLineGrid()
            back2Initial()

            // 固定一个终点
            setTimeout(() => {
                paintObstacles()
                paintPathSquare({ x: 19, y: 9 }, "#fff566")
            }, 1100)
        }
    }

    /**
     * @description 选择了自动寻路开始点
     */
    const startPointClick = (e: any) => {
        // console.log("寻路", (e.offsetX / 40).toFixed(2), (e.offsetY / 40).toFixed(2))
        const size = CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE
        const x = Math.floor(e.offsetX / size)
        const y = Math.floor(e.offsetY / size)

        // console.log("x, y", x, y)

        const targetNode: IPoint = { x: 19, y: 9 }
        const h = Math.abs(19 - x) + Math.abs(9 - y)
        const originNode: NearNode = { x, y, g: 0, h, f: h }
        const pathSearch = new PathSearch(originNode, targetNode, rightAngle)

        // paintPathSquare(originNode)

        pathSearch.search(originNode, cb)
        function cb(result: any) {
            // console.log("result", result)
            pathSearch.run2Target(originNode, setStateFunc)
        }

        setOriginNode(originNode)

        function setStateFunc(point: IPoint) {
            // console.log("zhixing1", point)
            setOriginNode(point)
        }
    }

    /**
     * @description 绘制障碍物
     */
    const paintObstacles = () => {
        paintPathSquare({ x: 10, y: 6 }, "#FF0000")
        paintPathSquare({ x: 10, y: 7 }, "#FF0000")
        paintPathSquare({ x: 10, y: 8 }, "#FF0000")
        paintPathSquare({ x: 10, y: 9 }, "#FF0000")
        paintPathSquare({ x: 10, y: 10 }, "#FF0000")
        paintPathSquare({ x: 10, y: 11 }, "#FF0000")

        // paintPathSquare({ x: 19, y: 8 }, "#FF0000")
        // paintPathSquare({ x: 18, y: 8 }, "#FF0000")
        // paintPathSquare({ x: 18, y: 9 }, "#FF0000")
        // paintPathSquare({ x: 9, y: 11 }, "#FF0000")

        // 改变 父元素指向
        paintPathSquare({ x: 20, y: 9 }, "#FF0000")
        paintPathSquare({ x: 20, y: 10 }, "#FF0000")
        paintPathSquare({ x: 20, y: 8 }, "#FF0000")
        paintPathSquare({ x: 19, y: 8 }, "#FF0000")
        paintPathSquare({ x: 18, y: 8 }, "#FF0000")
        paintPathSquare({ x: 17, y: 8 }, "#FF0000")
        paintPathSquare({ x: 17, y: 9 }, "#FF0000")
        paintPathSquare({ x: 17, y: 10 }, "#FF0000")
    }

    /**
     * @description 自动寻路绘制方块
     * @param {IPoint} point 绘制的方块的左上角坐标
     */
    const paintPathSquare = ({ x, y }: IPoint, fillColor?: string) => {
        const ctx = myCanvasRef.current!.getContext("2d")!
        const size = CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE
        const _x = x * size
        const _y = y * size
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(_x, _y)
        ctx.lineTo(_x + size, _y)
        ctx.lineTo(_x + size, _y + size)
        ctx.lineTo(_x, _y + size)
        ctx.closePath()
        ctx.fillStyle = fillColor ? fillColor : "#4472c4"
        ctx.fill()
        ctx.restore()
    }

    // test
    const printObjs = () => {
        console.log("canvas", canvasObjRef.current?.objects)
        console.log("painted", paintedElementRef.current?.objects)
    }

    const drawItems: MenuProps["items"] = [
        {
            key: "1",
            label: <span onClick={() => drawBlock(BlockType.TRIANGLE)}>三角形</span>,
        },
        {
            key: "2",
            // disabled: true,
            label: <span onClick={() => drawBlock(BlockType.RECT)}>矩形</span>,
        },
        {
            key: "3",
            // disabled: true,
            label: <span onClick={() => drawBlock(BlockType.CIRCLE)}>圆形</span>,
        },
    ]

    return (
        <div className="canvas" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Space style={{ margin: "10px auto", width: "1000px" }}>
                <Button disabled={plum} onClick={() => clickScale(true)}>
                    放大
                </Button>
                <Button disabled={plum} onClick={() => clickScale(false)}>
                    缩小
                </Button>
                <Button disabled={plum} onClick={throttleBack2Initial}>
                    回到初始点
                </Button>
                <Button type={plum ? "primary" : "default"} onClick={setPlumBlossom}>
                    生长梅花
                </Button>
                {plum ? <Button onClick={clearPlumBlossom}>清空</Button> : null}
                <Dropdown.Button menu={{ items: drawItems }} icon={<DownOutlined />}>
                    选择图形
                </Dropdown.Button>
                <Button disabled={plum} onClick={printObjs}>
                    打印对象
                </Button>
                <Button type={automaticRoute ? "primary" : "default"} onClick={automaticRouting}>
                    自动寻路
                </Button>
                {automaticRoute && (
                    <Button type={rightAngle ? "primary" : "default"} onClick={(val) => setRightAngle(!val)}>
                        RightAngle
                    </Button>
                )}
            </Space>
            <div
                style={{
                    width: "1000px",
                    border: "1px solid #999",
                    boxSizing: "border-box",
                }}
            >
                <canvas onMouseDown={mouseDown} id="myCanvas" ref={myCanvasRef} width="1000" height="660" style={{ backgroundColor: plum ? "#fff" : undefined }}></canvas>
            </div>
        </div>
    )
}

export default CanvasDemo
