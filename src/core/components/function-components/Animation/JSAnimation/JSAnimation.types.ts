export type TYPE_JS_ANIMATE_FUN = {
  timingFun: (time: number) => number;
  drawFun: (time: number, animationId?: number) => void;
  afterAnimationFun?: () => void;
  duration: number;
};
