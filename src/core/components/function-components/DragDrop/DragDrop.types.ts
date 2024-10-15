export type TYPE_STATE = {
  props: any;
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
  insideDrop?: boolean;
  removeOnDrag?: boolean;
  className?: string;
  children?: any;
};

export type TYPE_PROPS_DROP = {
  className?: string;
  layout: string;
};
