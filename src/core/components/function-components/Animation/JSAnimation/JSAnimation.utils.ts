import { TYPE_JS_ANIMATE_FUN } from "./JSAnimation.types";

export function animate(args: TYPE_JS_ANIMATE_FUN) {
  const { timingFun, drawFun, afterAnimationFun, duration } = args;
  const startTime = performance.now();
  let animationId = -1;

  animationId = requestAnimationFrame(function animate(time) {
    let timeFraction = (time - startTime) / duration;
    if (timeFraction > 1) {
      timeFraction = 1;
    }
    let progress = timingFun(timeFraction);

    drawFun(progress, animationId);

    if (timeFraction < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      if (afterAnimationFun) {
        afterAnimationFun();
      }
    }
  });
}

export function timingLinear(timeFraction: number) {
  return timeFraction;
}
