import { BlockType } from '../Constants'

// 点坐标
interface IPoint {
  x: number;
  y: number;
}

interface BlockInfo {
  type: keyof typeof BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
}

// 存储canvas对象的接口
interface CanvasObj {
  objects: BlockInfo[]
}

export {
  type IPoint,
  type BlockInfo,
  type CanvasObj
}