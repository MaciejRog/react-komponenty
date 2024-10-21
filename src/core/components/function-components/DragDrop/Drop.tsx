import React, { memo, useEffect, useId, useRef, useState } from "react";
import styles from "./Drop.module.css";
import {
  addArrayElementAtPosition,
  changeArrayElementPosition,
  CONTEXT_ACTIONS_DRAG_DROP,
  DROP_LAYOUT,
  DROP_STATUS,
} from "./DragDrop.utils";
import { useContextDrapDrop } from "./DragDrop.context";
import Drag from "./Drag";
import {
  TYPE_DROP_TEMP_ELEMENT,
  TYPE_PROPS_DRAG,
  TYPE_PROPS_DROP,
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
  const [elements, setElements] = useState<
    { id: string; props: TYPE_PROPS_DRAG }[]
  >([]);
  const [tempElement, setTempElement] = useState<TYPE_DROP_TEMP_ELEMENT>({
    elementAddedPosition: -1,
    position: -1,
    width: "0px",
    height: "0px",
  });
  const dropId = useId();
  const { value, dispatch } = useContextDrapDrop();

  const elementsIdsRef = useRef<Record<string, number>>({});

  const { className, layout, children } = props;

  useEffect(() => {
    if (value.dropId === dropId) {
      if (status === DROP_STATUS.INACTIVE) {
        setStatus(DROP_STATUS.ACTIVE);
      }
    } else {
      if (status === DROP_STATUS.ACTIVE) {
        setStatus(DROP_STATUS.INACTIVE);
      }
    }
    if (value.dragProps) {
      const dragInsideDropId = value.dragProps?.props.insideDropId;
      const dragElementDropPosition =
        value.dragProps?.props?.insideDropPosition;
      if (
        value.dropId === dropId &&
        dragInsideDropId === dropId &&
        (dragElementDropPosition || dragElementDropPosition === 0)
      ) {
        setTempElement({
          elementAddedPosition: dragElementDropPosition,
          position: dragElementDropPosition,
          width: `${value.dragProps?.width ? value.dragProps.width : 0}px`,
          height: `${value.dragProps?.height ? value.dragProps.height : 0}px`,
        });
      } else {
        if (tempElement.position !== -2) {
          setTempElement((prev) => {
            return {
              elementAddedPosition: prev.elementAddedPosition,
              position: -2,
              width: "0px",
              height: "0px",
            };
          });
        }
      }
    } else {
      if (tempElement.position !== -2) {
        setTempElement((prev) => {
          return {
            elementAddedPosition: prev.elementAddedPosition,
            position: -2,
            width: "0px",
            height: "0px",
          };
        });
      }
    }
  }, [value.dropId, value.dragProps]);

  useEffect(() => {
    if (value.end) {
      const dragInsideDropId = value.endDragProps?.props.insideDropId;
      const dragElementDropPosition =
        value.endDragProps?.props?.insideDropPosition;

      if (value.dropId === dropId) {
        if (dragInsideDropId === dropId) {
          if (dragElementDropPosition || dragElementDropPosition === 0) {
            changeElementPosition(dragElementDropPosition);
          } else {
            addElement();
          }
        } else {
          addElement();
        }
      } else {
        if (dragInsideDropId === dropId) {
          deleteElement(dragElementDropPosition);
        }
      }
      setTempElement({
        elementAddedPosition: tempElement.position,
        position: -2,
        width: "0px",
        height: "0px",
      });
    }
  }, [value.end]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (value.dropId === dropId && value.dragProps) {
      if (value.dropProps === null) {
        dispatch({
          type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_PROPS,
          payload: props,
        });
      } else {
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
                // console.warn("Z PRAWEJ");
                setTempElement({
                  elementAddedPosition: -1,
                  position: overElementDragPosition + 1,
                  width: `${value.dragProps.width}px`,
                  height: `${value.dragProps.height}px`,
                });
              } else {
                // console.warn("Z LEWEJ");
                setTempElement({
                  elementAddedPosition: -1,
                  position: overElementDragPosition,
                  width: `${value.dragProps.width}px`,
                  height: `${value.dragProps.height}px`,
                });
              }
            } else if (layout === DROP_LAYOUT.FLEX_COLUMN) {
              const dragPositionY = rect.top + rect.height / 2;
              if (dragPositionY <= clientY) {
                // console.warn("JEST POD");
                setTempElement({
                  elementAddedPosition: -1,
                  position: overElementDragPosition + 1,
                  width: `${value.dragProps.width}px`,
                  height: `${value.dragProps.height}px`,
                });
              } else {
                // console.warn("JEST NAD");
                setTempElement({
                  elementAddedPosition: -1,
                  position: overElementDragPosition,
                  width: `${value.dragProps.width}px`,
                  height: `${value.dragProps.height}px`,
                });
              }
            }
          }
        } else {
          setTempElement({
            elementAddedPosition: -1,
            position: -1,
            width: `${value.dragProps.width}px`,
            height: `${value.dragProps.height}px`,
          });
        }
      }
    } else {
      if (tempElement.position !== -2) {
        setTempElement((prev) => {
          return {
            elementAddedPosition: prev.elementAddedPosition,
            position: -2,
            width: "0px",
            height: "0px",
          };
        });
      }
    }
  };

  const changeElementPosition = (elementPosition: number) => {
    if (tempElement.position >= 0) {
      setElements((prev) => {
        return changeArrayElementPosition(
          prev,
          elementPosition,
          tempElement.position
        );
      });
    } else {
      setElements((prev) => {
        const elementToMove = prev[elementPosition];
        const newArray = prev.filter((_, index) => {
          if (index === elementPosition) {
            return false;
          }
          return true;
        });

        return [...newArray, elementToMove];
      });
    }
  };

  const addElement = () => {
    if (value.endDragProps?.props) {
      const dragGroupId = value.endDragProps.props?.groupId;
      const newValue = {
        props: value.endDragProps.props,
        id: `${dragGroupId}-${generateDragId(dragGroupId)}`,
      };
      if (tempElement.position >= 0) {
        setElements((prev) => {
          return addArrayElementAtPosition(
            prev,
            newValue,
            tempElement.position
          );
        });
      } else {
        setElements((prev) => {
          return [...prev, newValue];
        });
      }
    }
  };

  const deleteElement = (elementPosition: number | null | undefined) => {
    if (elementPosition || elementPosition === 0) {
      setElements((prev) => {
        const newArray = prev.filter((_, index) => {
          if (index === elementPosition) {
            return false;
          }
          return true;
        });

        return newArray;
      });
    }
  };

  const generateDragId = (groupId: string = ""): number => {
    let init = 0;
    if (elementsIdsRef.current?.[groupId]) {
      init = elementsIdsRef.current[groupId];
    } else {
      elementsIdsRef.current[groupId] = 0;
    }
    init++;
    elementsIdsRef.current[groupId] = init;
    return init;
  };

  return (
    <div
      data-drop-element="true"
      data-drop-id={dropId}
      className={`${styles.Drop} ${layout} ${status} ${className} `}
      onPointerMove={handlePointerMove}
    >
      {elements.map((dragElement, id) => {
        return (
          <React.Fragment key={dragElement.id}>
            <div
              data-test={dragElement.id}
              data-drag-element="true"
              style={{
                transition:
                  tempElement.elementAddedPosition === id
                    ? ""
                    : "0.1s padding linear",
                width: (() => {
                  let val = "0px";
                  if (layout === DROP_LAYOUT.FLEX_COLUMN) {
                    if (tempElement.position === id) {
                      val = tempElement.width;
                    }
                  }
                  return val;
                })(),
                height: (() => {
                  let val = "0px";
                  if (layout === DROP_LAYOUT.FLEX_ROW) {
                    if (tempElement.position === id) {
                      val = tempElement.height;
                    }
                  }
                  return val;
                })(),
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
            {dragElement?.props ? (
              <Drag
                {...dragElement.props}
                insideDropPosition={id}
                insideDropId={dropId}
                removeOnDrag={true}
              />
            ) : null}
            {id === elements.length - 1 ? (
              <div
                data-drag-element="true"
                style={{
                  transition:
                    tempElement.elementAddedPosition === id ||
                    tempElement.elementAddedPosition === elements.length
                      ? ""
                      : "0.1s padding linear",
                  width: "0px",
                  height: "0px",
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
      {children}
    </div>
  );
});

export default Drop;
