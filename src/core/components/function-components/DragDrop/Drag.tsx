import { useCallback, useEffect, useRef, useState } from "react";
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

const getDropElement = (
  clientX: number,
  clientY: number
): HTMLElement | null => {
  const temp: Element | null = document.elementFromPoint(clientX, clientY);
  let elToReturn = null;
  const getElement = (el: Element | null) => {
    if (el) {
      if ((el as HTMLElement)?.dataset?.dropElement) {
        elToReturn = el;
      } else {
        if (el?.parentElement) {
          getElement(el.parentElement);
        }
      }
    }
  };
  getElement(temp);
  return elToReturn;
};

function Drag(props: TYPE_PROPS_DRAG) {
  const [moving, setMoving] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const {
    value: {
      drag: { width: dragWidth, height: dragHeight },
      drop: { dropId },
      end,
    },
    dispatch,
  } = useContextDrapDrop();

  const dragRef = useRef<HTMLDivElement | null>(null);
  const shiftX = useRef(0);
  const shiftY = useRef(0);

  const {
    groupId = "",
    insideDropPosition = null,
    insideDropId = null,
    removeOnDrag = false,
    className = "",
    children,
  } = props;

  const moveDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const { clientX, clientY } = e;
      setOffsetTop(clientY - shiftY.current);
      setOffsetLeft(clientX - shiftX.current);

      const dropElement = getDropElement(clientX, clientY);
      if (dropElement?.dataset?.dropId) {
        if (dropId !== dropElement.dataset.dropId) {
          dispatch({
            type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_ID,
            payload: dropElement.dataset.dropId,
          });
        }
      } else {
        if (dropId !== null) {
          dispatch({ type: CONTEXT_ACTIONS_DRAG_DROP.EMPTY_DROP });
        }
      }
    },
    [dispatch, dropId]
  );

  const endDrag = useCallback(() => {
    removeWindowEventListeners("pointermove");
    removeWindowEventListeners("pointerup");
    setMoving(false);
    dispatch({
      type: CONTEXT_ACTIONS_DRAG_DROP.END_DRAG,
    });
  }, [dispatch]);

  useEffect(() => {
    if (end) {
      if (document.body.classList.contains("window-drag-drop-moving")) {
        document.body.classList.remove("window-drag-drop-moving");
      }
    } else {
      document.body.classList.add("window-drag-drop-moving");
    }
  }, [end]);

  useEffect(() => {
    if (moving) {
      removeWindowEventListeners("pointermove");
      removeWindowEventListeners("pointerup");
      addWindowEventListener("pointermove", moveDrag);
      addWindowEventListener("pointerup", endDrag);
    }
  }, [endDrag, moveDrag, moving]);

  useEffect(() => {
    if (moving) {
      if (dragRef.current) {
        const { width, height } = dragRef.current.getBoundingClientRect();
        if (width !== dragWidth || height !== dragHeight) {
          dispatch({
            type: CONTEXT_ACTIONS_DRAG_DROP.SET_DRAG_DIMENSIONS,
            payload: {
              width: width,
              height: height,
            },
          });
        }
      }
    }
  }, [dispatch, dragHeight, dragWidth, moving]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (dragRef.current) {
      const { clientX, clientY } = e;
      const { top, left } = dragRef.current.getBoundingClientRect();

      shiftX.current = clientX - left;
      shiftY.current = clientY - top;

      dispatch({
        type: CONTEXT_ACTIONS_DRAG_DROP.SET_DRAG,
        payload: {
          props: props,
          dropId: insideDropId,
          dropPosition: insideDropPosition,
          shiftX: clientX - left,
          shiftY: clientY - top,
        },
      });
      setMoving(true);
      moveDrag(e);
    }
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
        data-drag-inside-drop-id={`${insideDropId ? insideDropId : ""}`}
        data-drag-group-id={groupId}
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
        <div
          className={`${className} ${styles.Drag}`}
          style={moving ? { pointerEvents: "none" } : {}}
        >
          {children}
        </div>
      ) : null}
    </>
  );
}

export default Drag;
