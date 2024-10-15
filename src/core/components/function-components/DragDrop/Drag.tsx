import { useEffect, useRef, useState } from "react";
import styles from "./Drag.module.css";
import { useContextDrapDrop } from "./DragDrop.context";
import { CONTEXT_ACTIONS_DRAG_DROP } from "./DragDrop.utils";
import { TYPE_PROPS_DRAG } from "./DragDrop.types";

const WINDOW_EVENTS: Record<string, any[]> = {
  pointermove: [],
  pointerup: [],
};
const addWindowEventListener = (event: keyof WindowEventMap, fun: any) => {
  WINDOW_EVENTS[event].push(fun);
  window.addEventListener(event, fun);
};

const removeWindowEventListeners = (event: string) => {
  WINDOW_EVENTS[event].forEach((fun) => {
    window.removeEventListener(event, fun);
  });
  WINDOW_EVENTS[event] = [];
};

function Drag(props: TYPE_PROPS_DRAG) {
  const [moving, setMoving] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const { dispatch } = useContextDrapDrop();

  const dragRef = useRef<HTMLDivElement | null>(null);
  const shiftX = useRef(0);
  const shiftY = useRef(0);

  const {
    name = "",
    insideDropPosition = null,
    removeOnDrag = false,
    className = "",
    children,
  } = props;

  useEffect(() => {
    if (moving) {
      addWindowEventListener("pointermove", moveDrag);
      addWindowEventListener("pointerup", endDrag);

      return () => {
        endDrag();
      };
    }
  }, [moving]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      dispatch({ type: CONTEXT_ACTIONS_DRAG_DROP.SET, payload: props });
      setMoving(true);
      const { clientX, clientY } = e;
      const { top, left } = dragRef.current.getBoundingClientRect();
      shiftX.current = clientX - left;
      shiftY.current = clientY - top;
      moveDrag(e);
    }
  };

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const { pageX, pageY } = e;
    setOffsetTop(pageY - shiftY.current);
    setOffsetLeft(pageX - shiftX.current);
  };

  const endDrag = () => {
    removeWindowEventListeners("pointermove");
    removeWindowEventListeners("pointerup");

    setMoving(false);
    dispatch({ type: CONTEXT_ACTIONS_DRAG_DROP.EMPTY });
  };

  return (
    <>
      <div
        ref={dragRef}
        data-drag-inside-drop-position={`${
          insideDropPosition || insideDropPosition === 0
            ? insideDropPosition
            : ""
        }`}
        data-drag-name={name}
        data-drag-element="true"
        className={`${className} ${styles.Drag} ${
          moving ? styles.DragMoving : ""
        }`}
        style={{
          top: `${offsetTop}px`,
          left: `${offsetLeft}px`,
        }}
        onDragStart={() => {
          return false;
        }}
        onPointerDown={handlePointerDown}
      >
        {children}
      </div>
      {moving && !removeOnDrag ? (
        <div className={`${className} ${styles.Drag}`}>{children}</div>
      ) : null}
    </>
  );
}

export default Drag;
