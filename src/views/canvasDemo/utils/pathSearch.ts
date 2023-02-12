import { IPoint } from "../interface";
import gsap from 'gsap'

// 自动寻路需要用到的
interface NearNode {
    x: number,  // 坐标,以网格为单元的值
    y: number,
    parent?: NearNode,
    g: number,  // 当前点与附近点的距离,写死
    h: number,  // 当前点与终点水平垂直方向距离之和
    f: number // g+h之和
}

interface NearNodeObj {
    [key: string]: any
}

class PathSearch {

    originNode: NearNode;  // 起点
    targetNode: IPoint;  // 终点
    openList: Record<string, NearNode | null>; // 开放列表 当前步骤能够到达的或者退回到某步骤可以到达的节点列表
    closeList: Record<string, NearNode | null>;  // 封闭列表 已经走过的节点集合
    rightAngle: boolean; // 是否仅支持四个方向移动
    obstacleArr: IPoint[]; // 障碍物数组
    step: number;  // 跑步
    onComplete: Function | null;
    result: any[];

    constructor(originNode: NearNode, targetNode: IPoint, rightAngle: boolean = false) {
        this.openList = {};
        this.closeList = {};
        this.originNode = originNode;
        this.targetNode = targetNode;
        this.step = 0;
        this.onComplete = null;
        this.rightAngle = rightAngle;
        this.obstacleArr = [
            { x: 10, y: 6 },
            { x: 10, y: 7 },
            { x: 10, y: 8 },
            { x: 10, y: 9 },
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            // { x: 19, y: 8 },
            // { x: 18, y: 8 },
            // { x: 18, y: 9 },
            // { x: 9, y: 11 },

            // 改变 父元素指向
            { x: 20, y: 9 },
            { x: 20, y: 10 },
            { x: 20, y: 8 },
            { x: 19, y: 8 },
            { x: 18, y: 8 },
            { x: 17, y: 8 },
            { x: 17, y: 9 },
            { x: 17, y: 10 },
        ]

        this.result = []

        // 将起点加入到开放列表
        this.openList[`${originNode.x},${originNode.y}`] = originNode
    }

    /**
     * @description 搜索 直到找到终点
     * @param {NearNode} node 按照某个点为基准开始搜索
     * @param {Function} cb 搜索到终点后调用的回调
    */
    search(node: NearNode, cb: Function) {
        // 如果当前节点即结束节点，则说明找到终点
        if (node.x === this.targetNode.x && node.y === this.targetNode.y) {
            this.result = this.getBackPath(node);
            cb && cb(this.result)
        } else {
            // 找到当前步骤四周可用的节点（排除障碍物和处在封闭列表中的）
            const aroundNode = this.getAround(node);
            // console.log('aroundNode', aroundNode);


            // 将四周有用的节点添加到开启列表
            for (let i = 0; i < aroundNode.length; i++) {
                const item = aroundNode[i];

                // 如果网格不存在开启列表，则加入到开启列表并把选中的新方格作为父节点及计算其g、f、h值
                if (!this.openList[`${item.x},${item.y}`]) {
                    this.openList[`${item.x},${item.y}`] = item;
                    item.parent = node;
                    item.g = this.retG(item, node);
                    item.h = this.retH(item, this.targetNode);
                    item.f = this.retF(item);
                } else {
                    // 如果已经在开启列表里了，则检查该条路径是否会更好
                    // 检查新的路径g值是否会更低，如果更低则把该相邻方格的你节点改为目前选中的方格并重新计算其g、f、h
                    const oldG = item.g,
                        newG = this.retG(item, node);
                    if (newG < oldG) {
                        item.parent = node;
                        item.g = newG;
                        item.f = this.retF(item);
                    };
                }
            }

            // 从开启列表中删除点A并加入到关闭列表
            delete this.openList[`${node.x},${node.y}`];
            this.closeList[`${node.x},${node.y}`] = node;

            // 从开启列表中寻找最小的F值的项目，并将其加入到关闭列表
            let minItem = this.getOpenListMin();

            if (minItem) {
                this.search(minItem, cb);
            };
        }
    }

