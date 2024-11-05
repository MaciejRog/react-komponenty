import styles from "./InnerDropElement.module.css";
import { useLayoutEffect, useRef } from "react";
import { TYPE_PROPS_DROP_INNER_ELEMENT } from "../../DragDrop.types";
import {
  useContextDrapDropDispatch,
  useContextDrapDropValue,
} from "../../DragDrop.context";
import { CONTEXT_ACTIONS_DRAG_DROP } from "../../DragDrop.utils";

const CLASSNAME_ACTIVE = `inner-drop-element-active`;

function InnerDropElement(props: TYPE_PROPS_DROP_INNER_ELEMENT) {
  const { dropPosition, children } = props;

  const {
    drop: { position },
  } = useContextDrapDropValue();
  const dispatch = useContextDrapDropDispatch();

  useLayoutEffect(() => {
    if (dropPosition === position) {
      if (domSpaceRef.current?.classList) {
        domSpaceRef.current.classList.add(CLASSNAME_ACTIVE);
      }
    } else {
      if (
        domSpaceRef.current?.classList &&
        domSpaceRef.current.classList.contains(CLASSNAME_ACTIVE)
      ) {
        domSpaceRef.current.classList.remove(CLASSNAME_ACTIVE);
      }
    }
  }, [dropPosition, position]);

  const domSpaceRef = useRef<HTMLDivElement | null>(null);
  const domChildrenRef = useRef<HTMLDivElement | null>(null);

  const preventBubbling = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    let aegisHorizontal = -1;
    let aegisVertical = -1;
    if (
      domChildrenRef.current &&
      domChildrenRef.current?.getBoundingClientRect
    ) {
      const { top, height, left, width } =
        domChildrenRef.current.getBoundingClientRect();
      aegisHorizontal = top + height / 2;
      aegisVertical = left + width / 2;
    }
    if (aegisHorizontal > -1 && aegisVertical > -1) {
      if (clientX > aegisVertical) {
        // console.warn("PO PRAWEJ");
        // if (position !== dropPosition + 1) {
        //   dispatch({
        //     type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
        //     payload: dropPosition + 1,
        //   });
        // }
      } else {
        // console.warn("PO LEWEJ");
        //  if (position !== dropPosition) {
        //    dispatch({
        //      type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
        //      payload: dropPosition,
        //    });
        //  }
      }
      if (clientY > aegisHorizontal) {
        // console.warn("POD ELEMENTEM");
        if (position !== dropPosition + 1) {
          dispatch({
            type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
            payload: dropPosition + 1,
          });
        }
      } else {
        // console.warn("NAD ELEMENTEM");
        if (position !== dropPosition) {
          dispatch({
            type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
            payload: dropPosition,
          });
        }
      }
    }
  };

  return (
    <div
      className={`${styles.InnerDropElement}`}
      onPointerMove={preventBubbling}
    >
      <div
        className={`${styles.InnerDropElementSpace}`}
        ref={domSpaceRef}
      ></div>
      <div ref={domChildrenRef} onPointerMove={handlePointerMove}>
        {children}
      </div>
    </div>
  );
}

export default InnerDropElement;
