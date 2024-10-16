import { memo, useEffect, useRef, useState } from "react";
import "./CSSAnimation.classes.css";
import { TYPE_CSSANIMATION_PROPS } from "./CSSAnimation.types";
import { ANIMATION_PHASE, INIT_ANIMATION_DATA } from "./CSSAnimation.utils";

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

  const timeoutEnterRef = useRef<number>(0);
  const timeoutExitRef = useRef<number>(0);

  useEffect(() => {
    const temp = componentShow;
    clearTimeout(timeoutEnterRef.current);

    if (temp === true) {
      clearTimeout(timeoutExitRef.current);
      setShow(true);
      setAnimationPhase(ANIMATION_PHASE.ENTER);
      timeoutEnterRef.current = setTimeout(() => {
        setAnimationPhase(ANIMATION_PHASE.LOADED);
      }, duration);
    }
    return () => {
      if (temp === true) {
        setAnimationPhase(ANIMATION_PHASE.EXIT);
        timeoutExitRef.current = setTimeout(() => {
          setShow(false);
        }, duration);
      }
    };
  }, [componentShow]);

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
          className={`${animationPhase} ${otherClasses} ${animationName}`}
        >
          {children}
        </div>
      ) : null}
    </>
  );
});

export default CSSAnimation;
