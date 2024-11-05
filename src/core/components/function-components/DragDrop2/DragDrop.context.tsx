import { createContext, useContext, useMemo, useReducer } from "react";
import { CONTEXT_ACTIONS_DRAG_DROP } from "./DragDrop.utils";
import { TYPE_CONTEXT_VALUE } from "./DragDrop.types";

const INIT_VALUE_STATE: TYPE_CONTEXT_VALUE = {
  drop: {
    position: null,
  },
};
const INIT_DISPATCH_STATE: React.Dispatch<{
  type: string;
  payload?: any;
}> = () => {};

const ContextDrapDropValue = createContext(INIT_VALUE_STATE);
const ContextDrapDropDispatch = createContext(INIT_DISPATCH_STATE);

const reducer = (
  state: TYPE_CONTEXT_VALUE,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case CONTEXT_ACTIONS_DRAG_DROP.SET_DROP_POSITION:
      if (action?.payload || action?.payload === 0) {
        return {
          ...state,
          drop: {
            ...state.drop,
            position: action.payload,
          },
        };
      } else {
        throw new Error(
          "Cannot SET_DROP_POSITION CONTEXT_ACTIONS_DRAG_DROP | no payload"
        );
      }
    default:
      throw new Error("Cannot find CONTEXT_ACTIONS_DRAG_DROP");
  }
};

export const useContextDrapDropValue = () => {
  const context = useContext(ContextDrapDropValue);
  if (context === undefined) {
    throw new Error("useContextDrapDropValue out of scope");
  }
  return context;
};

export const useContextDrapDropDispatch = () => {
  const context = useContext(ContextDrapDropDispatch);
  if (context === undefined) {
    throw new Error("useContextDrapDropDispatch out of scope");
  }
  return context;
};

export const ContextProviderDragDrop = (props: { children: any }) => {
  const [dragDropState, dispatch] = useReducer(reducer, INIT_VALUE_STATE);
  const { children } = props;

  const dragDropValue: TYPE_CONTEXT_VALUE = useMemo(() => {
    return {
      drop: {
        position: dragDropState.drop.position,
      },
    };
  }, [dragDropState.drop.position]);

  return (
    <ContextDrapDropValue.Provider value={dragDropValue}>
      <ContextDrapDropDispatch.Provider value={dispatch}>
        {children}
      </ContextDrapDropDispatch.Provider>
    </ContextDrapDropValue.Provider>
  );
};
