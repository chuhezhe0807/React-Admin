import TWEEN from "@tweenjs/tween.js";

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

export {
  runAnimate,
  getUuid
}