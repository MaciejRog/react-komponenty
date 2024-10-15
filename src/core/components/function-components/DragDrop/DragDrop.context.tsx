import { createContext, useContext, useReducer } from "react";
import { CONTEXT_ACTIONS_DRAG_DROP } from "./DragDrop.utils";
import { TYPE_INIT_CONTEXT, TYPE_STATE } from "./DragDrop.types";

const INIT_STATE: TYPE_STATE = {
  props: null,
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
    case CONTEXT_ACTIONS_DRAG_DROP.SET:
      if (!action.payload) {
        throw new Error("Cannot SET CONTEXT_ACTIONS_DRAG_DROP | no payload");
      }
      return {
        ...state,
        props: action.payload,
      };
    case CONTEXT_ACTIONS_DRAG_DROP.EMPTY:
      return {
        ...state,
        props: null,
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
