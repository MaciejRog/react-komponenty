export type TYPE_CONTEXT_STATE = {
  drag: {
    props: TYPE_PROPS_DRAG | null;
    dropId: string | null;
    dropPosition: number | null;
    width: number;
    height: number;
  };
  drop: {
    props: TYPE_PROPS_DROP | null;
    dropId: string | null;
    dropPosition: number | null;
  };
  end: boolean;
  refreshDrop: boolean;
};

export type TYPE_CONTEXT = {
  value: TYPE_CONTEXT_STATE;
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

export type TYPE_PROPS_DROP_TEMP_ELEMENT = {
  id: number;
  position: number;
  paddingWidth: string;
  paddingHeight: string;
  width: string;
  height: string;
  animateEnter: boolean;
  animateExit: boolean;
};
