import Node from "../node";
import { getUuid } from "../../utils";
import { IPoint } from "../../interface";
import { CoordinateSystem } from "../../Constants";
import { BlockInfo } from "../../interface";

class Block extends Node {
    // 继承自抽象类 Node
    id: string;
    name: string;
    class: string;
    zIndex: number;
    scale: number;

    // 自身属性
    fillColor: string; // 填充色
    x: number; // 创建元素时，相对于canvas左上角的x坐标
    y: number; // 创建元素时，相对于canvas左上角的y坐标
    relative2originX: number; // 创建元素时，pageSlicePos 的坐标
    relative2originY: number; // 创建元素时，pageSlicePos 的坐标
    width: number; // 宽度
    height: number; // 高度
    ctx: CanvasRenderingContext2D; // canvas 2d渲染上下文

    // 节点状态
    isDragged: boolean; // 是否正在拖拽中
    isPointIn: boolean; //鼠标是否悬浮在元素上

    // 节点事件
    mouseOn: Function | null; // 如果有，鼠标悬浮后就会被调用
    mouseDown: Function | null; // 如果有，鼠标点击后就会被调用
    mouseLeave: Function | null; // 如果有，鼠标离开后就会被调用
    fisrtTouch: Function | null; // 碰撞触发事件
    touching: Function | null; // 碰撞触发事件

    constructor(x: number, y: number, relative2originX: number, relative2originY: number, width: number, height: number, ctx: CanvasRenderingContext2D, scale: number, fillColor?: string) {
        super();
        this.id = getUuid();
        this.name = "";
        this.class = "";
        this.zIndex = 0;
        this.scale = scale;

        this.x = x;
        this.y = y;
        this.relative2originX = relative2originX;
        this.relative2originY = relative2originY;
        this.width = width / CoordinateSystem.NATIVE_SCALE;
        this.height = height / CoordinateSystem.NATIVE_SCALE;
        this.ctx = ctx;
        this.fillColor = fillColor || "#4472c4";

        this.isDragged = false;
        this.isPointIn = false;

        this.mouseOn = null;
        this.mouseLeave = null;
        this.mouseDown = null;
        this.fisrtTouch = null;
        this.touching = null;
    }

    /**
     * @description 返回缩放后的坐标，宽高
     */
    retAfterZoom() {}

    /**
     * @description 返回相对坐标原点的坐标
     * @param {IPoint} itemPos    像画布上添加元素时，元素相对于canvas左上角的坐标
     * @param {IPoint} originPos  像画布上添加元素时，原点相对于canvas左上角的坐标
     * @param {Number} scale      当前的缩放比例
     */
    retRelative2Origin(itemPos: IPoint, originPos: IPoint, scale: number): IPoint {
        return {
            x: (itemPos.x - originPos.x) * scale,
            y: (itemPos.y - originPos.y) * scale,
        };
    }

    /**
     * @description 根据起始点和宽高返回左上、右上、右下和左下四个点的相对于canvas左上角的坐标
     * @returns IPoint[]
     */
    getCoordinate(): Record<string, IPoint> {
        const leftTop: IPoint = {
            x: this.x,
            y: this.y,
        };
        const rightTop: IPoint = {
            x: this.x + this.width,
            y: this.y,
        };
        const rightBottom: IPoint = {
            x: this.x + this.width,
            y: this.y + this.height,
        };
        const leftBottom: IPoint = {
            x: this.x,
            y: this.y + this.height,
        };

        return { leftTop, rightTop, rightBottom, leftBottom };
    }

    /**
     * @description 设置焦点高亮
     */
    setFocusStyle() {
        let ctx = this.ctx;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.stroke(); // 绘制路径
        ctx.restore();
    }

    /**
     * @description 移除块
     */
    removeBlock() {
        console.log("removeBlock");
    }

    /**
     * @description 判断鼠标是否位于某个可移动、可变换的元素上
     * @param {BlockInfo[]} canvasObjs 当前画布上的所有元素
     * @param {IPoint} mousePoint 鼠标相对于画布左上角的坐标
     */
    isPointInElement(canvasObjs: BlockInfo[], mousePoint: IPoint) {}
}

export default Block;
