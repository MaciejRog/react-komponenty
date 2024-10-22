import { createContext, useContext, useReducer } from "react";
import { CONTEXT_ACTIONS_DRAG_DROP } from "./DragDrop.utils";
import { TYPE_CONTEXT, TYPE_CONTEXT_STATE } from "./DragDrop.types";

const INIT_STATE: TYPE_CONTEXT_STATE = {
  drag: {
    props: null,
    dropId: null,
    dropPosition: null,
    width: 0,
    height: 0,
  },
  drop: {
    props: null,
    dropId: null,
    dropPosition: null,
  },
  end: true,
};

const INIT_CONTEXT: TYPE_CONTEXT = {
  value: INIT_STATE,
  dispatch: () => {},
};

const DragDropContext = createContext(INIT_CONTEXT);

const reducer = (
  state: TYPE_CONTEXT_STATE,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DRAG:
      if (!action.payload) {
        throw new Error(
          "Cannot SET_DRAG CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
      return {
        ...state,
        end: false,
        drag: {
          ...state.drag,
          props: action.payload.props,
          dropId: action.payload.dropId,
          dropPosition: action.payload.dropPosition,
        },
        // drop: {
        //   ...state.drop,
        // },
      };
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DRAG_DIMENSIONS:
      if (!action.payload) {
        throw new Error(
          "Cannot SET_DRAG CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
      return {
        ...state,
        end: false,
        drag: {
          ...state.drag,
          width: action.payload.width,
          height: action.payload.height,
        },
        // drop: {
        //   ...state.drop,
        // },
      };
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_ID:
      if (action?.payload) {
        return {
          ...state,
          drop: {
            ...state.drop,
            dropId: action.payload,
          },
        };
      } else {
        throw new Error(
          "Cannot SET_DROP_ID CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_PROPS:
      if (action?.payload) {
        return {
          ...state,
          drop: {
            ...state.drop,
            props: action.payload,
          },
        };
      } else {
        throw new Error(
          "Cannot SET_DROP_PROPS CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION:
      if (action?.payload || action?.payload === 0) {
        return {
          ...state,
          drop: {
            ...state.drop,
            dropPosition: action.payload,
          },
        };
      } else {
        throw new Error(
          "Cannot SET_DROP_POSITION CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
    case CONTEXT_ACTIONS_DRAG_DROP.END_DRAG:
      return {
        ...state,
        end: true,
      };
    case CONTEXT_ACTIONS_DRAG_DROP.DRAG_REMOVED:
      return {
        ...state,
        drag: {
          ...state.drag,
          dropId: INIT_STATE.drag.dropId,
          dropPosition: INIT_STATE.drag.dropPosition,
        },
      };
    case CONTEXT_ACTIONS_DRAG_DROP.DRAG_ADDED:
      return {
        ...state,
        drag: {
          ...state.drag,
          props: INIT_STATE.drag.props,
          width: INIT_STATE.drag.width,
          height: INIT_STATE.drag.height,
        },
        drop: {
          ...state.drop,
          props: INIT_STATE.drag.props,
          dropId: INIT_STATE.drag.dropId,
          dropPosition: INIT_STATE.drag.dropPosition,
        },
      };
    case CONTEXT_ACTIONS_DRAG_DROP.DRAG_CHANGED:
      return {
        ...state,
        drag: {
          ...state.drag,
          ...INIT_STATE.drag,
        },
        drop: {
          ...state.drop,
          ...INIT_STATE.drop,
        },
      };
    case CONTEXT_ACTIONS_DRAG_DROP.EMPTY_DROP:
      return {
        ...state,
        drop: {
          ...INIT_STATE.drop,
        },
      };
    default:
      throw new Error("Cannot find CONTEXT_ACTIONS_DRAG_DROP");
  }
};

export const useContextDrapDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error("useContextDrapDrop out of scope");
  }
  return context;
};

export const ContextProviderDragDrop = (props: { children: any }) => {
  const [value, dispatch] = useReducer(reducer, INIT_STATE);
  const { children } = props;

  return (
    <DragDropContext.Provider
      value={{
        value: value,
        dispatch: dispatch,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};
