import { TYPE_CSSANIMATION_ANIMATION_DATA } from "./CSSAnimation.types";

export const INIT_ANIMATION_DATA: TYPE_CSSANIMATION_ANIMATION_DATA = {
  animationName: "",
  otherClasses: "",
  duration: 0,
  isInfinite: false,
};

export const ANIMATION_PHASE = {
  ENTER: "onEnter",
  LOADED: "afterLoaded",
  EXIT: "onExit",
};
