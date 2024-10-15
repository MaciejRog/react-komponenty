export type TYPE_STATE = {
  props: TYPE_PROPS_DRAG | null;
};

export type TYPE_INIT_CONTEXT = {
  value: TYPE_STATE;
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
};

export type TYPE_PROPS_DRAG = {
  name?: string;
  insideDropPosition?: number | null;
  removeOnDrag?: boolean;
  className?: string;
  children?: any;
};

export type TYPE_PROPS_DROP = {
  className?: string;
  layout: string;
};

export type TYPE_DROP_TEMP_ELEMENT = {
  position: number;
  width: string;
  height: string;
};
