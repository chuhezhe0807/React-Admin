import Node from "./node";
import { getUuid } from "../utils";
import { IPoint } from "../interface";
import { BlockType, CoordinateSystem } from "../Constants";
import { BlockInfo } from "../interface";

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
    relative2originX: number; // 创建元素时，相对于 网格系统原点 的坐标
    relative2originY: number; // 创建元素时，相对于 网格系统原点 的坐标
    width: number; // 宽度
    height: number; // 高度
    ctx: CanvasRenderingContext2D; // canvas 2d渲染上下文
    padding: number; // 边框与物体的padding
    rotatingPointOffset: number; // 是旋转控制点到边框的距离
    controlPointsArr: IPoint[][]; // 控制点坐标数组（9个点 36个坐标）
    rotateDeg: number; // 元素旋转的角度


    // 节点状态
    isSelected: boolean;
    isDragged: boolean; // 是否正在拖拽中
    isPointIn: boolean; //鼠标是否悬浮在元素上

    // 节点事件
    mouseOn: Function | null; // 如果有，鼠标悬浮后就会被调用
    mouseDown: Function | null; // 如果有，鼠标点击后就会被调用
    mouseLeave: Function | null; // 如果有，鼠标离开后就会被调用
    fisrtTouch: Function | null; // 碰撞触发事件
    touching: Function | null; // 碰撞触发事件

    // 返回9个控制点的坐标（9个点 36个坐标）
    get getControlPointsArr() {
        return this.controlPointsArr
    }

    // 设置选中，用于监听事件
    set setSelected(value: boolean) {
        this.isSelected = value
    }

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
        this.padding = 10
        this.rotatingPointOffset = 30
        this.controlPointsArr = [];
        this.rotateDeg = 0;

        this.isDragged = false;
        this.isPointIn = false;
        this.isSelected = false;

        this.mouseOn = null;
        this.mouseLeave = null;
        this.mouseDown = null;
        this.fisrtTouch = null;
        this.touching = null;
    }

    /**
     * @description 返回缩放后的坐标，宽高
     */
    retAfterZoom() { }

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
     * @description 根据元素的类型返回元素实际的顶点坐标的坐标
    */
    retCoordinate(): IPoint[] {
        switch (this.class.toUpperCase()) {
            case "TRIANGLE":
                let top: IPoint = {
                    x: (this.x + this.width / 2) | 0,
                    y: (this.y) | 0
                };
                let left: IPoint = {
                    x: (this.x) | 0,
                    y: (this.y + this.height) | 0
                };
                let right: IPoint = {
                    x: (this.x + this.width) | 0,
                    y: (this.y + this.height) | 0
                };
                return [top, right, left];
            // 计算鼠标是否在圆中确实不精准，使用上下左右四个点代替 23/2/5
            case "CIRCLE": case 'RECT':
                let cLeftTop: IPoint = {
                    x: (this.x) | 0,
                    y: this.y | 0,
                };
                let cRightTop: IPoint = {
                    x: (this.x + this.width) | 0,
                    y: (this.y) | 0,
                };
                let cRightBottom: IPoint = {
                    x: (this.x + this.width) | 0,
                    y: (this.y + this.height) | 0,
                };
                let cLeftBottom: IPoint = {
                    x: (this.x) | 0,
                    y: (this.y + this.height) | 0,
                }
                return [cLeftTop, cRightTop, cRightBottom, cLeftBottom];
            default:
                return [];
        }
    }

    /**
     * @description 设置选中样式
     * @param {number} scale 当前的缩放比例
     */
    setFocusStyle(scale: number) {
        let ctx = this.ctx;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.isDragged ? 'rgba(0, 0, 0, 0.5)' : 'rgb(0, 0, 0)';
        ctx.stroke(); // 绘制路径
        ctx.restore();

        // 绘制边框和绘制控制点
        this.drawBorders(scale)
    }

    /**
     * @description 绘制物体边框和控制点
     * @param {number} scale 当前的缩放比例
    */
    drawBorders(scale: number) {
        const padding = this.padding; // 边框和物体的内间距，也是个配置项，和 css 中的 padding 一个意思
        const _x = this.x;
        const _y = this.y;
        const _width = this.width;
        const _height = this.height;
        const _scale = this.scale;

        const ctx = this.ctx;
        ctx.save();

        // ctx.globalAlpha = this.isMoving ? 0.5 : 1; // 物体变换的时候使其透明度减半，提升用户体验
        ctx.strokeStyle = '#409eff';
        ctx.lineWidth = 2;

        // console.log(this.x, this.y, this.width, this.height, this.scale, scale);

        const borderX = _x - padding;
        const borderY = _y - padding;
        const borderWidth = (_width * scale) / _scale + padding * 2;
        const borderHeight = (_height * scale) / _scale + padding * 2;
        ctx.strokeRect(borderX, borderY, borderWidth, borderHeight)


        // 绘制控制点
        // 上控制点
        ctx.strokeRect(borderX + borderWidth / 2 - 5, borderY - 5, 10, 10);
        const _topX = borderX + borderWidth / 2 - 5;
        const _topY = borderY - 5;
        const top: IPoint[] = [
            {
                x: _topX,
                y: _topY
            },
            {
                x: _topX + 10,
                y: _topY
            },
            {
                x: _topX + 10,
                y: _topY + 10
            },
            {
                x: _topX,
                y: _topY + 10
            },
        ]
        // 右控制点
        ctx.strokeRect(borderX + borderWidth - 5, borderY + borderHeight / 2 - 5, 10, 10);
        const _rightX = borderX + borderWidth - 5;
        const _rightY = borderY + borderHeight / 2 - 5;
        const right: IPoint[] = [
            {
                x: _rightX,
                y: _rightY
            },
            {
                x: _rightX + 10,
                y: _rightY
            },
            {
                x: _rightX + 10,
                y: _rightY + 10
            },
            {
                x: _rightX,
                y: _rightY + 10
            },
        ]
        // 下控制点
        ctx.strokeRect(borderX + borderWidth / 2 - 5, borderY + borderHeight - 5, 10, 10);
        const _bottomX = borderX + borderWidth / 2 - 5;
        const _bottomY = borderY + borderHeight - 5;
        const bottom: IPoint[] = [
            {
                x: _bottomX,
                y: _bottomY
            },
            {
                x: _bottomX + 10,
                y: _bottomY
            },
            {
                x: _bottomX + 10,
                y: _bottomY + 10
            },
            {
                x: _bottomX,
                y: _bottomY + 10
            },
        ]
        // 左控制点
        ctx.strokeRect(borderX - 5, borderY + borderHeight / 2 - 5, 10, 10);
        const _leftX = borderX - 5;
        const _leftY = borderY + borderHeight / 2 - 5;
        const left: IPoint[] = [
            {
                x: _leftX,
                y: _leftY
            },
            {
                x: _leftX + 10,
                y: _leftY
            },
            {
                x: _leftX + 10,
                y: _leftY + 10
            },
            {
                x: _leftX,
                y: _leftY + 10
            },
        ]
        // 上右控制点
        ctx.strokeRect(borderX + borderWidth - 5, borderY - 5, 10, 10);
        const _topRightX = borderX + borderWidth - 5;
        const _topRightY = borderY - 5;
        const topRight: IPoint[] = [
            {
                x: _topRightX,
                y: _topRightY
            },
            {
                x: _topRightX + 10,
                y: _topRightY
            },
            {
                x: _topRightX + 10,
                y: _topRightY + 10
            },
            {
                x: _topRightX,
                y: _topRightY + 10
            },
        ]
        // 下右控制点
        ctx.strokeRect(borderX + borderWidth - 5, borderY + borderHeight - 5, 10, 10);
        const _bottomRightX = borderX + borderWidth - 5;
        const _bottomRightY = borderY + borderHeight - 5;
        const bottomRight: IPoint[] = [
            {
                x: _bottomRightX,
                y: _bottomRightY
            },
            {
                x: _bottomRightX + 10,
                y: _bottomRightY
            },
            {
                x: _bottomRightX + 10,
                y: _bottomRightY + 10
            },
            {
                x: _bottomRightX,
                y: _bottomRightY + 10
            },
        ]
        // 下左控制点
        ctx.strokeRect(borderX - 5, borderY + borderHeight - 5, 10, 10);
        const _bottomLeftX = borderX - 5;
        const _bottomLeftY = borderY + borderHeight - 5;
        const bottomLeft: IPoint[] = [
            {
                x: _bottomLeftX,
                y: _bottomLeftY
            },
            {
                x: _bottomLeftX + 10,
                y: _bottomLeftY
            },
            {
                x: _bottomLeftX + 10,
                y: _bottomLeftY + 10
            },
            {
                x: _bottomLeftX,
                y: _bottomLeftY + 10
            },
        ]
        // 上左控制点
        ctx.strokeRect(borderX - 5, borderY - 5, 10, 10);
        const _topLeftX = borderX - 5;
        const _topLeftY = borderY - 5;
        const topLeft: IPoint[] = [
            {
                x: _topLeftX,
                y: _topLeftY
            },
            {
                x: _topLeftX + 10,
                y: _topLeftY
            },
            {
                x: _topLeftX + 10,
                y: _topLeftY + 10
            },
            {
                x: _topLeftX,
                y: _topLeftY + 10
            },
        ]


        // 旋转控制点
        const _rotateX = borderX + borderWidth / 2 - 5;
        const _rotateY = borderY - 40 - 5;
        const rotate: IPoint[] = [
            {
                x: _rotateX,
                y: _rotateY
            },
            {
                x: _rotateX + 10,
                y: _rotateY
            },
            {
                x: _rotateX + 10,
                y: _rotateY + 10
            },
            {
                x: _rotateX,
                y: _rotateY + 10
            },
        ]


        ctx.beginPath();
        ctx.moveTo(borderX + borderWidth / 2, borderY);
        ctx.lineTo(borderX + borderWidth / 2, borderY - 40);
        ctx.stroke();
        ctx.strokeRect(borderX + borderWidth / 2 - 5, borderY - 40 - 5, 10, 10)

        ctx.restore();

        // 绘制控制点的同时存储起来
        // this.controlPointsArr = [rotate, topLeft, bottomLeft, bottomRight, topRight, top, right, bottom, left]
        this.controlPointsArr = [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft, rotate]
    }

    /**
     * @description 设置元素的旋转
     * 
    */
    setRotateDeg() {
        // console.log('setRotateDeg', this.rotateDeg);


        const _x = this.x;
        const _y = this.y;
        const _width = this.width;
        const _height = this.height;
        const ctx = this.ctx;
        ctx.save()
        ctx.translate(_x + _width / 2, _y + _height / 2)
        ctx.rotate((this.rotateDeg * Math.PI) / 180)
        ctx.restore()
    }

    /**
     * @description 点击元素拖动元素，修改元素相对于 网格系统原点的坐标
     * @param {IPoint} delta 拖动时，鼠标相对于点击的时候的偏移量
     * @param {number} scale 拖动时的缩放比例
    */
    setRelative2origin(delta: IPoint, scale: number) {
        // 将坐标的偏移量换算为创建该元素时的相对于原点的坐标
        this.relative2originX = this.relative2originX + (delta.x * this.scale) / scale;
        this.relative2originY = this.relative2originY + (delta.y * this.scale) / scale;
    }

    /**
     * @description 移除块
     */
    removeBlock() {
        console.log("removeBlock");
    }

    /**
     * @description 判断一个点是否位于某几个点围成的区域内
     * @param {IPoint} point 鼠标相对于画布左上角的坐标
     * @param {IPoint[]} pointArr 当前画布上的所有元素
     */
    isPointInElement(point: IPoint, pointArr: IPoint[]): boolean {
        // 从（0，0）点开始，经过point点到的射线与pointArr中所有点围城的区域的交点个数，若为奇数，则在区域内，否则不在
        let sum = 0;
        // pointArr 中，某两个点所围成的线段的起始坐标
        let d_x1 = 0;
        let d_y1 = 0;
        let d_x2 = 0;
        let d_y2 = 0;
        // 从（0，0）点开始，经过point点到的射线与 pointArr 中，某两个点所围成的线段的交点的x值
        let intersectX: number;

        if (pointArr.length < 3) return false;

        for (let i = 0; i < pointArr.length; i++) {
            // 按顺序取出数组中的两个点，若是最后一个点就与第一个点组合
            if (i === pointArr.length) {
                d_x1 = pointArr[i].x;
                d_y1 = pointArr[i].y;
                d_x2 = pointArr[0].x;
                d_y2 = pointArr[0].y;
            } else {
                d_x1 = pointArr[i].x;
                d_y1 = pointArr[i].y;
                d_x2 = pointArr[i + 1].x;
                d_y2 = pointArr[i + 1].y;
            }

            // 判断 point 点是否在边的两端点的水平平行线之间(可能边的顺序不对，需要判断两次)
            if (((point.y >= d_y1) && (point.y < d_y2)) || ((point.y >= d_y2) && (point.y < d_y1))) {
                // 是否处于边界
                if (Math.abs(d_y1 - d_y2) > 0) {
                    // 得到 point 向左射线与边的交点的x坐标（相对于canvas左上角坐标定位，x、y都是正值）
                    intersectX = d_x1 - ((d_x1 - d_x2) * (d_y1 - point.y)) / (d_y1 - d_y2);

                    // 如果焦点在point左侧
                    if (intersectX < point.x) {
                        sum++;
                    }
                }
            }
        }

        // 交点个数是否为奇数
        if (sum % 2 != 0) {
            return true;
        }
        return false;
    }
}

export default Block;