    // 获取当前节点附近的6个点,分别是 左, 上, 右, 下, 左上, 右上, 右下, 左下
    getAround(originNode: NearNode): NearNode[] {
        let result: NearNode[] = [];
        const obj: NearNodeObj = {
            l: {
                x: originNode.x - 1,
                y: originNode.y,
                g: 1,
                h: 0,
                f: 0,
            },
            lt: {
                x: originNode.x - 1,
                y: originNode.y - 1,
                g: 1.4,
                h: 0,
                f: 0,
            },
            t: {
                x: originNode.x,
                y: originNode.y - 1,
                g: 1,
                h: 0,
                f: 0,
            },
            rt: {
                x: originNode.x + 1,
                y: originNode.y + 1,
                g: 1.4,
                h: 0,
                f: 0,
            },
            r: {
                x: originNode.x + 1,
                y: originNode.y,
                g: 1,
                h: 0,
                f: 0,
            },
            rb: {
                x: originNode.x + 1,
                y: originNode.y - 1,
                g: 1.4,
                h: 0,
                f: 0,
            },
            b: {
                x: originNode.x,
                y: originNode.y + 1,
                g: 1,
                h: 0,
                f: 0,
            },
            lb: {
                x: originNode.x - 1,
                y: originNode.y - 1,
                g: 1.4,
                h: 0,
                f: 0,
            },
        }

        // 判断相邻节点是否在障碍物数组中
        const isObstacleValid = (node: NearNode, obstacleArr: IPoint[]) => {
            // console.log('isObstacleValid', node, obstacleArr);
            let block: IPoint;
            for (let index = 0; index < obstacleArr.length; index++) {
                block = obstacleArr[index];
                if (block.x == node.x && block.y == node.y) {
                    return true;
                }
            }
            return false;
        }

        // 如果是直角则删除交叉格式忽略
        if (this.rightAngle) {
            delete obj.lt;
            delete obj.rt;
            delete obj.rb;
            delete obj.lb;
        } else {
            // 如果左边有障碍物，则左上、左下忽略
            if (isObstacleValid(obj.l, this.obstacleArr)) {
                delete obj.lt;
                delete obj.lb;
                // delete obj.l;
            };
            // 如果右边有障碍物，则右上、右下忽略
            if (isObstacleValid(obj.r, this.obstacleArr)) {
                delete obj.rt;
                delete obj.rb;
                // delete obj.r;
            };
            // 如果顶上有障碍物，则左上，右则忽略
            if (isObstacleValid(obj.t, this.obstacleArr)) {
                delete obj.lt;
                delete obj.rt;
                // delete obj.t;
            };
            // 如果底部有障碍物，则左下，右下忽略
            if (isObstacleValid(obj.b, this.obstacleArr)) {
                delete obj.lb;
                delete obj.rb;
                // delete obj.b;
            };
        };

        // 排除已经在closeList中的和障碍物
        for (let key in obj) {
            const item = obj[key];
            if (!this.closeList[`${item.x},${item.y}`] && !isObstacleValid(item, this.obstacleArr)) {
                result.push(item)
            }
        }

        return result;
    }

    /**
     * 搜索到终点后，根据终点返回最终路径
    */
    getBackPath(targetNode: NearNode): IPoint[] {
        let result: IPoint[] = [targetNode];
        let eachBack: Function;
        (eachBack = (node: NearNode) => {
            if (node.parent) {
                result.unshift({ x: node.x, y: node.y });
                eachBack(node.parent)
            }
        })(targetNode)

        return result;
    }

    /**
     * 获取打开列表中，f值最小的索引值的项
     * @return {object|undefined} 返回打开列表中，f值最小的索引值
     */
    getOpenListMin(): NearNode | null {
        // console.log('this.open', this.openList);


        let tempArr: NearNode[] = [];

        for (let key in this.openList) {
            tempArr.push(this.openList[key]!)
        }

        let minFNode: NearNode = tempArr[0];
        tempArr.forEach((item: NearNode) => {
            if (item.f < minFNode.f) {
                minFNode = item
            }
        })

        // console.log('minNode', minFNode);

        return minFNode;
    }

    /**
     * 得到当前节点的权重
     * @param {array} node <必填> 需要计算的节点
     */
    retF(node: NearNode): number {
        return node.g + node.h;
    }

    /**
     * 从start到指定网络的移动成本（垂直、水平返回10，斜角返回14）
     * @param  {array} node <必填>，子起点位置（[x,y]）
     * @param  {array} parent <必填>，父起点位置（[x,y]）
     * @return {number} 移动成本
     */
    retG(node: NearNode, parent: NearNode): number {
        return node.g + parent.g
    }

    /**
     * 获取至目标点的估计移动成本（使用曼哈顿方法获取）
     * @param {array} 起始位置，x:number,y:number
     * @param {array} 结束位置，x:number,y:number
     * @return {number} 估计移动成本(曼哈顿值)
     */
    retH(start: NearNode, end: IPoint = this.targetNode): number {
        return (Math.abs(end.x - start.x) + Math.abs(end.y - start.y));
    }

    /**
     * @description 利用 gsap.to 实现自动寻路动画效果
    */
    run2Target(originBlock: IPoint, setStateFn: Function) {
        // console.log('setStateFn', setStateFn);

        // const size = CoordinateSystem.GRID_SIZE * CoordinateSystem.NATIVE_SCALE
        let pos = {
            x: this.result[this.step].x,
            y: this.result[this.step].y
        }
        let that = this;
        if (that.step > that.result.length - 2) {
            that.onComplete && that.onComplete()
        }

        gsap.to(originBlock, {
            duration: .35,
            x: pos.x,
            y: pos.y,
            onUpdate() {
                // setStateFn && setStateFn({ x: pos.x, y: pos.y })
            },
            onComplete() {
                setStateFn && setStateFn({ x: pos.x, y: pos.y })
                that.step++;
                if (that.step <= that.result.length - 1) {
                    that.run2Target(originBlock, setStateFn);
                }
            }
        })

    }
}

export default PathSearch;