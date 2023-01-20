abstract class Node {

  abstract id: string // 唯一id
  abstract name: string // 名称
  abstract class: string // 元素类型

  // 元素基本属性
  abstract zIndex: number // 元素的层级属性
  abstract mouseOn: Function | null;  // 如果有，鼠标悬浮后就会被调用
  abstract mouseDown: Function | null;  // 如果有，鼠标点击后就会被调用
  abstract mouseLeave: Function | null;  // 如果有，鼠标离开后就会被调用

  // 方法
  abstract removeBlock(): void
}

export default Node