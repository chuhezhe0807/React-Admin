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
    scale: number;
    relative2originX: number;
    relative2originY: number;
    rotateDeg: number;
    id: string;
    isSelected?: boolean;
    isDragged?: boolean;
}

// 存储canvas对象的接口
interface CanvasObj {
    objects: BlockInfo[]
}

// 自动寻路需要用到的
interface NearNode {
    x: number,  // 坐标,以网格为单元的值
    y: number,
    name?: string,
    g?: number,  // 当前点与附近点的距离,写死
    h?: number,  // 当前点与终点水平垂直方向距离之和
    f?: number // g+h之和
}

export {
    type IPoint,
    type BlockInfo,
    type CanvasObj,
    type NearNode
}