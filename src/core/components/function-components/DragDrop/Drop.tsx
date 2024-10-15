import { memo, useState } from "react";
import styles from "./Drop.module.css";
import { DROP_STATUS } from "./DragDrop.utils";
import { useContextDrapDrop } from "./DragDrop.context";
import Drag from "./Drag";
import { TYPE_PROPS_DROP, TYPE_STATE } from "./DragDrop.types";

const getDragElement = (htmlEl: HTMLElement | null): HTMLElement | null => {
  let elToReturn = null;
  const getElement = (el: HTMLElement | null) => {
    if (el) {
      if (el?.dataset?.dragElement) {
        elToReturn = el;
      } else {
        if (el?.parentElement) {
          getElement(el.parentElement);
        }
      }
    }
  };
  getElement(htmlEl);
  return elToReturn;
};

const Drop = memo(function Drop(props: TYPE_PROPS_DROP) {
  const [status, setStatus] = useState(DROP_STATUS.INACTIVE);
  const [elements, setElements] = useState<(Record<any, any> & TYPE_STATE)[]>(
    []
  );

  const { value } = useContextDrapDrop();

  const { className, layout } = props;

  return (
    <div
      className={`${styles.Drop} ${layout} ${status} ${className} `}
      onPointerEnter={() => {
        if (value) {
          setStatus(DROP_STATUS.ACTIVE);
        }
      }}
      onPointerLeave={() => {
        if (status === DROP_STATUS.ACTIVE) {
          setStatus(DROP_STATUS.INACTIVE);
        }
      }}
      onPointerUp={(e) => {
        if (value) {
          const { clientX, clientY } = e;
          const overElement = document.elementFromPoint(clientX, clientY);
          const dragElement = getDragElement(overElement as HTMLElement);
          if (dragElement) {
            const rect = dragElement.getBoundingClientRect();
            const dragPositionX = rect.left + rect.width / 2;
            const dragPositionY = rect.top + rect.height / 2;
            if (dragPositionX <= clientX) {
              console.warn("Z PRAWEJ");
            } else {
              console.warn("Z LEWEJ");
            }
            if (dragPositionY <= clientY) {
              console.warn("JEST POD");
            } else {
              console.warn("JEST NAD");
            }
          } else {
            setElements((prev) => {
              return [...prev, value];
            });
          }
        }
      }}
    >
      {elements.map((dragElement, id) => {
        return (
          <Drag
            key={id}
            {...dragElement.props}
            insideDrop={true}
            removeOnDrag={true}
          />
        );
      })}
    </div>
  );
});

export default Drop;
