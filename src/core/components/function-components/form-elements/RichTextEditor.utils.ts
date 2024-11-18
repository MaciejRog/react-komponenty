export const getNearestNotTextElement = (
  node: Node | undefined
): HTMLElement | null => {
  let elementToReturn: HTMLElement | null = null;
  const getNotTextElement = (nodeEl: Node | undefined | HTMLElement | null) => {
    if (nodeEl) {
      if (nodeEl.nodeName === "#text") {
        getNotTextElement(nodeEl.parentElement);
      } else {
        elementToReturn = nodeEl as HTMLElement;
      }
    }
  };
  getNotTextElement(node);
  return elementToReturn;
};

export const getInnerRanges = (
  range: Range | undefined,
  nearestWrappingElement: HTMLElement | null
) => {
  const ranges: Range[] = [];

  if (range && nearestWrappingElement) {
    let canAdd = false;
    const checkNode = (node: ChildNode) => {
      if (node.childNodes.length === 0) {
        if (node === range.startContainer) {
          canAdd = true;
        }
        if (canAdd) {
          const newRange = new Range();
          let canAddRange = true;
          newRange.selectNode(node);
          if (node === range.startContainer) {
            const textContentLength = node.textContent?.length;
            if (textContentLength) {
              if (textContentLength === range.startOffset) {
                canAddRange = false;
              } else {
                newRange.setStart(node, range.startOffset);
                if (node !== range.endContainer) {
                  newRange.setEnd(node, textContentLength);
                }
              }
            }
          }
          if (node === range.endContainer) {
            if (range.endOffset === 0) {
              canAddRange = false;
            } else {
              if (node !== range.startContainer) {
                newRange.setStart(node, 0);
              }
              newRange.setEnd(node, range.endOffset);
            }
          }
          if (canAddRange) {
            ranges.push(newRange);
          }
        }
        if (node === range.endContainer) {
          canAdd = false;
        }
      } else {
        node.childNodes.forEach((childNode) => {
          checkNode(childNode);
        });
      }
    };

    nearestWrappingElement.childNodes.forEach((node) => {
      checkNode(node);
    });
  }

  return ranges;
};

export const getOuterRanges = (range: Range | undefined) => {
  const ranges: Range[] = [];
  let canAdd = false;
  if (range) {
    const getRichTextEditorChild = (node: Node): Node | null => {
      let elementToReturn: Node | null = null;

      const checkElement = (element: Node | null) => {
        if (element && element.parentElement) {
          if (
            element.parentElement.dataset.richTextEditorComponent === "true"
          ) {
            elementToReturn = element;
          } else {
            checkElement(node.parentNode);
          }
        }
      };
      checkElement(node);
      return elementToReturn;
    };

    const firstRangeOuterElement = getRichTextEditorChild(range.startContainer);
    const lastRangeOuterElement = getRichTextEditorChild(range.endContainer);

    if (firstRangeOuterElement && lastRangeOuterElement) {
      const richTextEditorElement = firstRangeOuterElement.parentElement;
      if (richTextEditorElement) {
        richTextEditorElement.childNodes.forEach((child) => {
          if (child === firstRangeOuterElement) {
            canAdd = true;
          }
          if (canAdd) {
            const newRange = new Range();
            newRange.selectNode(child);
            ranges.push(newRange);
          }
          if (child === lastRangeOuterElement) {
            canAdd = false;
          }
        });
      }
    }
  }

  return ranges;
};
