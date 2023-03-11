import TWEEN from "@tweenjs/tween.js";
import { IPoint } from "../interface";

/**
 * @description @tweenjs/tween.js 缓动效果
*/
var timer: number;
function runAnimate(start: any, end: any, duration: number, fn: Function, cancel: boolean = true) {
    window.cancelAnimationFrame(timer)
    animate();
    var tween = new TWEEN.Tween(start)
        .to(end, duration)
        .onStart(() => { })
        .onUpdate((e: any) => {
            fn && fn(e);
        })
        .onComplete((e: any) => {
            timer && window.cancelAnimationFrame(timer);
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    function animate() {
        timer = requestAnimationFrame(animate);
        TWEEN.update();
    }
}

/**
 * @description 生成唯一id
*/
const getUuid = (): string => {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;    // d是随机种子
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/**
 * @description 判断一个点是否位于某几个点围成的区域内
 * @param {IPoint} point 鼠标相对于画布左上角的坐标
 * @param {IPoint[]} pointArr 当前画布上的所有元素
 */
const isPointInElement = (point: IPoint, pointArr: IPoint[]): boolean => {
    // console.log(point, pointArr);

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
        if (i === pointArr.length - 1) {
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

/**
 * @description 返回旋转 deg 角度后对应形状绘制需要的点的坐标
 * @param {number} deg 旋转的角度（顺时针为正方向）
*/
// getCoor

export {
    runAnimate,
    getUuid,
    isPointInElement
}