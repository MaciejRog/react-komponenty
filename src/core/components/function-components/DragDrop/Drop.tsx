import React, { memo, useState } from "react";
import styles from "./Drop.module.css";
import {
  addArrayElementAtPosition,
  changeArrayElementPosition,
  DROP_LAYOUT,
  DROP_STATUS,
} from "./DragDrop.utils";
import { useContextDrapDrop } from "./DragDrop.context";
import Drag from "./Drag";
import {
  TYPE_DROP_TEMP_ELEMENT,
  TYPE_PROPS_DROP,
  TYPE_STATE,
} from "./DragDrop.types";

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
  const [elements, setElements] = useState<TYPE_STATE[]>([]);
  const [tempElement, setTempElement] = useState<TYPE_DROP_TEMP_ELEMENT>({
    elementAddedPosition: -1,
    position: -1,
    width: "0px",
    height: "0px",
  });

  const { value } = useContextDrapDrop();

  const { className, layout } = props;

  const handlePointerEnter = () => {
    if (value.props) {
      setStatus(DROP_STATUS.ACTIVE);
    }
  };

  const handlePointerLeave = () => {
    if (status === DROP_STATUS.ACTIVE) {
      setStatus(DROP_STATUS.INACTIVE);
    }
    if (value.props) {
      setTempElement({
        elementAddedPosition: -1,
        position: -1,
        width: "0px",
        height: "0px",
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    console.warn("DROP | pointer down");
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log("POINTER MOVE = value.props = ", value.props);
    if (value.props) {
      const { clientX, clientY } = e;
      const temp = document.elementFromPoint(clientX, clientY);
      const overElement = getDragElement(temp as HTMLElement);
      if (overElement) {
        let overElementDragPosition: number | null = null;
        if (overElement.dataset?.dragInsideDropPosition) {
          try {
            overElementDragPosition = Number(
              overElement.dataset.dragInsideDropPosition
            );
          } catch (exc) {
            console.error("Drop | cannot convert drop position to number");
          }
        }
        if (overElementDragPosition || overElementDragPosition === 0) {
          const rect = overElement.getBoundingClientRect();
          if (layout === DROP_LAYOUT.FLEX_ROW) {
            const dragPositionX = rect.left + rect.width / 2;
            if (dragPositionX <= clientX) {
              console.warn("Z PRAWEJ");
              setTempElement({
                elementAddedPosition: -1,
                position: overElementDragPosition + 1,
                width: "100px",
                height: "50px",
              });
            } else {
              console.warn("Z LEWEJ");
              setTempElement({
                elementAddedPosition: -1,
                position: overElementDragPosition,
                width: "100px",
                height: "50px",
              });
            }
          } else if (layout === DROP_LAYOUT.FLEX_COLUMN) {
            const dragPositionY = rect.top + rect.height / 2;
            if (dragPositionY <= clientY) {
              console.warn("JEST POD");
              setTempElement({
                elementAddedPosition: -1,
                position: overElementDragPosition + 1,
                width: "100px",
                height: "50px",
              });
            } else {
              console.warn("JEST NAD");
              setTempElement({
                elementAddedPosition: -1,
                position: overElementDragPosition,
                width: "100px",
                height: "50px",
              });
            }
          }
        }
      } else {
        setTempElement({
          elementAddedPosition: -1,
          position: -1,
          width: "100px",
          height: "50px",
        });
      }
    }
  };

  const handlePointerUp = () => {
    if (value.props) {
      let dragElementDropPosition = value.props?.insideDropPosition;

      if (tempElement.position >= 0) {
        if (dragElementDropPosition || dragElementDropPosition === 0) {
          setElements((prev) => {
            return changeArrayElementPosition(
              prev,
              dragElementDropPosition,
              tempElement.position
            );
          });
        } else {
          setElements((prev) => {
            return addArrayElementAtPosition(prev, value, tempElement.position);
          });
        }
      } else {
        if (!(dragElementDropPosition || dragElementDropPosition === 0)) {
          setElements((prev) => {
            return [...prev, value];
          });
        }
      }

      setTempElement({
        elementAddedPosition: tempElement.position,
        position: -1,
        width: "0px",
        height: "0px",
      });
    }
  };

  return (
    <div
      className={`${styles.Drop} ${layout} ${status} ${className} `}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {elements.map((dragElement, id) => {
        return (
          <React.Fragment key={id}>
            <div
              data-drag-element="true"
              style={{
                transition:
                  tempElement.elementAddedPosition === id
                    ? ""
                    : "0.2s all linear",
                paddingTop:
                  layout === DROP_LAYOUT.FLEX_COLUMN
                    ? `${
                        tempElement.position === id ? tempElement.height : "0px"
                      }`
                    : "0px",
                paddingLeft:
                  layout === DROP_LAYOUT.FLEX_ROW
                    ? `${
                        tempElement.position === id ? tempElement.width : "0px"
                      }`
                    : "0px",
              }}
            ></div>
            <Drag
              {...dragElement.props}
              insideDropPosition={id}
              removeOnDrag={true}
            />
            {id === elements.length - 1 ? (
              <div
                data-drag-element="true"
                style={{
                  transition:
                    tempElement.elementAddedPosition === id ||
                    tempElement.elementAddedPosition === elements.length
                      ? ""
                      : "0.2s all linear",
                  paddingTop:
                    layout === DROP_LAYOUT.FLEX_COLUMN
                      ? `${
                          tempElement.position === -1 ||
                          tempElement.position === elements.length
                            ? tempElement.height
                            : "0px"
                        }`
                      : "0px",
                  paddingLeft:
                    layout === DROP_LAYOUT.FLEX_ROW
                      ? `${
                          tempElement.position === -1 ||
                          tempElement.position === elements.length
                            ? tempElement.width
                            : "0px"
                        }`
                      : "0px",
                }}
              ></div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
});

export default Drop;
