import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, MenuProps, message, Space } from "antd";

import { CoordinateSystem, BlockType, MyEvent } from "./Constants";
import { runAnimate } from "./utils";
import useThrottle from "@/hooks/useThrottle";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import Triangle from "./shapes/triangle";
import { CanvasObj } from "./interface";

type TempType = {
    position: keyof typeof PlumOrigin;
    val: number;
    startPoint: Point;
};

interface Point {
    x: number;
    y: number;
}

interface Branch {
    start: Point;
    length: number;
    theta: number;
}

interface LastPos {
    x: number;
    y: number;
    scale: number;
}

enum PlumOrigin {
    top = Math.PI / 2,
    bottom = -Math.PI / 2,
    left = 0,
    right = Math.PI,
}

const ZERO_COLOR = CoordinateSystem.ZERO_COLOR; // 0 点坐标系颜色
const SOLID_COLOR = CoordinateSystem.SOLID_COLOR; // 实线颜色
const DASHED_COLOR = CoordinateSystem.DASHED_COLOR; // 虚线颜色
const CANVAS_WIDTH = 1000; // 画布宽
const CANVAS_HEIGHT = 660; // 画布高
const PENDING_TASKS: Function[] = []; // 绘制branch的任务数组，为了延时每一步的绘制任务，使得有动画效果
let FRAME_COUNTS = 0; // 调用frame的次数计数

