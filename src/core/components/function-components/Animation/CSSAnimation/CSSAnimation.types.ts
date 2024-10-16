export type TYPE_CSSANIMATION_PROPS = {
  show?: boolean;
  onEnter?: TYPE_CSSANIMATION_ANIMATION_DATA;
  afterLoaded?: TYPE_CSSANIMATION_ANIMATION_DATA;
  onExit?: TYPE_CSSANIMATION_ANIMATION_DATA;
  children: any;
};

export type TYPE_CSSANIMATION_ANIMATION_DATA = {
  animationName?: string;
  otherClasses?: string;
  duration?: number;
  isInfinite?: boolean;
};
