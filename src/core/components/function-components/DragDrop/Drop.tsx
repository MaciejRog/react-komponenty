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
  TYPE_PROPS_DRAG,
  TYPE_PROPS_DROP,
  TYPE_PROPS_DROP_TEMP_ELEMENT,
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

const INIT_TEMP_ELEMENT = {
  position: -1,
  paddingWidth: "0px",
  paddingHeight: "0px",
  width: "0px",
  height: "0px",
  animateEnter: false,
  animateExit: false,
};

const Drop = memo(function Drop(props: TYPE_PROPS_DROP) {
  const [status, setStatus] = useState(DROP_STATUS.INACTIVE);
  const [elements, setElements] = useState<
    { id: string; props: TYPE_PROPS_DRAG }[]
  >([]);
  const [tempElement, setTempElement] = useState(INIT_TEMP_ELEMENT);
  const dropId = useId();
  const {
    value: { drag: contextDrag, drop: contextDrop, end: contextEnd },
    dispatch,
  } = useContextDrapDrop();

  const elementsIdsRef = useRef<Record<string, number>>({});

  const { className, layout, children } = props;

  useEffect(() => {
    if (contextDrop.dropId === dropId) {
      if (status === DROP_STATUS.INACTIVE) {
        setStatus(DROP_STATUS.ACTIVE);
      }
    } else {
      if (status === DROP_STATUS.ACTIVE) {
        setStatus(DROP_STATUS.INACTIVE);
      }
    }
  }, [contextDrop.dropId]);

  useEffect(() => {
    if (contextEnd === true) {
      if (contextDrag.dropId === dropId && contextDrop.dropId === dropId) {
        const oldPosition = contextDrag.dropPosition;
        const newPosition = contextDrop.dropPosition;
        if (
          (oldPosition || oldPosition === 0) &&
          (newPosition || newPosition === 0) &&
          oldPosition !== newPosition
        ) {
          // ZAMIANA MIEJSCAMI
          setElements((prev) => {
            return changeArrayElementPosition(prev, oldPosition, newPosition);
          });
          dispatch({
            type: CONTEXT_ACTIONS_DRAG_DROP.DRAG_CHANGED,
          });
        }
      } else {
        if (contextDrag.dropId === dropId) {
          if (contextDrag.dropPosition || contextDrag.dropPosition === 0) {
            // USUWANIE_ELEMENTU
            const dragPosition = contextDrag.dropPosition;
            setElements((prev) => {
              return prev.filter((_, id) => {
                if (id === dragPosition) {
                  return false;
                }
                return true;
              });
            });
            dispatch({
              type: CONTEXT_ACTIONS_DRAG_DROP.DRAG_REMOVED,
            });
          }
        }
        if (contextDrop.dropId === dropId) {
          if (
            (contextDrop.dropPosition || contextDrop.dropPosition === 0) &&
            contextDrag.props
          ) {
            // DODAWANIE_ELEMENTU
            const elementProps = contextDrag.props;
            const dropPosition = contextDrop.dropPosition;
            setElements((prev) => {
              const newElement = {
                props: elementProps,
                id: `drop-${dropId}-drag-${
                  elementProps?.groupId
                }-${generateDragId(elementProps?.groupId)}`,
              };
              return addArrayElementAtPosition(prev, newElement, dropPosition);
            });
            dispatch({
              type: CONTEXT_ACTIONS_DRAG_DROP.DRAG_ADDED,
            });
          }
        }
      }
      setTempElement(INIT_TEMP_ELEMENT);
    } else {
      /// temp Element
      if (
        contextDrop.dropPosition ||
        contextDrop.dropPosition == 0 ||
        (contextDrop.dropId === dropId &&
          contextDrag.dropId === dropId &&
          (contextDrag.dropPosition || contextDrag.dropPosition === 0))
      ) {
        let position = -1;
        let animateEnter = true;
        if (contextDrop.dropPosition || contextDrop.dropPosition == 0) {
          position = contextDrop.dropPosition;
        } else {
          if (contextDrag.dropPosition || contextDrag.dropPosition == 0) {
            position = contextDrag.dropPosition;
            animateEnter = false;
          }
        }
        let tempPaddingWidth = "0px";
        let tempPaddingHeight = "0px";
        let tempWidth = "0px";
        let tempHeight = "0px";
        if (layout === DROP_LAYOUT.FLEX_COLUMN) {
          tempWidth = `${contextDrag.width}px`; // '100%',
          tempPaddingHeight = `${contextDrag.height}px`;
        }
        if (layout === DROP_LAYOUT.FLEX_ROW) {
          tempHeight = `${contextDrag.height}px`; // '100%',
          tempPaddingWidth = `${contextDrag.width}px`;
        }
        setTempElement({
          position: position,
          paddingWidth: tempPaddingWidth,
          paddingHeight: tempPaddingHeight,
          width: tempWidth,
          height: tempHeight,
          animateEnter: animateEnter,
          animateExit: true,
        });
        dispatch({
          type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_PROPS,
          payload: props,
        });
        dispatch({
          type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
          payload: position,
        });
      } else {
        setTempElement(INIT_TEMP_ELEMENT);
      }
    }
  }, [contextEnd, contextDrag, contextDrop, layout]);

  useEffect(() => {
    setTempElement(INIT_TEMP_ELEMENT);
  }, [elements.length]);

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (contextDrop.dropId === dropId && contextDrag.props) {
      if (contextDrop.props === null) {
        dispatch({
          type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_PROPS,
          payload: props,
        });
      } else {
        const { clientX, clientY } = e;
        const temp = document.elementFromPoint(clientX, clientY);
        const overElement = getDragElement(temp as HTMLElement);

        if (overElement) {
          if (!overElement.dataset.dragDropHollow) {
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
                  if (
                    contextDrop.dropPosition !==
                    overElementDragPosition + 1
                  ) {
                    dispatch({
                      type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
                      payload: overElementDragPosition + 1,
                    });
                  }
                } else {
                  // console.warn("Z LEWEJ");
                  if (contextDrop.dropPosition !== overElementDragPosition) {
                    dispatch({
                      type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
                      payload: overElementDragPosition,
                    });
                  }
                }
              } else if (layout === DROP_LAYOUT.FLEX_COLUMN) {
                const dragPositionY = rect.top + rect.height / 2;
                if (dragPositionY <= clientY) {
                  // console.warn("JEST POD");
                  if (
                    contextDrop.dropPosition !==
                    overElementDragPosition + 1
                  ) {
                    dispatch({
                      type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
                      payload: overElementDragPosition + 1,
                    });
                  }
                } else {
                  // console.warn("JEST NAD");
                  if (contextDrop.dropPosition !== overElementDragPosition) {
                    dispatch({
                      type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
                      payload: overElementDragPosition,
                    });
                  }
                }
              }
            } else {
              if (contextDrop.dropPosition !== elements.length + 1) {
                dispatch({
                  type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
                  payload: elements.length + 1,
                });
              }
            }
          }
        } else {
          if (contextDrop.dropPosition !== elements.length + 1) {
            dispatch({
              type: CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION,
              payload: elements.length + 1,
            });
          }
        }
      }
    }
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
            <DropTempElemenet {...tempElement} id={id} />
            {dragElement?.props ? (
              <Drag
                {...dragElement.props}
                insideDropPosition={id}
                insideDropId={dropId}
                removeOnDrag={true}
              />
            ) : null}
          </React.Fragment>
        );
      })}
      <DropTempElemenet {...tempElement} id={elements.length + 1} />
      {children}
    </div>
  );
});