const CanvasDemo = () => {
    // 当前 canvas 的 0 0 坐标，我们设置 canvas 左上角顶点为 0 0，向右👉和向下👇是 X Y 轴正方向，0，0 为 pageSlicePos 初始值
    const [pageSlicePos, setPageSlicePos] = useState<Point>({
        x: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        y: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
    });
    const [ctxVal, setCtxVal] = useState<any>(null); // canvas 的 ctx
    const [scale, setScale] = useState<number>(CoordinateSystem.NATIVE_SCALE); // 缩放比例
    const [plum, setPlum] = useState<boolean>(false);
    const myCanvasRef = useRef<HTMLCanvasElement>(null);
    // 存储canvas画布对象
    const canvasObjRef = useRef<CanvasObj>({ objects: [] });
    // 存储上一次的网格大小、（鼠标点的）坐标位置
    const { current: lastPos } = useRef<LastPos>({
        x: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        y: (CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE * 3) as number,
        scale: (CoordinateSystem.NATIVE_SCALE * CoordinateSystem.GRID_SIZE) as number,
    });

    // 监听 pageSlicePos 数据，有变动则进行 canvas 的绘制
    useEffect(() => {
        if (!plum) {
            if (ctxVal) {
                // 重新绘制之前清空 canvas
                ctxVal.clearRect(0, 0, ctxVal.canvas.width, ctxVal.canvas.height);
            }
            drawLineGrid();
        }
    }, [pageSlicePos, plum]);

    // 挂载、卸载时添加、移除监听事件
    useEffect(() => {
        if (!plum) {
            //滚轮事件wheel替换了已被弃用的非标准[`mousewheel`]事件。
            myCanvasRef.current!.addEventListener("wheel", mousewheel);
            myCanvasRef.current!.addEventListener("mousedown", mousedown);
            myCanvasRef.current!.addEventListener("mousemove", mousemove);
            return () => {
                myCanvasRef.current!.removeEventListener("wheel", mousewheel);
                myCanvasRef.current!.removeEventListener("mousedown", mousedown);
                myCanvasRef.current!.removeEventListener("mousemove", mousemove);
            };
        } else {
            myCanvasRef.current!.addEventListener("click", plumCanvasClick);
            return () => myCanvasRef.current!.removeEventListener("click", plumCanvasClick);
        }
    }, [scale, pageSlicePos, plum]);

    /**
     * 绘制网格
     * @param scaleVal 缩放倍数
     * @param scaleVal 缩放倍数
     */
    const drawLineGrid = (scaleVal = scale) => {
        // console.log("x, y", x, y);

        /*获取绘图工具*/
        var ctx = ctxVal || myCanvasRef.current!.getContext("2d");
        setCtxVal(ctx);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        // 设置网格大小
        var girdSize = CoordinateSystem.GRID_SIZE * scaleVal;

        // 获取Canvas的width、height
        var CanvasWidth = myCanvasRef.current!.width;
        var CanvasHeight = myCanvasRef.current!.height;

        // 在 pageSlicePos 的 x，y 点位画一个 10 * 10 的红色标记用来表示当前页面的 0 0 坐标
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#002766";
        ctx.fillRect(pageSlicePos.x - 5, pageSlicePos.y - 5, 10, 10); // 效果图红色小方块

        const canvasXHeight = CanvasHeight - pageSlicePos.y;
        const canvasYWidth = CanvasWidth - pageSlicePos.x;
        // 从 pageSlicePos.y 处开始往 Y 轴正方向画 X 轴网格
        const xPageSliceTotal = Math.ceil(canvasXHeight / girdSize);

        for (let i = 0; i < xPageSliceTotal; i++) {
            ctx.beginPath(); // 开启路径，设置不同的样式
            ctx.moveTo(0, pageSlicePos.y + girdSize * i);
            ctx.lineTo(CanvasWidth, pageSlicePos.y + girdSize * i);
            ctx.strokeStyle = i === 0 ? ZERO_COLOR : i % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR; // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke();
        }

        // 从 pageSlicePos.y 处开始往 Y 轴负方向画 X 轴网格
        const xRemaining = pageSlicePos.y;
        const xRemainingTotal = Math.ceil(xRemaining / girdSize);
        for (let i = 0; i < xRemainingTotal; i++) {
            if (i === 0) continue;
            ctx.beginPath(); // 开启路径，设置不同的样式
            ctx.moveTo(0, pageSlicePos.y - girdSize * i - 0.5); // -0.5是为了解决像素模糊问题
            ctx.lineTo(CanvasWidth, pageSlicePos.y - girdSize * i);
            ctx.strokeStyle = i === 0 ? ZERO_COLOR : i % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR; // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke();
        }

        // 从 pageSlicePos.x 处开始往 X 轴正方向画 Y 轴网格
        const yPageSliceTotal = Math.ceil(canvasYWidth / girdSize); // 计算需要绘画y轴的条数
        for (let j = 0; j < yPageSliceTotal; j++) {
            ctx.beginPath(); // 开启路径，设置不同的样式
            ctx.moveTo(pageSlicePos.x + girdSize * j, 0);
            ctx.lineTo(pageSlicePos.x + girdSize * j, CanvasHeight);
            ctx.strokeStyle = j === 0 ? ZERO_COLOR : j % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR; // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke();
        }

        // 从 pageSlicePos.x 处开始往 X 轴负方向画 Y 轴网格
        const yRemaining = pageSlicePos.x;
        const yRemainingTotal = Math.ceil(yRemaining / girdSize);
        for (let j = 0; j < yRemainingTotal; j++) {
            if (j === 0) continue;
            ctx.beginPath(); // 开启路径，设置不同的样式
            ctx.moveTo(pageSlicePos.x - girdSize * j, 0);
            ctx.lineTo(pageSlicePos.x - girdSize * j, CanvasHeight);
            ctx.strokeStyle = j === 0 ? ZERO_COLOR : j % CoordinateSystem.GRID_SIZE === 0 ? SOLID_COLOR : DASHED_COLOR; // 如果为 0 则用蓝色标记，取余 5 为实线，其余为比较淡的线
            ctx.stroke();
        }
        ctx.restore();

        // 开始绘制 canvasObjRef 中的元素
        // console.log("执行----=");

        let temp;
        for (let item of canvasObjRef.current.objects) {
            switch (item.type) {
                case "TRIANGLE":
                    temp = new Triangle(
                        ctxVal,
                        (scale / item.scale) * item.relative2originX + pageSlicePos.x,
                        (scale / item.scale) * item.relative2originY + pageSlicePos.y,
                        item.relative2originX,
                        item.relative2originY,
                        item.width || undefined,
                        item.height || undefined,
                        item.fillColor || undefined,
                        scale
                    );
                    // console.log("temp", temp);
                    temp.draw();

                    break;
                default:
                    break;
            }
        }
    };

    /**
     * 点击缩放，设置缩放倍数
     * @param {Boolean} type 放大(true)或者缩小(false)
     */
    const clickScale = (type: boolean) => {
        let scaleVal = type ? scale + CoordinateSystem.SCALE_ABILITY : scale - CoordinateSystem.SCALE_ABILITY;
        if (scale <= CoordinateSystem.MIN_SCALESIZE) {
            scaleVal = scale + CoordinateSystem.SCALE_ABILITY;
            message.warning("已经最小缩放了~");
        }
        if (scale >= CoordinateSystem.MAX_SCALESIZE) {
            scaleVal = scale - CoordinateSystem.SCALE_ABILITY;
            message.warning("已经最大缩放了~");
        }
        setScale(scaleVal);
        // // 把一个范围内的所有的像素都设置为透明的以达到 擦除一个矩形区域的目的
        // ctxVal.clearRect(0, 0, ctxVal.canvas.width, ctxVal.canvas.height)
        drawLineGrid(scaleVal);
    };

    /**
     * 滚轮滚动事件,重绘网格
     * @param e
     * @returns
     */
    const mousewheel = (e: any) => {
        // console.log(e.offsetX, e.offsetY);

        e.preventDefault();
        // 放大
        if (e.wheelDelta > 0) {
            if (scale + CoordinateSystem.SCALE_ABILITY >= CoordinateSystem.MAX_SCALESIZE) {
                setCtxVal(CoordinateSystem.MAX_SCALESIZE);
                drawLineGrid();
                return;
            } else {
                setScale(c => c + CoordinateSystem.SCALE_ABILITY);
            }
        } else {
            if (scale - CoordinateSystem.SCALE_ABILITY <= CoordinateSystem.MIN_SCALESIZE) {
                setCtxVal(CoordinateSystem.MIN_SCALESIZE);
                drawLineGrid();
                return;
            } else {
                setScale(c => c - CoordinateSystem.SCALE_ABILITY);
            }
        }
        back2center(e.offsetX, e.offsetY);
    };

    function back2center(x: number, y: number) {
        const different = scale * CoordinateSystem.GRID_SIZE - lastPos.scale;

        const { x: posX, y: posY } = pageSlicePos;

        setPageSlicePos({
            x: posX - ((x - lastPos.x) / lastPos.scale) * different,
            y: posY - ((y - lastPos.y) / lastPos.scale) * different,
        });

        lastPos.scale = scale * CoordinateSystem.GRID_SIZE;
        lastPos.x = pageSlicePos.x;
        lastPos.y = pageSlicePos.y;
    }

    /**
     * 监听点击事件
     */
    const mousedown = (e: any) => {
        document.dispatchEvent(new CustomEvent(MyEvent.POINT_DOWN, { detail: e }));
    };

    /**
     * @description 监听鼠标移事件
     */
    const mousemove = (e: any) => {
        // console.log(e);
    };

    /**
     * 拖动 canvas 动态渲染，拖动时，动态设置 pageSlicePos 的值
     * @param e Event
     */
    const mouseDown = (e: any) => {
        const downX = e.clientX;
        const downY = e.clientY;
        const { x, y } = pageSlicePos;

        lastPos.x = x;
        lastPos.y = y;

        // var myCanvas: any = document.querySelector("#myCanvas")
        myCanvasRef.current!.onmousemove = (ev: any) => {
            const moveX = ev.clientX;
            const moveY = ev.clientY;
            setPageSlicePos({
                x: x + (moveX - downX),
                y: y + (moveY - downY),
            });
            // 使用 drawLineGrid 直接重新绘制 代替 useState 驱动页面更新
            // drawLineGrid(undefined, x + (moveX - downX), y + (moveY - downY));

            myCanvasRef.current!.onmouseup = (en: any) => {
                myCanvasRef.current!.onmousemove = null;
                myCanvasRef.current!.onmouseup = null;
            };
        };
        myCanvasRef.current!.onmouseup = (en: any) => {
            myCanvasRef.current!.onmousemove = null;
            myCanvasRef.current!.onmouseup = null;
        };
    };

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
                setPageSlicePos({ x: e.x, y: e.y });
            }
        );
    };
    const throttleBack2Initial = useThrottle(back2Initial, 1000);

    /**
     * 工具函数
     * @description 画线
     */
    function lineTo(p1: Point, p2: Point) {
        const ctx = myCanvasRef.current!.getContext("2d")!;
        ctx.strokeStyle = "#00000080";
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    /**
     * @description 根据角度和长度确定终点坐标
     */
    function getEndPoint(b: Branch) {
        return {
            x: b.start.x + b.length * Math.cos(b.theta),
            y: b.start.y + b.length * Math.sin(b.theta),
        };
    }

    /**
     * 工具函数
     * @description 画出分支
     */
    function drawBranch(b: Branch) {
        lineTo(b.start, getEndPoint(b));
    }

    /**
     * @description 随机生长
     * @param {number} depth 至少要掉几次递归，防止画出来的枝树太少
     */
    function step(b: Branch, depth = 0) {
        if (depth > 20) return;
        drawBranch(b);
        const end = getEndPoint(b);

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
            );
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
            );
        }
    }

    /**
     * @descroption requestAnimationFrame 中每一帧要做的事
     */
    function frame() {
        const tasks = [...PENDING_TASKS];
        PENDING_TASKS.length = 0;
        tasks.forEach(fn => fn());
    }

    /**
     * @description 播放动画
     */
    function startFrame() {
        requestAnimationFrame(() => {
            FRAME_COUNTS++;
            if (FRAME_COUNTS % 5 === 0) frame();
            startFrame();
        });
    }

    /**
     * @description 生长梅花动画
     */
    const setPlumBlossom = () => {
        // 测试使用 每掉一次，需要清空函数组件外的数据
        FRAME_COUNTS = 0;
        PENDING_TASKS.length = 0;
        setPlum(val => !val);
        const ctx = ctxVal || myCanvasRef.current!.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    /**
     * @description 根据点击的坐标计算出离哪一个便距离最短
     */
    function getMiniDistancePoint(x: number, y: number): TempType {
        const orderArr: TempType[] = [];
        ["top", "bottom", "left", "right"].forEach(item => {
            switch (item) {
                case "top":
                    orderArr.push({ position: item, val: y, startPoint: { x, y: 0 } });
                    break;
                case "bottom":
                    orderArr.push({
                        position: item,
                        val: CANVAS_HEIGHT - y,
                        startPoint: { x, y: CANVAS_HEIGHT },
                    });
                    break;
                case "left":
                    orderArr.push({ position: item, val: x, startPoint: { x: 0, y } });
                    break;
                case "right":
                    orderArr.push({
                        position: item,
                        val: CANVAS_WIDTH - x,
                        startPoint: { x: CANVAS_WIDTH, y },
                    });
                    break;
                default:
                    break;
            }
        });

        return orderArr.sort((a: TempType, b: TempType) => a.val - b.val)[0];
    }

    /**
     * @description canvas 点击事件
     */
    function plumCanvasClick(e: any) {
        // console.log(e.offsetX, e.offsetY)
        const startPoint = getMiniDistancePoint(e.offsetX, e.offsetY);

        step({
            start: startPoint.startPoint,
            length: 40,
            theta: PlumOrigin[startPoint.position],
        });

        startFrame();
    }

    /**
     * @description 清空画布
     */
    const clearPlumBlossom = () => {
        const ctx = ctxVal || myCanvasRef.current!.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    /**
     * @description 画
     */
    const drawBlock = (type: BlockType) => {
        document.addEventListener(MyEvent.POINT_DOWN, getClickPoint);
        let createBlock;
        function getClickPoint(e: any) {
            switch (type) {
                case BlockType.TRIANGLE:
                    // console.log("点击三角形", e.detail.offsetX, e.detail.offsetY, ctxVal)
                    createBlock = new Triangle(
                        ctxVal,
                        e.detail.offsetX,
                        e.detail.offsetY,
                        e.detail.offsetX - pageSlicePos.x,
                        e.detail.offsetY - pageSlicePos.y,
                        undefined,
                        undefined,
                        undefined,
                        scale
                    );

                    canvasObjRef.current?.objects.push(createBlock.retCanvasObj);
                    // console.log("createBlock", createBlock, canvasObjRef.current);
                    createBlock.draw();
                    document.removeEventListener(MyEvent.POINT_DOWN, getClickPoint);
                    break;
                default:
                    break;
            }
        }
    };

    const drawItems: MenuProps["items"] = [
        {
            key: "1",
            label: <span onClick={() => drawBlock(BlockType.TRIANGLE)}>三角形</span>,
        },
        {
            key: "2",
            disabled: true,
            label: "矩形",
        },
        {
            key: "3",
            disabled: true,
            label: "圆形",
        },
    ];

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
    );
};

export default CanvasDemo;
