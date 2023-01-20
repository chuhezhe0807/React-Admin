import Block from "./class/block";
import { BlockInfo } from '../interface'

class Triangle extends Block {

  // 返回用于存储到 canvasObjRef 中的数据
  get retCanvasObj(): BlockInfo {
    return {
      type: 'TRIANGLE',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fillColor: this.fillColor,
    }
  }

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number = 100, height: number = 100, fillColor: string = '#4472c4') {
    super(x, y, width, height, ctx)
    this.name = 'triangle'
    this.class = 'Triangle'
    this.zIndex = 1
    this.fillColor = fillColor
  }

  draw() {
    let ctx = this.ctx;
    const { x, y, width } = this;
    ctx.save(); // save() 通过将当前状态放入栈中，保存 canvas 全部状态的方法。

    const { leftBottom, rightBottom } = this.getCoordinate()
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(leftBottom.x, leftBottom.y);
    ctx.lineTo(rightBottom.x, rightBottom.y);
    ctx.closePath(); // 闭合
    ctx.fillStyle = this.fillColor; // 先选择颜色
    ctx.fill(); // 再填充
    ctx.restore(); // 通过在绘图状态栈中弹出顶端的状态(需要调用 save() 方法)，将 canvas 恢复到最近的保存状态的方法。
    this.setFocusStyle();
    // this.setControPoint(); TODO
    this.isDragged = false;
    // this.update(); TODO
  }
}

export default Triangle
