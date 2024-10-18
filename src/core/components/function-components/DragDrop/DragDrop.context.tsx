import { createContext, useContext, useReducer } from "react";
import { CONTEXT_ACTIONS_DRAG_DROP } from "./DragDrop.utils";
import { TYPE_INIT_CONTEXT, TYPE_STATE } from "./DragDrop.types";

const INIT_STATE: TYPE_STATE = {
  dragProps: null,
  dropProps: null,
  dropId: null,
};

const INIT_CONTEXT: TYPE_INIT_CONTEXT = {
  value: INIT_STATE,
  dispatch: () => {},
};

const DragDropContext = createContext(INIT_CONTEXT);

const reducer = (
  state: TYPE_STATE,
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
        dragProps: action.payload,
      };
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_ID:
      if (action?.payload) {
        return {
          ...state,
          dropId: action.payload,
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
          dropProps: action.payload,
        };
      } else {
        throw new Error(
          "Cannot SET_DROP_PROPS CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
    case CONTEXT_ACTIONS_DRAG_DROP.EMPTY_DRAG:
      return {
        ...state,
        dragProps: null,
      };
    case CONTEXT_ACTIONS_DRAG_DROP.EMPTY_DROP:
      return {
        ...state,
        dropProps: null,
        dropId: null,
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
