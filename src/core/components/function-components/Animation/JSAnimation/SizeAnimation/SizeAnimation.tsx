import { useEffect, useRef, useState } from "react";
import { timingLinear } from "../JSAnimation.utils";
import { ANIMATION_PHASE } from "../../Animation.utils";

function SizeAnimation(props: {
  show?: boolean;
  overflowVisible?: boolean;
  animateWidth?: boolean;
  animateHeight?: boolean;
  enterDuration: number;
  exitDuration: number;
  children: any;
}) {
  const {
    show: componentShow = true,
    overflowVisible = true,
    animateWidth = true,
    animateHeight = true,
    enterDuration,
    exitDuration,
    children,
  } = props;

  const [animationPhase, setAnimationPhase] = useState(ANIMATION_PHASE.ENTER);
  const [show, setShow] = useState(true);

  const [style, setStyle] = useState({});

  const divRef = useRef<HTMLDivElement | null>(null);
  const heightRef = useRef(0);
  const widthRef = useRef(0);

  const enterAnimRef = useRef<number | undefined>(undefined);
  const exitAnimRef = useRef<number | undefined>(undefined);

  const enterAnim = () => {
    const startTime = performance.now();

    const animate = (time: number) => {
      let timeFraction = (time - startTime) / enterDuration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }
      let progress = timingLinear(timeFraction);

      setStyle((prev) => {
        const newStyles: Record<string, any> = {};
        if (animateWidth) {
          newStyles["width"] = `${widthRef.current * progress}px`;
        }
        if (animateHeight) {
          newStyles["height"] = `${heightRef.current * progress}px`;
        }
        return {
          ...prev,
          ...newStyles,
          // transform: `scale(${progress})`,
        };
      });

      if (timeFraction < 1) {
        enterAnimRef.current = requestAnimationFrame(animate);
      }
    };

    enterAnimRef.current = requestAnimationFrame(animate);
  };

  const exitAnim = () => {
    const startTime = performance.now();

    const animate = (time: number) => {
      let timeFraction = (time - startTime) / exitDuration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }
      let progress = timingLinear(timeFraction);

      setStyle((prev) => {
        const newStyles: Record<string, any> = {};
        if (animateWidth) {
          newStyles["width"] = `${
            widthRef.current - widthRef.current * progress
          }px`;
        }
        if (animateHeight) {
          newStyles["height"] = `${
            widthRef.current - widthRef.current * progress
          }px`;
        }
        return {
          ...prev,
          ...newStyles,
          // transform: `scale(${progress})`,
        };
      });

      if (timeFraction < 1) {
        exitAnimRef.current = requestAnimationFrame(animate);
      } else {
        setShow(false);
      }
    };

    exitAnimRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (divRef.current) {
      widthRef.current = divRef.current.getBoundingClientRect().width;
      heightRef.current = divRef.current.getBoundingClientRect().height;
    }
  }, []);

  useEffect(() => {
    const temp = componentShow;
    if (temp === true) {
      setShow(true);
      setAnimationPhase(ANIMATION_PHASE.ENTER);
    }
    return () => {
      // if (temp === true) {
      setAnimationPhase(ANIMATION_PHASE.EXIT);
      // }
    };
  }, [componentShow]);

  useEffect(() => {
    switch (animationPhase) {
      case ANIMATION_PHASE.ENTER:
        if (exitAnimRef.current) {
          cancelAnimationFrame(exitAnimRef.current);
        }
        enterAnim();
        break;
      case ANIMATION_PHASE.EXIT:
        if (enterAnimRef.current) {
          cancelAnimationFrame(enterAnimRef.current);
        }
        exitAnim();
        break;
      default:
        break;
    }
  }, [animationPhase]);

  return (
    <>
      {show ? (
        <div
          ref={divRef}
          style={{
            width: "max-content",
            height: "max-content",
            overflow: overflowVisible ? "visible" : "hidden",
            transformOrigin: `center center`,
            ...style,
          }}
        >
          {children}
        </div>
      ) : null}
    </>
  );
}

export default SizeAnimation;
