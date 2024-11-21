export const RICH_TEXT_EDITOR_TYPE = {
  PREVIEW: "PREVIEW",
  HTML: "HTML",
};

export const getNearestNotTextElement = (
  node: Node | undefined
): HTMLElement | null => {
  let elementToReturn: HTMLElement | null = null;
  const getNotTextElement = (nodeEl: Node | undefined | HTMLElement | null) => {
    if (nodeEl) {
      if (nodeEl.nodeName === "#document") {
        elementToReturn = null;
      } else {
        if (nodeEl.nodeName === "#text") {
          getNotTextElement(nodeEl.parentElement);
        } else {
          elementToReturn = nodeEl as HTMLElement;
        }
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

  const doesNodeContain = (nodeToCheck: Node, nodeToContain: Node) => {
    let contain = false;
    const check = (node: Node) => {
      if (node === nodeToContain) {
        contain = true;
      } else {
        node.childNodes.forEach((childNode) => {
          check(childNode);
        });
      }
    };
    check(nodeToCheck);

    return contain;
  };

  if (range) {
    range.commonAncestorContainer.childNodes.forEach((childNode) => {
      if (childNode.textContent?.trim()) {
        if (doesNodeContain(childNode, range.startContainer)) {
          canAdd = true;
        }
        if (canAdd) {
          const newRange = new Range();
          newRange.selectNode(childNode);
          ranges.push(newRange);
        }
        if (doesNodeContain(childNode, range.endContainer)) {
          canAdd = false;
        }
      }
    });
  }

  return ranges;
};

export const isInRichTextEditor = (element: HTMLElement | null) => {
  let isInReturn = false;

  const search = (el: HTMLElement | null) => {
    if (el) {
      if (el.dataset.richTextEditorComponent) {
        isInReturn = true;
      } else {
        search(el.parentElement);
      }
    }
  };
  search(element);

  return isInReturn;
};

// export const nodeContainsNode = (nodeToCheck: Node, nodeToContain: Node) => {
//   let contain = false;

//   const check = (node: Node) => {
//     if (node === nodeToContain) {
//       contain = true;
//     } else {
//       if (node.childNodes.length > 0) {
//         node.childNodes.forEach((child) => {
//           check(child);
//         });
//       }
//     }
//   };
//   check(nodeToCheck);

//   return contain;
// };