export default Drop;

const DROP_ANIMATION_PHASE = {
  ENTER: "ENTER",
  EXIT: "EXIT",
};
const TRANISTION_TIMES = {
  ENTER: 0.1,
  EXIT: 0.1,
};
const DropTempElemenet = (props: TYPE_PROPS_DROP_TEMP_ELEMENT) => {
  const {
    id = -1,
    position = -1,
    paddingWidth = "0px",
    paddingHeight = "0px",
    width = "0px",
    height = "0px",
    animateEnter = false,
    animateExit = false,
  } = props;

  const [animationPhase, setAnimationPhase] = useState(
    DROP_ANIMATION_PHASE.ENTER
  );
  const [tranistionTime, setTransitionTIme] = useState(1);

  useEffect(() => {
    const temp = id === position;
    if (temp === true) {
      setAnimationPhase(DROP_ANIMATION_PHASE.ENTER);
    } else {
      setTransitionTIme(0);
    }
    return () => {
      setAnimationPhase(DROP_ANIMATION_PHASE.EXIT);
    };
  }, [id, position]);

  useEffect(() => {
    switch (animationPhase) {
      case DROP_ANIMATION_PHASE.ENTER:
        if (animateEnter) {
          setTransitionTIme(TRANISTION_TIMES.ENTER);
        } else {
          setTransitionTIme(0);
        }
        break;
      case DROP_ANIMATION_PHASE.EXIT:
        if (animateExit) {
          setTransitionTIme(TRANISTION_TIMES.EXIT);
        } else {
          setTransitionTIme(0);
        }
        break;
      default:
        break;
    }
  }, [animationPhase]);

  return (
    <div
      data-drag-drop-hollow="true"
      data-drag-element="true"
      style={{
        transition: `${tranistionTime}s padding linear`,
        paddingTop: position === id ? paddingHeight : "0px",
        paddingLeft: position === id ? paddingWidth : "0px",
        width: position === id ? width : "0px",
        height: position === id ? height : "0px",
      }}
    ></div>
  );
};
