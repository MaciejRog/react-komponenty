export type TYPE_STATE = {
  dragProps: {
    props: TYPE_PROPS_DRAG;
    width: number;
    height: number;
  } | null;
  dropProps: TYPE_PROPS_DROP | null;
  dropId: string | null;
};

export type TYPE_INIT_CONTEXT = {
  value: TYPE_STATE;
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
};

export type TYPE_PROPS_DRAG = {
  groupId: string;
  insideDropPosition?: number | null;
  insideDropId?: string | null;
  removeOnDrag?: boolean;
  className?: string;
  children?: any;
};

export type TYPE_PROPS_DROP = {
  className?: string;
  layout: string;
  children?: any;
};

export type TYPE_DROP_TEMP_ELEMENT = {
  elementAddedPosition: number | null | undefined;
  position: number;
  width: string;
  height: string;
};
