import Block from "../block";
import { BlockInfo, IPoint } from '../../interface'
import { BlockType } from "../../Constants";

class Rect extends Block {

    // 返回用于存储到 canvasObjRef 中的数据
    get retCanvasObj(): BlockInfo {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillColor: this.fillColor,
            scale: this.scale,
            relative2originX: this.relative2originX,
            relative2originY: this.relative2originY,
            id: this.id,
            rotateDeg: this.rotateDeg
        }
    }

    // 自有属性
    type: keyof typeof BlockType;
    prevCoordinate: IPoint[]; // 最近一次绘制的三个控制点的坐标

    // 在缩放比例 scale 为1的时候默认的宽高为100 
    constructor(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        relative2originX: number,
        relative2originY: number,
        width: number = 100,
        height: number = 100,
        fillColor: string = '#4472c4',
        scale: number,
        rotateDeg: number = 0
    ) {
        // console.log(scale, width, height);

        if (scale) {
            super(x, y, relative2originX, relative2originY, width * scale, height * scale, ctx, scale)
        } else {
            super(x, y, relative2originX, relative2originY, width, height, ctx, scale)
        }

        this.name = 'rect'
        this.class = 'Rect'
        this.zIndex = 1
        this.fillColor = fillColor
        this.type = "RECT"
        this.prevCoordinate = []
        this.rotateDeg = rotateDeg
    }

    draw() {
        let ctx = this.ctx;
        const { x, y, width, height } = this;
        ctx.save(); // save() 通过将当前状态放入栈中，保存 canvas 全部状态的方法。

        // const { leftBottom, rightBottom } = this.getCoordinate()
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath(); // 闭合
        ctx.fillStyle = this.fillColor; // 先选择颜色
        ctx.globalAlpha = this.isDragged ? 0.5 : 1; // 拖拽时半透明
        ctx.fill(); // 再填充
        ctx.restore(); // 通过在绘图状态栈中弹出顶端的状态(需要调用 save() 方法)，将 canvas 恢复到最近的保存状态的方法。
        // this.setFocusStyle();
        // this.setControPoint(); TODO
        this.setRotateDeg()
        // this.isDragged = false;
        // this.update(); TODO
    }

    // 存储最近一次绘制的三个控制点的坐标
    savePrevCoordinate(points: IPoint[]) {
        this.prevCoordinate = points
    }

    // 绘制控制点
    drawControlPoint() {

    }
}

export default Rect
