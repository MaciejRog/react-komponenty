import { memo, useCallback, useEffect, useState } from "react";
import "./CSSAnimation.classes.css";
import { TYPE_CSSANIMATION_PROPS } from "./CSSAnimation.types";
import { INIT_ANIMATION_DATA } from "./CSSAnimation.utils";
import { ANIMATION_PHASE } from "../Animation.utils";

const CSSAnimation = memo(function CSSAnimation(
  props: TYPE_CSSANIMATION_PROPS
) {
  const { show: componentShow = true, children } = props;

  const [animationPhase, setAnimationPhase] = useState(ANIMATION_PHASE.ENTER);
  const [show, setShow] = useState(false);

  const animationName =
    props?.[animationPhase as keyof TYPE_CSSANIMATION_PROPS]?.animationName ??
    INIT_ANIMATION_DATA?.animationName;
  const duration =
    props?.[animationPhase as keyof TYPE_CSSANIMATION_PROPS]?.duration ??
    INIT_ANIMATION_DATA?.duration;
  const otherClasses =
    props?.[animationPhase as keyof TYPE_CSSANIMATION_PROPS]?.otherClasses ??
    INIT_ANIMATION_DATA?.otherClasses;
  const isInfinite =
    props?.[animationPhase as keyof TYPE_CSSANIMATION_PROPS]?.isInfinite ??
    INIT_ANIMATION_DATA?.isInfinite;

  const handleAnimationEnd = useCallback(() => {
    switch (animationPhase) {
      case ANIMATION_PHASE.ENTER:
        setAnimationPhase(ANIMATION_PHASE.LOADED);
        break;
      case ANIMATION_PHASE.EXIT:
        setShow(false);
        break;
      default:
        break;
    }
  }, [animationPhase]);

  useEffect(() => {
    const temp = componentShow;

    if (temp === true) {
      setShow(true);
      setAnimationPhase(ANIMATION_PHASE.ENTER);
    }
    return () => {
      if (temp === true) {
        setAnimationPhase(ANIMATION_PHASE.EXIT);
      }
    };
  }, [componentShow]);

  useEffect(() => {
    if (duration === 0) {
      handleAnimationEnd();
    }
  }, [animationPhase, duration, handleAnimationEnd]);

  return (
    <>
      {show ? (
        <div
          style={{
            animationDuration: `${duration}ms`,
            animationFillMode: "forwards",
            transition: `${duration}ms all linear`,
            animationIterationCount: isInfinite ? "infinite" : "unset",
          }}
          onAnimationEnd={handleAnimationEnd}
          className={`${animationPhase} ${otherClasses} ${animationName}`}
        >
          {children}
        </div>
      ) : null}
    </>
  );
});

export default CSSAnimation;
