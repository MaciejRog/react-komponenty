export const CONTEXT_ACTIONS_DRAG_DROP = {
  SET_DRAG: "SET_DRAG",
  SET_DROP_ID: "SET_DROP_ID",
  SET_DROP_PROPS: "SET_DROP_PROPS",
  END_DRAG: "END_DRAG",
  EMPTY_DROP: "EMPTY_DROP",
};

export const DROP_LAYOUT = {
  FLEX_ROW: "DropFlexRow",
  FLEX_COLUMN: "DropFlexColumn",
  ABSOLUTE: "DropAbsolute",
};

export const DROP_STATUS = {
  ACTIVE: "active",
  INACTIVE: "",
};

export function addArrayElementAtPosition(
  argsArray: any[],
  element: any,
  position?: number | null | undefined
): any[] {
  const array = [...argsArray];
  let arrayToReturn: any[] = [];
  if (position || position === 0) {
    if (position === -1) {
    } else {
      const firstPart = array.filter((_, id) => {
        if (id < position) {
          return true;
        }
        return false;
      });
      const secondPart = array.filter((_, id) => {
        if (id >= position) {
          return true;
        }
        return false;
      });
      arrayToReturn = [...firstPart, element, ...secondPart];
    }
  } else {
    arrayToReturn = [...array, element];
  }
  return arrayToReturn;
}

export function changeArrayElementPosition(
  argsArray: any[],
  elementPosition: number | null | undefined,
  elementNewPosition: number | null | undefined
): any[] {
  const array = [...argsArray];
  let arrayToReturn: any[] = [];
  if (
    (elementPosition || elementPosition === 0) &&
    (elementNewPosition || elementNewPosition === 0)
  ) {
    if (
      elementPosition >= 0 &&
      elementPosition < array.length &&
      elementNewPosition >= 0
    ) {
      let elToMove = array[elementPosition];
      array[elementPosition] = undefined;

      const firstPart = array.slice(0, elementNewPosition);
      const secondPart = array.slice(elementNewPosition);

      arrayToReturn = [...firstPart, elToMove, ...secondPart].filter((el) =>
        el ? true : false
      );
    }
  }
  return arrayToReturn;
}
