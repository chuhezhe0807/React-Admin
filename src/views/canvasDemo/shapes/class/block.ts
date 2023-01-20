import Node from "../node";
import { getUuid } from "../../utils";
import { IPoint } from "../../interface";

class Block extends Node {
  // 继承自抽象类 Node
  id: string
  name: string
  class: string
  zIndex: number

  // 自身属性
  fillColor: string // 填充色
  x: number  // x坐标
  y: number  // y坐标
  width: number  // 宽度
  height: number  // 高度
  ctx: CanvasRenderingContext2D  // canvas 2d渲染上下文

  // 节点状态
  isDragged: boolean // 是否正在拖拽中

  // 节点事件
  mouseOn: Function | null;  // 如果有，鼠标悬浮后就会被调用
  mouseDown: Function | null;  // 如果有，鼠标点击后就会被调用
  mouseLeave: Function | null;  // 如果有，鼠标离开后就会被调用
  fisrtTouch: Function | null;  // 碰撞触发事件
  touching: Function | null;  // 碰撞触发事件

  constructor(x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D, fillColor?: string) {
    super();
    this.id = getUuid();
    this.name = '';
    this.class = '';
    this.zIndex = 0;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.fillColor = fillColor || '#4472c4';

    this.isDragged = false

    this.mouseOn = null;
    this.mouseLeave = null;
    this.mouseDown = null;
    this.fisrtTouch = null;
    this.touching = null;
  }

  /**
   * @description 返回缩放后的坐标，宽高
  */
  retAfterZoom() {

  }

  /**
   * @description 根据起始点和宽高返回左上、右上、右下和左下四个点的相对于canvas左上角的坐标
   * @returns IPoint[]
  */
  getCoordinate(): Record<string, IPoint> {
    const leftTop: IPoint = {
      x: this.x,
      y: this.y
    }
    const rightTop: IPoint = {
      x: this.x + this.width,
      y: this.y
    }
    const rightBottom: IPoint = {
      x: this.x + this.width,
      y: this.y + this.height
    }
    const leftBottom: IPoint = {
      x: this.x,
      y: this.y + this.height
    }

    return { leftTop, rightTop, rightBottom, leftBottom }
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
    console.log('removeBlock');

  }
}

export default Block;